-- ============================================================================
-- EC7 GO-LIVE (HELD): Petroleum Industry Act 2021 & Nigerian Fiscal Terms
-- flips to 'available' in the Economics & Commercial module, at path_order
-- 72.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/pia. The 78 lessons, the teaching lab (piaLab.js), its
-- three calculator panels (royalty, hydrocarbon tax and ledger) and the three
-- capstone case files ship in the ZIP and NOT in this database, so a flip
-- before the upload puts a live catalogue tile in front of a route that does
-- not exist. AN ENGINE COURSE: there is no Suite app and no Suite upload to
-- wait for. This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values pia_capstone.mjs returned through
--      the vendored engines/economics/cashflow.ts (3.12.0) when this file was
--      generated, to the last bit;
--   2. by a SECOND ROUTE IN SQL: the whole PIA 2021 / NTA 2025 ledger rebuilt
--      in plpgsql over the case files the learner is handed; each to 1e-9
--      relative;
--   3. by the ORACLE: oracle_check.py's run of the vendored stdlib Python
--      oracle (tools/validation/economics/oracle_pia2021.py), written in by
--      value, each seeded value within its tolerance of the oracle's;
--   4. by the TRAPS the course is built on: every wrong method
--      discriminate.mjs swept through the engine for a field, written in by
--      value, must miss the seeded value by more than the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
--
-- NO BEGIN OR COMMIT. Like every course migration in this repository, the
-- file carries no transaction lines of its own; apply_ec7_pia.sh wraps it in
-- one transaction.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. Every field must
-- carry a non-zero, non-whole expected value at its own shipped tolerance
-- (never below the six-decimal floor 5e-7) with a label and a unit, the
-- six-decimal answer the prompt asks for must pass, and one unit either side
-- of it in the sixth decimal must fail.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================
-- ------------------------------------------------ the second route's helpers
-- Temporary functions (pg_temp), created with create or replace: they vanish
-- with the session and create nothing in any schema. They rebuild the PIA 2021
-- / NTA 2025 ledger from the texts the course cites, in SQL, with no engine
-- code: royalty by terrain and daily rate (PIA Seventh Schedule para 10; REGS
-- r.12, r.13), gas royalty with the in-country share (para 10(6); REGS r.16),
-- royalty by price on the Regulations' benchmarks rounded to cents year by
-- year (para 11; REGS Schedule), HCDT (PIA s.240(2)), the NDDC levy on the
-- total annual budget, the decommissioning fund with the NTA s.86 escrow
-- condition, the cost price ratio on crude and condensate revenue with its
-- carry (Sixth Schedule para 2), the production allowance (Sixth Schedule
-- para 1), the capital allowance by the law of each year (PIA Fifth Schedule
-- para 17(1); NTA First Schedule Part II para 14(1)), the hydrocarbon tax
-- rate (PIA s.260(3), s.267; NTA s.65, s.72), loss relief by class (s.265),
-- companies income tax with the two thirds restriction in years under the Act
-- alone, the tertiary education tax (Finance Act 2023 s.26) and the
-- development levy (NTA s.59(1)), every money line at the working interest
-- share. The engine's stated approximations are followed where the course
-- states them (the annual daily rate over calendar days; shared costs at the
-- crude-plus-condensate share of revenue; the realised price as the fiscal
-- price; the pool and the operating costs claimed under the cap before the
-- capital allowance). Every number is a double precision.

-- A number out of a jsonb value, read through its text (the double JSON.parse gives).
create or replace function pg_temp.ec7_n(v jsonb) returns double precision
language sql immutable as $f$
  select case when v is null or jsonb_typeof(v) = 'null' then null else (v #>> '{}')::double precision end
$f$;

-- The royalty rate on crude oil and condensate for a terrain and daily rate.
create or replace function pg_temp.ec7_oil_rate(terrain text, bopd double precision) returns double precision
language plpgsql immutable as $f$
declare up double precision;
begin
  if terrain = 'frontier' then return 0.075; end if;
  if terrain = 'deep_offshore' then
    if bopd <= 50000.0 then return 0.05; end if;
    return (50000.0 * 0.05 + (bopd - 50000.0) * 0.075) / bopd;
  end if;
  up := case when terrain = 'onshore' then 0.15 else 0.125 end;
  if bopd <= 5000.0 then return 0.05; end if;
  if bopd <= 10000.0 then return (5000.0 * 0.05 + (bopd - 5000.0) * 0.075) / bopd; end if;
  return (5000.0 * 0.05 + 5000.0 * 0.075 + (bopd - 10000.0) * up) / bopd;
end $f$;

-- The royalty by price benchmarks for a year on the Regulations base (2021 =
-- 50/100/150, each raised by 2 percent every 1 January from 2022, rounded half
-- up to whole cents year by year), and the rate at a price.
create or replace function pg_temp.ec7_price_rate(price double precision, yr int, terrain text) returns double precision
language plpgsql immutable as $f$
declare lo double precision := 50.0; mi double precision := 100.0; hi double precision := 150.0; y int;
begin
  if terrain = 'frontier' then return 0.0; end if;
  for y in 2022 .. yr loop
    lo := floor(lo * 1.02 * 100.0 + 0.5) / 100.0;
    mi := floor(mi * 1.02 * 100.0 + 0.5) / 100.0;
    hi := floor(hi * 1.02 * 100.0 + 0.5) / 100.0;
  end loop;
  if price <= lo then return 0.0; end if;
  if price >= hi then return 0.10; end if;
  if price <= mi then return 0.05 * (price - lo) / (mi - lo); end if;
  return 0.05 + 0.05 * (price - mi) / (hi - mi);
end $f$;

-- The whole ledger of one case (cfg, prodRows, capexRows, opexRows), returned
-- as {rows: [...], total_cit, take, forfeited}.
create or replace function pg_temp.ec7_ledger(c jsonb) returns jsonb
language plpgsql immutable as $f$
declare
  k jsonb := c->'cfg';
  base int := (k->>'base_year')::int;
  wi double precision := coalesce(pg_temp.ec7_n(k->'pia_working_interest_pct'), 100.0) / 100.0;
  terrain text := k->>'pia_terrain';
  lease text := coalesce(k->>'pia_lease_status', 'converted');
  lic text := k->>'pia_license_type';
  marginal boolean := coalesce((k->>'pia_marginal_field_pre_2021')::boolean, false);
  in_share double precision := coalesce(pg_temp.ec7_n(k->'pia_gas_in_country_share_pct'), 0.0);
  p_oil double precision := coalesce(pg_temp.ec7_n(k->'oil_price_usd_bbl'), 0.0);
  p_gas double precision := coalesce(pg_temp.ec7_n(k->'gas_price_usd_mscf'), 0.0);
  p_cond double precision := coalesce(pg_temp.ec7_n(k->'condensate_price_usd_bbl'), 0.0);
  e_oil double precision := coalesce(pg_temp.ec7_n(k->'oil_price_escalator_pct'), 0.0) / 100.0;
  e_gas double precision := coalesce(pg_temp.ec7_n(k->'gas_price_escalator_pct'), 0.0) / 100.0;
  e_cond double precision := coalesce(pg_temp.ec7_n(k->'condensate_price_escalator_pct'), 0.0) / 100.0;
  e_opex double precision := coalesce(pg_temp.ec7_n(k->'opex_escalator_pct'), 0.0) / 100.0;
  e_capex double precision := coalesce(pg_temp.ec7_n(k->'capex_escalator_pct'), 0.0) / 100.0;
  ab_cost double precision := coalesce(pg_temp.ec7_n(k->'abandonment_cost_usd'), 0.0);
  sinking boolean := coalesce(k->>'abandonment_funding_mode', '') = 'sinking_fund';
  escrow boolean := (k->>'pia_decom_escrow_condition_met')::boolean;
  gasops boolean := coalesce((k->>'pia_cit_company_gas_operations')::boolean, false);
  new_rate double precision := pg_temp.ec7_n(k->'pia_new_pml_hct_rate_pct');
  deep_read text := k->>'pia_deep_offshore_hct_interpretation';
  years int[]; y int; yi int; nfund int := 0; ab_year int; fw text;
  oil double precision; gas double precision; cond double precision; t int;
  po double precision; pg double precision; pc double precision; ox double precision; cx double precision; ca double precision;
  oil_rev double precision; gas_rev double precision; cond_rev double precision; liq_rev double precision; gross double precision;
  bopd double precision; r_liq double precision; r_gas double precision; liq_roy double precision; gas_roy double precision;
  price_roy double precision; royalty double precision; hcdt double precision; nddc double precision; contrib double precision;
  decom_ded double precision; share double precision; cap double precision; op_costs double precision; ca_costs double precision;
  pool double precision; claimed double precision; deferred double precision; op_claimed double precision; ca_claimed double precision;
  hct_ap double precision; pa double precision; below double precision; after_ double precision; per_below double precision;
  per_after double precision; capq double precision; hct_cp double precision; hct_base double precision; h_rate double precision;
  hct double precision; cit_ap double precision; avail double precision; cit_ca double precision; cit_cp double precision;
  cit_base double precision; cit double precision; tet double precision; levy double precision; tax double precision; ncf double precision;
  carry double precision := 0; hct_loss double precision := 0; cit_loss double precision := 0; cit_carry double precision := 0;
  prior_opex double precision := coalesce(pg_temp.ec7_n(k->'pia_prior_year_opex_usd'), 0.0);
  cum double precision := coalesce(pg_temp.ec7_n(k->'pia_prior_cumulative_oil_bbl'), 0.0);
  sum_rev double precision := 0; sum_capex double precision := 0; sum_opex double precision := 0; sum_ncf double precision := 0;
  sum_cit double precision := 0; rows jsonb := '[]'::jsonb; pre double precision;
begin
  select array_agg(distinct yy order by yy) into years from (
    select (r->>'year')::int yy from jsonb_array_elements(c->'prodRows') r
    union select (r->>'year')::int from jsonb_array_elements(c->'capexRows') r
    union select (r->>'year')::int from jsonb_array_elements(c->'opexRows') r) u;
  ab_year := years[array_length(years, 1)];
  if sinking and ab_cost > 0 then nfund := array_length(years, 1); end if;

  foreach y in array years loop
    t := y - base;
    fw := case when y >= 2026 then 'nta_2025' else 'pia_only' end;
    oil := coalesce((select pg_temp.ec7_n(r->'oil_bbl') from jsonb_array_elements(c->'prodRows') r where (r->>'year')::int = y), 0.0);
    gas := coalesce((select pg_temp.ec7_n(r->'gas_mscf') from jsonb_array_elements(c->'prodRows') r where (r->>'year')::int = y), 0.0);
    cond := coalesce((select pg_temp.ec7_n(r->'condensate_bbl') from jsonb_array_elements(c->'prodRows') r where (r->>'year')::int = y), 0.0);
    po := p_oil * power(1.0 + e_oil, t); pg := p_gas * power(1.0 + e_gas, t); pc := p_cond * power(1.0 + e_cond, t);
    ox := coalesce((select sum(pg_temp.ec7_n(r->'total_opex_usd')) from jsonb_array_elements(c->'opexRows') r where (r->>'year')::int = y), 0.0) * power(1.0 + e_opex, t);
    cx := coalesce((select sum(pg_temp.ec7_n(r->'amount_usd')) from jsonb_array_elements(c->'capexRows') r where (r->>'year')::int = y), 0.0) * power(1.0 + e_capex, t);
    -- the capital allowance of the year: every spend in its first five years of life, by this year's law
    ca := 0.0;
    for yi in 0 .. 4 loop
      ca := ca + coalesce((select sum(pg_temp.ec7_n(r->'amount_usd')) from jsonb_array_elements(c->'capexRows') r where (r->>'year')::int = y - yi), 0.0)
            * power(1.0 + e_capex, y - yi - base)
            * (case when fw = 'nta_2025' then 0.20 else (array[0.20, 0.20, 0.20, 0.20, 0.19])[yi + 1] end);
    end loop;
    oil_rev := oil * po; gas_rev := gas * pg; cond_rev := cond * pc;
    liq_rev := oil_rev + cond_rev; gross := liq_rev + gas_rev;
    bopd := (oil + cond) / (case when (y % 4 = 0 and y % 100 <> 0) or y % 400 = 0 then 366.0 else 365.0 end);
    r_liq := pg_temp.ec7_oil_rate(terrain, bopd);
    r_gas := 0.05 * (1.0 - in_share / 100.0) + 0.025 * (in_share / 100.0);
    liq_roy := liq_rev * r_liq; gas_roy := gas_rev * r_gas;
    price_roy := oil_rev * pg_temp.ec7_price_rate(po, y, terrain) + cond_rev * pg_temp.ec7_price_rate(pc, y, terrain);
    royalty := liq_roy + gas_roy + price_roy;
    hcdt := case when prior_opex > 0 then 0.03 * prior_opex else 0.0 end;
    nddc := (ox + cx) * 3.0 / 100.0;
    contrib := case when nfund > 0 and y <= ab_year then ab_cost / nfund / wi else 0.0 end;
    decom_ded := case when contrib > 0 and (fw = 'pia_only' or escrow is true) then contrib else 0.0 end;
    share := case when gross > 0 then liq_rev / gross else 0.0 end;
    cap := greatest(0.0, liq_rev * 65.0 / 100.0);
    op_costs := share * (ox + decom_ded); ca_costs := share * ca;
    pool := carry + op_costs + ca_costs;
    claimed := least(pool, cap); deferred := pool - claimed;
    op_claimed := least(carry + op_costs, claimed); ca_claimed := claimed - op_claimed;
    carry := deferred;
    hct_ap := liq_rev - liq_roy - price_roy - op_claimed - share * (hcdt + nddc);
    -- the production allowance (Sixth Schedule para 1)
    pa := 0.0; below := 0.0; after_ := 0.0;
    if oil + cond > 0 then
      if lease = 'converted' then
        pa := least(2.5, 0.20 * po) * (oil + cond);
      elsif not ((terrain = 'deep_offshore' or terrain = 'frontier') and fw = 'nta_2025') then
        capq := case when terrain = 'onshore' then 50000000.0 when terrain = 'shallow_water' then 100000000.0 else 500000000.0 end;
        below := least(oil + cond, greatest(0.0, capq - cum)); after_ := (oil + cond) - below;
        per_below := least(8.0, 0.20 * po); per_after := least(4.0, 0.20 * po);
        pa := per_below * below + per_after * after_;
      end if;
    end if;
    hct_cp := hct_ap - ca_claimed - pa;
    if hct_cp < 0 then hct_loss := hct_loss - hct_cp; hct_base := 0.0;
    else hct_base := hct_cp - least(hct_loss, hct_cp); hct_loss := hct_loss - least(hct_loss, hct_cp); end if;
    h_rate := case
      when terrain = 'frontier' then 0.0
      when terrain = 'deep_offshore' and fw = 'pia_only' then 0.0
      when terrain = 'deep_offshore' then case deep_read when 'conservative_zero' then 0.0 when 'aggressive_pml_30' then 0.30
                                            else pg_temp.ec7_n(k->'pia_deep_offshore_hct_custom_rate_pct') / 100.0 end
      when marginal or lic = 'PPL' then 0.15
      when lease = 'converted' then 0.30
      else new_rate / 100.0 end;
    hct := greatest(0.0, hct_base * h_rate);
    cit_ap := gross - royalty - ox - hcdt - nddc - decom_ded;
    avail := ca + cit_carry;
    cit_ca := case when fw = 'pia_only' and not gasops then least(avail, greatest(0.0, cit_ap * 2.0 / 3.0)) else avail end;
    cit_carry := avail - cit_ca;
    cit_cp := cit_ap - cit_ca;
    if cit_cp < 0 then cit_loss := cit_loss - cit_cp; cit_base := 0.0;
    else cit_base := cit_cp - least(cit_loss, cit_cp); cit_loss := cit_loss - least(cit_loss, cit_cp); end if;
    cit := greatest(0.0, cit_base * 30.0 / 100.0);
    if fw = 'pia_only' then
      tet := greatest(0.0, cit_ap * (case when y >= 2023 then 3.0 else 2.5 end) / 100.0); levy := 0.0;
    else
      tet := 0.0; levy := greatest(0.0, cit_ap * 4.0 / 100.0);
    end if;
    tax := hct + cit + tet + levy;
    ncf := gross - royalty - ox - hcdt - nddc - tax - cx - contrib;
    prior_opex := ox; cum := cum + oil + cond;
    sum_rev := sum_rev + gross * wi; sum_capex := sum_capex + cx * wi; sum_opex := sum_opex + ox * wi;
    sum_ncf := sum_ncf + ncf * wi; sum_cit := sum_cit + cit * wi;
    rows := rows || jsonb_build_array(jsonb_build_object(
      'year', y, 'framework', fw, 'royalty_rate_liquids', r_liq,
      'liquids_production_royalty', liq_roy * wi, 'production_royalty', (liq_roy + gas_roy) * wi, 'royalty', royalty * wi,
      'production_allowance', pa * wi, 'hct_chargeable_profit', hct_cp * wi, 'cpr_deferred_to_next', deferred * wi,
      'hct_tax', hct * wi, 'cit_tax', cit * wi, 'tet_tax', tet * wi, 'dev_levy_tax', levy * wi));
  end loop;
  pre := sum_rev - sum_capex - sum_opex - (case when ab_cost > 0 then ab_cost else 0.0 end);
  return jsonb_build_object('rows', rows, 'total_cit', sum_cit, 'forfeited', carry * wi,
    'take', case when pre > 0 then (pre - sum_ncf) / pre * 100.0 else null end);
end $f$;

-- One value of a ledger row, by year and line.
create or replace function pg_temp.ec7_row(l jsonb, yr int, line text) returns double precision
language sql immutable as $f$
  select pg_temp.ec7_n(r->line) from jsonb_array_elements(l->'rows') r where (r->>'year')::int = yr
$f$;

do $$
#variable_conflict use_column
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_s double precision; v_wrong double precision;
  v_led_b jsonb; v_led_i jsonb; v_led_a jsonb;
  v_g_odozi_2028_liquids_royalty_rate double precision;
  v_g_odozi_2029_production_royalty_usd double precision;
  v_g_odozi_2030_hct_usd double precision;
  v_g_odozi_2031_dev_levy_usd double precision;
  v_g_odozi_total_cit_usd double precision;
  v_g_odozi_government_take_pct double precision;
  v_g_nkemdi_2028_liquids_royalty_usd double precision;
  v_g_nkemdi_2029_production_allowance_usd double precision;
  v_g_nkemdi_2029_hct_chargeable_profit_usd double precision;
  v_g_nkemdi_2031_cpr_deferred_usd double precision;
  v_g_nkemdi_cpr_forfeited_usd double precision;
  v_g_nkemdi_total_cit_usd double precision;
  v_g_alaku_2026_total_royalty_usd double precision;
  v_g_alaku_2026_hct_chargeable_profit_usd double precision;
  v_g_alaku_2025_tet_usd double precision;
  v_g_alaku_2027_dev_levy_usd double precision;
  v_g_alaku_2028_cit_usd double precision;
  v_g_alaku_total_cit_usd double precision;
  v_case_b jsonb := '{"name":"ODOZI","label":"ODOZI, an Ekene synthetic onshore lease converted from an oil mining lease","cfg":{"fiscal_regime":"PIA","discount_rate_pct":10,"inflation_rate_pct":0,"present_value_basis":"nominal","oil_price_escalator_pct":0,"gas_price_escalator_pct":0,"condensate_price_escalator_pct":0,"capex_escalator_pct":0,"base_year":2027,"oil_price_usd_bbl":54,"gas_price_usd_mscf":2.8,"opex_escalator_pct":2,"pia_terrain":"onshore","pia_license_type":"PML","pia_lease_status":"converted","pia_marginal_field_pre_2021":false,"pia_water_depth_m":0,"pia_working_interest_pct":60,"pia_prior_year_opex_usd":19000000,"pia_prior_cumulative_oil_bbl":0,"pia_gas_in_country_share_pct":40,"pia_under_nta_2025_override":"auto"},"prodRows":[{"year":2027,"oil_bbl":3150000,"gas_mscf":1890000,"condensate_bbl":0},{"year":2028,"oil_bbl":2835000,"gas_mscf":1701000,"condensate_bbl":0},{"year":2029,"oil_bbl":2551500,"gas_mscf":1530900,"condensate_bbl":0},{"year":2030,"oil_bbl":2296350,"gas_mscf":1377810,"condensate_bbl":0},{"year":2031,"oil_bbl":2066715,"gas_mscf":1240029,"condensate_bbl":0},{"year":2032,"oil_bbl":1860044,"gas_mscf":1116026,"condensate_bbl":0}],"capexRows":[{"year":2027,"amount_usd":48000000},{"year":2028,"amount_usd":22000000}],"opexRows":[{"year":2027,"total_opex_usd":21000000},{"year":2028,"total_opex_usd":21000000},{"year":2029,"total_opex_usd":21000000},{"year":2030,"total_opex_usd":21000000},{"year":2031,"total_opex_usd":21000000},{"year":2032,"total_opex_usd":21000000}]}'::jsonb;
  v_case_i jsonb := '{"name":"NKEMDI","label":"NKEMDI, an Ekene synthetic shallow water lease granted out of new acreage","cfg":{"fiscal_regime":"PIA","discount_rate_pct":10,"inflation_rate_pct":0,"present_value_basis":"nominal","oil_price_escalator_pct":0,"gas_price_escalator_pct":0,"condensate_price_escalator_pct":0,"capex_escalator_pct":0,"base_year":2027,"oil_price_usd_bbl":54,"condensate_price_usd_bbl":51,"gas_price_usd_mscf":3.1,"opex_escalator_pct":0,"pia_terrain":"shallow_water","pia_license_type":"PML","pia_lease_status":"new","pia_new_pml_hct_rate_pct":30,"pia_marginal_field_pre_2021":false,"pia_water_depth_m":85,"pia_working_interest_pct":45,"pia_prior_year_opex_usd":160000000,"pia_prior_cumulative_oil_bbl":64500000,"pia_gas_in_country_share_pct":25,"pia_under_nta_2025_override":"auto"},"prodRows":[{"year":2027,"oil_bbl":16400000,"gas_mscf":14760000,"condensate_bbl":820000},{"year":2028,"oil_bbl":13776000,"gas_mscf":12398400,"condensate_bbl":688800},{"year":2029,"oil_bbl":11571840,"gas_mscf":10414656,"condensate_bbl":578592},{"year":2030,"oil_bbl":9720346,"gas_mscf":8748311,"condensate_bbl":486017},{"year":2031,"oil_bbl":8165090,"gas_mscf":7348581,"condensate_bbl":408255},{"year":2032,"oil_bbl":6858676,"gas_mscf":6172808,"condensate_bbl":342934},{"year":2033,"oil_bbl":5761288,"gas_mscf":5185159,"condensate_bbl":288064}],"capexRows":[{"year":2027,"amount_usd":620000000},{"year":2028,"amount_usd":410000000},{"year":2030,"amount_usd":180000000}],"opexRows":[{"year":2027,"total_opex_usd":185000000},{"year":2028,"total_opex_usd":185000000},{"year":2029,"total_opex_usd":185000000},{"year":2030,"total_opex_usd":185000000},{"year":2031,"total_opex_usd":185000000},{"year":2032,"total_opex_usd":185000000},{"year":2033,"total_opex_usd":185000000}]}'::jsonb;
  v_case_a jsonb := '{"name":"ALAKU","label":"ALAKU, an Ekene synthetic deep offshore lease granted out of new acreage","cfg":{"fiscal_regime":"PIA","discount_rate_pct":10,"inflation_rate_pct":0,"present_value_basis":"nominal","oil_price_escalator_pct":0,"gas_price_escalator_pct":0,"condensate_price_escalator_pct":0,"capex_escalator_pct":0,"base_year":2025,"oil_price_usd_bbl":180,"gas_price_usd_mscf":3.4,"opex_escalator_pct":0,"pia_terrain":"deep_offshore","pia_license_type":"PML","pia_lease_status":"new","pia_marginal_field_pre_2021":false,"pia_deep_offshore_hct_interpretation":"conservative_zero","pia_water_depth_m":1350,"pia_working_interest_pct":20,"pia_prior_year_opex_usd":0,"pia_prior_cumulative_oil_bbl":0,"pia_gas_in_country_share_pct":60,"abandonment_cost_usd":90000000,"abandonment_funding_mode":"sinking_fund","pia_decom_escrow_condition_met":false,"pia_under_nta_2025_override":"auto"},"prodRows":[{"year":2025,"oil_bbl":22630000,"gas_mscf":24893000,"condensate_bbl":0},{"year":2026,"oil_bbl":19914400,"gas_mscf":21905840,"condensate_bbl":0},{"year":2027,"oil_bbl":17524672,"gas_mscf":19277139,"condensate_bbl":0},{"year":2028,"oil_bbl":15421711,"gas_mscf":16963882,"condensate_bbl":0},{"year":2029,"oil_bbl":13571106,"gas_mscf":14928217,"condensate_bbl":0}],"capexRows":[{"year":2025,"amount_usd":2400000000},{"year":2026,"amount_usd":350000000}],"opexRows":[{"year":2025,"total_opex_usd":420000000},{"year":2026,"total_opex_usd":420000000},{"year":2027,"total_opex_usd":420000000},{"year":2028,"total_opex_usd":420000000},{"year":2029,"total_opex_usd":420000000}]}'::jsonb;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'pia' and active;
  if v_structures <> 3 then
    raise exception 'EC7 go-live refused: pia has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'pia';
  if v_questions <> 396 then
    raise exception 'EC7 go-live refused: pia has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'pia' group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'EC7 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;
  select count(*) into v_n from (select tier, module_key from public.academy_quiz_questions where app_slug = 'pia' and scope = 'module' group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'EC7 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'pia' and scope = 'final' group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'EC7 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = 'pia'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'EC7 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;
  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'pia' and s.active;
  if v_lessons <> 78 then
    raise exception 'EC7 go-live refused: pia carries % lesson keys, expected 78', v_lessons;
  end if;
  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'pia' and s.active;
  if v_modules <> 18 then
    raise exception 'EC7 go-live refused: pia carries % modules, expected 18 (six per tier)', v_modules;
  end if;
  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'pia' and qq.scope = 'module' and not exists (
       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'EC7 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'pia';
  if v_capstones <> 3 then
    raise exception 'EC7 go-live refused: pia has % capstones, expected 3', v_capstones;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'pia';
  if v_graded <> 18 then
    raise exception 'EC7 go-live refused: pia has % graded capstone fields, expected 18', v_graded;
  end if;
  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'pia' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'EC7 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'pia' and module = 'economics' and path_order = 72 and prereq_slug is null) then
    raise exception 'EC7 go-live refused: the pia catalogue row is not economics at path_order 72 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 72 and slug <> 'pia') then
    raise exception 'EC7 go-live refused: another course already holds path_order 72';
  end if;

  -- ------------------------------------------------- the grader is numeric
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or abs((f->>'expected')::numeric) <= 0.001
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric is distinct from (select t.tol from (values ('beginner', 'odozi_2028_liquids_royalty_rate', 5e-07::numeric), ('beginner', 'odozi_2029_production_royalty_usd', 5e-07::numeric), ('beginner', 'odozi_2030_hct_usd', 5e-07::numeric), ('beginner', 'odozi_2031_dev_levy_usd', 5e-07::numeric), ('beginner', 'odozi_total_cit_usd', 5e-07::numeric), ('beginner', 'odozi_government_take_pct', 5e-07::numeric), ('intermediate', 'nkemdi_2028_liquids_royalty_usd', 5e-07::numeric), ('intermediate', 'nkemdi_2029_production_allowance_usd', 5e-07::numeric), ('intermediate', 'nkemdi_2029_hct_chargeable_profit_usd', 5e-07::numeric), ('intermediate', 'nkemdi_2031_cpr_deferred_usd', 5e-07::numeric), ('intermediate', 'nkemdi_cpr_forfeited_usd', 5e-07::numeric), ('intermediate', 'nkemdi_total_cit_usd', 5e-07::numeric), ('advanced', 'alaku_2026_total_royalty_usd', 5e-07::numeric), ('advanced', 'alaku_2026_hct_chargeable_profit_usd', 5e-07::numeric), ('advanced', 'alaku_2025_tet_usd', 5e-07::numeric), ('advanced', 'alaku_2027_dev_levy_usd', 5e-07::numeric), ('advanced', 'alaku_2028_cit_usd', 5e-07::numeric), ('advanced', 'alaku_total_cit_usd', 5e-07::numeric)) t(tier, k, tol) where t.tier = c.tier and t.k = f->>'key')
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'EC7 go-live refused: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;
  end if;
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or ((f->>'tol')::numeric = 0.0000005
              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));
  if v_n <> 0 then
    raise exception 'EC7 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or, at the six-decimal floor, pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;

  -- ---------------------------------------- the prompts the learner reads
  select prompt into v_prompt from public.academy_capstones where app_slug = 'pia' and tier = 'beginner';
  if v_prompt is null or md5(v_prompt) <> 'a1c8ec5c4aa322ee625614335edaa3b1' then
    raise exception 'EC7 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'pia' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'ODOZI, an onshore lease converted from an oil mining lease, 2027 to 2032' and title = 'The map of the Act on one ledger') then
    raise exception 'EC7 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['terrain onshore', 'licence PML', 'lease converted', 'a 60 percent working interest', 'oil at 54 USD/bbl', 'gas at 2.8 USD/Mscf', '40 percent of the gas used in-country', 'prior-year opex of 19000000 USD', '0 bbl produced before the ledger', 'the framework override auto', 'Petroleum Royalty Regulations 2022 base', 'odozi_case.json']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC7 go-live refused: % stated setting(s) or case file(s) are not named in the shipped beginner prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'pia' and tier = 'intermediate';
  if v_prompt is null or md5(v_prompt) <> '117c883a9f454a9bb099d102dc1cc1cb' then
    raise exception 'EC7 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'pia' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'NKEMDI, a shallow water lease granted out of new acreage, 2027 to 2033' and title = 'The hydrocarbon tax as a system') then
    raise exception 'EC7 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['terrain shallow_water', 'licence PML', 'lease new', 'a 45 percent working interest', 'oil at 54 USD/bbl', 'gas at 3.1 USD/Mscf', '25 percent of the gas used in-country', 'prior-year opex of 160000000 USD', '64500000 bbl produced before the ledger', 'the framework override auto', 'Petroleum Royalty Regulations 2022 base', 'nkemdi_case.json', 'states 30 percent as a stated reading']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC7 go-live refused: % stated setting(s) or case file(s) are not named in the shipped intermediate prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'pia' and tier = 'advanced';
  if v_prompt is null or md5(v_prompt) <> '7f2917cd44b9e2ade2afb5e3af27b730' then
    raise exception 'EC7 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'pia' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'ALAKU, a deep offshore lease granted out of new acreage, 2025 to 2029' and title = 'Transitions and reading an outcome') then
    raise exception 'EC7 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['terrain deep_offshore', 'licence PML', 'lease new', 'a 20 percent working interest', 'oil at 180 USD/bbl', 'gas at 3.4 USD/Mscf', '60 percent of the gas used in-country', 'prior-year opex of 0 USD', '0 bbl produced before the ledger', 'the framework override auto', 'Petroleum Royalty Regulations 2022 base', 'alaku_case.json', 'states the reading conservative_zero', 'is NOT met']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC7 go-live refused: % stated setting(s) or case file(s) are not named in the shipped advanced prompt: %', v_n, v_names;
  end if;
  -- No number handed in any capstone text of this course may sit within its
  -- tolerance of any graded value of any tier.
  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names
    from (select c.tier as ctier, m[1]::double precision as x
            from public.academy_capstones c,
                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||
                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),
                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m
           where c.app_slug = 'pia') h,
         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'pia') g
   where abs(abs(h.x) - abs(g.v)) <= g.t;
  if v_n <> 0 then
    raise exception 'EC7 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_odozi_2028_liquids_royalty_rate
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'beginner' and f->>'key' = 'odozi_2028_liquids_royalty_rate';
  if v_g_odozi_2028_liquids_royalty_rate is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: beginner/odozi_2028_liquids_royalty_rate]';
  end if;
  select (f->>'expected')::double precision into v_g_odozi_2029_production_royalty_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'beginner' and f->>'key' = 'odozi_2029_production_royalty_usd';
  if v_g_odozi_2029_production_royalty_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: beginner/odozi_2029_production_royalty_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_odozi_2030_hct_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'beginner' and f->>'key' = 'odozi_2030_hct_usd';
  if v_g_odozi_2030_hct_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: beginner/odozi_2030_hct_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_odozi_2031_dev_levy_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'beginner' and f->>'key' = 'odozi_2031_dev_levy_usd';
  if v_g_odozi_2031_dev_levy_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: beginner/odozi_2031_dev_levy_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_odozi_total_cit_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'beginner' and f->>'key' = 'odozi_total_cit_usd';
  if v_g_odozi_total_cit_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: beginner/odozi_total_cit_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_odozi_government_take_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'beginner' and f->>'key' = 'odozi_government_take_pct';
  if v_g_odozi_government_take_pct is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: beginner/odozi_government_take_pct]';
  end if;
  select (f->>'expected')::double precision into v_g_nkemdi_2028_liquids_royalty_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'intermediate' and f->>'key' = 'nkemdi_2028_liquids_royalty_usd';
  if v_g_nkemdi_2028_liquids_royalty_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: intermediate/nkemdi_2028_liquids_royalty_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_nkemdi_2029_production_allowance_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'intermediate' and f->>'key' = 'nkemdi_2029_production_allowance_usd';
  if v_g_nkemdi_2029_production_allowance_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: intermediate/nkemdi_2029_production_allowance_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_nkemdi_2029_hct_chargeable_profit_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'intermediate' and f->>'key' = 'nkemdi_2029_hct_chargeable_profit_usd';
  if v_g_nkemdi_2029_hct_chargeable_profit_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: intermediate/nkemdi_2029_hct_chargeable_profit_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_nkemdi_2031_cpr_deferred_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'intermediate' and f->>'key' = 'nkemdi_2031_cpr_deferred_usd';
  if v_g_nkemdi_2031_cpr_deferred_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: intermediate/nkemdi_2031_cpr_deferred_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_nkemdi_cpr_forfeited_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'intermediate' and f->>'key' = 'nkemdi_cpr_forfeited_usd';
  if v_g_nkemdi_cpr_forfeited_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: intermediate/nkemdi_cpr_forfeited_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_nkemdi_total_cit_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'intermediate' and f->>'key' = 'nkemdi_total_cit_usd';
  if v_g_nkemdi_total_cit_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: intermediate/nkemdi_total_cit_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_alaku_2026_total_royalty_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'advanced' and f->>'key' = 'alaku_2026_total_royalty_usd';
  if v_g_alaku_2026_total_royalty_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: advanced/alaku_2026_total_royalty_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_alaku_2026_hct_chargeable_profit_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'advanced' and f->>'key' = 'alaku_2026_hct_chargeable_profit_usd';
  if v_g_alaku_2026_hct_chargeable_profit_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: advanced/alaku_2026_hct_chargeable_profit_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_alaku_2025_tet_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'advanced' and f->>'key' = 'alaku_2025_tet_usd';
  if v_g_alaku_2025_tet_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: advanced/alaku_2025_tet_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_alaku_2027_dev_levy_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'advanced' and f->>'key' = 'alaku_2027_dev_levy_usd';
  if v_g_alaku_2027_dev_levy_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: advanced/alaku_2027_dev_levy_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_alaku_2028_cit_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'advanced' and f->>'key' = 'alaku_2028_cit_usd';
  if v_g_alaku_2028_cit_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: advanced/alaku_2028_cit_usd]';
  end if;
  select (f->>'expected')::double precision into v_g_alaku_total_cit_usd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'pia' and c.tier = 'advanced' and f->>'key' = 'alaku_total_cit_usd';
  if v_g_alaku_total_cit_usd is null then
    raise exception 'EC7 go-live refused: the seeded rows carry no value [graded field: advanced/alaku_total_cit_usd]';
  end if;

  -- ------------------------------------------ 1. against the engine ledger
  if v_g_odozi_2028_liquids_royalty_rate <> 0.05886243386243386::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 0.05886243386243386 [graded field: beginner/odozi_2028_liquids_royalty_rate]', v_g_odozi_2028_liquids_royalty_rate;
  end if;
  if v_g_odozi_2029_production_royalty_usd <> 4824771.4799999995::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 4824771.4799999995 [graded field: beginner/odozi_2029_production_royalty_usd]', v_g_odozi_2029_production_royalty_usd;
  end if;
  if v_g_odozi_2030_hct_usd <> 13491169.608103443::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 13491169.608103443 [graded field: beginner/odozi_2030_hct_usd]', v_g_odozi_2030_hct_usd;
  end if;
  if v_g_odozi_2031_dev_levy_usd <> 2038747.0449887998::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 2038747.0449887998 [graded field: beginner/odozi_2031_dev_levy_usd]', v_g_odozi_2031_dev_levy_usd;
  end if;
  if v_g_odozi_total_cit_usd <> 101420921.54433312::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 101420921.54433312 [graded field: beginner/odozi_total_cit_usd]', v_g_odozi_total_cit_usd;
  end if;
  if v_g_odozi_government_take_pct <> 65.07108427930685::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 65.07108427930685 [graded field: beginner/odozi_government_take_pct]', v_g_odozi_government_take_pct;
  end if;
  if v_g_nkemdi_2028_liquids_royalty_usd <> 38276675.35714286::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 38276675.35714286 [graded field: intermediate/nkemdi_2028_liquids_royalty_usd]', v_g_nkemdi_2028_liquids_royalty_usd;
  end if;
  if v_g_nkemdi_2029_production_allowance_usd <> 28738137.6::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 28738137.6 [graded field: intermediate/nkemdi_2029_production_allowance_usd]', v_g_nkemdi_2029_production_allowance_usd;
  end if;
  if v_g_nkemdi_2029_hct_chargeable_profit_usd <> 62018258.59948723::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 62018258.59948723 [graded field: intermediate/nkemdi_2029_hct_chargeable_profit_usd]', v_g_nkemdi_2029_hct_chargeable_profit_usd;
  end if;
  if v_g_nkemdi_2031_cpr_deferred_usd <> 70390530.68609568::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 70390530.68609568 [graded field: intermediate/nkemdi_2031_cpr_deferred_usd]', v_g_nkemdi_2031_cpr_deferred_usd;
  end if;
  if v_g_nkemdi_cpr_forfeited_usd <> 86358633.90547855::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 86358633.90547855 [graded field: intermediate/nkemdi_cpr_forfeited_usd]', v_g_nkemdi_cpr_forfeited_usd;
  end if;
  if v_g_nkemdi_total_cit_usd <> 171688707.5012266::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 171688707.5012266 [graded field: intermediate/nkemdi_total_cit_usd]', v_g_nkemdi_total_cit_usd;
  end if;
  if v_g_alaku_2026_total_royalty_usd <> 109557078.99200001::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 109557078.99200001 [graded field: advanced/alaku_2026_total_royalty_usd]', v_g_alaku_2026_total_royalty_usd;
  end if;
  if v_g_alaku_2026_hct_chargeable_profit_usd <> 410836854.37683696::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 410836854.37683696 [graded field: advanced/alaku_2026_hct_chargeable_profit_usd]', v_g_alaku_2026_hct_chargeable_profit_usd;
  end if;
  if v_g_alaku_2025_tet_usd <> 17578523.598::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 17578523.598 [graded field: advanced/alaku_2025_tet_usd]', v_g_alaku_2025_tet_usd;
  end if;
  if v_g_alaku_2027_dev_levy_usd <> 18394584.872472::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 18394584.872472 [graded field: advanced/alaku_2027_dev_levy_usd]', v_g_alaku_2027_dev_levy_usd;
  end if;
  if v_g_alaku_2028_cit_usd <> 85198816.79052001::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 85198816.79052001 [graded field: advanced/alaku_2028_cit_usd]', v_g_alaku_2028_cit_usd;
  end if;
  if v_g_alaku_total_cit_usd <> 531288148.85508::double precision then
    raise exception 'EC7 go-live refused: the seeded value is %, and the engine returned 531288148.85508 [graded field: advanced/alaku_total_cit_usd]', v_g_alaku_total_cit_usd;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  v_led_b := pg_temp.ec7_ledger(v_case_b);
  v_led_i := pg_temp.ec7_ledger(v_case_i);
  v_led_a := pg_temp.ec7_ledger(v_case_a);
  v_s := pg_temp.ec7_row(v_led_b, 2028, 'royalty_rate_liquids');
  if v_s is null or abs(v_s - v_g_odozi_2028_liquids_royalty_rate) > 1e-9 * abs(v_g_odozi_2028_liquids_royalty_rate) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/odozi_2028_liquids_royalty_rate]', v_s, v_g_odozi_2028_liquids_royalty_rate;
  end if;
  v_s := pg_temp.ec7_row(v_led_b, 2029, 'production_royalty');
  if v_s is null or abs(v_s - v_g_odozi_2029_production_royalty_usd) > 1e-9 * abs(v_g_odozi_2029_production_royalty_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/odozi_2029_production_royalty_usd]', v_s, v_g_odozi_2029_production_royalty_usd;
  end if;
  v_s := pg_temp.ec7_row(v_led_b, 2030, 'hct_tax');
  if v_s is null or abs(v_s - v_g_odozi_2030_hct_usd) > 1e-9 * abs(v_g_odozi_2030_hct_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/odozi_2030_hct_usd]', v_s, v_g_odozi_2030_hct_usd;
  end if;
  v_s := pg_temp.ec7_row(v_led_b, 2031, 'dev_levy_tax');
  if v_s is null or abs(v_s - v_g_odozi_2031_dev_levy_usd) > 1e-9 * abs(v_g_odozi_2031_dev_levy_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/odozi_2031_dev_levy_usd]', v_s, v_g_odozi_2031_dev_levy_usd;
  end if;
  v_s := pg_temp.ec7_n(v_led_b->'total_cit');
  if v_s is null or abs(v_s - v_g_odozi_total_cit_usd) > 1e-9 * abs(v_g_odozi_total_cit_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/odozi_total_cit_usd]', v_s, v_g_odozi_total_cit_usd;
  end if;
  v_s := pg_temp.ec7_n(v_led_b->'take');
  if v_s is null or abs(v_s - v_g_odozi_government_take_pct) > 1e-9 * abs(v_g_odozi_government_take_pct) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/odozi_government_take_pct]', v_s, v_g_odozi_government_take_pct;
  end if;
  v_s := pg_temp.ec7_row(v_led_i, 2028, 'liquids_production_royalty');
  if v_s is null or abs(v_s - v_g_nkemdi_2028_liquids_royalty_usd) > 1e-9 * abs(v_g_nkemdi_2028_liquids_royalty_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nkemdi_2028_liquids_royalty_usd]', v_s, v_g_nkemdi_2028_liquids_royalty_usd;
  end if;
  v_s := pg_temp.ec7_row(v_led_i, 2029, 'production_allowance');
  if v_s is null or abs(v_s - v_g_nkemdi_2029_production_allowance_usd) > 1e-9 * abs(v_g_nkemdi_2029_production_allowance_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nkemdi_2029_production_allowance_usd]', v_s, v_g_nkemdi_2029_production_allowance_usd;
  end if;
  v_s := pg_temp.ec7_row(v_led_i, 2029, 'hct_chargeable_profit');
  if v_s is null or abs(v_s - v_g_nkemdi_2029_hct_chargeable_profit_usd) > 1e-9 * abs(v_g_nkemdi_2029_hct_chargeable_profit_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nkemdi_2029_hct_chargeable_profit_usd]', v_s, v_g_nkemdi_2029_hct_chargeable_profit_usd;
  end if;
  v_s := pg_temp.ec7_row(v_led_i, 2031, 'cpr_deferred_to_next');
  if v_s is null or abs(v_s - v_g_nkemdi_2031_cpr_deferred_usd) > 1e-9 * abs(v_g_nkemdi_2031_cpr_deferred_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nkemdi_2031_cpr_deferred_usd]', v_s, v_g_nkemdi_2031_cpr_deferred_usd;
  end if;
  v_s := pg_temp.ec7_n(v_led_i->'forfeited');
  if v_s is null or abs(v_s - v_g_nkemdi_cpr_forfeited_usd) > 1e-9 * abs(v_g_nkemdi_cpr_forfeited_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nkemdi_cpr_forfeited_usd]', v_s, v_g_nkemdi_cpr_forfeited_usd;
  end if;
  v_s := pg_temp.ec7_n(v_led_i->'total_cit');
  if v_s is null or abs(v_s - v_g_nkemdi_total_cit_usd) > 1e-9 * abs(v_g_nkemdi_total_cit_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nkemdi_total_cit_usd]', v_s, v_g_nkemdi_total_cit_usd;
  end if;
  v_s := pg_temp.ec7_row(v_led_a, 2026, 'royalty');
  if v_s is null or abs(v_s - v_g_alaku_2026_total_royalty_usd) > 1e-9 * abs(v_g_alaku_2026_total_royalty_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/alaku_2026_total_royalty_usd]', v_s, v_g_alaku_2026_total_royalty_usd;
  end if;
  v_s := pg_temp.ec7_row(v_led_a, 2026, 'hct_chargeable_profit');
  if v_s is null or abs(v_s - v_g_alaku_2026_hct_chargeable_profit_usd) > 1e-9 * abs(v_g_alaku_2026_hct_chargeable_profit_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/alaku_2026_hct_chargeable_profit_usd]', v_s, v_g_alaku_2026_hct_chargeable_profit_usd;
  end if;
  v_s := pg_temp.ec7_row(v_led_a, 2025, 'tet_tax');
  if v_s is null or abs(v_s - v_g_alaku_2025_tet_usd) > 1e-9 * abs(v_g_alaku_2025_tet_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/alaku_2025_tet_usd]', v_s, v_g_alaku_2025_tet_usd;
  end if;
  v_s := pg_temp.ec7_row(v_led_a, 2027, 'dev_levy_tax');
  if v_s is null or abs(v_s - v_g_alaku_2027_dev_levy_usd) > 1e-9 * abs(v_g_alaku_2027_dev_levy_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/alaku_2027_dev_levy_usd]', v_s, v_g_alaku_2027_dev_levy_usd;
  end if;
  v_s := pg_temp.ec7_row(v_led_a, 2028, 'cit_tax');
  if v_s is null or abs(v_s - v_g_alaku_2028_cit_usd) > 1e-9 * abs(v_g_alaku_2028_cit_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/alaku_2028_cit_usd]', v_s, v_g_alaku_2028_cit_usd;
  end if;
  v_s := pg_temp.ec7_n(v_led_a->'total_cit');
  if v_s is null or abs(v_s - v_g_alaku_total_cit_usd) > 1e-9 * abs(v_g_alaku_total_cit_usd) then
    raise exception 'EC7 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/alaku_total_cit_usd]', v_s, v_g_alaku_total_cit_usd;
  end if;

  -- ---------------------------------------------------- 3. against the oracle
  -- oracle_check.py --json, run when this file was generated: the value the
  -- vendored stdlib oracle computed, written in, with the module it came from.
  -- odozi_2028_liquids_royalty_rate: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_odozi_2028_liquids_royalty_rate - 0.05886243386243386::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 0.05886243386243386, not within 5e-07 of the seeded % [graded field: beginner/odozi_2028_liquids_royalty_rate]', v_g_odozi_2028_liquids_royalty_rate;
  end if;
  -- odozi_2029_production_royalty_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_odozi_2029_production_royalty_usd - 4824771.4799999995::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 4824771.4799999995, not within 5e-07 of the seeded % [graded field: beginner/odozi_2029_production_royalty_usd]', v_g_odozi_2029_production_royalty_usd;
  end if;
  -- odozi_2030_hct_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_odozi_2030_hct_usd - 13491169.608103443::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 13491169.608103443, not within 5e-07 of the seeded % [graded field: beginner/odozi_2030_hct_usd]', v_g_odozi_2030_hct_usd;
  end if;
  -- odozi_2031_dev_levy_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_odozi_2031_dev_levy_usd - 2038747.0449887998::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 2038747.0449887998, not within 5e-07 of the seeded % [graded field: beginner/odozi_2031_dev_levy_usd]', v_g_odozi_2031_dev_levy_usd;
  end if;
  -- odozi_total_cit_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_odozi_total_cit_usd - 101420921.54433312::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 101420921.54433312, not within 5e-07 of the seeded % [graded field: beginner/odozi_total_cit_usd]', v_g_odozi_total_cit_usd;
  end if;
  -- odozi_government_take_pct: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_odozi_government_take_pct - 65.07108427930685::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 65.07108427930685, not within 5e-07 of the seeded % [graded field: beginner/odozi_government_take_pct]', v_g_odozi_government_take_pct;
  end if;
  -- nkemdi_2028_liquids_royalty_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_nkemdi_2028_liquids_royalty_usd - 38276675.35714286::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 38276675.35714286, not within 5e-07 of the seeded % [graded field: intermediate/nkemdi_2028_liquids_royalty_usd]', v_g_nkemdi_2028_liquids_royalty_usd;
  end if;
  -- nkemdi_2029_production_allowance_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_nkemdi_2029_production_allowance_usd - 28738137.6::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 28738137.6, not within 5e-07 of the seeded % [graded field: intermediate/nkemdi_2029_production_allowance_usd]', v_g_nkemdi_2029_production_allowance_usd;
  end if;
  -- nkemdi_2029_hct_chargeable_profit_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_nkemdi_2029_hct_chargeable_profit_usd - 62018258.59948723::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 62018258.59948723, not within 5e-07 of the seeded % [graded field: intermediate/nkemdi_2029_hct_chargeable_profit_usd]', v_g_nkemdi_2029_hct_chargeable_profit_usd;
  end if;
  -- nkemdi_2031_cpr_deferred_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_nkemdi_2031_cpr_deferred_usd - 70390530.68609565::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 70390530.68609565, not within 5e-07 of the seeded % [graded field: intermediate/nkemdi_2031_cpr_deferred_usd]', v_g_nkemdi_2031_cpr_deferred_usd;
  end if;
  -- nkemdi_cpr_forfeited_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_nkemdi_cpr_forfeited_usd - 86358633.90547852::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 86358633.90547852, not within 5e-07 of the seeded % [graded field: intermediate/nkemdi_cpr_forfeited_usd]', v_g_nkemdi_cpr_forfeited_usd;
  end if;
  -- nkemdi_total_cit_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_nkemdi_total_cit_usd - 171688707.5012266::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 171688707.5012266, not within 5e-07 of the seeded % [graded field: intermediate/nkemdi_total_cit_usd]', v_g_nkemdi_total_cit_usd;
  end if;
  -- alaku_2026_total_royalty_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_alaku_2026_total_royalty_usd - 109557078.99200001::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 109557078.99200001, not within 5e-07 of the seeded % [graded field: advanced/alaku_2026_total_royalty_usd]', v_g_alaku_2026_total_royalty_usd;
  end if;
  -- alaku_2026_hct_chargeable_profit_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_alaku_2026_hct_chargeable_profit_usd - 410836854.37683696::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 410836854.37683696, not within 5e-07 of the seeded % [graded field: advanced/alaku_2026_hct_chargeable_profit_usd]', v_g_alaku_2026_hct_chargeable_profit_usd;
  end if;
  -- alaku_2025_tet_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_alaku_2025_tet_usd - 17578523.598::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 17578523.598, not within 5e-07 of the seeded % [graded field: advanced/alaku_2025_tet_usd]', v_g_alaku_2025_tet_usd;
  end if;
  -- alaku_2027_dev_levy_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_alaku_2027_dev_levy_usd - 18394584.872472::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 18394584.872472, not within 5e-07 of the seeded % [graded field: advanced/alaku_2027_dev_levy_usd]', v_g_alaku_2027_dev_levy_usd;
  end if;
  -- alaku_2028_cit_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_alaku_2028_cit_usd - 85198816.79052001::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 85198816.79052001, not within 5e-07 of the seeded % [graded field: advanced/alaku_2028_cit_usd]', v_g_alaku_2028_cit_usd;
  end if;
  -- alaku_total_cit_usd: tools/validation/economics/oracle_pia2021.py
  if abs(v_g_alaku_total_cit_usd - 531288148.85508::double precision) > 5e-07::double precision then
    raise exception 'EC7 go-live refused: the oracle gives 531288148.85508, not within 5e-07 of the seeded % [graded field: advanced/alaku_total_cit_usd]', v_g_alaku_total_cit_usd;
  end if;

  -- ------------------------------------------------------------- 4. the traps
  -- Every wrong method discriminate.mjs swept through the engine for a field,
  -- by value: each must miss the seeded value by more than the tolerance, or
  -- the field does not discriminate the trap it is for.
  v_wrong := 0.15::double precision;
  if abs(v_wrong - v_g_odozi_2028_liquids_royalty_rate) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (flat royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2028_liquids_royalty_rate]', v_wrong, v_g_odozi_2028_liquids_royalty_rate;
  end if;
  v_wrong := 0.05890652557319223::double precision;
  if abs(v_wrong - v_g_odozi_2028_liquids_royalty_rate) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (daily rate 365 days) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2028_liquids_royalty_rate]', v_wrong, v_g_odozi_2028_liquids_royalty_rate;
  end if;
  v_wrong := 0.05::double precision;
  if abs(v_wrong - v_g_odozi_2028_liquids_royalty_rate) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (tranche read on the share of the volume) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2028_liquids_royalty_rate]', v_wrong, v_g_odozi_2028_liquids_royalty_rate;
  end if;
  v_wrong := 0.05::double precision;
  if abs(v_wrong - v_g_odozi_2028_liquids_royalty_rate) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (five percent on every barrel) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2028_liquids_royalty_rate]', v_wrong, v_g_odozi_2028_liquids_royalty_rate;
  end if;
  v_wrong := 12503166.48::double precision;
  if abs(v_wrong - v_g_odozi_2029_production_royalty_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (flat royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2029_production_royalty_usd]', v_wrong, v_g_odozi_2029_production_royalty_usd;
  end if;
  v_wrong := 4901928.84::double precision;
  if abs(v_wrong - v_g_odozi_2029_production_royalty_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (old gas rates) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2029_production_royalty_usd]', v_wrong, v_g_odozi_2029_production_royalty_usd;
  end if;
  v_wrong := 4850490.6::double precision;
  if abs(v_wrong - v_g_odozi_2029_production_royalty_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (gas in country ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2029_production_royalty_usd]', v_wrong, v_g_odozi_2029_production_royalty_usd;
  end if;
  v_wrong := 8041285.8::double precision;
  if abs(v_wrong - v_g_odozi_2029_production_royalty_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2029_production_royalty_usd]', v_wrong, v_g_odozi_2029_production_royalty_usd;
  end if;
  v_wrong := 11373655.458103443::double precision;
  if abs(v_wrong - v_g_odozi_2030_hct_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (flat royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2030_hct_usd]', v_wrong, v_g_odozi_2030_hct_usd;
  end if;
  v_wrong := 13607879.617241377::double precision;
  if abs(v_wrong - v_g_odozi_2030_hct_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (nddc outside hct base) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2030_hct_usd]', v_wrong, v_g_odozi_2030_hct_usd;
  end if;
  v_wrong := 13488881.176551722::double precision;
  if abs(v_wrong - v_g_odozi_2030_hct_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (hcdt current year) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2030_hct_usd]', v_wrong, v_g_odozi_2030_hct_usd;
  end if;
  v_wrong := 6745584.8040517215::double precision;
  if abs(v_wrong - v_g_odozi_2030_hct_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (read as a prospecting licence) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2030_hct_usd]', v_wrong, v_g_odozi_2030_hct_usd;
  end if;
  v_wrong := 22485282.680172406::double precision;
  if abs(v_wrong - v_g_odozi_2030_hct_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2030_hct_usd]', v_wrong, v_g_odozi_2030_hct_usd;
  end if;
  v_wrong := 1778732.3469887997::double precision;
  if abs(v_wrong - v_g_odozi_2031_dev_levy_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (flat royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2031_dev_levy_usd]', v_wrong, v_g_odozi_2031_dev_levy_usd;
  end if;
  v_wrong := 2036247.1465247998::double precision;
  if abs(v_wrong - v_g_odozi_2031_dev_levy_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (old gas rates) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2031_dev_levy_usd]', v_wrong, v_g_odozi_2031_dev_levy_usd;
  end if;
  v_wrong := 2038426.1356896::double precision;
  if abs(v_wrong - v_g_odozi_2031_dev_levy_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (hcdt current year) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2031_dev_levy_usd]', v_wrong, v_g_odozi_2031_dev_levy_usd;
  end if;
  v_wrong := 2037913.7455007995::double precision;
  if abs(v_wrong - v_g_odozi_2031_dev_levy_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (gas in country ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2031_dev_levy_usd]', v_wrong, v_g_odozi_2031_dev_levy_usd;
  end if;
  v_wrong := 3397911.7416479997::double precision;
  if abs(v_wrong - v_g_odozi_2031_dev_levy_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_2031_dev_levy_usd]', v_wrong, v_g_odozi_2031_dev_levy_usd;
  end if;
  v_wrong := 87997886.5833331::double precision;
  if abs(v_wrong - v_g_odozi_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (flat royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_total_cit_usd]', v_wrong, v_g_odozi_total_cit_usd;
  end if;
  v_wrong := 101287022.37753311::double precision;
  if abs(v_wrong - v_g_odozi_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (old gas rates) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_total_cit_usd]', v_wrong, v_g_odozi_total_cit_usd;
  end if;
  v_wrong := 101398318.78125024::double precision;
  if abs(v_wrong - v_g_odozi_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (hcdt current year) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_total_cit_usd]', v_wrong, v_g_odozi_total_cit_usd;
  end if;
  v_wrong := 101376288.4887331::double precision;
  if abs(v_wrong - v_g_odozi_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (gas in country ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_total_cit_usd]', v_wrong, v_g_odozi_total_cit_usd;
  end if;
  v_wrong := 169034869.24055517::double precision;
  if abs(v_wrong - v_g_odozi_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_total_cit_usd]', v_wrong, v_g_odozi_total_cit_usd;
  end if;
  v_wrong := 69.40567842715178::double precision;
  if abs(v_wrong - v_g_odozi_government_take_pct) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (flat royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_government_take_pct]', v_wrong, v_g_odozi_government_take_pct;
  end if;
  v_wrong := 65.15035577058393::double precision;
  if abs(v_wrong - v_g_odozi_government_take_pct) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (old gas rates) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_government_take_pct]', v_wrong, v_g_odozi_government_take_pct;
  end if;
  v_wrong := 65.35642687536395::double precision;
  if abs(v_wrong - v_g_odozi_government_take_pct) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (nddc outside hct base) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_government_take_pct]', v_wrong, v_g_odozi_government_take_pct;
  end if;
  v_wrong := 65.07856673216446::double precision;
  if abs(v_wrong - v_g_odozi_government_take_pct) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (hcdt current year) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_government_take_pct]', v_wrong, v_g_odozi_government_take_pct;
  end if;
  v_wrong := 52.73978875719874::double precision;
  if abs(v_wrong - v_g_odozi_government_take_pct) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (read as a prospecting licence) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/odozi_government_take_pct]', v_wrong, v_g_odozi_government_take_pct;
  end if;
  v_wrong := 43820595.0::double precision;
  if abs(v_wrong - v_g_nkemdi_2028_liquids_royalty_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (flat royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2028_liquids_royalty_usd]', v_wrong, v_g_nkemdi_2028_liquids_royalty_usd;
  end if;
  v_wrong := 38291822.678571425::double precision;
  if abs(v_wrong - v_g_nkemdi_2028_liquids_royalty_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (daily rate 365 days) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2028_liquids_royalty_usd]', v_wrong, v_g_nkemdi_2028_liquids_royalty_usd;
  end if;
  v_wrong := 37999479.375::double precision;
  if abs(v_wrong - v_g_nkemdi_2028_liquids_royalty_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (daily rate crude only) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2028_liquids_royalty_usd]', v_wrong, v_g_nkemdi_2028_liquids_royalty_usd;
  end if;
  v_wrong := 85059278.57142857::double precision;
  if abs(v_wrong - v_g_nkemdi_2028_liquids_royalty_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2028_liquids_royalty_usd]', v_wrong, v_g_nkemdi_2028_liquids_royalty_usd;
  end if;
  v_wrong := 13734720.0::double precision;
  if abs(v_wrong - v_g_nkemdi_2029_production_allowance_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (no allowance after cap) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2029_production_allowance_usd]', v_wrong, v_g_nkemdi_2029_production_allowance_usd;
  end if;
  v_wrong := 43741555.2::double precision;
  if abs(v_wrong - v_g_nkemdi_2029_production_allowance_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (prior production left out of the cap) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2029_production_allowance_usd]', v_wrong, v_g_nkemdi_2029_production_allowance_usd;
  end if;
  v_wrong := 13669236.0::double precision;
  if abs(v_wrong - v_g_nkemdi_2029_production_allowance_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (read as a converted lease) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2029_production_allowance_usd]', v_wrong, v_g_nkemdi_2029_production_allowance_usd;
  end if;
  v_wrong := 63862528.0::double precision;
  if abs(v_wrong - v_g_nkemdi_2029_production_allowance_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2029_production_allowance_usd]', v_wrong, v_g_nkemdi_2029_production_allowance_usd;
  end if;
  v_wrong := 56489486.278058656::double precision;
  if abs(v_wrong - v_g_nkemdi_2029_hct_chargeable_profit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (flat royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2029_hct_chargeable_profit_usd]', v_wrong, v_g_nkemdi_2029_hct_chargeable_profit_usd;
  end if;
  v_wrong := 64398333.169760235::double precision;
  if abs(v_wrong - v_g_nkemdi_2029_hct_chargeable_profit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (nddc outside hct base) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2029_hct_chargeable_profit_usd]', v_wrong, v_g_nkemdi_2029_hct_chargeable_profit_usd;
  end if;
  v_wrong := 77021676.19948724::double precision;
  if abs(v_wrong - v_g_nkemdi_2029_hct_chargeable_profit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (no allowance after cap) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2029_hct_chargeable_profit_usd]', v_wrong, v_g_nkemdi_2029_hct_chargeable_profit_usd;
  end if;
  v_wrong := 62294697.215558656::double precision;
  if abs(v_wrong - v_g_nkemdi_2029_hct_chargeable_profit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (daily rate crude only) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2029_hct_chargeable_profit_usd]', v_wrong, v_g_nkemdi_2029_hct_chargeable_profit_usd;
  end if;
  v_wrong := 137818352.44330496::double precision;
  if abs(v_wrong - v_g_nkemdi_2029_hct_chargeable_profit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2029_hct_chargeable_profit_usd]', v_wrong, v_g_nkemdi_2029_hct_chargeable_profit_usd;
  end if;
  v_wrong := 55794673.86509568::double precision;
  if abs(v_wrong - v_g_nkemdi_2031_cpr_deferred_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (cpr on gross revenue) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2031_cpr_deferred_usd]', v_wrong, v_g_nkemdi_2031_cpr_deferred_usd;
  end if;
  v_wrong := 88459235.82000001::double precision;
  if abs(v_wrong - v_g_nkemdi_2031_cpr_deferred_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (cpr costs not apportioned) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2031_cpr_deferred_usd]', v_wrong, v_g_nkemdi_2031_cpr_deferred_usd;
  end if;
  v_wrong := 48057907.0812774::double precision;
  if abs(v_wrong - v_g_nkemdi_2031_cpr_deferred_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (cpr carry dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2031_cpr_deferred_usd]', v_wrong, v_g_nkemdi_2031_cpr_deferred_usd;
  end if;
  v_wrong := 156423401.52465707::double precision;
  if abs(v_wrong - v_g_nkemdi_2031_cpr_deferred_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_2031_cpr_deferred_usd]', v_wrong, v_g_nkemdi_2031_cpr_deferred_usd;
  end if;
  v_wrong := 61463940.50722855::double precision;
  if abs(v_wrong - v_g_nkemdi_cpr_forfeited_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (cpr on gross revenue) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_cpr_forfeited_usd]', v_wrong, v_g_nkemdi_cpr_forfeited_usd;
  end if;
  v_wrong := 115513991.77500002::double precision;
  if abs(v_wrong - v_g_nkemdi_cpr_forfeited_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (cpr costs not apportioned) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_cpr_forfeited_usd]', v_wrong, v_g_nkemdi_cpr_forfeited_usd;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_nkemdi_cpr_forfeited_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (cpr carry dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_cpr_forfeited_usd]', v_wrong, v_g_nkemdi_cpr_forfeited_usd;
  end if;
  v_wrong := 191908075.3455079::double precision;
  if abs(v_wrong - v_g_nkemdi_cpr_forfeited_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_cpr_forfeited_usd]', v_wrong, v_g_nkemdi_cpr_forfeited_usd;
  end if;
  v_wrong := 160069197.23254693::double precision;
  if abs(v_wrong - v_g_nkemdi_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (flat royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_total_cit_usd]', v_wrong, v_g_nkemdi_total_cit_usd;
  end if;
  v_wrong := 170974335.2125047::double precision;
  if abs(v_wrong - v_g_nkemdi_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (old gas rates) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_total_cit_usd]', v_wrong, v_g_nkemdi_total_cit_usd;
  end if;
  v_wrong := 171587457.5012266::double precision;
  if abs(v_wrong - v_g_nkemdi_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (hcdt current year) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_total_cit_usd]', v_wrong, v_g_nkemdi_total_cit_usd;
  end if;
  v_wrong := 172269682.99838004::double precision;
  if abs(v_wrong - v_g_nkemdi_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (daily rate crude only) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_total_cit_usd]', v_wrong, v_g_nkemdi_total_cit_usd;
  end if;
  v_wrong := 381530461.1138369::double precision;
  if abs(v_wrong - v_g_nkemdi_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkemdi_total_cit_usd]', v_wrong, v_g_nkemdi_total_cit_usd;
  end if;
  v_wrong := 125982078.99200001::double precision;
  if abs(v_wrong - v_g_alaku_2026_total_royalty_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (deep offshore step) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2026_total_royalty_usd]', v_wrong, v_g_alaku_2026_total_royalty_usd;
  end if;
  v_wrong := 125982078.99200001::double precision;
  if abs(v_wrong - v_g_alaku_2026_total_royalty_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (flat royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2026_total_royalty_usd]', v_wrong, v_g_alaku_2026_total_royalty_usd;
  end if;
  v_wrong := 109780518.56::double precision;
  if abs(v_wrong - v_g_alaku_2026_total_royalty_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (old gas rates) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2026_total_royalty_usd]', v_wrong, v_g_alaku_2026_total_royalty_usd;
  end if;
  v_wrong := 109780518.56::double precision;
  if abs(v_wrong - v_g_alaku_2026_total_royalty_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (gas in country ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2026_total_royalty_usd]', v_wrong, v_g_alaku_2026_total_royalty_usd;
  end if;
  v_wrong := 111046676.11200002::double precision;
  if abs(v_wrong - v_g_alaku_2026_total_royalty_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (price royalty on gas) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2026_total_royalty_usd]', v_wrong, v_g_alaku_2026_total_royalty_usd;
  end if;
  v_wrong := 547785394.96::double precision;
  if abs(v_wrong - v_g_alaku_2026_total_royalty_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2026_total_royalty_usd]', v_wrong, v_g_alaku_2026_total_royalty_usd;
  end if;
  v_wrong := 378973814.37683696::double precision;
  if abs(v_wrong - v_g_alaku_2026_hct_chargeable_profit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (nta deep allowance kept) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2026_hct_chargeable_profit_usd]', v_wrong, v_g_alaku_2026_hct_chargeable_profit_usd;
  end if;
  v_wrong := 361340201.66321975::double precision;
  if abs(v_wrong - v_g_alaku_2026_hct_chargeable_profit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (one framework per ledger) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2026_hct_chargeable_profit_usd]', v_wrong, v_g_alaku_2026_hct_chargeable_profit_usd;
  end if;
  v_wrong := 415362814.973332::double precision;
  if abs(v_wrong - v_g_alaku_2026_hct_chargeable_profit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (nddc outside hct base) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2026_hct_chargeable_profit_usd]', v_wrong, v_g_alaku_2026_hct_chargeable_profit_usd;
  end if;
  v_wrong := 394411854.37683696::double precision;
  if abs(v_wrong - v_g_alaku_2026_hct_chargeable_profit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (deep offshore step) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2026_hct_chargeable_profit_usd]', v_wrong, v_g_alaku_2026_hct_chargeable_profit_usd;
  end if;
  v_wrong := 2054184271.8841846::double precision;
  if abs(v_wrong - v_g_alaku_2026_hct_chargeable_profit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2026_hct_chargeable_profit_usd]', v_wrong, v_g_alaku_2026_hct_chargeable_profit_usd;
  end if;
  v_wrong := 14648769.665000001::double precision;
  if abs(v_wrong - v_g_alaku_2025_tet_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (tet 25 after 2023) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2025_tet_usd]', v_wrong, v_g_alaku_2025_tet_usd;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_alaku_2025_tet_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (levy in pia years) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2025_tet_usd]', v_wrong, v_g_alaku_2025_tet_usd;
  end if;
  v_wrong := 17085773.598::double precision;
  if abs(v_wrong - v_g_alaku_2025_tet_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (deep offshore step) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2025_tet_usd]', v_wrong, v_g_alaku_2025_tet_usd;
  end if;
  v_wrong := 17527741.878000002::double precision;
  if abs(v_wrong - v_g_alaku_2025_tet_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (price royalty on gas) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2025_tet_usd]', v_wrong, v_g_alaku_2025_tet_usd;
  end if;
  v_wrong := 90052617.99::double precision;
  if abs(v_wrong - v_g_alaku_2025_tet_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2025_tet_usd]', v_wrong, v_g_alaku_2025_tet_usd;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_alaku_2027_dev_levy_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (one framework per ledger) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2027_dev_levy_usd]', v_wrong, v_g_alaku_2027_dev_levy_usd;
  end if;
  v_wrong := 17763696.680472::double precision;
  if abs(v_wrong - v_g_alaku_2027_dev_levy_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (flat royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2027_dev_levy_usd]', v_wrong, v_g_alaku_2027_dev_levy_usd;
  end if;
  v_wrong := 18386719.79976::double precision;
  if abs(v_wrong - v_g_alaku_2027_dev_levy_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (old gas rates) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2027_dev_levy_usd]', v_wrong, v_g_alaku_2027_dev_levy_usd;
  end if;
  v_wrong := 18342151.054392::double precision;
  if abs(v_wrong - v_g_alaku_2027_dev_levy_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (price royalty on gas) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2027_dev_levy_usd]', v_wrong, v_g_alaku_2027_dev_levy_usd;
  end if;
  v_wrong := 91972924.36236::double precision;
  if abs(v_wrong - v_g_alaku_2027_dev_levy_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2027_dev_levy_usd]', v_wrong, v_g_alaku_2027_dev_levy_usd;
  end if;
  v_wrong := 79798816.79052::double precision;
  if abs(v_wrong - v_g_alaku_2028_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (escrow condition taken as met) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2028_cit_usd]', v_wrong, v_g_alaku_2028_cit_usd;
  end if;
  v_wrong := 79798816.79052::double precision;
  if abs(v_wrong - v_g_alaku_2028_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (one framework per ledger) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2028_cit_usd]', v_wrong, v_g_alaku_2028_cit_usd;
  end if;
  v_wrong := 81034954.82052001::double precision;
  if abs(v_wrong - v_g_alaku_2028_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (flat royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2028_cit_usd]', v_wrong, v_g_alaku_2028_cit_usd;
  end if;
  v_wrong := 84852753.59772003::double precision;
  if abs(v_wrong - v_g_alaku_2028_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (price royalty on gas) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2028_cit_usd]', v_wrong, v_g_alaku_2028_cit_usd;
  end if;
  v_wrong := 425994083.9526::double precision;
  if abs(v_wrong - v_g_alaku_2028_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_2028_cit_usd]', v_wrong, v_g_alaku_2028_cit_usd;
  end if;
  v_wrong := 521433148.85508::double precision;
  if abs(v_wrong - v_g_alaku_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (deep offshore step) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_total_cit_usd]', v_wrong, v_g_alaku_total_cit_usd;
  end if;
  v_wrong := 511128148.85508::double precision;
  if abs(v_wrong - v_g_alaku_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (one framework per ledger) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_total_cit_usd]', v_wrong, v_g_alaku_total_cit_usd;
  end if;
  v_wrong := 509688148.85508::double precision;
  if abs(v_wrong - v_g_alaku_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (escrow condition taken as met) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_total_cit_usd]', v_wrong, v_g_alaku_total_cit_usd;
  end if;
  v_wrong := 508873426.82508004::double precision;
  if abs(v_wrong - v_g_alaku_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (flat royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_total_cit_usd]', v_wrong, v_g_alaku_total_cit_usd;
  end if;
  v_wrong := 529289600.0638801::double precision;
  if abs(v_wrong - v_g_alaku_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (price royalty on gas) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_total_cit_usd]', v_wrong, v_g_alaku_total_cit_usd;
  end if;
  v_wrong := 2678040744.2754::double precision;
  if abs(v_wrong - v_g_alaku_total_cit_usd) <= 5e-07::double precision then
    raise exception 'EC7 go-live refused: the trap (working interest ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/alaku_total_cit_usd]', v_wrong, v_g_alaku_total_cit_usd;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'pia';
  if not exists (select 1 from public.academy_apps where slug = 'pia' and status = 'available') then
    raise exception 'EC7 go-live refused: pia did not reach status available';
  end if;
  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon from public.academy_apps;
  raise notice 'EC7 go-live: pia available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
