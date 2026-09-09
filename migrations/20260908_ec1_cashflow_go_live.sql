-- ============================================================================
-- EC1 GO-LIVE (HELD): Cash Flow & NPV flips to 'available'. This is the FIRST
-- Economics course and the root of that module's path.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/cashflow.
--
-- Every assertion below is written from the ENGINE's output, never from the
-- intuition the capstone was designed with. Several are written as PAIRS or
-- as exact identities, because a one-sided check would pass on a capstone
-- that had quietly been recut into exactly the mistake the course exists to
-- correct.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_rev33  numeric; v_tax32  numeric; v_ncf34  numeric; v_pb     numeric; v_boe    numeric; v_take   numeric;
  v_npv    numeric; v_npvmid numeric; v_irr    numeric; v_dpb    numeric; v_dpi    numeric; v_be     numeric;
  v_proy32 numeric; v_elig32 numeric; v_cpr31  numeric; v_hct    numeric; v_dev33  numeric; v_npvpia numeric;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'cashflow' and active;
  if v_structures <> 3 then
    raise exception 'EC1 go-live refused: cashflow has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'cashflow';
  if v_questions <> 396 then
    raise exception 'EC1 go-live refused: cashflow has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'cashflow';
  if v_capstones <> 3 then
    raise exception 'EC1 go-live refused: cashflow has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This engine turns rows into a fiscal ledger and reads it. It does not
  -- forecast a decline, book a reserve, size a facility, compare regime
  -- DESIGNS (EC2), sample a distribution (EC3) or roll back a decision tree
  -- (EC4). Nothing here may certify past that.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow'
     and (f->>'label' ilike '%reserve%'   or f->>'label' ilike '%decline%'
       or f->>'label' ilike '%eur%'       or f->>'label' ilike '%probabilit%'
       or f->>'label' ilike '%p10%'       or f->>'label' ilike '%p90%'
       or f->>'label' ilike '%emv%'       or f->>'label' ilike '%tornado%'
       or f->>'unit'  ilike '%psi%'       or f->>'unit'  ilike '%stb/d%');
  if v_graded <> 0 then
    raise exception 'EC1 go-live refused: % capstone field(s) grade a quantity this cash flow engine cannot produce', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- The headline values the goldens and the teaching digest publish. A graded
  -- field within tolerance of one of these is a lookup, not a calculation.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'cashflow'
     and (abs((f->>'expected')::numeric - 135185570.34) < 1          -- PIA worked example NPV
       or abs((f->>'expected')::numeric - 21590909.090909086) < 1    -- hand-derived JV NPV
       or abs((f->>'expected')::numeric - 203250580.205128) < 1      -- multiyear_pia_real NPV
       or abs((f->>'expected')::numeric - 88104638.99559215) < 1     -- multiyear_jv_real NPV
       or abs((f->>'expected')::numeric - 72534830.66) < 1           -- AKATA NPV
       or abs((f->>'expected')::numeric - 70188970.32) < 1           -- AKATA mid-year NPV
       or abs((f->>'expected')::numeric - 42943268.01) < 1           -- AKATA under the PIA
       or abs((f->>'expected')::numeric - 200) < 0.001               -- hand-derived JV IRR
       or abs((f->>'expected')::numeric - 43.92693503545888) < 0.001 -- multiyear_pia_real IRR
       or abs((f->>'expected')::numeric - 47.90202040678996) < 0.001 -- multiyear_jv_real IRR
       or abs((f->>'expected')::numeric - 29.2361) < 0.001           -- AKATA IRR
       or abs((f->>'expected')::numeric - 71.72619047591115) < 0.01  -- hand-derived JV breakeven
       or abs((f->>'expected')::numeric - 66.115702) < 0.01);        -- AKATA breakeven
  if v_graded <> 0 then
    raise exception 'EC1 go-live refused: % graded field(s) sit within tolerance of a value the goldens or the digest publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------ the handed-in-the-prompt assertion --
  -- Every number the three prompts state, at the grader's own tolerance. A
  -- graded field equal to one of them is a transcription, not a calculation.
  -- The Expert prompt once walked the learner from the 100,000,000 bbl cap
  -- and the 97,612,500 bbl prior production to the 2,387,500 bbl of room and
  -- said "field 2 is what remains"; the walkthrough was cut so that the cap,
  -- the prior production and the 2031 volume have to be COMBINED.
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
    raise exception 'EC1 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  -- Re-reads the STORED prompts: no tier's prompt may state a graded value
  -- belonging to another tier (commas stripped, because a prompt writes
  -- 1,600,000 where the answer key holds 1600000).
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'cashflow' and c2.app_slug = 'cashflow' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'EC1 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_rev33  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='jv_2033_gross_revenue_usd';
  select (f->>'expected')::numeric into v_tax32  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='jv_2032_tax_usd';
  select (f->>'expected')::numeric into v_ncf34  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='jv_2034_net_cash_flow_usd';
  select (f->>'expected')::numeric into v_pb     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='jv_payback_years';
  select (f->>'expected')::numeric into v_boe    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='jv_total_boe';
  select (f->>'expected')::numeric into v_take   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='jv_government_take_pct';
  select (f->>'expected')::numeric into v_npv    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='jv_npv_real_usd';
  select (f->>'expected')::numeric into v_npvmid from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='jv_npv_mid_year_usd';
  select (f->>'expected')::numeric into v_irr    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='jv_irr_pct';
  select (f->>'expected')::numeric into v_dpb    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='jv_discounted_payback_years';
  select (f->>'expected')::numeric into v_dpi    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='jv_dpi';
  select (f->>'expected')::numeric into v_be     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='jv_breakeven_oil_price_usd_bbl';
  select (f->>'expected')::numeric into v_proy32 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='pia_2032_price_royalty_usd';
  select (f->>'expected')::numeric into v_elig32 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='pia_2032_prod_alw_eligible_bbl';
  select (f->>'expected')::numeric into v_cpr31  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='pia_2031_cpr_deferred_usd';
  select (f->>'expected')::numeric into v_hct    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='pia_total_hct_usd';
  select (f->>'expected')::numeric into v_dev33  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='pia_2033_dev_levy_usd';
  select (f->>'expected')::numeric into v_npvpia from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='cashflow' and f->>'key'='pia_npv_real_usd';

  if v_rev33 is null or v_tax32 is null or v_ncf34 is null or v_pb is null or v_boe is null or v_take is null
     or v_npv is null or v_npvmid is null or v_irr is null or v_dpb is null or v_dpi is null or v_be is null
     or v_proy32 is null or v_elig32 is null or v_cpr31 is null or v_hct is null or v_dev33 is null or v_npvpia is null then
    raise exception 'EC1 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------------ Associate: FIELD AND SHARE, AS EXACT IDENTITIES --
  -- The joint venture ledger keeps gross revenue and volumes at FIELD level
  -- and scales only royalty, taxable income, tax and net cash flow to the
  -- share (the engine's applyJV scales inside the regime; the row's
  -- gross_revenue is the unscaled field number). 2033 oil is 1,024,000 bbl
  -- at 76 x 1.015^2 and gas 921,600 Mscf at 3.0 x 1.015^2, unscaled. A
  -- capstone recut to scale revenue, or with the escalator dropped, fails
  -- this to the cent.
  if abs(v_rev33 - (1024000 * 76 * 1.015 * 1.015 + 921600 * 3.0 * 1.015 * 1.015)) > 0.01 then
    raise exception 'EC1 go-live refused: 2033 gross revenue of % is not the field-level escalated 2033 revenue', v_rev33;
  end if;
  -- The volume total is field level too: oil + gas/6 over six years.
  if abs(v_boe - (5902848 + 5312563.2 / 6)) > 0.01 then
    raise exception 'EC1 go-live refused: total boe of % is not field oil plus gas at six to one', v_boe;
  end if;
  -- And the tax IS the share: it must be below 80 percent of the 45 percent
  -- rate on field revenue, which a 100 percent recut could exceed.
  if v_tax32 >= 0.8 * 0.45 * (1280000 * 76 * 1.015 + 1152000 * 3.0 * 1.015) then
    raise exception 'EC1 go-live refused: 2032 tax of % is not a working-interest share', v_tax32;
  end if;
  -- Tax in 2032 is the second year, after the 30,000,000 capex, so it must
  -- be positive, and it must be less than 45 percent of the 2032 share
  -- revenue (the base is net of royalty, opex and depreciation).
  if v_tax32 <= 0 then
    raise exception 'EC1 go-live refused: 2032 tax of % is not positive', v_tax32;
  end if;
  -- Payback inside the fourth year, take between the tax rate and 100.
  if not (v_pb > 3 and v_pb < 4) then
    raise exception 'EC1 go-live refused: payback of % years is not inside the fourth year', v_pb;
  end if;
  if not (v_take > 45 and v_take < 100) then
    raise exception 'EC1 go-live refused: take of % percent is not between the tax rate and 100', v_take;
  end if;
  if v_ncf34 <= 0 then
    raise exception 'EC1 go-live refused: 2034 net cash flow of % is not positive on a year with no capex', v_ncf34;
  end if;

  -- ------------------------------ Professional: TWO CONVENTIONS, AS A PAIR --
  -- Mid-year must be BELOW end-year here, because the first-year outflow is
  -- discounted by half a year too and the later inflows outweigh it; and the
  -- two must differ by more than the grading tolerance, or the pair grades
  -- one number twice.
  if not (v_npvmid < v_npv and v_npv - v_npvmid > 100000) then
    raise exception 'EC1 go-live refused: mid-year NPV % against end-year NPV % is not the separated pair the tier is built on', v_npvmid, v_npv;
  end if;
  -- NPV positive at 9 percent nominal means the IRR sits above 9; and the
  -- IRR is a NOMINAL rate on a real-basis run, so it must exceed the 9
  -- percent nominal hurdle by more than the 2.5 percent inflation gap.
  if not (v_npv > 0 and v_irr > 11.5) then
    raise exception 'EC1 go-live refused: NPV % and IRR % percent do not agree with a 9 percent nominal hurdle', v_npv, v_irr;
  end if;
  -- Discounted payback is later than payback, DPI is NPV over PV(capex) and
  -- therefore between 0 and 1 for a modest project, and the breakeven sits
  -- below the 76 USD/bbl price because NPV is positive there.
  if v_dpb <= v_pb then
    raise exception 'EC1 go-live refused: discounted payback % is not later than payback %', v_dpb, v_pb;
  end if;
  if not (v_dpi > 0 and v_dpi < 1) then
    raise exception 'EC1 go-live refused: DPI of % is not between 0 and 1', v_dpi;
  end if;
  if not (v_be < 76 and v_be > 40) then
    raise exception 'EC1 go-live refused: breakeven of % USD/bbl does not sit below the 76 USD/bbl price on a positive-NPV run', v_be;
  end if;

  -- ------------------------------ Expert: THE CAP CROSSING, AS AN IDENTITY --
  -- 100,000,000 less 97,612,500 of prior production less 1,600,000 in 2031.
  if abs(v_elig32 - 787500) > 0.5 then
    raise exception 'EC1 go-live refused: eligible barrels in 2032 of % are not the 787,500 the cap leaves', v_elig32;
  end if;
  -- The CPR cap must BIND in 2031, otherwise module 3 grades nought.
  if v_cpr31 <= 0 then
    raise exception 'EC1 go-live refused: the CPR cap defers % in 2031, so it does not bind and the tier loses its argument', v_cpr31;
  end if;
  -- The 2032 price royalty is positive (77.14 USD/bbl sits above the 2032
  -- low anchor) and small against revenue; the development levy in 2033 is
  -- positive because the framework is NTA 2025.
  if not (v_proy32 > 0 and v_proy32 < 0.05 * 0.8 * 1280000 * 76 * 1.015) then
    raise exception 'EC1 go-live refused: 2032 price royalty of % is outside the tier band', v_proy32;
  end if;
  if v_dev33 <= 0 then
    raise exception 'EC1 go-live refused: the 2033 development levy is %, so the framework is not NTA 2025', v_dev33;
  end if;
  if v_hct <= 0 then
    raise exception 'EC1 go-live refused: total HCT of % is not positive on a shallow-water PML', v_hct;
  end if;
  -- And the PIA run must be worth LESS than the joint venture run of the same
  -- rows: five taxes on three bases plus a terminal abandonment.
  if v_npvpia >= v_npv then
    raise exception 'EC1 go-live refused: the PIA NPV % is not below the joint venture NPV % on the same rows', v_npvpia, v_npv;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'cashflow' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'cashflow' and status = 'available') then
    raise exception 'EC1 go-live refused: cashflow did not reach status available';
  end if;

  raise notice 'EC1 go-live: cashflow is available. This OPENS the Economics module.';
end $$;
