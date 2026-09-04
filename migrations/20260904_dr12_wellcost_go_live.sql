-- ============================================================================
-- DR12 GO-LIVE (HELD): Well Cost & Time flips to 'available'.
-- This is the TWELFTH and FINAL Drilling & Completions course.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/wellcost.
--
-- Every assertion below is written from the ENGINE's output. This course found
-- its engine's own HEADER contradicting its arithmetic, so nothing here is
-- taken from prose, including the engine's.
-- ============================================================================

do $$
declare
  c_npt      constant numeric := 0.285;   -- the capstone allowance
  c_cont     constant numeric := 0.235;   -- the capstone contingency fraction
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_drill numeric; v_trip numeric; v_csg numeric;
  v_prod  numeric; v_npt  numeric; v_days numeric;
  v_tang  numeric; v_intg numeric; v_ctg  numeric;
  v_total numeric; v_cpmi numeric; v_cpmr numeric;
  v_c1    numeric; v_c2   numeric; v_cf   numeric;
  v_p10   numeric; v_p90  numeric; v_dp50 numeric;
  v_base  numeric;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'wellcost' and active;
  if v_structures <> 3 then
    raise exception 'DR12 go-live refused: wellcost has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'wellcost';
  if v_questions <> 396 then
    raise exception 'DR12 go-live refused: wellcost has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'wellcost';
  if v_capstones <> 3 then
    raise exception 'DR12 go-live refused: wellcost has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This engine costs the programme it is given. It does not forecast a market
  -- rate, price a contract, judge whether the well should be drilled, or model
  -- a rig-specific learning curve. Its own header calls the output a planning
  -- estimate. Nothing here may certify past that.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'wellcost'
     and (f->>'label' ilike '%market%'    or f->>'label' ilike '%learning curve%'
       or f->>'label' ilike '%npv%'       or f->>'label' ilike '%return%'
       or f->>'label' ilike '%probabilit%' or f->>'label' ilike '%reserves%'
       or f->>'unit'  ilike '%bbl%'       or f->>'unit'  ilike '%boe%');
  if v_graded <> 0 then
    raise exception 'DR12 go-live refused: % capstone field(s) grade a quantity this cost engine cannot produce', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'wellcost'
     and (abs((f->>'expected')::numeric - 5380000) < 2          -- published AFE base
       or abs((f->>'expected')::numeric - 5918000) < 2          -- published AFE total
       or abs((f->>'expected')::numeric - 538000) < 2           -- published contingency
       or abs((f->>'expected')::numeric - 1050000) < 2          -- published tangible
       or abs((f->>'expected')::numeric - 4330000) < 2          -- published intangible
       or abs((f->>'expected')::numeric - 2260000) < 2          -- published curve checkpoint
       or abs((f->>'expected')::numeric - 770) < 0.0005         -- the standalone cost per metre worked example
       or abs((f->>'expected')::numeric - 384) < 0.00005        -- published productive hours
       or abs((f->>'expected')::numeric - 432) < 0.00005        -- published elapsed hours
       or abs((f->>'expected')::numeric - 1530000) < 2          -- published analytic MC mean
       or abs((f->>'expected')::numeric - 211.5) < 0.00005);    -- published checkpoint hour
  if v_graded <> 0 then
    raise exception 'DR12 go-live refused: % graded field(s) sit within tolerance of a value the goldens publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_drill from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='drill_reservoir_hr';
  select (f->>'expected')::numeric into v_trip  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='trip_td_hr';
  select (f->>'expected')::numeric into v_csg   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='casing_liner_run_hr';
  select (f->>'expected')::numeric into v_prod  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='productive_hr';
  select (f->>'expected')::numeric into v_npt   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='npt_hr';
  select (f->>'expected')::numeric into v_days  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='total_days';
  select (f->>'expected')::numeric into v_tang  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='tangible_usd';
  select (f->>'expected')::numeric into v_intg  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='intangible_usd';
  select (f->>'expected')::numeric into v_ctg   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='contingency_usd';
  select (f->>'expected')::numeric into v_total from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='total_usd';
  select (f->>'expected')::numeric into v_cpmi  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='cpm_intermediate_usd_m';
  select (f->>'expected')::numeric into v_cpmr  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='cpm_reservoir_usd_m';
  select (f->>'expected')::numeric into v_c1    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='curve_at_int_casing_usd';
  select (f->>'expected')::numeric into v_c2    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='curve_at_evaluation_usd';
  select (f->>'expected')::numeric into v_cf    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='curve_final_usd';
  select (f->>'expected')::numeric into v_p10   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='mc_cost_p10_usd';
  select (f->>'expected')::numeric into v_p90   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='mc_cost_p90_usd';
  select (f->>'expected')::numeric into v_dp50  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='wellcost' and f->>'key'='mc_days_p50';

  if v_drill is null or v_trip is null or v_csg is null or v_prod is null
     or v_npt is null or v_days is null or v_tang is null or v_intg is null
     or v_ctg is null or v_total is null or v_cpmi is null or v_cpmr is null
     or v_c1 is null or v_c2 is null or v_cf is null or v_p10 is null
     or v_p90 is null or v_dp50 is null then
    raise exception 'DR12 go-live refused: one or more of the eighteen graded fields is missing';
  end if;
  v_base := v_tang + v_intg;

  -- --------------------------------- Associate: THE STRETCH, AS A PAIR ------
  -- The allowance is a fraction of PRODUCTIVE time. So it must close against
  -- productive hours AND must NOT close against elapsed hours. Asserting only
  -- the first would pass on a capstone that had quietly been recut to the
  -- elapsed convention, which is the exact confusion this course found in the
  -- engine's own header and which would leave the Associate tier teaching the
  -- reading it exists to correct.
  if abs(v_npt / v_prod - c_npt) > 0.0000005 then
    raise exception 'DR12 go-live refused: non-productive hours of % are not % of the productive hours of %', v_npt, c_npt, v_prod;
  end if;
  if abs(v_npt / (v_prod + v_npt) - c_npt) < 0.001 then
    raise exception 'DR12 go-live refused: the non-productive share of ELAPSED time equals the allowance, so the capstone has been recut to the wrong convention and the tier loses its central trap';
  end if;
  if v_npt / (v_prod + v_npt) >= c_npt then
    raise exception 'DR12 go-live refused: the elapsed share of % is not below the allowance of %', v_npt / (v_prod + v_npt), c_npt;
  end if;
  -- and the rollup closes
  if abs(v_days * 24 - (v_prod + v_npt)) > 0.00005 then
    raise exception 'DR12 go-live refused: % days is not the productive and non-productive hours added together', v_days;
  end if;
  if v_drill <= 0 or v_trip <= 0 or v_csg <= 0 then
    raise exception 'DR12 go-live refused: one of the three closed-form durations is not positive';
  end if;

  -- ------------------------------------- Professional: the AFE identities ---
  if abs(v_total - (v_base + v_ctg)) > 0.5 then
    raise exception 'DR12 go-live refused: the total of % is not the base of % plus the contingency of %', v_total, v_base, v_ctg;
  end if;
  if abs(v_ctg / v_base - c_cont) > 0.0000005 then
    raise exception 'DR12 go-live refused: the contingency of % is not % of the base of %, so it has been taken on the total instead', v_ctg, c_cont, v_base;
  end if;

  -- THE INVERSION, WHICH IS THE POINT OF THE COST PER METRE MODULE. The
  -- intermediate section is the LARGER cheque and the CHEAPER metre. If a
  -- later edit made the two rankings agree, the module would be teaching a
  -- phenomenon its own capstone no longer shows.
  if v_cpmi >= v_cpmr then
    raise exception 'DR12 go-live refused: the intermediate cost per metre of % is not below the reservoir cost per metre of %, so the capstone no longer inverts the spend ranking', v_cpmi, v_cpmr;
  end if;

  -- ------------------------------------------ Expert: THE ENDPOINT PAIR -----
  -- The curve ends on the BASE, not the TOTAL. Both halves are asserted,
  -- because reporting the total is the error the module exists to prevent and
  -- an assertion that only checked closeness to the base could still pass on a
  -- capstone whose contingency had gone to zero, where the two coincide.
  if abs(v_cf - v_base) > 0.000001 then
    raise exception 'DR12 go-live refused: the curve endpoint of % is not the AFE base of %, so contingency has started accruing along the curve', v_cf, v_base;
  end if;
  if abs(v_cf - v_total) < 1 then
    raise exception 'DR12 go-live refused: the curve endpoint equals the estimate TOTAL, so the contingency is no longer distinguishable and the endpoint identity teaches nothing';
  end if;
  if abs((v_total - v_cf) - v_ctg) > 0.5 then
    raise exception 'DR12 go-live refused: the total less the curve endpoint is %, not the contingency of %', v_total - v_cf, v_ctg;
  end if;

  -- the curve only rises
  if not (v_c1 < v_c2 and v_c2 < v_cf) then
    raise exception 'DR12 go-live refused: the curve checkpoints % and % and the endpoint % are not increasing', v_c1, v_c2, v_cf;
  end if;

  -- ------------------------------------------- Expert: the risked reading ---
  if v_p10 >= v_p90 then
    raise exception 'DR12 go-live refused: the P10 cost of % is not below the P90 cost of %, so the two have been labelled in the reserves convention rather than the AFE one', v_p10, v_p90;
  end if;
  -- THE POINT OF THE TIER. A deterministic estimate built on most-likely rates
  -- is not a most-likely cost: it must sit INSIDE the risked range and LOW in
  -- it. If an edit moved it above the midpoint, module 5 would lose the
  -- finding its whole argument rests on.
  if not (v_cf > v_p10 and v_cf < v_p90) then
    raise exception 'DR12 go-live refused: the deterministic base of % does not sit between the P10 of % and the P90 of %', v_cf, v_p10, v_p90;
  end if;
  if v_cf >= (v_p10 + v_p90) / 2 then
    raise exception 'DR12 go-live refused: the deterministic base of % is not below the midpoint of the risked range, so the capstone no longer shows an optimistic base case', v_cf;
  end if;
  -- and the risked median schedule must exceed the deterministic one, for the
  -- same reason: time goes as one over rate, so the cost is convex in it.
  if v_dp50 <= v_days then
    raise exception 'DR12 go-live refused: the risked median of % days does not exceed the deterministic % days, so convexity is no longer visible', v_dp50, v_days;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'wellcost' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'wellcost' and status = 'available') then
    raise exception 'DR12 go-live refused: wellcost did not reach status available';
  end if;

  raise notice 'DR12 go-live: wellcost is available. This CLOSES the twelve-course Drilling & Completions module.';
end $$;
