-- ============================================================================
-- EC11 GO-LIVE (HELD): Reserves & Resources under SPE-PRMS 2018 flips to
-- 'available' in the Economics & Commercial module, at path_order
-- 76.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/prms. The 78 lessons, the teaching lab
-- (prmsLab.js), its three calculator panels (classification, reserves and
-- aggregation)
-- and the three capstone case files ship in the ZIP and NOT in this database,
-- so a flip before the upload puts a live catalogue tile in front of a route
-- that does not exist. AN ENGINE COURSE: there is no Suite app and no Suite
-- upload to wait for. This file is written, dry-run and left unapplied on
-- purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values prms_capstone.mjs returned
--      through the vendored engines/economics/prms.js (petrolord-engines
--      42139e6) when this file was generated, to the last bit;
--   2. by a SECOND ROUTE IN SQL: the stated arithmetic rebuilt in plpgsql over
--      the case files the learner is handed; each to 1e-9 relative;
--   3. by the ORACLE: oracle_check.py's run of the vendored stdlib Python
--      oracle (tools/validation/economics/oracle_prms.py), written in by
--      value, each seeded value within its tolerance of the oracle's;
--   4. by the TRAPS the course is built on: every wrong method
--      discriminate.mjs swept through the engine for a field, written in by
--      value, must miss the seeded value by more than the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
--
-- NO BEGIN OR COMMIT. Like every course migration in this repository, the
-- file carries no transaction lines of its own; apply_ec11_prms.sh wraps it
-- in one transaction.
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

do $$
#variable_conflict use_column
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_s double precision; v_wrong double precision;
  v_g_abagana_prospect_pc_pct double precision;
  v_g_abagana_lead_pc_pct double precision;
  v_g_abagana_reserves_p2 double precision;
  v_g_abagana_reserves_p3 double precision;
  v_g_abagana_contingent_2c double precision;
  v_g_abagana_contingent_3c double precision;
  v_g_awkuzu_best_ncf_share double precision;
  v_g_awkuzu_best_npv_share double precision;
  v_g_awkuzu_2p_net_oil double precision;
  v_g_awkuzu_p2_boe double precision;
  v_g_awkuzu_p3_boe double precision;
  v_g_awkuzu_high_beyond_licence_oil double precision;
  v_g_isuofia_reserves_arith_1p double precision;
  v_g_isuofia_reserves_arith_3p double precision;
  v_g_isuofia_contingent_risked_mean double precision;
  v_g_isuofia_closing_1p double precision;
  v_g_isuofia_closing_3p double precision;
  v_g_isuofia_difference_2p double precision;
  v_case_b jsonb := '{"dataset":"ABAGANA (synthetic)","label":"ABAGANA, the resources of the Abagana licence (synthetic)","classify:prospect":{"name":"Abagana Deep prospect (synthetic)","discovery":"undiscovered","recoveryProject":"established-technology","subClass":"prospect","chances":{"geologicDiscoveryPct":23.5,"developmentPct":61.3}},"classify:lead":{"name":"Abagana Shallow lead (synthetic)","discovery":"undiscovered","recoveryProject":"established-technology","subClass":"lead","chances":{"geologicDiscoveryPct":12.25,"developmentPct":47.5}},"categorize:reserves":{"resourceClass":"reserves","method":"cumulative","estimates":{"low":11.35,"best":18.62,"high":27.415},"unit":"MMbbl"},"categorize:contingent":{"resourceClass":"contingent","method":"incremental","estimates":{"first":4.215,"second":3.37,"third":5.605},"unit":"MMboe"}}'::jsonb;
  v_case_i jsonb := '{"dataset":"AWKUZU (synthetic)","label":"AWKUZU, the economic limit of the Awkuzu field (synthetic)","economicLimit":{"effectiveYear":2029,"forecasts":{"low":[{"year":2029,"oil":1180000,"gas":767000},{"year":2030,"oil":920400,"gas":598260},{"year":2031,"oil":717912,"gas":466642.75},{"year":2032,"oil":559971.25,"gas":363981.25},{"year":2033,"oil":436777.75,"gas":283905.5},{"year":2034,"oil":340686.5,"gas":221446.25},{"year":2035,"oil":265735.5,"gas":172728},{"year":2036,"oil":207273.75,"gas":134728},{"year":2037,"oil":161673.5,"gas":105087.75},{"year":2038,"oil":126105.25,"gas":81968.5},{"year":2039,"oil":98362.25,"gas":63935.5},{"year":2040,"oil":76722.5,"gas":49869.75},{"year":2041,"oil":59843.5,"gas":38898.25},{"year":2042,"oil":46678,"gas":30340.75},{"year":2043,"oil":36408.75,"gas":23665.75},{"year":2044,"oil":28398.75,"gas":18459.25}],"best":[{"year":2029,"oil":1725000,"gas":1121250},{"year":2030,"oil":1483500,"gas":964275},{"year":2031,"oil":1275810,"gas":829276.5},{"year":2032,"oil":1097196.5,"gas":713177.75},{"year":2033,"oil":943589,"gas":613332.75},{"year":2034,"oil":811486.5,"gas":527466.25},{"year":2035,"oil":697878.5,"gas":453621},{"year":2036,"oil":600175.5,"gas":390114},{"year":2037,"oil":516151,"gas":335498.25},{"year":2038,"oil":443889.75,"gas":288528.25},{"year":2039,"oil":381745.25,"gas":248134.5},{"year":2040,"oil":328301,"gas":213395.75},{"year":2041,"oil":282338.75,"gas":183520.25},{"year":2042,"oil":242811.25,"gas":157827.25},{"year":2043,"oil":208817.75,"gas":135731.5},{"year":2044,"oil":179583.25,"gas":116729}],"high":[{"year":2029,"oil":2140000,"gas":1391000},{"year":2030,"oil":1926000,"gas":1251900},{"year":2031,"oil":1733400,"gas":1126710},{"year":2032,"oil":1560060,"gas":1014039},{"year":2033,"oil":1404054,"gas":912635},{"year":2034,"oil":1263648.5,"gas":821371.5},{"year":2035,"oil":1137283.75,"gas":739234.5},{"year":2036,"oil":1023555.25,"gas":665311},{"year":2037,"oil":921199.75,"gas":598779.75},{"year":2038,"oil":829079.75,"gas":538901.75},{"year":2039,"oil":746171.75,"gas":485011.75},{"year":2040,"oil":671554.75,"gas":436510.5},{"year":2041,"oil":604399.25,"gas":392859.5},{"year":2042,"oil":543959.25,"gas":353573.5},{"year":2043,"oil":489563.25,"gas":318216},{"year":2044,"oil":440607,"gas":286394.5}]},"prices":[{"year":2029,"oil":62.5,"gas":2.85},{"year":2030,"oil":62.5,"gas":2.85},{"year":2031,"oil":62.5,"gas":2.85},{"year":2032,"oil":62.5,"gas":2.85},{"year":2033,"oil":62.5,"gas":2.85},{"year":2034,"oil":62.5,"gas":2.85},{"year":2035,"oil":62.5,"gas":2.85},{"year":2036,"oil":62.5,"gas":2.85},{"year":2037,"oil":62.5,"gas":2.85},{"year":2038,"oil":62.5,"gas":2.85},{"year":2039,"oil":62.5,"gas":2.85},{"year":2040,"oil":62.5,"gas":2.85},{"year":2041,"oil":62.5,"gas":2.85},{"year":2042,"oil":62.5,"gas":2.85},{"year":2043,"oil":62.5,"gas":2.85},{"year":2044,"oil":62.5,"gas":2.85}],"costs":{"opex":[{"year":2029,"amount":21500000},{"year":2030,"amount":21500000},{"year":2031,"amount":21500000},{"year":2032,"amount":21500000},{"year":2033,"amount":21500000},{"year":2034,"amount":21500000},{"year":2035,"amount":21500000},{"year":2036,"amount":21500000},{"year":2037,"amount":21500000},{"year":2038,"amount":21500000},{"year":2039,"amount":21500000},{"year":2040,"amount":21500000},{"year":2041,"amount":21500000},{"year":2042,"amount":21500000},{"year":2043,"amount":21500000},{"year":2044,"amount":21500000}],"capex":[{"year":2029,"amount":96400000},{"year":2030,"amount":38250000}],"abandonment":27500000},"royalty":{"ratePct":12.5,"form":"royalty-interest"},"tax":{"ratePct":32.5,"depreciationYears":5,"lossCarryforward":true},"workingInterestPct":57.5,"licence":{"expiryYear":2041,"renewalExpected":false},"reportingBasis":"net-entitlement","discountRatePct":10,"mscfPerBoe":6}}'::jsonb;
  v_case_a jsonb := '{"dataset":"ISUOFIA (synthetic)","label":"ISUOFIA, the aggregation and reconciliation of the Isuofia field (synthetic)","aggregate:reserves":{"resourceClass":"reserves","level":"field","unit":"MMbbl","projects":[{"id":"ISF-1","name":"Isuofia Main (synthetic)","distribution":{"type":"lognormal","mean":7.35,"stdDev":2.15}},{"id":"ISF-2","name":"Isuofia North (synthetic)","distribution":{"type":"normal","mean":5.42,"stdDev":0.87}},{"id":"ISF-3","name":"Isuofia East (synthetic)","distribution":{"type":"triangular","min":2.1,"mode":3.65,"max":6.4}}],"correlation":{"type":"uniform","rho":0.35},"seed":20291204,"iterations":5000},"aggregate:contingent":{"resourceClass":"contingent","level":"field","unit":"MMboe","projects":[{"id":"ISF-4","name":"Isuofia West gas (synthetic)","distribution":{"type":"triangular","min":1.8,"mode":3.2,"max":7.9},"chanceOfCommercialityPct":55.5},{"id":"ISF-5","name":"Isuofia Deep appraisal (synthetic)","distribution":{"type":"lognormal","mean":4.65,"stdDev":1.9},"chanceOfCommercialityPct":38.25},{"id":"ISF-6","name":"Isuofia South infill (synthetic)","distribution":{"type":"normal","mean":2.95,"stdDev":0.6},"chanceOfCommercialityPct":71.4}],"correlation":{"type":"uniform","rho":0.2},"seed":20291205,"iterations":5000},"reconcile":{"resourceClass":"reserves","unit":"MMbbl","periodYears":1,"opening":{"low":24.6,"best":33.85,"high":45.2},"movements":[{"type":"production","quantity":2.35},{"type":"revisions","low":0.42,"best":-0.31,"high":-1.05},{"type":"extensions-and-discoveries","low":1.15,"best":2.4,"high":3.95},{"type":"divestments","low":0.8,"best":1.1,"high":1.45},{"type":"transfers","low":2.2,"best":3.35,"high":4.6,"note":"Isuofia West oil moved from Contingent Resources (synthetic)"}],"closing":{"low":25.3,"best":36.137,"high":49.35},"tolerance":0.001}}'::jsonb;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'prms' and active;
  if v_structures <> 3 then
    raise exception 'EC11 go-live refused: prms has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'prms';
  if v_questions <> 396 then
    raise exception 'EC11 go-live refused: prms has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'prms' group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'EC11 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;
  select count(*) into v_n from (select tier, module_key from public.academy_quiz_questions where app_slug = 'prms' and scope = 'module' group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'EC11 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'prms' and scope = 'final' group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'EC11 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = 'prms'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'EC11 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;
  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'prms' and s.active;
  if v_lessons <> 78 then
    raise exception 'EC11 go-live refused: prms carries % lesson keys, expected 78', v_lessons;
  end if;
  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'prms' and s.active;
  if v_modules <> 18 then
    raise exception 'EC11 go-live refused: prms carries % modules, expected 18 (six per tier)', v_modules;
  end if;
  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'prms' and qq.scope = 'module' and not exists (
       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'EC11 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'prms';
  if v_capstones <> 3 then
    raise exception 'EC11 go-live refused: prms has % capstones, expected 3', v_capstones;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'prms';
  if v_graded <> 18 then
    raise exception 'EC11 go-live refused: prms has % graded capstone fields, expected 18', v_graded;
  end if;
  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'prms' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'EC11 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'prms' and module = 'economics' and path_order = 76 and prereq_slug is null) then
    raise exception 'EC11 go-live refused: the prms catalogue row is not economics at path_order 76 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 76 and slug <> 'prms') then
    raise exception 'EC11 go-live refused: another course already holds path_order 76';
  end if;

  -- ------------------------------------------------- the grader is numeric
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or abs((f->>'expected')::numeric) <= 0.001
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric is distinct from (select t.tol from (values ('beginner', 'abagana_prospect_pc_pct', 5e-07::numeric), ('beginner', 'abagana_lead_pc_pct', 5e-07::numeric), ('beginner', 'abagana_reserves_p2', 5e-07::numeric), ('beginner', 'abagana_reserves_p3', 5e-07::numeric), ('beginner', 'abagana_contingent_2c', 5e-07::numeric), ('beginner', 'abagana_contingent_3c', 5e-07::numeric), ('intermediate', 'awkuzu_best_ncf_share', 5e-07::numeric), ('intermediate', 'awkuzu_best_npv_share', 5e-07::numeric), ('intermediate', 'awkuzu_2p_net_oil', 5e-07::numeric), ('intermediate', 'awkuzu_p2_boe', 5e-07::numeric), ('intermediate', 'awkuzu_p3_boe', 5e-07::numeric), ('intermediate', 'awkuzu_high_beyond_licence_oil', 5e-07::numeric), ('advanced', 'isuofia_reserves_arith_1p', 5e-07::numeric), ('advanced', 'isuofia_reserves_arith_3p', 5e-07::numeric), ('advanced', 'isuofia_contingent_risked_mean', 5e-07::numeric), ('advanced', 'isuofia_closing_1p', 5e-07::numeric), ('advanced', 'isuofia_closing_3p', 5e-07::numeric), ('advanced', 'isuofia_difference_2p', 5e-07::numeric)) t(tier, k, tol) where t.tier = c.tier and t.k = f->>'key')
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'EC11 go-live refused: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;
  end if;
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or ((f->>'tol')::numeric = 0.0000005
              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));
  if v_n <> 0 then
    raise exception 'EC11 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or, at the six-decimal floor, pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;

  -- ---------------------------------------- the prompts the learner reads
  select prompt into v_prompt from public.academy_capstones where app_slug = 'prms' and tier = 'beginner';
  if v_prompt is null or md5(v_prompt) <> '99ff9f42a5d987110eea3463e758cf0e' then
    raise exception 'EC11 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'prms' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'ABAGANA, the resources of the Abagana licence (synthetic)' and title = 'Classes, categories and the low estimate') then
    raise exception 'EC11 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['prospect', 'lead', 'cumulative', 'incremental', 'MMbbl', 'MMboe', 'undiscovered', 'established technology', 'abagana_case.json', 'No value depends on any of the readings the engine states (the five-year benchmark, the economic test at exactly 0 and with abandonment, the economic-limit rule, the replacement ratio, the life index, the tolerance at its boundary, the Monte Carlo low) or on a Monte Carlo draw, and every input a value needs is stated in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC11 go-live refused: % stated setting(s) or case file(s) are not named in the shipped beginner prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'prms' and tier = 'intermediate';
  if v_prompt is null or md5(v_prompt) <> '7537c5ed01d37856da1935b96e0ddd15' then
    raise exception 'EC11 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'prms' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'AWKUZU, the economic limit of the Awkuzu field (synthetic)' and title = 'Maturity, commerciality and the economic limit') then
    raise exception 'EC11 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['royalty-interest', 'net-entitlement', 'lossCarryforward', 'renewalExpected', 'after tax and abandonment', 'awkuzu_case.json', 'No value depends on any of the readings the engine states (the five-year benchmark, the economic test at exactly 0 and with abandonment, the economic-limit rule, the replacement ratio, the life index, the tolerance at its boundary, the Monte Carlo low) or on a Monte Carlo draw, and every input a value needs is stated in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC11 go-live refused: % stated setting(s) or case file(s) are not named in the shipped intermediate prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'prms' and tier = 'advanced';
  if v_prompt is null or md5(v_prompt) <> 'a4c87d276d6d08b29a65223a89aa80b7' then
    raise exception 'EC11 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'prms' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'ISUOFIA, the aggregation and reconciliation of the Isuofia field (synthetic)' and title = 'Aggregation, reconciliation and the limits') then
    raise exception 'EC11 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['field', 'MMbbl', 'MMboe', 'MMbbl', 'uniform correlation', 'lognormal', 'normal', 'triangular', 'triangular', 'lognormal', 'normal', 'production', 'revisions', 'extensions-and-discoveries', 'divestments', 'transfers', 'isuofia_case.json', 'No value depends on any of the readings the engine states (the five-year benchmark, the economic test at exactly 0 and with abandonment, the economic-limit rule, the replacement ratio, the life index, the tolerance at its boundary, the Monte Carlo low) or on a Monte Carlo draw, and every input a value needs is stated in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC11 go-live refused: % stated setting(s) or case file(s) are not named in the shipped advanced prompt: %', v_n, v_names;
  end if;
  -- No number handed in any capstone text of this course may sit within its
  -- tolerance of any graded value of any tier.
  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names
    from (select c.tier as ctier, m[1]::double precision as x
            from public.academy_capstones c,
                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||
                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),
                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m
           where c.app_slug = 'prms') h,
         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'prms') g
   where abs(abs(h.x) - abs(g.v)) <= g.t;
  if v_n <> 0 then
    raise exception 'EC11 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_abagana_prospect_pc_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'beginner' and f->>'key' = 'abagana_prospect_pc_pct';
  if v_g_abagana_prospect_pc_pct is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: beginner/abagana_prospect_pc_pct]';
  end if;
  select (f->>'expected')::double precision into v_g_abagana_lead_pc_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'beginner' and f->>'key' = 'abagana_lead_pc_pct';
  if v_g_abagana_lead_pc_pct is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: beginner/abagana_lead_pc_pct]';
  end if;
  select (f->>'expected')::double precision into v_g_abagana_reserves_p2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'beginner' and f->>'key' = 'abagana_reserves_p2';
  if v_g_abagana_reserves_p2 is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: beginner/abagana_reserves_p2]';
  end if;
  select (f->>'expected')::double precision into v_g_abagana_reserves_p3
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'beginner' and f->>'key' = 'abagana_reserves_p3';
  if v_g_abagana_reserves_p3 is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: beginner/abagana_reserves_p3]';
  end if;
  select (f->>'expected')::double precision into v_g_abagana_contingent_2c
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'beginner' and f->>'key' = 'abagana_contingent_2c';
  if v_g_abagana_contingent_2c is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: beginner/abagana_contingent_2c]';
  end if;
  select (f->>'expected')::double precision into v_g_abagana_contingent_3c
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'beginner' and f->>'key' = 'abagana_contingent_3c';
  if v_g_abagana_contingent_3c is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: beginner/abagana_contingent_3c]';
  end if;
  select (f->>'expected')::double precision into v_g_awkuzu_best_ncf_share
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'intermediate' and f->>'key' = 'awkuzu_best_ncf_share';
  if v_g_awkuzu_best_ncf_share is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: intermediate/awkuzu_best_ncf_share]';
  end if;
  select (f->>'expected')::double precision into v_g_awkuzu_best_npv_share
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'intermediate' and f->>'key' = 'awkuzu_best_npv_share';
  if v_g_awkuzu_best_npv_share is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: intermediate/awkuzu_best_npv_share]';
  end if;
  select (f->>'expected')::double precision into v_g_awkuzu_2p_net_oil
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'intermediate' and f->>'key' = 'awkuzu_2p_net_oil';
  if v_g_awkuzu_2p_net_oil is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: intermediate/awkuzu_2p_net_oil]';
  end if;
  select (f->>'expected')::double precision into v_g_awkuzu_p2_boe
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'intermediate' and f->>'key' = 'awkuzu_p2_boe';
  if v_g_awkuzu_p2_boe is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: intermediate/awkuzu_p2_boe]';
  end if;
  select (f->>'expected')::double precision into v_g_awkuzu_p3_boe
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'intermediate' and f->>'key' = 'awkuzu_p3_boe';
  if v_g_awkuzu_p3_boe is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: intermediate/awkuzu_p3_boe]';
  end if;
  select (f->>'expected')::double precision into v_g_awkuzu_high_beyond_licence_oil
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'intermediate' and f->>'key' = 'awkuzu_high_beyond_licence_oil';
  if v_g_awkuzu_high_beyond_licence_oil is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: intermediate/awkuzu_high_beyond_licence_oil]';
  end if;
  select (f->>'expected')::double precision into v_g_isuofia_reserves_arith_1p
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'advanced' and f->>'key' = 'isuofia_reserves_arith_1p';
  if v_g_isuofia_reserves_arith_1p is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: advanced/isuofia_reserves_arith_1p]';
  end if;
  select (f->>'expected')::double precision into v_g_isuofia_reserves_arith_3p
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'advanced' and f->>'key' = 'isuofia_reserves_arith_3p';
  if v_g_isuofia_reserves_arith_3p is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: advanced/isuofia_reserves_arith_3p]';
  end if;
  select (f->>'expected')::double precision into v_g_isuofia_contingent_risked_mean
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'advanced' and f->>'key' = 'isuofia_contingent_risked_mean';
  if v_g_isuofia_contingent_risked_mean is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: advanced/isuofia_contingent_risked_mean]';
  end if;
  select (f->>'expected')::double precision into v_g_isuofia_closing_1p
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'advanced' and f->>'key' = 'isuofia_closing_1p';
  if v_g_isuofia_closing_1p is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: advanced/isuofia_closing_1p]';
  end if;
  select (f->>'expected')::double precision into v_g_isuofia_closing_3p
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'advanced' and f->>'key' = 'isuofia_closing_3p';
  if v_g_isuofia_closing_3p is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: advanced/isuofia_closing_3p]';
  end if;
  select (f->>'expected')::double precision into v_g_isuofia_difference_2p
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'prms' and c.tier = 'advanced' and f->>'key' = 'isuofia_difference_2p';
  if v_g_isuofia_difference_2p is null then
    raise exception 'EC11 go-live refused: the seeded rows carry no value [graded field: advanced/isuofia_difference_2p]';
  end if;

  -- ------------------------------------------ 1. against the engine ledger
  if v_g_abagana_prospect_pc_pct <> 14.4055::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 14.4055 [graded field: beginner/abagana_prospect_pc_pct]', v_g_abagana_prospect_pc_pct;
  end if;
  if v_g_abagana_lead_pc_pct <> 5.81875::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 5.81875 [graded field: beginner/abagana_lead_pc_pct]', v_g_abagana_lead_pc_pct;
  end if;
  if v_g_abagana_reserves_p2 <> 7.270000000000001::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 7.270000000000001 [graded field: beginner/abagana_reserves_p2]', v_g_abagana_reserves_p2;
  end if;
  if v_g_abagana_reserves_p3 <> 8.794999999999998::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 8.794999999999998 [graded field: beginner/abagana_reserves_p3]', v_g_abagana_reserves_p3;
  end if;
  if v_g_abagana_contingent_2c <> 7.585::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 7.585 [graded field: beginner/abagana_contingent_2c]', v_g_abagana_contingent_2c;
  end if;
  if v_g_abagana_contingent_3c <> 13.190000000000001::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 13.190000000000001 [graded field: beginner/abagana_contingent_3c]', v_g_abagana_contingent_3c;
  end if;
  if v_g_awkuzu_best_ncf_share <> 58168493.64463964::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 58168493.64463964 [graded field: intermediate/awkuzu_best_ncf_share]', v_g_awkuzu_best_ncf_share;
  end if;
  if v_g_awkuzu_best_npv_share <> 39957040.64785222::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 39957040.64785222 [graded field: intermediate/awkuzu_best_npv_share]', v_g_awkuzu_best_npv_share;
  end if;
  if v_g_awkuzu_2p_net_oil <> 4827321.739843749::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 4827321.739843749 [graded field: intermediate/awkuzu_2p_net_oil]', v_g_awkuzu_2p_net_oil;
  end if;
  if v_g_awkuzu_p2_boe <> 5350281.583463541::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 5350281.583463541 [graded field: intermediate/awkuzu_p2_boe]', v_g_awkuzu_p2_boe;
  end if;
  if v_g_awkuzu_p3_boe <> 3549723.34609375::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 3549723.34609375 [graded field: intermediate/awkuzu_p3_boe]', v_g_awkuzu_p3_boe;
  end if;
  if v_g_awkuzu_high_beyond_licence_oil <> 1474129.5::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 1474129.5 [graded field: intermediate/awkuzu_high_beyond_licence_oil]', v_g_awkuzu_high_beyond_licence_oil;
  end if;
  if v_g_isuofia_reserves_arith_1p <> 12.107774398049704::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 12.107774398049704 [graded field: advanced/isuofia_reserves_arith_1p]', v_g_isuofia_reserves_arith_1p;
  end if;
  if v_g_isuofia_reserves_arith_3p <> 22.031925128837223::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 22.031925128837223 [graded field: advanced/isuofia_reserves_arith_3p]', v_g_isuofia_reserves_arith_3p;
  end if;
  if v_g_isuofia_contingent_risked_mean <> 6.271425::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 6.271425 [graded field: advanced/isuofia_contingent_risked_mean]', v_g_isuofia_contingent_risked_mean;
  end if;
  if v_g_isuofia_closing_1p <> 25.22::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 25.22 [graded field: advanced/isuofia_closing_1p]', v_g_isuofia_closing_1p;
  end if;
  if v_g_isuofia_closing_3p <> 48.900000000000006::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 48.900000000000006 [graded field: advanced/isuofia_closing_3p]', v_g_isuofia_closing_3p;
  end if;
  if v_g_isuofia_difference_2p <> 0.29699999999999704::double precision then
    raise exception 'EC11 go-live refused: the seeded value is %, and the engine returned 0.29699999999999704 [graded field: advanced/isuofia_difference_2p]', v_g_isuofia_difference_2p;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  v_s := pg_temp.ec11_pc(v_case_b->'classify:prospect');
  if v_s is null or abs(v_s - v_g_abagana_prospect_pc_pct) > 1e-9 * abs(v_g_abagana_prospect_pc_pct) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/abagana_prospect_pc_pct]', v_s, v_g_abagana_prospect_pc_pct;
  end if;
  v_s := pg_temp.ec11_pc(v_case_b->'classify:lead');
  if v_s is null or abs(v_s - v_g_abagana_lead_pc_pct) > 1e-9 * abs(v_g_abagana_lead_pc_pct) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/abagana_lead_pc_pct]', v_s, v_g_abagana_lead_pc_pct;
  end if;
  v_s := pg_temp.ec11_cat(v_case_b->'categorize:reserves', 'second');
  if v_s is null or abs(v_s - v_g_abagana_reserves_p2) > 1e-9 * abs(v_g_abagana_reserves_p2) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/abagana_reserves_p2]', v_s, v_g_abagana_reserves_p2;
  end if;
  v_s := pg_temp.ec11_cat(v_case_b->'categorize:reserves', 'third');
  if v_s is null or abs(v_s - v_g_abagana_reserves_p3) > 1e-9 * abs(v_g_abagana_reserves_p3) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/abagana_reserves_p3]', v_s, v_g_abagana_reserves_p3;
  end if;
  v_s := pg_temp.ec11_cat(v_case_b->'categorize:contingent', 'best');
  if v_s is null or abs(v_s - v_g_abagana_contingent_2c) > 1e-9 * abs(v_g_abagana_contingent_2c) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/abagana_contingent_2c]', v_s, v_g_abagana_contingent_2c;
  end if;
  v_s := pg_temp.ec11_cat(v_case_b->'categorize:contingent', 'high');
  if v_s is null or abs(v_s - v_g_abagana_contingent_3c) > 1e-9 * abs(v_g_abagana_contingent_3c) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/abagana_contingent_3c]', v_s, v_g_abagana_contingent_3c;
  end if;
  v_s := pg_temp.ec11_n(pg_temp.ec11_case(v_case_i->'economicLimit', 'best')->'undiscounted') * pg_temp.ec11_n(v_case_i->'economicLimit'->'workingInterestPct') / 100.0;
  if v_s is null or abs(v_s - v_g_awkuzu_best_ncf_share) > 1e-9 * abs(v_g_awkuzu_best_ncf_share) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/awkuzu_best_ncf_share]', v_s, v_g_awkuzu_best_ncf_share;
  end if;
  v_s := pg_temp.ec11_n(pg_temp.ec11_case(v_case_i->'economicLimit', 'best')->'npv') * pg_temp.ec11_n(v_case_i->'economicLimit'->'workingInterestPct') / 100.0;
  if v_s is null or abs(v_s - v_g_awkuzu_best_npv_share) > 1e-9 * abs(v_g_awkuzu_best_npv_share) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/awkuzu_best_npv_share]', v_s, v_g_awkuzu_best_npv_share;
  end if;
  v_s := pg_temp.ec11_reported(v_case_i->'economicLimit', 'best', 'oil');
  if v_s is null or abs(v_s - v_g_awkuzu_2p_net_oil) > 1e-9 * abs(v_g_awkuzu_2p_net_oil) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/awkuzu_2p_net_oil]', v_s, v_g_awkuzu_2p_net_oil;
  end if;
  v_s := pg_temp.ec11_reported(v_case_i->'economicLimit', 'best', 'boe') - pg_temp.ec11_reported(v_case_i->'economicLimit', 'low', 'boe');
  if v_s is null or abs(v_s - v_g_awkuzu_p2_boe) > 1e-9 * abs(v_g_awkuzu_p2_boe) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/awkuzu_p2_boe]', v_s, v_g_awkuzu_p2_boe;
  end if;
  v_s := pg_temp.ec11_reported(v_case_i->'economicLimit', 'high', 'boe') - pg_temp.ec11_reported(v_case_i->'economicLimit', 'best', 'boe');
  if v_s is null or abs(v_s - v_g_awkuzu_p3_boe) > 1e-9 * abs(v_g_awkuzu_p3_boe) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/awkuzu_p3_boe]', v_s, v_g_awkuzu_p3_boe;
  end if;
  v_s := pg_temp.ec11_n(pg_temp.ec11_case(v_case_i->'economicLimit', 'high')->'techOil') - pg_temp.ec11_n(pg_temp.ec11_case(v_case_i->'economicLimit', 'high')->'withinOil');
  if v_s is null or abs(v_s - v_g_awkuzu_high_beyond_licence_oil) > 1e-9 * abs(v_g_awkuzu_high_beyond_licence_oil) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/awkuzu_high_beyond_licence_oil]', v_s, v_g_awkuzu_high_beyond_licence_oil;
  end if;
  v_s := pg_temp.ec11_sum(v_case_a->'aggregate:reserves', 'low');
  if v_s is null or abs(v_s - v_g_isuofia_reserves_arith_1p) > 1e-9 * abs(v_g_isuofia_reserves_arith_1p) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/isuofia_reserves_arith_1p]', v_s, v_g_isuofia_reserves_arith_1p;
  end if;
  v_s := pg_temp.ec11_sum(v_case_a->'aggregate:reserves', 'high');
  if v_s is null or abs(v_s - v_g_isuofia_reserves_arith_3p) > 1e-9 * abs(v_g_isuofia_reserves_arith_3p) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/isuofia_reserves_arith_3p]', v_s, v_g_isuofia_reserves_arith_3p;
  end if;
  v_s := pg_temp.ec11_sum(v_case_a->'aggregate:contingent', 'risked');
  if v_s is null or abs(v_s - v_g_isuofia_contingent_risked_mean) > 1e-9 * abs(v_g_isuofia_contingent_risked_mean) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/isuofia_contingent_risked_mean]', v_s, v_g_isuofia_contingent_risked_mean;
  end if;
  v_s := pg_temp.ec11_closing(v_case_a->'reconcile', 'low');
  if v_s is null or abs(v_s - v_g_isuofia_closing_1p) > 1e-9 * abs(v_g_isuofia_closing_1p) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/isuofia_closing_1p]', v_s, v_g_isuofia_closing_1p;
  end if;
  v_s := pg_temp.ec11_closing(v_case_a->'reconcile', 'high');
  if v_s is null or abs(v_s - v_g_isuofia_closing_3p) > 1e-9 * abs(v_g_isuofia_closing_3p) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/isuofia_closing_3p]', v_s, v_g_isuofia_closing_3p;
  end if;
  v_s := pg_temp.ec11_n(v_case_a->'reconcile'->'closing'->'best') - pg_temp.ec11_closing(v_case_a->'reconcile', 'best');
  if v_s is null or abs(v_s - v_g_isuofia_difference_2p) > 1e-9 * abs(v_g_isuofia_difference_2p) then
    raise exception 'EC11 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/isuofia_difference_2p]', v_s, v_g_isuofia_difference_2p;
  end if;

  -- ---------------------------------------------------- 3. against the oracle
  -- oracle_check.py --json, run when this file was generated: the value the
  -- vendored stdlib oracle computed, written in, with the module it came from.
  -- abagana_prospect_pc_pct: tools/validation/economics/oracle_prms.py
  if abs(v_g_abagana_prospect_pc_pct - 14.4055::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 14.4055, not within 5e-07 of the seeded % [graded field: beginner/abagana_prospect_pc_pct]', v_g_abagana_prospect_pc_pct;
  end if;
  -- abagana_lead_pc_pct: tools/validation/economics/oracle_prms.py
  if abs(v_g_abagana_lead_pc_pct - 5.81875::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 5.81875, not within 5e-07 of the seeded % [graded field: beginner/abagana_lead_pc_pct]', v_g_abagana_lead_pc_pct;
  end if;
  -- abagana_reserves_p2: tools/validation/economics/oracle_prms.py
  if abs(v_g_abagana_reserves_p2 - 7.270000000000001::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 7.270000000000001, not within 5e-07 of the seeded % [graded field: beginner/abagana_reserves_p2]', v_g_abagana_reserves_p2;
  end if;
  -- abagana_reserves_p3: tools/validation/economics/oracle_prms.py
  if abs(v_g_abagana_reserves_p3 - 8.794999999999998::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 8.794999999999998, not within 5e-07 of the seeded % [graded field: beginner/abagana_reserves_p3]', v_g_abagana_reserves_p3;
  end if;
  -- abagana_contingent_2c: tools/validation/economics/oracle_prms.py
  if abs(v_g_abagana_contingent_2c - 7.585::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 7.585, not within 5e-07 of the seeded % [graded field: beginner/abagana_contingent_2c]', v_g_abagana_contingent_2c;
  end if;
  -- abagana_contingent_3c: tools/validation/economics/oracle_prms.py
  if abs(v_g_abagana_contingent_3c - 13.190000000000001::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 13.190000000000001, not within 5e-07 of the seeded % [graded field: beginner/abagana_contingent_3c]', v_g_abagana_contingent_3c;
  end if;
  -- awkuzu_best_ncf_share: tools/validation/economics/oracle_prms.py
  if abs(v_g_awkuzu_best_ncf_share - 58168493.64463965::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 58168493.64463965, not within 5e-07 of the seeded % [graded field: intermediate/awkuzu_best_ncf_share]', v_g_awkuzu_best_ncf_share;
  end if;
  -- awkuzu_best_npv_share: tools/validation/economics/oracle_prms.py
  if abs(v_g_awkuzu_best_npv_share - 39957040.64785223::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 39957040.64785223, not within 5e-07 of the seeded % [graded field: intermediate/awkuzu_best_npv_share]', v_g_awkuzu_best_npv_share;
  end if;
  -- awkuzu_2p_net_oil: tools/validation/economics/oracle_prms.py
  if abs(v_g_awkuzu_2p_net_oil - 4827321.73984375::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 4827321.73984375, not within 5e-07 of the seeded % [graded field: intermediate/awkuzu_2p_net_oil]', v_g_awkuzu_2p_net_oil;
  end if;
  -- awkuzu_p2_boe: tools/validation/economics/oracle_prms.py
  if abs(v_g_awkuzu_p2_boe - 5350281.583463541::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 5350281.583463541, not within 5e-07 of the seeded % [graded field: intermediate/awkuzu_p2_boe]', v_g_awkuzu_p2_boe;
  end if;
  -- awkuzu_p3_boe: tools/validation/economics/oracle_prms.py
  if abs(v_g_awkuzu_p3_boe - 3549723.34609375::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 3549723.34609375, not within 5e-07 of the seeded % [graded field: intermediate/awkuzu_p3_boe]', v_g_awkuzu_p3_boe;
  end if;
  -- awkuzu_high_beyond_licence_oil: tools/validation/economics/oracle_prms.py
  if abs(v_g_awkuzu_high_beyond_licence_oil - 1474129.5::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 1474129.5, not within 5e-07 of the seeded % [graded field: intermediate/awkuzu_high_beyond_licence_oil]', v_g_awkuzu_high_beyond_licence_oil;
  end if;
  -- isuofia_reserves_arith_1p: tools/validation/economics/oracle_prms.py
  if abs(v_g_isuofia_reserves_arith_1p - 12.107774398049704::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 12.107774398049704, not within 5e-07 of the seeded % [graded field: advanced/isuofia_reserves_arith_1p]', v_g_isuofia_reserves_arith_1p;
  end if;
  -- isuofia_reserves_arith_3p: tools/validation/economics/oracle_prms.py
  if abs(v_g_isuofia_reserves_arith_3p - 22.031925128837223::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 22.031925128837223, not within 5e-07 of the seeded % [graded field: advanced/isuofia_reserves_arith_3p]', v_g_isuofia_reserves_arith_3p;
  end if;
  -- isuofia_contingent_risked_mean: tools/validation/economics/oracle_prms.py
  if abs(v_g_isuofia_contingent_risked_mean - 6.271425000000001::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 6.271425000000001, not within 5e-07 of the seeded % [graded field: advanced/isuofia_contingent_risked_mean]', v_g_isuofia_contingent_risked_mean;
  end if;
  -- isuofia_closing_1p: tools/validation/economics/oracle_prms.py
  if abs(v_g_isuofia_closing_1p - 25.220000000000002::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 25.220000000000002, not within 5e-07 of the seeded % [graded field: advanced/isuofia_closing_1p]', v_g_isuofia_closing_1p;
  end if;
  -- isuofia_closing_3p: tools/validation/economics/oracle_prms.py
  if abs(v_g_isuofia_closing_3p - 48.900000000000006::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 48.900000000000006, not within 5e-07 of the seeded % [graded field: advanced/isuofia_closing_3p]', v_g_isuofia_closing_3p;
  end if;
  -- isuofia_difference_2p: tools/validation/economics/oracle_prms.py
  if abs(v_g_isuofia_difference_2p - 0.2969999999999992::double precision) > 5e-07::double precision then
    raise exception 'EC11 go-live refused: the oracle gives 0.2969999999999992, not within 5e-07 of the seeded % [graded field: advanced/isuofia_difference_2p]', v_g_isuofia_difference_2p;
  end if;

  -- ------------------------------------------------------------- 4. the traps
  -- Every wrong method discriminate.mjs swept through the engine for a field,
  -- by value: each must miss the seeded value by more than the tolerance, or
  -- the field does not discriminate the trap it is for.
  v_wrong := 23.5::double precision;
  if abs(v_wrong - v_g_abagana_prospect_pc_pct) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (pc read as pg) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_prospect_pc_pct]', v_wrong, v_g_abagana_prospect_pc_pct;
  end if;
  v_wrong := 61.3::double precision;
  if abs(v_wrong - v_g_abagana_prospect_pc_pct) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (pc read as pd) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_prospect_pc_pct]', v_wrong, v_g_abagana_prospect_pc_pct;
  end if;
  v_wrong := 84.8::double precision;
  if abs(v_wrong - v_g_abagana_prospect_pc_pct) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (pg plus pd) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_prospect_pc_pct]', v_wrong, v_g_abagana_prospect_pc_pct;
  end if;
  v_wrong := 70.3945::double precision;
  if abs(v_wrong - v_g_abagana_prospect_pc_pct) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (either of the two) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_prospect_pc_pct]', v_wrong, v_g_abagana_prospect_pc_pct;
  end if;
  v_wrong := 12.25::double precision;
  if abs(v_wrong - v_g_abagana_lead_pc_pct) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (pc read as pg) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_lead_pc_pct]', v_wrong, v_g_abagana_lead_pc_pct;
  end if;
  v_wrong := 47.5::double precision;
  if abs(v_wrong - v_g_abagana_lead_pc_pct) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (pc read as pd) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_lead_pc_pct]', v_wrong, v_g_abagana_lead_pc_pct;
  end if;
  v_wrong := 59.75::double precision;
  if abs(v_wrong - v_g_abagana_lead_pc_pct) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (pg plus pd) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_lead_pc_pct]', v_wrong, v_g_abagana_lead_pc_pct;
  end if;
  v_wrong := 29.875::double precision;
  if abs(v_wrong - v_g_abagana_lead_pc_pct) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the mean of the two) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_lead_pc_pct]', v_wrong, v_g_abagana_lead_pc_pct;
  end if;
  v_wrong := 18.62::double precision;
  if abs(v_wrong - v_g_abagana_reserves_p2) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (categorize cumulative as increments) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_reserves_p2]', v_wrong, v_g_abagana_reserves_p2;
  end if;
  v_wrong := 16.064999999999998::double precision;
  if abs(v_wrong - v_g_abagana_reserves_p2) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the high less the low) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_reserves_p2]', v_wrong, v_g_abagana_reserves_p2;
  end if;
  v_wrong := 11.35::double precision;
  if abs(v_wrong - v_g_abagana_reserves_p2) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the 1p as the p2) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_reserves_p2]', v_wrong, v_g_abagana_reserves_p2;
  end if;
  v_wrong := 8.794999999999998::double precision;
  if abs(v_wrong - v_g_abagana_reserves_p2) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the high less the best) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_reserves_p2]', v_wrong, v_g_abagana_reserves_p2;
  end if;
  v_wrong := 27.415::double precision;
  if abs(v_wrong - v_g_abagana_reserves_p3) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (categorize cumulative as increments) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_reserves_p3]', v_wrong, v_g_abagana_reserves_p3;
  end if;
  v_wrong := 16.064999999999998::double precision;
  if abs(v_wrong - v_g_abagana_reserves_p3) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the high less the low) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_reserves_p3]', v_wrong, v_g_abagana_reserves_p3;
  end if;
  v_wrong := 18.62::double precision;
  if abs(v_wrong - v_g_abagana_reserves_p3) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the 2p as the p3) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_reserves_p3]', v_wrong, v_g_abagana_reserves_p3;
  end if;
  v_wrong := 7.270000000000001::double precision;
  if abs(v_wrong - v_g_abagana_reserves_p3) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the best less the low) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_reserves_p3]', v_wrong, v_g_abagana_reserves_p3;
  end if;
  v_wrong := 3.37::double precision;
  if abs(v_wrong - v_g_abagana_contingent_2c) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (categorize increments as cumulative) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_contingent_2c]', v_wrong, v_g_abagana_contingent_2c;
  end if;
  v_wrong := 3.37::double precision;
  if abs(v_wrong - v_g_abagana_contingent_2c) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the c2 alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_contingent_2c]', v_wrong, v_g_abagana_contingent_2c;
  end if;
  v_wrong := 13.190000000000001::double precision;
  if abs(v_wrong - v_g_abagana_contingent_2c) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (all three increments) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_contingent_2c]', v_wrong, v_g_abagana_contingent_2c;
  end if;
  v_wrong := 8.975000000000001::double precision;
  if abs(v_wrong - v_g_abagana_contingent_2c) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the c2 and c3) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_contingent_2c]', v_wrong, v_g_abagana_contingent_2c;
  end if;
  v_wrong := 5.605::double precision;
  if abs(v_wrong - v_g_abagana_contingent_3c) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (categorize increments as cumulative) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_contingent_3c]', v_wrong, v_g_abagana_contingent_3c;
  end if;
  v_wrong := 5.605::double precision;
  if abs(v_wrong - v_g_abagana_contingent_3c) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the c3 alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_contingent_3c]', v_wrong, v_g_abagana_contingent_3c;
  end if;
  v_wrong := 9.82::double precision;
  if abs(v_wrong - v_g_abagana_contingent_3c) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the c1 and c3) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_contingent_3c]', v_wrong, v_g_abagana_contingent_3c;
  end if;
  v_wrong := 8.975000000000001::double precision;
  if abs(v_wrong - v_g_abagana_contingent_3c) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the c2 and c3) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/abagana_contingent_3c]', v_wrong, v_g_abagana_contingent_3c;
  end if;
  v_wrong := 53211792.03346777::double precision;
  if abs(v_wrong - v_g_awkuzu_best_ncf_share) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (economic limit off in cash) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_best_ncf_share]', v_wrong, v_g_awkuzu_best_ncf_share;
  end if;
  v_wrong := 101162597.64285156::double precision;
  if abs(v_wrong - v_g_awkuzu_best_ncf_share) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (working interest not applied to cash) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_best_ncf_share]', v_wrong, v_g_awkuzu_best_ncf_share;
  end if;
  v_wrong := 73980993.64463966::double precision;
  if abs(v_wrong - v_g_awkuzu_best_ncf_share) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (no abandonment cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_best_ncf_share]', v_wrong, v_g_awkuzu_best_ncf_share;
  end if;
  v_wrong := 93788972.06613283::double precision;
  if abs(v_wrong - v_g_awkuzu_best_ncf_share) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (no tax) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_best_ncf_share]', v_wrong, v_g_awkuzu_best_ncf_share;
  end if;
  v_wrong := 46663084.238367125::double precision;
  if abs(v_wrong - v_g_awkuzu_best_ncf_share) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the npv as the net cash flow) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_best_ncf_share]', v_wrong, v_g_awkuzu_best_ncf_share;
  end if;
  v_wrong := 39989984.41511888::double precision;
  if abs(v_wrong - v_g_awkuzu_best_npv_share) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (economic limit off in cash) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_best_npv_share]', v_wrong, v_g_awkuzu_best_npv_share;
  end if;
  v_wrong := 69490505.4745256::double precision;
  if abs(v_wrong - v_g_awkuzu_best_npv_share) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (working interest not applied to cash) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_best_npv_share]', v_wrong, v_g_awkuzu_best_npv_share;
  end if;
  v_wrong := 68453787.31971447::double precision;
  if abs(v_wrong - v_g_awkuzu_best_npv_share) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (no tax) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_best_npv_share]', v_wrong, v_g_awkuzu_best_npv_share;
  end if;
  v_wrong := 58168493.64463964::double precision;
  if abs(v_wrong - v_g_awkuzu_best_npv_share) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (no discounting) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_best_npv_share]', v_wrong, v_g_awkuzu_best_npv_share;
  end if;
  v_wrong := 46663084.238367125::double precision;
  if abs(v_wrong - v_g_awkuzu_best_npv_share) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (no abandonment cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_best_npv_share]', v_wrong, v_g_awkuzu_best_npv_share;
  end if;
  v_wrong := 5326615.442968749::double precision;
  if abs(v_wrong - v_g_awkuzu_2p_net_oil) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (economic limit ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_2p_net_oil]', v_wrong, v_g_awkuzu_2p_net_oil;
  end if;
  v_wrong := 8395342.15625::double precision;
  if abs(v_wrong - v_g_awkuzu_2p_net_oil) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (working interest not applied) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_2p_net_oil]', v_wrong, v_g_awkuzu_2p_net_oil;
  end if;
  v_wrong := 5516939.13125::double precision;
  if abs(v_wrong - v_g_awkuzu_2p_net_oil) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (royalty interest not deducted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_2p_net_oil]', v_wrong, v_g_awkuzu_2p_net_oil;
  end if;
  v_wrong := 5516939.13125::double precision;
  if abs(v_wrong - v_g_awkuzu_2p_net_oil) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the working interest basis) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_2p_net_oil]', v_wrong, v_g_awkuzu_2p_net_oil;
  end if;
  v_wrong := 9594676.75::double precision;
  if abs(v_wrong - v_g_awkuzu_2p_net_oil) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the gross basis) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_2p_net_oil]', v_wrong, v_g_awkuzu_2p_net_oil;
  end if;
  v_wrong := 3222888.3358072913::double precision;
  if abs(v_wrong - v_g_awkuzu_p2_boe) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (low kept when failing) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_p2_boe]', v_wrong, v_g_awkuzu_p2_boe;
  end if;
  v_wrong := 5903665.458723958::double precision;
  if abs(v_wrong - v_g_awkuzu_p2_boe) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (economic limit ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_p2_boe]', v_wrong, v_g_awkuzu_p2_boe;
  end if;
  v_wrong := 9304837.536458334::double precision;
  if abs(v_wrong - v_g_awkuzu_p2_boe) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (working interest not applied) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_p2_boe]', v_wrong, v_g_awkuzu_p2_boe;
  end if;
  v_wrong := 6114607.523958333::double precision;
  if abs(v_wrong - v_g_awkuzu_p2_boe) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (royalty interest not deducted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_p2_boe]', v_wrong, v_g_awkuzu_p2_boe;
  end if;
  v_wrong := 4827321.739843749::double precision;
  if abs(v_wrong - v_g_awkuzu_p2_boe) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (boe without gas) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_p2_boe]', v_wrong, v_g_awkuzu_p2_boe;
  end if;
  v_wrong := 23653876.110156246::double precision;
  if abs(v_wrong - v_g_awkuzu_p2_boe) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (boe factor inverted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_p2_boe]', v_wrong, v_g_awkuzu_p2_boe;
  end if;
  v_wrong := 8900004.929557292::double precision;
  if abs(v_wrong - v_g_awkuzu_p3_boe) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (economic increments as cumulative) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_p3_boe]', v_wrong, v_g_awkuzu_p3_boe;
  end if;
  v_wrong := 2996339.470833333::double precision;
  if abs(v_wrong - v_g_awkuzu_p3_boe) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (economic limit ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_p3_boe]', v_wrong, v_g_awkuzu_p3_boe;
  end if;
  v_wrong := 4371742.471614584::double precision;
  if abs(v_wrong - v_g_awkuzu_p3_boe) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (licence ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_p3_boe]', v_wrong, v_g_awkuzu_p3_boe;
  end if;
  v_wrong := 6173431.90625::double precision;
  if abs(v_wrong - v_g_awkuzu_p3_boe) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (working interest not applied) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_p3_boe]', v_wrong, v_g_awkuzu_p3_boe;
  end if;
  v_wrong := 4056826.68125::double precision;
  if abs(v_wrong - v_g_awkuzu_p3_boe) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (royalty interest not deducted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_p3_boe]', v_wrong, v_g_awkuzu_p3_boe;
  end if;
  v_wrong := 3202757.90625::double precision;
  if abs(v_wrong - v_g_awkuzu_p3_boe) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (boe without gas) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_p3_boe]', v_wrong, v_g_awkuzu_p3_boe;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_awkuzu_high_beyond_licence_oil) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (licence ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_high_beyond_licence_oil]', v_wrong, v_g_awkuzu_high_beyond_licence_oil;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_awkuzu_high_beyond_licence_oil) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (renewal expected) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_high_beyond_licence_oil]', v_wrong, v_g_awkuzu_high_beyond_licence_oil;
  end if;
  v_wrong := 2078528.75::double precision;
  if abs(v_wrong - v_g_awkuzu_high_beyond_licence_oil) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the expiry year counted as beyond) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_high_beyond_licence_oil]', v_wrong, v_g_awkuzu_high_beyond_licence_oil;
  end if;
  v_wrong := 741671.4046875::double precision;
  if abs(v_wrong - v_g_awkuzu_high_beyond_licence_oil) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the net entitlement of it) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/awkuzu_high_beyond_licence_oil]', v_wrong, v_g_awkuzu_high_beyond_licence_oil;
  end if;
  v_wrong := 17.405848075811626::double precision;
  if abs(v_wrong - v_g_isuofia_reserves_arith_1p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (lognormal low high swapped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_reserves_arith_1p]', v_wrong, v_g_isuofia_reserves_arith_1p;
  end if;
  v_wrong := 14.33767412209731::double precision;
  if abs(v_wrong - v_g_isuofia_reserves_arith_1p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (normal low high swapped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_reserves_arith_1p]', v_wrong, v_g_isuofia_reserves_arith_1p;
  end if;
  v_wrong := 14.503951727027694::double precision;
  if abs(v_wrong - v_g_isuofia_reserves_arith_1p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (triangular low high swapped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_reserves_arith_1p]', v_wrong, v_g_isuofia_reserves_arith_1p;
  end if;
  v_wrong := 11.29137988557427::double precision;
  if abs(v_wrong - v_g_isuofia_reserves_arith_1p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (triangular min mode max) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_reserves_arith_1p]', v_wrong, v_g_isuofia_reserves_arith_1p;
  end if;
  v_wrong := 16.82::double precision;
  if abs(v_wrong - v_g_isuofia_reserves_arith_1p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the sum of the means) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_reserves_arith_1p]', v_wrong, v_g_isuofia_reserves_arith_1p;
  end if;
  v_wrong := 16.7338514510753::double precision;
  if abs(v_wrong - v_g_isuofia_reserves_arith_3p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (lognormal low high swapped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_reserves_arith_3p]', v_wrong, v_g_isuofia_reserves_arith_3p;
  end if;
  v_wrong := 19.802025404789617::double precision;
  if abs(v_wrong - v_g_isuofia_reserves_arith_3p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (normal low high swapped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_reserves_arith_3p]', v_wrong, v_g_isuofia_reserves_arith_3p;
  end if;
  v_wrong := 19.63574779985923::double precision;
  if abs(v_wrong - v_g_isuofia_reserves_arith_3p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (triangular low high swapped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_reserves_arith_3p]', v_wrong, v_g_isuofia_reserves_arith_3p;
  end if;
  v_wrong := 23.119353287383802::double precision;
  if abs(v_wrong - v_g_isuofia_reserves_arith_3p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (triangular min mode max) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_reserves_arith_3p]', v_wrong, v_g_isuofia_reserves_arith_3p;
  end if;
  v_wrong := 16.82::double precision;
  if abs(v_wrong - v_g_isuofia_reserves_arith_3p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the sum of the means) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_reserves_arith_3p]', v_wrong, v_g_isuofia_reserves_arith_3p;
  end if;
  v_wrong := 11.899999999999999::double precision;
  if abs(v_wrong - v_g_isuofia_contingent_risked_mean) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (risked mean without chance) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_contingent_risked_mean]', v_wrong, v_g_isuofia_contingent_risked_mean;
  end if;
  v_wrong := 6.0359645761571175::double precision;
  if abs(v_wrong - v_g_isuofia_contingent_risked_mean) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (risked mean on best) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_contingent_risked_mean]', v_wrong, v_g_isuofia_contingent_risked_mean;
  end if;
  v_wrong := 6.550949999999999::double precision;
  if abs(v_wrong - v_g_isuofia_contingent_risked_mean) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the mean chance times the sum of means) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_contingent_risked_mean]', v_wrong, v_g_isuofia_contingent_risked_mean;
  end if;
  v_wrong := 4.064256812406647::double precision;
  if abs(v_wrong - v_g_isuofia_contingent_risked_mean) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (chance times the low estimate) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_contingent_risked_mean]', v_wrong, v_g_isuofia_contingent_risked_mean;
  end if;
  v_wrong := 29.92::double precision;
  if abs(v_wrong - v_g_isuofia_closing_1p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (production added) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_closing_1p]', v_wrong, v_g_isuofia_closing_1p;
  end if;
  v_wrong := 26.82::double precision;
  if abs(v_wrong - v_g_isuofia_closing_1p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (divestments added) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_closing_1p]', v_wrong, v_g_isuofia_closing_1p;
  end if;
  v_wrong := 27.57::double precision;
  if abs(v_wrong - v_g_isuofia_closing_1p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (production from best only) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_closing_1p]', v_wrong, v_g_isuofia_closing_1p;
  end if;
  v_wrong := 24.799999999999997::double precision;
  if abs(v_wrong - v_g_isuofia_closing_1p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the revisions left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_closing_1p]', v_wrong, v_g_isuofia_closing_1p;
  end if;
  v_wrong := 23.02::double precision;
  if abs(v_wrong - v_g_isuofia_closing_1p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the transfers left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_closing_1p]', v_wrong, v_g_isuofia_closing_1p;
  end if;
  v_wrong := 53.60000000000001::double precision;
  if abs(v_wrong - v_g_isuofia_closing_3p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (production added) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_closing_3p]', v_wrong, v_g_isuofia_closing_3p;
  end if;
  v_wrong := 51.80000000000001::double precision;
  if abs(v_wrong - v_g_isuofia_closing_3p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (divestments added) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_closing_3p]', v_wrong, v_g_isuofia_closing_3p;
  end if;
  v_wrong := 51.25000000000001::double precision;
  if abs(v_wrong - v_g_isuofia_closing_3p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (production from best only) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_closing_3p]', v_wrong, v_g_isuofia_closing_3p;
  end if;
  v_wrong := 49.95::double precision;
  if abs(v_wrong - v_g_isuofia_closing_3p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the revisions left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_closing_3p]', v_wrong, v_g_isuofia_closing_3p;
  end if;
  v_wrong := 44.300000000000004::double precision;
  if abs(v_wrong - v_g_isuofia_closing_3p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the transfers left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_closing_3p]', v_wrong, v_g_isuofia_closing_3p;
  end if;
  v_wrong := -4.402999999999999::double precision;
  if abs(v_wrong - v_g_isuofia_difference_2p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (production added) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_difference_2p]', v_wrong, v_g_isuofia_difference_2p;
  end if;
  v_wrong := -1.9030000000000058::double precision;
  if abs(v_wrong - v_g_isuofia_difference_2p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (divestments added) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_difference_2p]', v_wrong, v_g_isuofia_difference_2p;
  end if;
  v_wrong := -0.012999999999998124::double precision;
  if abs(v_wrong - v_g_isuofia_difference_2p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the revisions left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_difference_2p]', v_wrong, v_g_isuofia_difference_2p;
  end if;
  v_wrong := -0.29699999999999704::double precision;
  if abs(v_wrong - v_g_isuofia_difference_2p) <= 5e-07::double precision then
    raise exception 'EC11 go-live refused: the trap (the computed less the stated) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuofia_difference_2p]', v_wrong, v_g_isuofia_difference_2p;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'prms';
  if not exists (select 1 from public.academy_apps where slug = 'prms' and status = 'available') then
    raise exception 'EC11 go-live refused: prms did not reach status available';
  end if;
  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon from public.academy_apps;
  raise notice 'EC11 go-live: prms available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
