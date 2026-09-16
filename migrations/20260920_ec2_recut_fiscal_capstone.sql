-- ============================================================================
-- EC2 CAPSTONE RECUT: Fiscal Regime Design (fiscal), the LIVE URUAN capstone.
--
-- WHY. Engines #190 (decision EC2-3, on engines main 709172f) repaired the
-- capex sweep. The loop accumulated 0.1 in floating point from 0.8, reached
-- 1.4000000000000004 and then failed its own <= 1.5 test, so a range labelled
-- 0.8 to 1.5 returned SEVEN points ending at 1.4. It now runs an integer step
-- count and returns EIGHT points, 0.8 to 1.5 in tenths.
--
-- WHAT THAT DOES TO THE EXPERT CAPSTONE. The Expert tier graded the same
-- quantity twice on purpose: field 4 was the loss across the sweep as the
-- engine swept it (seven points, ending at 1.4) and field 5 the loss to a
-- multiplier of 1.5 called directly. With the sweep repaired those two are
-- now THE SAME NUMBER:
--
--   cmp_psc_capex_loss_seven_point_musd  140.9798310836312 -> 169.10768926905132
--   cmp_psc_capex_loss_eight_point_musd  169.10768926905132 (unchanged)
--
-- A graded pair that cannot discriminate is not a repair, so this migration
-- does not move field 4's value. It RETIRES the key and puts a field in its
-- place that measures what the repair made readable, the loss over the LAST
-- TENTH of the sweep:
--
--   remove cmp_psc_capex_loss_seven_point_musd = 140.9798310836312
--   add    cmp_psc_capex_loss_last_tenth_musd  = 28.127858185420223
--          (the swept point at 1.4, -125.86586806663306, minus the swept point
--           at 1.5, -153.99372625205328), tolerance 0.001, same unit
--
-- The removal and the insertion are ONE jsonb rewrite of ONE row, at the same
-- array position, so the tier never holds five or seven fields at any instant
-- and the prompt's numbering (1) to (6) still lines up with the stored order.
--
-- Three sentences of the Expert prompt move with it: field 4's definition,
-- field 5's ("the same loss" is no longer the same loss), and the trap that
-- told the learner the loop never reaches its labelled endpoint.
--
-- The other seventeen graded fields are unchanged to the last digit. EC2-6
-- (the RRT capital uplift, same engines PR) moves no graded field here:
-- both URUAN regimes set an RRT of 0.
--
-- HOW THE VALUES WERE PRODUCED. The course's own field computation
-- (/root/ec-wip-fiscal/ec2_fields.mjs) was run against the engine vendored in
-- this repo, reproducing all eighteen LIVE values character for character,
-- and against engines main 709172f. The new value is the engine's own
-- subtraction of its last two swept points, printed at full precision.
-- Generator: scratchpad ec12/gen_ec12.py, reading a dump of the live rows.
--
-- GUARDS. The field array must hold EITHER the published shape, in which case
-- it is rewritten, OR the recut shape, in which case it is left alone.
-- Anything else raises. The seventeen other values, every key, label, unit,
-- tolerance and the field order are captured before and compared after, and
-- the go-live's own gates are re-run on the result.
--
-- SAFE TO RE-RUN. A second run finds the field already swapped and writes
-- nothing.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. The field swap: one atomic rewrite of the Expert fields array.
-- ----------------------------------------------------------------------------
do $$
declare
  v_before_others text;
  v_after_others  text;
  v_before_shape  text;
  v_after_shape   text;
  v_before_head   text;
  v_after_head    text;
  v_state         text;
  v_count         integer;
  v_updated       integer := 0;
  t               text;
begin
  -- Every graded field that is NOT the one being swapped.
  select string_agg(c.tier || ':' || (f->>'key') || '=' || (f->>'expected') || '/' || (f->>'tol'), ',' order by c.tier, f->>'key')
    into v_before_others
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and f->>'key' not in ('cmp_psc_capex_loss_seven_point_musd', 'cmp_psc_capex_loss_last_tenth_musd');

  -- Shape of every field EXCEPT the swapped position, which is allowed to move.
  select string_agg(c.tier || ':' || e.n || ':' || (e.f->>'key') || '|' || coalesce(e.f->>'label', '') || '|' || coalesce(e.f->>'unit', '') || '|' || (e.f->>'tol'), ',' order by c.tier, e.n)
    into v_before_shape
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'fiscal' and (e.f->>'key') not in ('cmp_psc_capex_loss_seven_point_musd', 'cmp_psc_capex_loss_last_tenth_musd');

  select string_agg(c.tier || ':' || md5(c.title) || ':' || md5(c.dataset) || ':' || c.cert_tier || ':' || c.active::text, ',' order by c.tier)
    into v_before_head
    from public.academy_capstones c where c.app_slug = 'fiscal';

  -- Published, or already recut, or refuse.
  select case
           when e.f->>'key' = 'cmp_psc_capex_loss_seven_point_musd'
            and (e.f->>'expected')::numeric = 140.9798310836312
            and (e.f->>'tol')::numeric = 0.001
            and e.f->>'unit' = 'million USD'
            and e.f->>'label' = 'Capex loss over the swept points' then 'old'
           when e.f->>'key' = 'cmp_psc_capex_loss_last_tenth_musd'
            and (e.f->>'expected')::numeric = 28.127858185420223
            and (e.f->>'tol')::numeric = 0.001
            and e.f->>'unit' = 'million USD'
            and e.f->>'label' = 'Capex loss over the last tenth of the sweep, 1.4 to 1.5' then 'new'
           else 'other' end
    into v_state
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'fiscal' and c.tier = 'advanced' and e.n = 4;
  if v_state is null then
    raise exception 'EC2 recut refused: the Expert capstone has no field at position 4';
  end if;
  if v_state = 'other' then
    raise exception 'EC2 recut refused: the Expert field at position 4 is neither the published seven-point field nor the recut last-tenth one';
  end if;

  if v_state = 'old' then
    -- ONE update: the retired field leaves and the new one arrives in its
    -- place, in the same statement, at the same array position.
    update public.academy_capstones c
       set fields = (select jsonb_agg(case when e.n = 4
                                           then '{"expected": 28.127858185420223, "key": "cmp_psc_capex_loss_last_tenth_musd", "label": "Capex loss over the last tenth of the sweep, 1.4 to 1.5", "tol": 0.001, "unit": "million USD"}'::jsonb
                                           else e.f end order by e.n)
                       from jsonb_array_elements(c.fields) with ordinality as e(f, n))
     where c.app_slug = 'fiscal' and c.tier = 'advanced';
    get diagnostics v_count = row_count;
    if v_count <> 1 then
      raise exception 'EC2 recut refused: the Expert field swap touched % rows', v_count;
    end if;
    v_updated := v_updated + 1;
  end if;

  -- ------------------------------------------------ the unchanged assertions --
  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and f->>'key' = 'cmp_psc_capex_loss_seven_point_musd';
  if v_count <> 0 then
    raise exception 'EC2 recut refused: the retired key is still present % time(s)', v_count;
  end if;

  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and f->>'key' = 'cmp_psc_capex_loss_last_tenth_musd'
     and (f->>'expected')::numeric = 28.127858185420223;
  if v_count <> 1 then
    raise exception 'EC2 recut refused: the last-tenth field is present % time(s) at its recut value, expected 1', v_count;
  end if;

  -- The two capex-loss fields must DISCRIMINATE: that is the whole point of
  -- the swap. Ten tolerances apart is the bar.
  select count(*) into v_count
    from public.academy_capstones c,
         lateral jsonb_array_elements(c.fields) a,
         lateral jsonb_array_elements(c.fields) b
   where c.app_slug = 'fiscal' and c.tier = 'advanced'
     and a->>'key' = 'cmp_psc_capex_loss_last_tenth_musd' and b->>'key' = 'cmp_psc_capex_loss_eight_point_musd'
     and abs((a->>'expected')::numeric - (b->>'expected')::numeric) <= 10 * (a->>'tol')::numeric;
  if v_count <> 0 then
    raise exception 'EC2 recut refused: the two capex-loss fields still sit within ten tolerances of each other';
  end if;

  select string_agg(c.tier || ':' || (f->>'key') || '=' || (f->>'expected') || '/' || (f->>'tol'), ',' order by c.tier, f->>'key')
    into v_after_others
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal' and f->>'key' not in ('cmp_psc_capex_loss_seven_point_musd', 'cmp_psc_capex_loss_last_tenth_musd');
  if v_after_others is distinct from v_before_others then
    raise exception 'EC2 recut refused: a capstone field other than the swapped one moved';
  end if;

  select string_agg(c.tier || ':' || e.n || ':' || (e.f->>'key') || '|' || coalesce(e.f->>'label', '') || '|' || coalesce(e.f->>'unit', '') || '|' || (e.f->>'tol'), ',' order by c.tier, e.n)
    into v_after_shape
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
   where c.app_slug = 'fiscal' and (e.f->>'key') not in ('cmp_psc_capex_loss_seven_point_musd', 'cmp_psc_capex_loss_last_tenth_musd');
  if v_after_shape is distinct from v_before_shape then
    raise exception 'EC2 recut refused: a capstone key, label, unit, tolerance or field order changed';
  end if;

  select string_agg(c.tier || ':' || md5(c.title) || ':' || md5(c.dataset) || ':' || c.cert_tier || ':' || c.active::text, ',' order by c.tier)
    into v_after_head
    from public.academy_capstones c where c.app_slug = 'fiscal';
  if v_after_head is distinct from v_before_head then
    raise exception 'EC2 recut refused: a capstone title, dataset, cert tier or active flag changed';
  end if;

  for t in select unnest(array['beginner', 'intermediate', 'advanced']) loop
    select count(*) into v_count
      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
     where c.app_slug = 'fiscal' and c.tier = t;
    if v_count <> 6 then
      raise exception 'EC2 recut refused: the % capstone carries % graded fields, expected 6', t, v_count;
    end if;
  end loop;

  select count(*) into v_count
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal';
  if v_count <> 18 then
    raise exception 'EC2 recut refused: the fiscal capstones carry % graded fields, expected 18', v_count;
  end if;

  select count(*) into v_count from public.academy_capstones where app_slug = 'fiscal';
  if v_count <> 3 then
    raise exception 'EC2 recut refused: fiscal has % capstones, expected 3', v_count;
  end if;

  raise notice 'EC2 recut capstone: % of 1 Expert field swapped', v_updated;
end $$;

-- ----------------------------------------------------------------------------
-- 2. The Expert prompt: fields 4 and 5, and the trap about the endpoint.
-- ----------------------------------------------------------------------------
do $$
declare
  v_md5     text;
  v_count   integer;
  v_updated integer := 0;
begin
  select md5(prompt) into v_md5 from public.academy_capstones
   where app_slug = 'fiscal' and tier = 'advanced';
  if v_md5 is null then
    raise exception 'EC2 recut refused: no Expert capstone for fiscal';
  end if;
  if v_md5 not in ('78e2c54a19db1503432fd43888d8d192', 'd3c59d3cf5a65713173c9514c348a8b4') then
    raise exception 'EC2 recut refused: the Expert prompt hashes to %, neither the published text nor the recut one', v_md5;
  end if;

  if v_md5 = '78e2c54a19db1503432fd43888d8d192' then
    update public.academy_capstones
       set prompt = 'Six values from ONE call of runFiscalComparison on the SAME URUAN project as the other two tiers, with BOTH regimes in it: the concession (royalty flat 14 percent, cost recovery limit 100 percent, profit split flat 100 percent, corporate income tax 28 percent, no resource rent tax, no minimum tax) and the production sharing contract (royalty sliding, 6 percent from 0 USD/bbl and 9.5 percent from 60 USD/bbl; cost recovery limit 65 percent; profit split 65 percent from R 1.0, 45 percent from R 1.4, 32 percent from R 1.65; corporate income tax 32 percent, no resource rent tax, no minimum tax). Report: (1) the NPV of the regime the summary puts FIRST, in millions of USD; (2) the PRODUCTION SHARING CONTRACT''s government share of net revenue (undiscounted) as the SUMMARY TABLE reports it, the engine''s effectiveTaxRate key, in percent; (3) the PRODUCTION SHARING CONTRACT''s government take (undiscounted) on the PRICE SWEEP at 60 USD/bbl, in percent; (4) the contractor NPV the production sharing contract gives up over the LAST TENTH of the capex sweep, the swept point at a multiplier of 1.4 minus the swept point at 1.5, in millions of USD; (5) the loss over the WHOLE swept range, the first swept point minus the engine called directly at a capex multiplier of 1.5, in millions of USD; and (6) the CONCESSION''s climb across the price sweep, last point minus first point, in percentage points. Traps. Fields 2 and 3 are two different ratios of the same government cash flow and they are NOT the same number: government share of net revenue adds TOTAL CAPEX back into contractor take and government take does not, and field 3 is also read at a swept price. Fields 4 and 5 are two different spans of one sweep, so one is much smaller than the other: field 4 is the last step alone and field 5 is the whole range. The sweep now reaches the multiplier its axis is labelled with, so its last swept point and a direct call at 1.5 are the same number; count the points the engine returns before subtracting, and read the last two. Field 6 is negative on this project and that is the answer, not an error: the concession''s line falls as the price rises, and field 6 is the endpoint difference asked for whatever state each endpoint carries. The summary is sorted by contractor NPV descending, so field 1 is a lookup only after the sort. The price sweep reaches each price by a multiplier on the FIRST deck point''s oil price, and that multiplier scales OIL ONLY.'
     where app_slug = 'fiscal' and tier = 'advanced';
    get diagnostics v_count = row_count;
    if v_count <> 1 then
      raise exception 'EC2 recut refused: the Expert prompt update touched % rows', v_count;
    end if;
    v_updated := v_updated + 1;
  end if;

  select md5(prompt) into v_md5 from public.academy_capstones
   where app_slug = 'fiscal' and tier = 'advanced';
  if v_md5 <> 'd3c59d3cf5a65713173c9514c348a8b4' then
    raise exception 'EC2 recut refused: the Expert prompt hashes to % after the update', v_md5;
  end if;

  select md5(prompt) into v_md5 from public.academy_capstones where app_slug = 'fiscal' and tier = 'beginner';
  if v_md5 <> '4f3ed4f51fbf1b10e8cfd5a779409978' then
    raise exception 'EC2 recut refused: the Associate prompt changed';
  end if;
  select md5(prompt) into v_md5 from public.academy_capstones where app_slug = 'fiscal' and tier = 'intermediate';
  if v_md5 <> '5be2b3a132aec8daf747058cda0298e3' then
    raise exception 'EC2 recut refused: the Professional prompt changed';
  end if;

  raise notice 'EC2 recut prompt: % of 1 Expert prompt rewritten', v_updated;
end $$;

-- ----------------------------------------------------------------------------
-- 3. The go-live's own gates, re-run on the recut capstone.
-- ----------------------------------------------------------------------------
do $$
declare
  v_graded integer;
begin
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
            (397.0444827478669),(382.06603200373354),(357.872791645486),(274.366984253646),
            (173.4149835907035),(240.39370956440843),(218.5118562784327),(98.25197540715591),
            (107.7526249224264),(452.51050838949885),(46.345241558596065),(55.5380437422336),
            (59.6210),(71.4471),(149.03678748332425),(164.90022186013016),(102400),(1431.0440)
         ) as g(v)
   where c.app_slug = 'fiscal'
     and abs(abs((f->>'expected')::numeric) - g.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC2 recut refused: % graded field(s) now sit within their own tolerance of a published golden', v_graded;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values (5200),(11),(65),(7),(480),(13),(25),(365),(58),(3.2),(27),
            (8),(72),(4.1),(34),(185),(95),(35),(9),(6.5),(14),(100),(28),
            (6),(9.5),(60),(1.0),(1.4),(1.65),(45),(32),(6000),(0),(1),
            (2),(3),(4),(5),(1.5),(40),(120),(315)) as h(v)
   where c.app_slug = 'fiscal'
     and abs(abs((f->>'expected')::numeric) - h.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC2 recut refused: % graded field(s) land on a number handed in a prompt', v_graded;
  end if;

  select count(*) into v_graded
    from public.academy_capstones c, public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'fiscal' and c2.app_slug = 'fiscal' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'EC2 recut refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- The scope assertion: nothing this sandbox cannot produce.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal'
     and (f->>'label' ilike '%reserve%'   or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%probabilit%' or f->>'label' ilike '%p10%'
       or f->>'label' ilike '%p90%'        or f->>'label' ilike '%emv%'
       or f->>'label' ilike '%tornado%'    or f->>'label' ilike '%value of information%'
       or f->>'unit'  ilike '%psi%'        or f->>'unit'  ilike '%stb/d%');
  if v_graded <> 0 then
    raise exception 'EC2 recut refused: % capstone field(s) grade a quantity this fiscal sandbox cannot produce', v_graded;
  end if;

  raise notice 'EC2 recut: the go-live gates pass on the recut capstone';
end $$;

-- ---------------------------------------------------------------- read-back --
select 'ec2 recut capstone' as migration, c.tier, e.n as ord, e.f->>'key' as key,
       (e.f->>'expected')::numeric as expected, (e.f->>'tol')::numeric as tol,
       e.f->>'label' as label
  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) with ordinality as e(f, n)
 where c.app_slug = 'fiscal'
 order by c.tier, e.n;

select 'ec2 recut prompt' as migration, tier, md5(prompt) as prompt_md5, length(prompt) as len
  from public.academy_capstones where app_slug = 'fiscal' order by tier;
