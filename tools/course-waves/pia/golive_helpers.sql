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
