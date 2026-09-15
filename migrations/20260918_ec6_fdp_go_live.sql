-- ============================================================================
-- EC6 GO-LIVE (HELD): Field Development Planning flips to 'available'.
-- The SIXTH and LAST Economics course.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/fdp.
--
-- Every assertion below was checked in Python against fields.json before it
-- was written here (scratch/ec6_golive_check.py, 19 of 19 holding). Thirteen
-- of the eighteen graded fields are EXACT closed forms of the prompt's own
-- numbers: three sums, a longest path, a date difference, two drilling rules,
-- a power law, a percentage of another graded field, and four earned value
-- identities including a planned value spread across each task's own window.
-- The five screening economics fields (two NPVs, a rate, a stress case and a
-- sensitivity swing) are checked as ORDERED PAIRS and bounds, because a
-- twenty year mid-year discounted cash flow is not a closed form a migration
-- should recompute.
-- ============================================================================

do $$
declare
  v_structures integer;
  v_capstones  integer;
  v_questions  integer;
  v_graded     integer;
  v_d1 integer; v_d2 integer; v_d3 integer;
  v_u_concept_capex_mm numeric;
  v_u_oil_p50_mmbbl numeric;
  v_u_gas_p50_bcf numeric;
  v_u_base_npv_mm numeric;
  v_u_base_irr_pct numeric;
  v_u_alternative_npv_mm numeric;
  v_u_network_duration_days numeric;
  v_u_calendar_span_days numeric;
  v_u_uk01_well_cost_usd numeric;
  v_u_campaign_cost_usd numeric;
  v_u_platform_capex_mm numeric;
  v_u_platform_decommissioning_m numeric;
  v_m_planned_value_usd numeric;
  v_m_earned_value_usd numeric;
  v_m_spi numeric;
  v_m_completion_ratio numeric;
  v_u_price_swing_mm numeric;
  v_u_stress_npv_mm numeric;
begin
  -- ---------------------------------------------------------------- shape --
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'fdp' and active;
  if v_structures <> 3 then
    raise exception 'EC6 go-live refused: fdp has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'fdp';
  if v_questions <> 396 then
    raise exception 'EC6 go-live refused: fdp has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'fdp';
  if v_capstones <> 3 then
    raise exception 'EC6 go-live refused: fdp has % capstones, expected 3', v_capstones;
  end if;

  -- ------------------------------------------------- the scope assertion --
  -- This course plans a field development and measures a project against its
  -- own plan. It does not value information (EC4), choose a portfolio under a
  -- limit (EC5), sample a breakeven price (EC3), roll back a decision tree,
  -- book a reserve against SPE-PRMS or model a pressure.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fdp'
     and (f->>'label' ilike '%value of information%' or f->>'label' ilike '%evpi%'
       or f->>'label' ilike '%breakeven%' or f->>'label' ilike '%decision tree%'
       or f->>'label' ilike '%efficient frontier%' or f->>'label' ilike '%working interest%'
       or f->>'unit'  ilike '%psi%');
  if v_graded <> 0 then
    raise exception 'EC6 go-live refused: % capstone field(s) grade a quantity these engines cannot produce', v_graded;
  end if;

  -- ---------------------------------------------- the P-label assertion --
  -- A P-label may only name a reserves distribution, one fluid at a time.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'fdp'
     and f->>'label' ~ '\mP(10|50|90)\M'
     and f->>'label' !~* '(oil|gas|condensate|reserves)';
  if v_graded <> 0 then
    raise exception 'EC6 go-live refused: % capstone field label(s) put a P-label on something other than a reserves distribution', v_graded;
  end if;

  -- --------------------------------------- the published-golden assertion --
  -- No graded answer may sit within its own tolerance of a number the teaching
  -- digest or the published goldens carry.
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values
            (2250), (130), (70), (2047.5653), (29.5998), (3.8273), (870), (933), (63)
          , (1363.3524), (204.5029), (10178668), (8360000), (0.821326), (0.26125), (3092.0051), (-1797.2732), (0.247009), (0.428718), (0.877425)
         ) as g(v)
   where c.app_slug = 'fdp'
     and abs(abs((f->>'expected')::numeric) - abs(g.v)) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC6 go-live refused: % graded field(s) sit within their own tolerance of a value the goldens or the digest publish', v_graded;
  end if;

  -- ------------------------------------ the handed-in-the-prompt assertion --
  select count(*) into v_graded
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f,
         (values (48),(82),(130),(17),(29),(47),(26),(46),(73),(15),(28),(45),(410),(760),(150),(68),(18),(44),(190),(120),(260),(33),(14),(19),(22),(10),(24),(260),(380),(190),(171),(120),(265000),(13100),(10400),(8700),(45000),(110000),(1800000),(1950000),(4600000),(2860000),(7300000),(1180000),(9900000),(70),(20)) as h(v)
   where c.app_slug = 'fdp'
     and abs(abs((f->>'expected')::numeric) - h.v) <= (f->>'tol')::numeric;
  if v_graded <> 0 then
    raise exception 'EC6 go-live refused: % graded field(s) land on a number the learner is handed in a prompt', v_graded;
  end if;

  -- ------------------------------------- the cross-tier prompt-leak gate --
  select count(*) into v_graded
    from public.academy_capstones c, public.academy_capstones c2, lateral jsonb_array_elements(c2.fields) f
   where c.app_slug = 'fdp' and c2.app_slug = 'fdp' and c.tier <> c2.tier
     and replace(c.prompt, ',', '') like '%' || (f->>'expected') || '%';
  if v_graded <> 0 then
    raise exception 'EC6 go-live refused: % capstone prompt(s) state a graded value belonging to another tier', v_graded;
  end if;

  -- ------------------------------------------------------- load the values --
  select (f->>'expected')::numeric into v_u_concept_capex_mm from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_concept_capex_mm';
  select (f->>'expected')::numeric into v_u_oil_p50_mmbbl from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_oil_p50_mmbbl';
  select (f->>'expected')::numeric into v_u_gas_p50_bcf from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_gas_p50_bcf';
  select (f->>'expected')::numeric into v_u_base_npv_mm from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_base_npv_mm';
  select (f->>'expected')::numeric into v_u_base_irr_pct from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_base_irr_pct';
  select (f->>'expected')::numeric into v_u_alternative_npv_mm from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_alternative_npv_mm';
  select (f->>'expected')::numeric into v_u_network_duration_days from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_network_duration_days';
  select (f->>'expected')::numeric into v_u_calendar_span_days from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_calendar_span_days';
  select (f->>'expected')::numeric into v_u_uk01_well_cost_usd from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_uk01_well_cost_usd';
  select (f->>'expected')::numeric into v_u_campaign_cost_usd from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_campaign_cost_usd';
  select (f->>'expected')::numeric into v_u_platform_capex_mm from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_platform_capex_mm';
  select (f->>'expected')::numeric into v_u_platform_decommissioning_m from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_platform_decommissioning_mm';
  select (f->>'expected')::numeric into v_m_planned_value_usd from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='meren_planned_value_usd';
  select (f->>'expected')::numeric into v_m_earned_value_usd from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='meren_earned_value_usd';
  select (f->>'expected')::numeric into v_m_spi from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='meren_spi';
  select (f->>'expected')::numeric into v_m_completion_ratio from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='meren_completion_ratio';
  select (f->>'expected')::numeric into v_u_price_swing_mm from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_price_swing_mm';
  select (f->>'expected')::numeric into v_u_stress_npv_mm from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug='fdp' and f->>'key'='ukot_stress_npv_mm';

  if v_u_concept_capex_mm is null
     or v_u_oil_p50_mmbbl is null
     or v_u_gas_p50_bcf is null
     or v_u_base_npv_mm is null
     or v_u_base_irr_pct is null
     or v_u_alternative_npv_mm is null
     or v_u_network_duration_days is null
     or v_u_calendar_span_days is null
     or v_u_uk01_well_cost_usd is null
     or v_u_campaign_cost_usd is null
     or v_u_platform_capex_mm is null
     or v_u_platform_decommissioning_m is null
     or v_m_planned_value_usd is null
     or v_m_earned_value_usd is null
     or v_m_spi is null
     or v_m_completion_ratio is null
     or v_u_price_swing_mm is null
     or v_u_stress_npv_mm is null then
    raise exception 'EC6 go-live refused: one or more of the eighteen graded fields is missing';
  end if;

  -- ------------------------------------ Associate: EXACT SUMS OF THE ROWS --
  if v_u_concept_capex_mm <> 410 + 760 + 150 then
    raise exception 'EC6 go-live refused: the concept capex % is not the three capex fields added', v_u_concept_capex_mm;
  end if;
  if v_u_oil_p50_mmbbl <> 82 + 29 then
    raise exception 'EC6 go-live refused: the oil P50 % is not the two oil rows added', v_u_oil_p50_mmbbl;
  end if;
  if v_u_gas_p50_bcf <> 46 + 28 then
    raise exception 'EC6 go-live refused: the gas P50 % is not the two gas rows added', v_u_gas_p50_bcf;
  end if;
  -- and the two fluids are never one number
  if v_u_oil_p50_mmbbl = v_u_gas_p50_bcf then
    raise exception 'EC6 go-live refused: the oil and gas P50 fields carry the same value';
  end if;

  -- ------------------------- Professional: the longest path and the rules --
  -- The critical chain is u1, u3, u5, u6, u7: 0 + 380 + 120 + 171 + 0.
  if v_u_network_duration_days <> 0 + 380 + 120 + 171 + 0 then
    raise exception 'EC6 go-live refused: the network duration % is not the longest path through the stated dependencies', v_u_network_duration_days;
  end if;
  -- The calendar span is a date difference, and it is longer than the work.
  if v_u_calendar_span_days <> (date '2030-07-05' - date '2028-06-01') then
    raise exception 'EC6 go-live refused: the calendar span % is not the difference between the first and last dates typed on the activities', v_u_calendar_span_days;
  end if;
  if v_u_calendar_span_days <= v_u_network_duration_days then
    raise exception 'EC6 go-live refused: the calendar span is not longer than the network, so the plan carries no calendar float and the question is not the question';
  end if;
  -- Drilling days: measured depth over the rate of penetration for the
  -- trajectory, plus ten flat days, rounded up. Cost is days x rate x 2.5.
  v_d1 := ceil(13100.0 / (400 * 0.7) + 10);
  v_d2 := ceil(10400.0 / (400 * 0.85) + 10);
  v_d3 := ceil(8700.0 / 400 + 10);
  if v_u_uk01_well_cost_usd <> v_d1 * 265000 * 2.5 then
    raise exception 'EC6 go-live refused: the first well cost % is not its days times the rig rate times 2.5', v_u_uk01_well_cost_usd;
  end if;
  if v_u_campaign_cost_usd <> (v_d1 + v_d2 + v_d3) * 265000 * 2.5 then
    raise exception 'EC6 go-live refused: the campaign cost % is not the three wells at the same rule', v_u_campaign_cost_usd;
  end if;
  -- The Platform base cost scaled by size to the power 0.7.
  if abs(v_u_platform_capex_mm - 800 * power(45000.0/50000.0, 0.7)) > 1e-9 then
    raise exception 'EC6 go-live refused: the facility capex % is not the Platform base scaled by size to the power 0.7', v_u_platform_capex_mm;
  end if;
  -- Decommissioning follows the SIZED capex, which is the EC6-1 repair.
  if abs(v_u_platform_decommissioning_m - v_u_platform_capex_mm * 0.15) > 1e-9 then
    raise exception 'EC6 go-live refused: the decommissioning cost % is not 15 percent of the capex the facility carries', v_u_platform_decommissioning_m;
  end if;
  if abs(v_u_platform_decommissioning_m - 800 * 0.15) < 1 then
    raise exception 'EC6 go-live refused: the decommissioning cost is 15 percent of the UNSCALED base, which is the defect this course teaches against';
  end if;

  -- --------------------------------- Expert: the earned value identities --
  -- Earned value is each budget times its percent complete.
  if v_m_earned_value_usd <> 1800000*1.0 + 4600000*0.7 + 7300000*0.2 + 9900000*0.0 then
    raise exception 'EC6 go-live refused: the earned value % is not each budget times its percent complete', v_m_earned_value_usd;
  end if;
  -- Planned value is each budget across its OWN window, cut at the as-of date.
  if abs(v_m_planned_value_usd - (
       1800000 * 1.0
     + 4600000 * ((date '2030-03-31' - date '2029-06-01')::numeric / (date '2030-05-31' - date '2029-06-01'))
     + 7300000 * ((date '2030-03-31' - date '2029-11-01')::numeric / (date '2030-12-31' - date '2029-11-01'))
     + 9900000 * 0.0)) > 0.5 then
    raise exception 'EC6 go-live refused: the planned value % is not each budget spread across its own window to the as-of date', v_m_planned_value_usd;
  end if;
  -- The two indexes are ratios of the fields above, and they are different.
  if abs(v_m_spi - v_m_earned_value_usd / v_m_planned_value_usd) > 1e-6 then
    raise exception 'EC6 go-live refused: the schedule index % is not earned value over planned value', v_m_spi;
  end if;
  if abs(v_m_completion_ratio - v_m_earned_value_usd / (1800000 + 4600000 + 7300000 + 9900000)) > 1e-6 then
    raise exception 'EC6 go-live refused: the completion ratio % is not earned value over the budget at completion', v_m_completion_ratio;
  end if;
  if abs(v_m_spi - v_m_completion_ratio) < 0.05 then
    raise exception 'EC6 go-live refused: the schedule index and the completion ratio are within 0.05 of each other, so the tier cannot examine the difference between them';
  end if;

  -- --------------------- the five screening fields, as ordered pairs --
  if v_u_base_npv_mm <= v_u_alternative_npv_mm + 100 then
    raise exception 'EC6 go-live refused: the two concepts are not far enough apart to be compared';
  end if;
  if v_u_alternative_npv_mm <= 0 then
    raise exception 'EC6 go-live refused: the alternative concept does not carry a positive value';
  end if;
  if v_u_stress_npv_mm >= 0 then
    raise exception 'EC6 go-live refused: the stress case is not a loss, so it cannot teach a case with no rate of return';
  end if;
  if v_u_base_npv_mm - v_u_stress_npv_mm <= 1320 then
    raise exception 'EC6 go-live refused: the price cases are closer than the capex, so the tier cannot examine price exposure';
  end if;
  if v_u_price_swing_mm <= v_u_base_npv_mm then
    raise exception 'EC6 go-live refused: the price swing is not wider than the base NPV, so the sensitivity teaches nothing';
  end if;
  if v_u_base_irr_pct <= 10 or v_u_base_irr_pct >= 1000 then
    raise exception 'EC6 go-live refused: the rate of return % is outside the band the engine reports, so the field is not the rate', v_u_base_irr_pct;
  end if;

  -- ----------------------------------------------------------- the flip --
  update public.academy_apps set status = 'available' where slug = 'fdp';
  raise notice 'EC6 Field Development Planning is available: 3 structures, 396 questions, 3 capstones, 18 graded fields, every assertion held';
end $$;
