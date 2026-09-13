-- ============================================================================
-- EC2 GO-LIVE (HELD): Fiscal Regime Design flips to 'available'. The SECOND
-- Economics course.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/fiscal.
--
-- Every assertion below is written from the ENGINE's output, never from the
-- intuition the capstone was designed with. Four of the Associate and
-- Professional checks are EXACT CLOSED-FORM IDENTITIES rather than bands,
-- because the sandbox generates its own production profile from a rate and a
-- decline and every one of those four values can therefore be written out in
-- full: a capstone quietly recut to a different decline, a different deck or
-- a different limit fails them to the cent.
--
-- Several others are written as PAIRS, because the Expert tier grades two
-- readings of ONE quantity on purpose (the effective tax rate with and
-- without the capex add-back, and the capex loss over the seven points the
-- engine sweeps against the eight its axis promises). A pair that collapses
-- to one number would grade the same thing twice and lose the finding.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_rev1   numeric; v_roy4   numeric; v_opex4  numeric; v_ncf5   numeric; v_pbcum  numeric; v_gov    numeric;
  v_rec1   numeric; v_pool3  numeric; v_rf5    numeric; v_roy8   numeric; v_tax    numeric; v_npvpsc numeric;
  v_top    numeric; v_etrtab numeric; v_etrswp numeric; v_loss7  numeric; v_loss8  numeric; v_climb  numeric;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'fiscal' and active;
  if v_structures <> 3 then
    raise exception 'EC2 go-live refused: fiscal has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'fiscal';
  if v_questions <> 396 then
    raise exception 'EC2 go-live refused: fiscal has % quiz questions, expected 396', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'fiscal';
  if v_capstones <> 3 then
    raise exception 'EC2 go-live refused: fiscal has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This engine compares the SHAPE of fiscal regimes on a generated profile.
  -- It does not forecast a decline it was not given, book a reserve, size a
  -- facility, sample a distribution (EC3), roll back a decision tree (EC4) or
  -- rank a portfolio (EC5). Nothing here may certify past that.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fiscal'
     and (f->>'label' ilike '%reserve%'   or f->>'label' ilike '%eur%'
       or f->>'label' ilike '%probabilit%' or f->>'label' ilike '%p10%'
       or f->>'label' ilike '%p90%'        or f->>'label' ilike '%emv%'
       or f->>'label' ilike '%tornado%'    or f->>'label' ilike '%value of information%'
       or f->>'unit'  ilike '%psi%'        or f->>'unit'  ilike '%stb/d%');
  if v_graded <> 0 then
    raise exception 'EC2 go-live refused: % capstone field(s) grade a quantity this fiscal sandbox cannot produce', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- Headline values the goldens and the teaching digest publish. A graded
  -- field within tolerance of one of these is a lookup, not a calculation.
  -- The window is the field's OWN tolerance, which is why the comparison is
  -- written against (f->>'tol') rather than a single absolute band: the
  -- eighteen fields span 1e-06 to 0.001 and one window for all of them would
  -- refuse values thousands of tolerances clear of any neighbour.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
            (397.0444827478669),   -- Generic Royalty/Tax NPV, default project
            (382.06603200373354),  -- USA Gulf of Mexico NPV, default project
            (357.872791645486),    -- Brazil Concession NPV, default project
            (274.366984253646),    -- Designer defaults, Concessionary NPV
            (173.4149835907035),   -- Designer defaults, PIA NPV
            (240.39370956440843),  -- capex_0.7_pia_default NPV
            (218.5118562784327),   -- capex_0.8_pia_default NPV
            (98.25197540715591),   -- capex_1.3_pia_default NPV
            (107.7526249224264),   -- price_60_pia_default NPV
            (452.51050838949885),  -- price_120_pia_default NPV
            (46.345241558596065),  -- Designer defaults, Concessionary ETR, table
            (55.5380437422336),    -- Designer defaults, PIA ETR, table
            (59.6210),             -- Designer defaults, Concessionary ETR, sweep
            (71.4471),             -- Designer defaults, PIA ETR, sweep
            (149.03678748332425),  -- capexLossesAsEngine, PIA
            (164.90022186013016),  -- capexLossesAsEngine, Concessionary
            (102400),              -- the IRR bracket
            (1431.0440)            -- cmp_never_recovers PIA government take
         ) as g(v)
   where c.app_slug = 'fiscal'
     and abs(abs((f->>'expected')::numeric) - g.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC2 go-live refused: % graded field(s) sit within their own tolerance of a value the goldens or the digest publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------ the handed-in-the-prompt assertion --
  -- Every number the three prompts state, at the grader's own tolerance. A
  -- graded field equal to one of them is a transcription, not a calculation.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values (5200),(11),(65),(7),(480),(13),(25),(365),(58),(3.2),(27),
                 (8),(72),(4.1),(34),(185),(95),(35),(9),(6.5),(14),(100),(28),
                 (6),(9.5),(60),(1.0),(1.4),(1.65),(45),(32),(6000),(0),(1),
                 (2),(3),(4),(5),(1.5),(40),(120),(315)) as h(v)
   where c.app_slug = 'fiscal'
     and abs(abs((f->>'expected')::numeric) - h.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC2 go-live refused: % graded field(s) land on a number the learner is handed in a prompt, which makes the field a transcription rather than a calculation', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  -- Re-reads the STORED prompts: no tier's prompt may state a graded value
  -- belonging to another tier (commas stripped, because a prompt writes
  -- 5,200 where the answer key holds 5200).
  select count(*) into v_graded
    from public.academy_capstones c,
         public.academy_capstones c2,
         lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'fiscal' and c2.app_slug = 'fiscal' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'EC2 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_rev1   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='con_y1_gross_revenue_musd';
  select (f->>'expected')::numeric into v_roy4   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='con_y4_royalty_musd';
  select (f->>'expected')::numeric into v_opex4  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='con_y4_opex_musd';
  select (f->>'expected')::numeric into v_ncf5   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='con_y5_contractor_ncf_musd';
  select (f->>'expected')::numeric into v_pbcum  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='con_payback_year_cum_ncf_musd';
  select (f->>'expected')::numeric into v_gov    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='con_total_government_take_musd';
  select (f->>'expected')::numeric into v_rec1   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='psc_y1_cost_recovered_musd';
  select (f->>'expected')::numeric into v_pool3  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='psc_y3_unrecovered_pool_musd';
  select (f->>'expected')::numeric into v_rf5    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='psc_y5_r_factor';
  select (f->>'expected')::numeric into v_roy8   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='psc_y8_royalty_musd';
  select (f->>'expected')::numeric into v_tax    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='psc_total_tax_musd';
  select (f->>'expected')::numeric into v_npvpsc from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='psc_npv_musd';
  select (f->>'expected')::numeric into v_top    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='cmp_top_npv_musd';
  select (f->>'expected')::numeric into v_etrtab from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='cmp_psc_effective_tax_rate_pct';
  select (f->>'expected')::numeric into v_etrswp from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='cmp_psc_price_sweep_at_60_pct';
  select (f->>'expected')::numeric into v_loss7  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='cmp_psc_capex_loss_seven_point_musd';
  select (f->>'expected')::numeric into v_loss8  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='cmp_psc_capex_loss_eight_point_musd';
  select (f->>'expected')::numeric into v_climb  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fiscal' and f->>'key'='cmp_con_price_climb_pct_points';

  if v_rev1 is null or v_roy4 is null or v_opex4 is null or v_ncf5 is null or v_pbcum is null or v_gov is null
     or v_rec1 is null or v_pool3 is null or v_rf5 is null or v_roy8 is null or v_tax is null or v_npvpsc is null
     or v_top is null or v_etrtab is null or v_etrswp is null or v_loss7 is null or v_loss8 is null or v_climb is null then
    raise exception 'EC2 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- --------------------------- Associate: THE PROFILE, AS EXACT IDENTITIES --
  -- The sandbox generates its own production, so year 1 is the initial rate
  -- times 365 days with NO decline taken, and gross revenue is the three
  -- streams at the first deck point divided by one million. A capstone recut
  -- to take the decline in year 1 fails this by 11 percent.
  if abs(v_rev1 - (5200 * 365 * 58 + 65 * 365 * 3.2 + 480 * 365 * 27) / 1e6) > 1e-9 then
    raise exception 'EC2 go-live refused: year 1 gross revenue of % is not the three streams at the first deck point with no decline taken', v_rev1;
  end if;
  -- Year 4 opex: the fixed half never moves and the variable half is charged
  -- on BOE, with gas at 6000 scf per barrel. A capstone that charged the
  -- variable rate on oil alone fails this.
  if abs(v_opex4 - (9 + 6.5 * (5200 * power(0.89, 3) * 365
                             + 480 * power(0.87, 3) * 365
                             + 65 * power(0.93, 3) * 365 * 1000 / 6000) / 1e6)) > 1e-9 then
    raise exception 'EC2 go-live refused: year 4 opex of % is not the fixed half plus the variable rate on barrels of oil equivalent', v_opex4;
  end if;
  -- Year 4 royalty: a FLAT 14 percent of gross revenue, and the deck has not
  -- stepped yet, so year 4 is still at the first deck point.
  if abs(v_roy4 - 0.14 * (5200 * power(0.89, 3) * 365 * 58
                        + 65 * power(0.93, 3) * 365 * 3.2
                        + 480 * power(0.87, 3) * 365 * 27) / 1e6) > 1e-9 then
    raise exception 'EC2 go-live refused: year 4 royalty of % is not a flat 14 percent of year 4 gross revenue at the first deck point', v_roy4;
  end if;
  -- The payback reading is a CUMULATIVE and must be the first POSITIVE one,
  -- so it is above zero and below the single year that produced it.
  if not (v_pbcum > 0 and v_pbcum < v_ncf5) then
    raise exception 'EC2 go-live refused: the cumulative of % in the payback year is not a first crossing below the year 5 flow of %', v_pbcum, v_ncf5;
  end if;
  if v_ncf5 <= 0 then
    raise exception 'EC2 go-live refused: year 5 net cash flow of % is not positive on a year with no capex', v_ncf5;
  end if;
  -- Government take is positive and below total revenue over the life.
  if not (v_gov > 0 and v_gov < 1200) then
    raise exception 'EC2 go-live refused: total government take of % is outside the tier band', v_gov;
  end if;

  -- ------------------- Professional: THE LIMIT BINDS, AS AN EXACT IDENTITY --
  -- Year 1 cost recovery is the LIMIT and not the pool, because the whole
  -- capex is charged in year 1 and the pool is far larger than the
  -- allowance. The allowance is the limit on revenue AFTER royalty, and the
  -- royalty in year 1 is the LOWER sliding tier because the deck opens below
  -- the 60 USD/bbl threshold. Both facts are in this one line.
  if abs(v_rec1 - 0.65 * (1 - 0.06) * (5200 * 365 * 58 + 65 * 365 * 3.2 + 480 * 365 * 27) / 1e6) > 1e-9 then
    raise exception 'EC2 go-live refused: year 1 cost recovery of % is not the 65 percent limit on revenue after a 6 percent royalty, so either the limit does not bind or the royalty took the wrong tier', v_rec1;
  end if;
  -- And the pool must still be carrying a balance out of year 3, or module 2
  -- grades nought and the tier loses its argument.
  if v_pool3 <= 0 then
    raise exception 'EC2 go-live refused: the unrecovered pool out of year 3 is %, so the cost recovery limit never binds', v_pool3;
  end if;
  -- The R factor in year 5 must sit in the FIRST tranche band, above the 1.0
  -- threshold and below the 1.4 one, or the field grades a tranche boundary
  -- rather than a reading. The thresholds are 1.0, 1.4 and 1.65, chosen so
  -- that ALL THREE engage over the life and the ratio then FALLS BACK through
  -- the top one in the final year. An earlier cut used 1.8 and 2.6, which this
  -- field never reaches: the split read 65 percent in all 25 years and a
  -- learner who ignored the R factor entirely scored full marks on every
  -- production sharing field.
  if not (v_rf5 > 1.0 and v_rf5 < 1.4) then
    raise exception 'EC2 go-live refused: the year 5 R factor of % is not inside the first tranche band', v_rf5;
  end if;
  -- Year 8 is the FIRST year on the far side of the deck step, so it is
  -- charged at the UPPER sliding tier, and it must still be smaller than the
  -- upper rate on year 1 revenue, because production has declined for seven
  -- years. Year 8 rather than year 9 because year 9 is past every candidate
  -- step year and therefore grades the same whether the reader puts the step
  -- at 7, 8 or 9; year 8 is the only year that discriminates it.
  if not (v_roy8 > 0 and v_roy8 < 0.095 * v_rev1) then
    raise exception 'EC2 go-live refused: the year 8 royalty of % is outside the band the upper sliding tier allows on a declined year', v_roy8;
  end if;
  if v_tax <= 0 then
    raise exception 'EC2 go-live refused: total tax of % is not positive', v_tax;
  end if;
  -- The production sharing run must be worth LESS than the concession run of
  -- the same rows. That is the comparison the whole course is for, and if it
  -- inverts the Expert tier grades the wrong regime as the winner.
  if v_npvpsc >= v_top then
    raise exception 'EC2 go-live refused: the production sharing NPV % is not below the concession NPV %, so the summary sort no longer puts the concession first', v_npvpsc, v_top;
  end if;

  -- ------------------------------- Expert: THE TWO PAIRS, AS SEPARATIONS --
  -- PAIR ONE, the effective tax rate with and without the capex add-back.
  -- Adding capex back into contractor take ENLARGES the denominator, so the
  -- summary's rate must be the SMALLER of the two, and they must differ by
  -- far more than the grading tolerance or the tier grades one number twice
  -- and the finding is lost.
  if not (v_etrswp > v_etrtab and v_etrswp - v_etrtab > 1) then
    raise exception 'EC2 go-live refused: the summary rate % and the sweep rate % are not the separated pair the tier is built on', v_etrtab, v_etrswp;
  end if;
  -- Both are shares in the ordinary band on this project, which is what makes
  -- the pair readable: neither point is the guard firing at zero and neither
  -- is above 100.
  if not (v_etrtab > 0 and v_etrtab < 100 and v_etrswp > 0 and v_etrswp < 100) then
    raise exception 'EC2 go-live refused: one of the two rates, % and %, is outside the ordinary share band, so the tier grades a guard rather than a reading', v_etrtab, v_etrswp;
  end if;
  -- PAIR TWO, the capex loss over the SEVEN points the engine sweeps against
  -- the EIGHT its axis promises. The eight-point loss must be strictly larger
  -- and the gap must exceed the tolerance, or the finding grades as one
  -- number and a learner who never noticed the short sweep still passes.
  if not (v_loss8 > v_loss7 and v_loss8 - v_loss7 > 1) then
    raise exception 'EC2 go-live refused: the seven-point loss % and the eight-point loss % are not separated, so the short capex sweep is not actually graded', v_loss7, v_loss8;
  end if;
  -- The concession's climb is NEGATIVE on this project: a flat royalty and a
  -- flat tax on a growing profit give the government a shrinking fraction.
  -- A positive climb means the regime was recut into a progressive one and
  -- the lesson the field carries no longer applies.
  if v_climb >= 0 then
    raise exception 'EC2 go-live refused: the concession climb of % percentage points is not negative, so the regressive reading the field teaches no longer holds', v_climb;
  end if;
  if v_top <= 0 then
    raise exception 'EC2 go-live refused: the top summary NPV of % is not positive, so the comparison has no viable regime in it', v_top;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'fiscal' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'fiscal' and status = 'available') then
    raise exception 'EC2 go-live refused: fiscal did not reach status available';
  end if;

  raise notice 'EC2 go-live: fiscal is available. Economics now has two courses.';
end $$;
