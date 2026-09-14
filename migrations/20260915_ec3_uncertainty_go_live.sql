-- ============================================================================
-- EC3 GO-LIVE (HELD): Probabilistic Economics flips to 'available'. The THIRD
-- Economics course.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/uncertainty.
--
-- Every assertion below is written from the ENGINES' output, never from the
-- intuition the capstone was designed with, and every one was checked in
-- Python against fields.json before it was written here (18 of 18 held; the
-- three closed forms reproduce the engine to 5e-15). Three Associate checks
-- are EXACT CLOSED-FORM IDENTITIES, because the quick form generates its
-- profile from a rate and a decline: a capstone quietly recut to another
-- decline, price, royalty or tax rate fails them to the cent.
--
-- The Expert checks are PAIRS, because the tier grades one sample read two
-- ways on purpose: the Low case P90 against the High case P10 of the same
-- run, and the 10th percentile by the screening rule against the breakeven
-- engine's floor rule. A pair that collapses would grade one thing twice and
-- lose the finding.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_roy5 numeric; v_tax4 numeric; v_ncf11 numeric; v_pbcum numeric; v_npv numeric; v_npvup numeric;
  v_cxmax numeric; v_oxmode numeric; v_base numeric; v_q10 numeric; v_q90 numeric; v_torn numeric;
  v_low numeric; v_high numeric; v_emv numeric; v_floor numeric; v_nextmed numeric; v_hurdle numeric;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'uncertainty' and active;
  if v_structures <> 3 then
    raise exception 'EC3 go-live refused: uncertainty has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'uncertainty';
  if v_questions <> 396 then
    raise exception 'EC3 go-live refused: uncertainty has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'uncertainty';
  if v_capstones <> 3 then
    raise exception 'EC3 go-live refused: uncertainty has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This course samples a SCREENING case and a breakeven price. It does not
  -- book a reserve, estimate an ultimate recovery, model a pressure, value
  -- information, roll back a decision tree (EC4), rank a portfolio (EC5) or
  -- run a production sharing cost pool. Percentiles, P-labels on an NPV, EMV
  -- and a tornado are this course's subject and are NOT refused here.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'uncertainty'
     and (f->>'label' ilike '%reserve%'   or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%value of information%' or f->>'label' ilike '%decision tree%'
       or f->>'label' ilike '%portfolio%' or f->>'label' ilike '%cost pool%'
       or f->>'label' ilike '%r factor%'  or f->>'unit'  ilike '%psi%');
  if v_graded <> 0 then
    raise exception 'EC3 go-live refused: % capstone field(s) grade a quantity these screening engines cannot produce', v_graded;
  end if;

  -- ----------------------------------- the percentile-words assertion --
  -- The Suite convention: a breakeven price and every input take percentile
  -- words. A P-label may only name an NPV outcome.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'uncertainty'
     and f->>'label' ~ '\mP(10|50|90)\M'
     and f->>'label' not ilike '%NPV%';
  if v_graded <> 0 then
    raise exception 'EC3 go-live refused: % capstone field label(s) put a P-label on something other than an NPV outcome', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- Headline values the goldens and the teaching digest publish. A graded
  -- field within its OWN tolerance of one of these is a lookup.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
            (81.0464),              -- ISIALA NPV
            (71.6277),              -- ISIALA base breakeven
            (73.3297),              -- ISIALA median breakeven
            (62.1713),              -- ISIALA 10th percentile breakeven
            (85.5912),              -- ISIALA 90th percentile breakeven
            (48.7439),              -- ISIALA Low case P90 NPV
            (81.1835),              -- ISIALA Best case P50 NPV
            (109.8980),             -- ISIALA High case P10 NPV
            (80.1707),              -- ISIALA EMV
            (1000),                 -- the screening IRR clamp
            (20260829),             -- the default seed of both engines
            (179.21898086125307),   -- mc_seed_7 median breakeven
            (150.7141535501849),    -- mc_seed_7 10th percentile breakeven
            (215.81480630802645),   -- mc_seed_7 90th percentile breakeven
            (175.15000162269325),   -- mc_seed_7 base breakeven
            (472.60822311560736)    -- scen_base_10yr Base NPV
         ) as g(v)
   where c.app_slug = 'uncertainty'
     and abs(abs((f->>'expected')::numeric) - g.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC3 go-live refused: % graded field(s) sit within their own tolerance of a value the goldens or the digest publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------ the handed-in-the-prompt assertion --
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values (3900),(10),(64),(150),(2.1),(14.5),(17.5),(38),(13),(2028),(20),
                 (125),(185),(14),(23),(84),(90),(95),(4000),(9031),(9032),(1200),
                 (22),(15),(100),(0),(1),(1.3),(2032),(2031),(2038),(0.1),(5),(4),(11)) as h(v)
   where c.app_slug = 'uncertainty'
     and abs(abs((f->>'expected')::numeric) - h.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC3 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'uncertainty' and c2.app_slug = 'uncertainty' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'EC3 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_roy5    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_y5_royalty_musd';
  select (f->>'expected')::numeric into v_tax4    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_y4_tax_musd';
  select (f->>'expected')::numeric into v_ncf11   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_y11_ncf_musd';
  select (f->>'expected')::numeric into v_pbcum   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_payback_year_cum_ncf_musd';
  select (f->>'expected')::numeric into v_npv     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_npv_musd';
  select (f->>'expected')::numeric into v_npvup   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_npv_price_up_30_musd';
  select (f->>'expected')::numeric into v_cxmax   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_capex_fit_max_musd';
  select (f->>'expected')::numeric into v_oxmode  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_opex_fit_mode_musd';
  select (f->>'expected')::numeric into v_base    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_base_breakeven_usd_bbl';
  select (f->>'expected')::numeric into v_q10     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_breakeven_10th_percentile_usd_bbl';
  select (f->>'expected')::numeric into v_q90     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_breakeven_90th_percentile_usd_bbl';
  select (f->>'expected')::numeric into v_torn    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_tornado_capex_high_side_usd_bbl';
  select (f->>'expected')::numeric into v_low     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_mc_low_case_p90_npv_musd';
  select (f->>'expected')::numeric into v_high    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_mc_high_case_p10_npv_musd';
  select (f->>'expected')::numeric into v_emv     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_mc_emv_musd';
  select (f->>'expected')::numeric into v_floor   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_mc_10th_percentile_floor_rule_musd';
  select (f->>'expected')::numeric into v_nextmed from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_breakeven_median_next_seed_usd_bbl';
  select (f->>'expected')::numeric into v_hurdle  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='uncertainty' and f->>'key'='um_breakeven_at_hurdle_usd_bbl';

  if v_roy5 is null or v_tax4 is null or v_ncf11 is null or v_pbcum is null or v_npv is null or v_npvup is null
     or v_cxmax is null or v_oxmode is null or v_base is null or v_q10 is null or v_q90 is null or v_torn is null
     or v_low is null or v_high is null or v_emv is null or v_floor is null or v_nextmed is null or v_hurdle is null then
    raise exception 'EC3 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------------------- Associate: EXACT CLOSED-FORM IDENTITIES --
  -- The quick form's profile is 3900 bopd x 365 x 0.9 to the power of the year
  -- index (year 1 = index 0), at a flat 64 USD per bbl, royalty 17.5 percent,
  -- tax 38 percent on revenue after royalty less fixed opex 2.1 and variable
  -- opex 14.5 USD per bbl; capex is expensed only in years 1 and 2.
  if abs(v_roy5 - 0.175 * 3900 * 365 * power(0.9, 4) * 64 / 1e6) > 1e-9 then
    raise exception 'EC3 go-live refused: year 5 royalty of % is not 17.5 percent of the year 5 gross revenue', v_roy5;
  end if;
  if abs(v_tax4 - 0.38 * (0.825 * 3900 * 365 * power(0.9, 3) * 64 / 1e6 - 2.1 - 14.5 * 3900 * 365 * power(0.9, 3) / 1e6)) > 1e-9 then
    raise exception 'EC3 go-live refused: year 4 tax of % is not 38 percent of revenue after royalty less fixed and variable opex', v_tax4;
  end if;
  if abs(v_ncf11 - 0.62 * (0.825 * 3900 * 365 * power(0.9, 10) * 64 / 1e6 - 2.1 - 14.5 * 3900 * 365 * power(0.9, 10) / 1e6)) > 1e-9 then
    raise exception 'EC3 go-live refused: year 11 net cash flow of % is not the after-tax margin of a year with no capex', v_ncf11;
  end if;
  if not (v_pbcum > 0) then
    raise exception 'EC3 go-live refused: the cumulative of % in the payback year is not positive', v_pbcum;
  end if;
  if not (v_npv > 0 and v_npvup > v_npv + 1) then
    raise exception 'EC3 go-live refused: NPV % and NPV at price x1.3 % are not the ordered pair the sweep produces', v_npv, v_npvup;
  end if;

  -- ------------------------------- Professional: the fit and the sample --
  if not (v_cxmax > 185 + 1) then
    raise exception 'EC3 go-live refused: the fitted capex maximum % is not wider than the stated 90th percentile, so the endpoints mistake is not graded', v_cxmax;
  end if;
  if not (v_oxmode < 17.5 - 1) then
    raise exception 'EC3 go-live refused: the fitted opex mode % is not below the stated median, so the fit is not distinguished from the belief', v_oxmode;
  end if;
  if not (v_q10 < v_base and v_base < v_q90) then
    raise exception 'EC3 go-live refused: the base breakeven % is not inside the sampled 10th % and 90th % percentiles', v_base, v_q10, v_q90;
  end if;
  if not (v_torn > 0) then
    raise exception 'EC3 go-live refused: the capex tornado high side % is not positive', v_torn;
  end if;

  -- ------------------------------- Expert: THE PAIRS, AS SEPARATIONS --
  -- Low case P90 reads the engine key p10, High case P10 the key p90: they
  -- must be ordered around EMV and far apart, or a reader who swapped them
  -- would still score.
  if not (v_low < v_emv and v_emv < v_high and v_high - v_low > 1) then
    raise exception 'EC3 go-live refused: Low case %, EMV % and High case % are not the ordered, separated triple the convention lesson grades', v_low, v_emv, v_high;
  end if;
  -- The two percentile rules on one sample: apart by more than the tolerance
  -- (so the rule is graded) and close (so both describe the same sample).
  if not (abs(v_floor - v_low) > 0.001 and abs(v_floor - v_low) < 0.1) then
    raise exception 'EC3 go-live refused: the floor-rule 10th percentile % and the Low case % are not the close but separated pair the two-rules lesson grades', v_floor, v_low;
  end if;
  if not (v_q10 < v_nextmed and v_nextmed < v_q90) then
    raise exception 'EC3 go-live refused: the next-seed median % is outside the 10th to 90th percentile band % to %', v_nextmed, v_q10, v_q90;
  end if;
  if not (v_hurdle > v_base + 1) then
    raise exception 'EC3 go-live refused: the hurdle breakeven % is not above the base breakeven %', v_hurdle, v_base;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'uncertainty' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'uncertainty' and status = 'available') then
    raise exception 'EC3 go-live refused: uncertainty did not reach status available';
  end if;

  raise notice 'EC3 go-live: uncertainty is available. Economics now has three courses.';
end $$;
