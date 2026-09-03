-- ============================================================================
-- DR9 GO-LIVE (HELD): Perforation & Sand Control flips to 'available'.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/perfsand. Flipping the catalog row before the route
-- exists sells a course that returns a blank page.
--
-- Every assertion below is written from the ENGINE's output rather than from
-- the intuition the capstone prompts were drafted with, which is the DR7 rule.
-- DR7's first clean go-live run REFUSED because an assertion encoded a ceiling
-- the course's own module had already disproved, and asserting the wrong thing
-- confidently is worse than asserting nothing.
-- ============================================================================

do $$
declare
  c_in         constant numeric := 0.0254;
  c_ft         constant numeric := 0.3048;
  c_boost      constant numeric := 1.15;   -- the boost the Expert capstone applies
  c_top        constant numeric := 2200;   -- the Expert capstone interval
  c_bottom     constant numeric := 2320;
  c_step       constant numeric := 25;
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_spf        numeric;
  v_spacing    numeric;
  v_d50        numeric;
  v_d10        numeric;
  v_unif       numeric;
  v_fines      numeric;
  v_sh         numeric;
  v_sv         numeric;
  v_scz        numeric;
  v_stot       numeric;
  v_pr         numeric;
  v_rpd        numeric;
  v_band       numeric;
  v_gauge      numeric;
  v_pwf        numeric;
  v_cdpgov     numeric;
  v_cdpbot     numeric;
  v_boost0     numeric;
  v_lnrerw     numeric;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures
    from public.academy_course_structures where app_slug = 'perfsand' and active;
  if v_structures <> 3 then
    raise exception 'DR9 go-live refused: perfsand has % active deep structures, expected 3', v_structures;
  end if;

  select count(*) into v_questions
    from public.academy_quiz_questions where app_slug = 'perfsand';
  if v_questions <> 396 then
    raise exception 'DR9 go-live refused: perfsand has % quiz questions, expected 396 (132 per tier)', v_questions;
  end if;

  select count(*) into v_capstones
    from public.academy_capstones where app_slug = 'perfsand';
  if v_capstones <> 3 then
    raise exception 'DR9 go-live refused: perfsand has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This engine computes an ONSET criterion and a dimensionless skin. It
  -- computes no rate of anything: not a production rate, not a sand rate, not
  -- a volume of solids over time. A course that TEACHES a topic says it is
  -- worth knowing about; one that GRADES it says the learner can produce the
  -- answer AND that the answer is worth certifying. Nothing here may grade a
  -- rate, because the engine has no input that could produce one.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'perfsand'
     and (f->>'unit' ilike '%/day%' or f->>'unit' ilike '%bbl%'
       or f->>'unit' ilike '%stb%'  or f->>'unit' ilike '%kg/%'
       or f->>'label' ilike '%rate%' or f->>'label' ilike '%production%');
  if v_graded <> 0 then
    raise exception 'DR9 go-live refused: % capstone field(s) grade a rate, which this onset-and-geometry engine cannot produce', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- DR4 earned this. The pairwise collision test catches two graded fields
  -- colliding with EACH OTHER; it does NOT catch a graded field colliding with
  -- a value the GOLDENS PUBLISH, which would turn a calculation into a lookup
  -- a learner could read off the fixture. The most quotable numbers in
  -- perfsand_cases.json are checked by name; the full sweep is in
  -- perfsandLab.test.js.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'perfsand'
     and (abs((f->>'expected')::numeric - 0.000295804)  < 0.0000000005   -- published D10
       or abs((f->>'expected')::numeric - 0.00011274)   < 0.0000000005   -- published D50
       or abs((f->>'expected')::numeric - 0.000138465)  < 0.0000000005   -- published D40
       or abs((f->>'expected')::numeric - 0.000045176)  < 0.0000000005   -- published D90
       or abs((f->>'expected')::numeric - 3.065002676)  < 0.0000005      -- published uniformity
       or abs((f->>'expected')::numeric - 9.0)          < 0.000005       -- published fines percent
       or abs((f->>'expected')::numeric - 0.000563701)  < 0.0000000005   -- published gravel band minimum
       or abs((f->>'expected')::numeric - 0.000676441)  < 0.0000000005   -- published gravel band maximum
       or abs((f->>'expected')::numeric - 0.125163143)  < 0.0000005      -- published plane-flow skin
       or abs((f->>'expected')::numeric - 0.382819829)  < 0.0000005      -- published converging-flow skin
       or abs((f->>'expected')::numeric - 1.173069655)  < 0.0000005      -- published crushed-zone skin
       or abs((f->>'expected')::numeric - 1.969859507)  < 0.0000005      -- published total skin
       or abs((f->>'expected')::numeric - 0.801018847)  < 0.0000005      -- published productivity ratio
       or abs((f->>'expected')::numeric - 0.039433757)  < 0.00000005     -- published dimensionless perf radius
       or abs((f->>'expected')::numeric - 0.0762)       < 0.00000005     -- published shot spacing
       or abs((f->>'expected')::numeric - 6000141.976310883) < 500       -- published ragged governing CDP
       or abs((f->>'expected')::numeric - 17204680.382154956) < 500);    -- published critical flowing pressure
  if v_graded <> 0 then
    raise exception 'DR9 go-live refused: % graded field(s) sit within tolerance of a value the goldens publish, which makes them a lookup rather than a calculation', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_spf     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='spf_per_m';
  select (f->>'expected')::numeric into v_spacing from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='perf_spacing_m';
  select (f->>'expected')::numeric into v_d50     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='d50_m';
  select (f->>'expected')::numeric into v_d10     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='d10_m';
  select (f->>'expected')::numeric into v_unif    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='uniformity';
  select (f->>'expected')::numeric into v_fines   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='fines_pct';
  select (f->>'expected')::numeric into v_sh      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='skin_h';
  select (f->>'expected')::numeric into v_sv      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='skin_v';
  select (f->>'expected')::numeric into v_scz     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='skin_cz';
  select (f->>'expected')::numeric into v_stot    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='skin_total';
  select (f->>'expected')::numeric into v_pr      from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='productivity_ratio';
  select (f->>'expected')::numeric into v_rpd     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='rp_d';
  select (f->>'expected')::numeric into v_band    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='gravel_band_min_m';
  select (f->>'expected')::numeric into v_gauge   from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='gauge_margin_m';
  select (f->>'expected')::numeric into v_pwf     from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='pwf_crit_pa';
  select (f->>'expected')::numeric into v_cdpgov  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='cdp_governing_pa';
  select (f->>'expected')::numeric into v_cdpbot  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='cdp_bottom_pa';
  select (f->>'expected')::numeric into v_boost0  from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='perfsand' and f->>'key'='boost_at_zero_margin';

  if v_spf is null or v_spacing is null or v_d50 is null or v_d10 is null
     or v_unif is null or v_fines is null or v_sh is null or v_sv is null
     or v_scz is null or v_stot is null or v_pr is null or v_rpd is null
     or v_band is null or v_gauge is null or v_pwf is null or v_cdpgov is null
     or v_cdpbot is null or v_boost0 is null then
    raise exception 'DR9 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------------------------------------ Associate: the inputs --
  -- The reciprocal identity. Density and spacing are the same input twice, and
  -- the product is one by construction. A conversion applied to one and not the
  -- other is the most likely single error on this tier and it breaks here.
  if abs(v_spf * v_spacing - 1) > 0.0000000001 then
    raise exception 'DR9 go-live refused: shot density % times spacing % is %, not 1, so one of the two has been converted and the other has not', v_spf, v_spacing, v_spf * v_spacing;
  end if;
  if abs(v_spf - 8 / c_ft) > 0.0000005 then
    raise exception 'DR9 go-live refused: the shot density of % per metre is not 8 per foot converted', v_spf;
  end if;

  -- THE CONVENTION ASSERTION. On a RETAINED curve D10 is the coarse end, so it
  -- must EXCEED D50. Reading the capstone sieve as a passing curve swaps them
  -- and quietly ruins the uniformity with them, producing three wrong fields
  -- and no error anywhere.
  if v_d10 <= v_d50 then
    raise exception 'DR9 go-live refused: D10 of % does not exceed D50 of %, so the capstone sieve has been read as a passing curve rather than a retained one', v_d10, v_d50;
  end if;
  if v_unif <= 1 then
    raise exception 'DR9 go-live refused: the uniformity of % is not above one, which no real distribution gives', v_unif;
  end if;

  -- A PAIR ON THE FINES, OF WHICH BOTH BOUNDS MUST HOLD AND NEITHER MAY CLOSE.
  -- The cutoff at 44 microns is BRACKETED by the 50 micron sieve (92 percent
  -- retained, so 8 percent passing) and the 38 micron sieve (96 retained, 4
  -- passing). The answer must fall strictly between those, because a value
  -- landing exactly on either one would mean the interpolation had collapsed
  -- onto a sieve point and the cutoff was never actually interpolated.
  if v_fines <= 4 or v_fines >= 8 then
    raise exception 'DR9 go-live refused: the fines percentage of % does not fall strictly between the 4 percent passing at 38 microns and the 8 percent at 50 microns, which bracket the 44 micron cutoff', v_fines;
  end if;

  -- --------------------------------------------- Professional: the skin ----
  -- THE BLOCKAGE ASSERTION, AS A PAIR OF WHICH ONE MUST CLOSE AND THE OTHER
  -- MUST NOT. The total is the sum of FOUR components and only three are
  -- graded. So the total must NOT equal the sum of the three, and the residual
  -- must be a small positive number: that residual IS the wellbore blockage
  -- skin. Asserting only that the three sum to something near the total would
  -- pass on an engine that had quietly dropped the fourth term, which is
  -- exactly the failure this pair exists to catch.
  if abs(v_stot - (v_sh + v_sv + v_scz)) <= 0.0000005 then
    raise exception 'DR9 go-live refused: the total skin of % equals the sum of the three graded components, so the wellbore blockage term has gone to zero and the Professional capstone has lost its fourth component', v_stot;
  end if;
  if (v_stot - (v_sh + v_sv + v_scz)) <= 0 or (v_stot - (v_sh + v_sv + v_scz)) > 0.02 then
    raise exception 'DR9 go-live refused: the residual after the three graded skin components is %, which is not a small positive blockage term', v_stot - (v_sh + v_sv + v_scz);
  end if;

  -- The sign chain, which is the tier's headline. A tunnel reaching past the
  -- wall gives a NEGATIVE plane-flow skin; convergence and crushing are both
  -- POSITIVE; the total stays negative; and a negative total is a stimulation,
  -- so the ratio exceeds one. If a later edit made this gun damage the well,
  -- two whole modules would lose their worked case.
  if v_sh >= 0 then
    raise exception 'DR9 go-live refused: the plane-flow skin of % is not negative, so the capstone tunnel no longer reaches past the wellbore wall', v_sh;
  end if;
  if v_sv <= 0 or v_scz <= 0 then
    raise exception 'DR9 go-live refused: the converging-flow skin % or the crushed-zone skin % is not positive', v_sv, v_scz;
  end if;
  if v_stot >= 0 then
    raise exception 'DR9 go-live refused: the total skin of % is not negative, so the Professional capstone no longer demonstrates a stimulating perforation', v_stot;
  end if;
  if v_pr <= 1 then
    raise exception 'DR9 go-live refused: the productivity ratio of % does not exceed one despite a negative total skin of %', v_pr, v_stot;
  end if;

  -- And the ratio must be the skin put through the definition, at the stated
  -- drainage radius of 220 m and the 9-7/8 inch hole, rather than any default.
  v_lnrerw := ln(220 / (4.9375 * c_in));
  if abs(v_pr - v_lnrerw / (v_lnrerw + v_stot)) > 0.0000005 then
    raise exception 'DR9 go-live refused: the productivity ratio of % is not the logarithm of the radius ratio over that logarithm plus the total skin, so a different drainage radius or wellbore radius has been used', v_pr;
  end if;
  if v_rpd <= 0 or v_rpd >= 1 then
    raise exception 'DR9 go-live refused: the dimensionless perforation radius of % is outside (0, 1)', v_rpd;
  end if;

  -- ------------------------------------------------- Expert: sand and rock --
  -- THE CROSS-TIER IDENTITY. The Saucier band minimum is five times the
  -- formation median, and the median is an Associate graded field on the SAME
  -- sand. Grading both is deliberate: the Expert learner has already earned
  -- the median, and this assertion is what keeps the two tiers on one sample.
  if abs(v_band - 5 * v_d50) > 0.0000000005 then
    raise exception 'DR9 go-live refused: the gravel band minimum of % is not five times the Associate D50 of %, so the two tiers are no longer sizing the same sand', v_band, v_d50;
  end if;
  if v_gauge <= 0 then
    raise exception 'DR9 go-live refused: the gauge margin of % is not positive, so the selected gauge is not below its bound', v_gauge;
  end if;

  -- THE RAGGED-INTERVAL ASSERTION, WHICH IS THE WHOLE REASON THIS COURSE
  -- EXISTS IN ITS PRESENT FORM. The Expert capstone interval must NOT divide
  -- evenly by its step. If a later edit tidied 2200 to 2320 at 25 m into
  -- something that divides, the capstone would stop exercising the engine
  -- defect module 5 is built on, the bottom row would coincide with the last
  -- whole step, and the course would teach a bug that its own capstone could
  -- no longer detect.
  if mod(c_bottom - c_top, c_step) = 0 then
    raise exception 'DR9 go-live refused: the Expert interval of % to % divides evenly by its % m step, so the capstone no longer exercises the clamped bottom row', c_top, c_bottom, c_step;
  end if;

  -- The governing value is a MINIMUM over the rows, so the bottom row must be
  -- strictly larger. This is also the pair that proves the top governs: if a
  -- later edit made the deepest station the worst one, these two would be
  -- equal and the tier's warning about assuming the deepest row governs would
  -- have quietly become false.
  if v_cdpbot <= v_cdpgov then
    raise exception 'DR9 go-live refused: the bottom-station CDP of % does not exceed the governing CDP of %, so the governing row is no longer the top of the interval', v_cdpbot, v_cdpgov;
  end if;
  if v_pwf <= 0 or v_cdpgov <= 0 then
    raise exception 'DR9 go-live refused: the critical flowing pressure % or the governing CDP % is not positive', v_pwf, v_cdpgov;
  end if;

  -- The boost at which the governing margin vanishes must sit BELOW the boost
  -- the capstone applies, because at 1.15 the interval still has margin. An
  -- edit that pushed the capstone into failure would invert this and the
  -- Expert prompt's free check would be wrong.
  if v_boost0 >= c_boost then
    raise exception 'DR9 go-live refused: the zero-margin boost of % is not below the applied boost of %, so the Expert capstone interval no longer has margin', v_boost0, c_boost;
  end if;

  -- ------------------------------------------------------------ the flip --
  update public.academy_apps
     set status = 'available'
   where slug = 'perfsand' and status = 'coming_soon';

  if not exists (select 1 from public.academy_apps where slug = 'perfsand' and status = 'available') then
    raise exception 'DR9 go-live refused: perfsand did not reach status available';
  end if;

  raise notice 'DR9 go-live: perfsand is available. 3 structures, 396 questions, 3 capstones, 18 graded fields, all assertions passed.';
end $$;
