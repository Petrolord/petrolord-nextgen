-- ------------------------------------------------ the second route's helpers
-- Temporary functions (pg_temp), created with create or replace: they vanish
-- with the session and create nothing in any schema. They rebuild each graded
-- EC11 value from the stated inputs of the case files, in SQL, with no engine
-- code: the chance of commerciality of an undiscovered project, Pg x Pd; the
-- cumulative and incremental categories of a stated set (Probable = best less
-- low, Possible = high less best; 2C = C1 + C2, 3C = C1 + C2 + C3); the
-- economic limit of one forecast case (the licence cut with no renewal
-- expected, the trailing years whose revenue less royalty less opex is
-- negative trimmed while no capital follows, straight-line depreciation over
-- the stated years, the loss carried forward, the tax charged at the stated
-- rate, the abandonment cost in the limit year, the net cash flow summed and
-- discounted at (1 + r) to the power of the years since the effective year);
-- the reporting basis (net entitlement: working interest less the royalty
-- interest) and BOE at the stated Mscf per BOE; the closed-form low and high
-- of a stated triangular (inverse at 0.1 and 0.9), normal (the mean less and
-- plus 1.2815515655446004 standard deviations) and lognormal (from the log of
-- the mean less half the log variance); a risked mean, the sum of chance x
-- mean; and a reconciliation's computed closing (production and divestments
-- subtracted, the others added as stated). Every number is a double precision.

-- A number out of a jsonb value, read through its text (the double JSON.parse gives).
create or replace function pg_temp.ec11_n(v jsonb) returns double precision
language sql immutable as $f$
  select case when v is null or jsonb_typeof(v) = 'null' then null else (v #>> '{}')::double precision end
$f$;

-- The chance of commerciality of an undiscovered project, in percent: Pg x Pd.
create or replace function pg_temp.ec11_pc(c jsonb) returns double precision
language sql immutable as $f$
  select pg_temp.ec11_n(c->'chances'->'geologicDiscoveryPct') * pg_temp.ec11_n(c->'chances'->'developmentPct') / 100.0
$f$;

-- One figure of a stated set: low, best, high (cumulative) or first, second,
-- third (incremental), whichever method the set is stated in.
create or replace function pg_temp.ec11_cat(c jsonb, k text) returns double precision
language plpgsql immutable as $f$
declare
  e jsonb := c->'estimates';
  lo double precision; be double precision; hi double precision;
begin
  if c->>'method' = 'cumulative' then
    lo := pg_temp.ec11_n(e->'low'); be := pg_temp.ec11_n(e->'best'); hi := pg_temp.ec11_n(e->'high');
  else
    lo := pg_temp.ec11_n(e->'first');
    be := lo + pg_temp.ec11_n(e->'second');
    hi := be + pg_temp.ec11_n(e->'third');
  end if;
  return case k when 'low' then lo when 'best' then be when 'high' then hi
                when 'first' then lo when 'second' then be - lo when 'third' then hi - be end;
end
$f$;

-- One forecast case through the licence and the economic limit. Returns
-- {limit, undiscounted, npv, techOil, techGas, withinOil, withinGas, keptOil, keptGas}.
create or replace function pg_temp.ec11_case(el jsonb, k text) returns jsonb
language plpgsql immutable as $f$
declare
  y0 int := (el->>'effectiveYear')::int;
  cutoff int := case when (el->'licence'->>'renewalExpected')::boolean then null else (el->'licence'->>'expiryYear')::int end;
  roy double precision := pg_temp.ec11_n(el->'royalty'->'ratePct');
  taxp double precision := pg_temp.ec11_n(el->'tax'->'ratePct');
  dy int := (el->'tax'->>'depreciationYears')::int;
  lcf boolean := (el->'tax'->>'lossCarryforward')::boolean;
  adr double precision := pg_temp.ec11_n(el->'costs'->'abandonment');
  rate double precision := pg_temp.ec11_n(el->'discountRatePct');
  last_prod int; last_cap int; lim int; y int; cy int; i int;
  years int[]; kept int[];
  r double precision; royal double precision; taxable double precision; charge double precision; t double precision;
  ncf double precision; pool double precision := 0; tot double precision := 0; pv double precision := 0;
  use_ double precision; depr double precision; amt double precision;
  t_oil double precision; t_gas double precision; w_oil double precision; w_gas double precision;
  k_oil double precision; k_gas double precision;
begin
  select sum(pg_temp.ec11_n(x->'oil')), sum(pg_temp.ec11_n(x->'gas')) into t_oil, t_gas
    from jsonb_array_elements(el->'forecasts'->k) x;
  select max((x->>'year')::int) into last_prod
    from jsonb_array_elements(el->'forecasts'->k) x where cutoff is null or (x->>'year')::int <= cutoff;
  select sum(pg_temp.ec11_n(x->'oil')), sum(pg_temp.ec11_n(x->'gas')) into w_oil, w_gas
    from jsonb_array_elements(el->'forecasts'->k) x where (x->>'year')::int <= last_prod;
  select array_agg(yy order by yy) into years from (
    select (x->>'year')::int yy from jsonb_array_elements(el->'forecasts'->k) x where (x->>'year')::int <= last_prod
    union select (x->>'year')::int from jsonb_array_elements(el->'costs'->'capex') x
    union select (x->>'year')::int from jsonb_array_elements(el->'costs'->'opex') x where (x->>'year')::int <= last_prod) s;
  select max((x->>'year')::int) into last_cap
    from jsonb_array_elements(el->'costs'->'capex') x where pg_temp.ec11_n(x->'amount') <> 0;
  kept := years;
  -- the canonical trailing trim: cut the last year while no capital follows it
  -- and its revenue less royalty less opex is negative
  loop
    exit when cardinality(kept) <= 1;
    y := kept[cardinality(kept)];
    exit when last_cap is not null and y <= last_cap;
    exit when pg_temp.ec11_noi(el, k, y, last_prod) >= 0;
    kept := kept[1:cardinality(kept) - 1];
  end loop;
  lim := kept[cardinality(kept)];
  foreach y in array kept loop
    r := pg_temp.ec11_rev(el, k, y, last_prod);
    royal := r * roy / 100.0;
    depr := 0;
    for cy, amt in select (x->>'year')::int, pg_temp.ec11_n(x->'amount') from jsonb_array_elements(el->'costs'->'capex') x loop
      if y >= cy and y < cy + dy then depr := depr + amt / dy::double precision; end if;
    end loop;
    taxable := r - royal - pg_temp.ec11_opex(el, y, last_prod) - depr;
    if lcf then
      if taxable < 0 then pool := pool - taxable; charge := 0;
      else use_ := least(pool, taxable); pool := pool - use_; charge := taxable - use_; end if;
    else
      charge := taxable;
    end if;
    t := greatest(0.0, charge * taxp / 100.0);
    ncf := r - royal - pg_temp.ec11_opex(el, y, last_prod) - pg_temp.ec11_capex(el, y) - t;
    if y = lim then ncf := ncf - adr; end if;
    tot := tot + ncf;
    pv := pv + ncf / power(1.0 + rate / 100.0, (y - y0)::double precision);
  end loop;
  select coalesce(sum(pg_temp.ec11_n(x->'oil')), 0), coalesce(sum(pg_temp.ec11_n(x->'gas')), 0) into k_oil, k_gas
    from jsonb_array_elements(el->'forecasts'->k) x where (x->>'year')::int <= least(lim, last_prod);
  return jsonb_build_object('limit', lim, 'undiscounted', tot, 'npv', pv, 'techOil', t_oil, 'techGas', t_gas,
                            'withinOil', w_oil, 'withinGas', w_gas, 'keptOil', k_oil, 'keptGas', k_gas);
end
$f$;

-- The revenue of one year of one case, zero past the licence cut.
create or replace function pg_temp.ec11_rev(el jsonb, k text, y int, last_prod int) returns double precision
language sql immutable as $f$
  select coalesce((select pg_temp.ec11_n(x->'oil') * pg_temp.ec11_n(p->'oil') + pg_temp.ec11_n(x->'gas') * pg_temp.ec11_n(p->'gas')
                     from jsonb_array_elements(el->'forecasts'->k) x, jsonb_array_elements(el->'prices') p
                    where (x->>'year')::int = y and (p->>'year')::int = y and y <= last_prod), 0.0)
$f$;

create or replace function pg_temp.ec11_opex(el jsonb, y int, last_prod int) returns double precision
language sql immutable as $f$
  select coalesce((select pg_temp.ec11_n(x->'amount') from jsonb_array_elements(el->'costs'->'opex') x
                    where (x->>'year')::int = y and y <= last_prod), 0.0)
$f$;

create or replace function pg_temp.ec11_capex(el jsonb, y int) returns double precision
language sql immutable as $f$
  select coalesce((select pg_temp.ec11_n(x->'amount') from jsonb_array_elements(el->'costs'->'capex') x
                    where (x->>'year')::int = y), 0.0)
$f$;

-- Revenue less royalty less opex, the quantity the trailing trim reads.
create or replace function pg_temp.ec11_noi(el jsonb, k text, y int, last_prod int) returns double precision
language sql immutable as $f$
  select pg_temp.ec11_rev(el, k, y, last_prod) * (1.0 - pg_temp.ec11_n(el->'royalty'->'ratePct') / 100.0)
         - pg_temp.ec11_opex(el, y, last_prod)
$f$;

-- The reporting-basis factor: 1 gross, the working interest, or the working
-- interest less the royalty interest (net entitlement; a production tax
-- deducts no volume).
create or replace function pg_temp.ec11_basis(el jsonb) returns double precision
language sql immutable as $f$
  select case el->>'reportingBasis'
           when 'gross' then 1.0
           when 'working-interest' then pg_temp.ec11_n(el->'workingInterestPct') / 100.0
           else pg_temp.ec11_n(el->'workingInterestPct') / 100.0
                * (1.0 - case when el->'royalty'->>'form' = 'royalty-interest' then pg_temp.ec11_n(el->'royalty'->'ratePct') else 0.0 end / 100.0)
         end
$f$;

-- One reported figure of one case on the stated basis: oil, gas or boe; zero
-- when the case fails the economic test (undiscounted net cash flow not above 0).
create or replace function pg_temp.ec11_reported(el jsonb, k text, what text) returns double precision
language plpgsql immutable as $f$
declare
  c jsonb := pg_temp.ec11_case(el, k);
  f double precision := pg_temp.ec11_basis(el);
  o double precision; g double precision;
begin
  if not (pg_temp.ec11_n(c->'undiscounted') > 0) then return 0.0; end if;
  o := pg_temp.ec11_n(c->'keptOil') * f;
  g := pg_temp.ec11_n(c->'keptGas') * f;
  return case what when 'oil' then o when 'gas' then g else o + g / pg_temp.ec11_n(el->'mscfPerBoe') end;
end
$f$;

-- The closed-form low (u = 0.1) or high (u = 0.9) of a stated distribution.
create or replace function pg_temp.ec11_q(d jsonb, u double precision) returns double precision
language plpgsql immutable as $f$
declare
  z double precision := 1.2815515655446004 * case when u < 0.5 then -1.0 else 1.0 end;
  a double precision; c double precision; b double precision; m double precision; s double precision; s2 double precision;
begin
  if d->>'type' = 'triangular' then
    a := pg_temp.ec11_n(d->'min'); c := pg_temp.ec11_n(d->'mode'); b := pg_temp.ec11_n(d->'max');
    if u <= (c - a) / (b - a) then return a + sqrt(u * (b - a) * (c - a)); end if;
    return b - sqrt((1.0 - u) * (b - a) * (b - c));
  end if;
  m := pg_temp.ec11_n(d->'mean'); s := pg_temp.ec11_n(d->'stdDev');
  if d->>'type' = 'normal' then return m + z * s; end if;
  s2 := ln(1.0 + (s * s) / (m * m));
  return exp(ln(m) - s2 / 2.0 + z * sqrt(s2));
end
$f$;

-- The exact mean of a stated distribution.
create or replace function pg_temp.ec11_mean(d jsonb) returns double precision
language sql immutable as $f$
  select case when d->>'type' = 'triangular'
              then (pg_temp.ec11_n(d->'min') + pg_temp.ec11_n(d->'mode') + pg_temp.ec11_n(d->'max')) / 3.0
              else pg_temp.ec11_n(d->'mean') end
$f$;

-- The arithmetic sum over the projects of an aggregate call: 'low', 'high' or
-- 'risked' (chance of commerciality x mean).
create or replace function pg_temp.ec11_sum(call jsonb, what text) returns double precision
language sql immutable as $f$
  select sum(case what when 'low' then pg_temp.ec11_q(p->'distribution', 0.1)
                       when 'high' then pg_temp.ec11_q(p->'distribution', 0.9)
                       else pg_temp.ec11_n(p->'chanceOfCommercialityPct') * pg_temp.ec11_mean(p->'distribution') / 100.0 end)
    from jsonb_array_elements(call->'projects') p
$f$;

-- A reconciliation's computed closing in one category: the opening plus every
-- movement, production and divestments subtracted.
create or replace function pg_temp.ec11_closing(call jsonb, k text) returns double precision
language sql immutable as $f$
  select pg_temp.ec11_n(call->'opening'->k)
         + coalesce(sum(case m->>'type'
                          when 'production' then -pg_temp.ec11_n(m->'quantity')
                          when 'divestments' then -pg_temp.ec11_n(m->k)
                          else pg_temp.ec11_n(m->k) end), 0.0)
    from jsonb_array_elements(call->'movements') m
$f$;
