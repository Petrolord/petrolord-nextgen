-- ============================================================================
-- SC3 GO-LIVE (HELD): Materials, Spares & Inventory Management flips to
-- 'available' in the Supply Chain module, at path_order 77.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/materials. The 78 lessons, the teaching lab
-- (materialsLab.js), its three calculator panels (register, stock and spares)
-- and the three capstone case files ship in the ZIP and NOT in this database,
-- so a flip before the upload puts a live catalogue tile in front of a route
-- that does not exist. AN APP COURSE: the Suite app is the Materials & Spares
-- Planner (Suite #740, its tile migrations held for the owner separately), and
-- the course's own calculator panels carry every practical, so this go-live
-- waits on the NextGen upload only and reads nothing of the Suite. This file
-- is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values materials_capstone.mjs returned
--      through the vendored engines/supplychain/inventory.js (petrolord-engines
--      110f0a0) when this file was generated, to the last bit;
--   2. by a SECOND ROUTE IN SQL: the stated arithmetic rebuilt in plpgsql over
--      the case files the learner is handed; each to 1e-9 relative;
--   3. by the ORACLE: oracle_check.py's run of the vendored stdlib Python
--      oracle (tools/validation/supplychain/oracle_inventory.py), written in by
--      value, each seeded value within its tolerance of the oracle's;
--   4. by the TRAPS the course is built on: every wrong method
--      discriminate.mjs swept through the engine for a field, written in by
--      value, must miss the seeded value by more than the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
--
-- NO BEGIN OR COMMIT. Like every course migration in this repository, the
-- file carries no transaction lines of its own; apply_sc3_materials.sh wraps it
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
-- SC3 value from the stated inputs of the case files, in SQL, with no engine
-- code and none of the engine's numerics: the weighted criticality score (the
-- sum of weight x score / scoreMax); the cumulative share of annual usage value
-- with an item included (ranked highest value first, ties by id); the Harris
-- EOQ sqrt(2 A D / h) with h = holdingRate x unitCost, the quantity ordered
-- under the stated rounding rule, the relevant cost A D / Q + h Q / 2 at it and
-- the penalty against sqrt(2 A D h); the total write-down of a register by the
-- stated months-since-last-issue bands (a band reached at or above its
-- minimum); the quantity-discount order (all-units or incremental, each band's
-- EOQ, the lowest total cost with ties to the smaller quantity); the normal
-- safety stock, safety factor and level over the protection period, with the
-- normal CDF summed as its Taylor series and Phi^-1 and the fill-rate k found
-- by plain bisection (the engine uses Wichura AS241 and the incomplete gamma);
-- the Poisson units short E[(X - s)+] in closed form, m - s + sum over x <= s
-- of (s - x) p(x) (the engine uses the loss recursion), with the level the
-- smallest meeting the target; and the one-for-one insurance spares (holding
-- n x unitCost x holdingRate plus E[(X - n)+] x daysPerYear x downtime cost
-- a day, the cheapest n from 0 to maxSpares with ties to fewer; no shortage
-- P(X <= n); fill rate P(X <= n - 1)). Every number is a double precision.

-- A number out of a jsonb value, read through its text (the double JSON.parse gives).
create or replace function pg_temp.sc3_n(v jsonb) returns double precision
language sql immutable as $f$
  select case when v is null or jsonb_typeof(v) = 'null' then null else (v #>> '{}')::double precision end
$f$;

-- A figure at 12 significant digits, the engine's stated comparison.
create or replace function pg_temp.sc3_k12(x double precision) returns double precision
language sql immutable as $f$
  select case when x = 0 then 0::double precision
              else round(x::numeric, (11 - floor(log(abs(x)::numeric)))::int)::double precision end
$f$;

-- The weighted criticality score of one item: sum of weight x score / scoreMax.
create or replace function pg_temp.sc3_crit(c jsonb, item text) returns double precision
language sql immutable as $f$
  select sum(pg_temp.sc3_n(cr->'weight') * pg_temp.sc3_n(it->'scores'->(cr->>'id')) / pg_temp.sc3_n(c->'scoreMax'))
    from jsonb_array_elements(c->'items') it, jsonb_array_elements(c->'criteria') cr
   where it->>'id' = item
$f$;

-- The cumulative share (percent) of annual usage value with the item included,
-- ranked highest value first, ties by id.
create or replace function pg_temp.sc3_abc_cum(c jsonb, item text) returns double precision
language sql immutable as $f$
  with v as (
    select it->>'id' as id, pg_temp.sc3_n(it->'annualUsage') * pg_temp.sc3_n(it->'unitCost') as val
      from jsonb_array_elements(c->'items') it),
  r as (
    select id, 100.0::double precision * sum(val) over (order by pg_temp.sc3_k12(val) desc, id asc
                                                         rows between unbounded preceding and current row)
               / (select sum(val) from v) as cum
      from v)
  select cum from r where id = item
$f$;

-- A quantity under a stated rounding rule: none, up, down, nearest (halves upward).
create or replace function pg_temp.sc3_round(x double precision, r jsonb) returns double precision
language plpgsql immutable as $f$
declare
  m double precision; q double precision;
begin
  if r->>'rule' = 'none' then return x; end if;
  m := pg_temp.sc3_n(r->'multiple');
  q := pg_temp.sc3_k12(x / m);
  if r->>'rule' = 'up' then return ceil(q) * m; end if;
  if r->>'rule' = 'down' then return floor(q) * m; end if;
  if r->>'rule' = 'nearest' then return floor(q + 0.5) * m; end if;
  raise exception 'sc3_round: an unstated rounding rule %', r->>'rule';
end
$f$;

-- The EOQ, the relevant cost at the quantity ordered, or the rounding penalty in percent.
create or replace function pg_temp.sc3_eoq(c jsonb, what text) returns double precision
language plpgsql immutable as $f$
declare
  a double precision := pg_temp.sc3_n(c->'orderCost');
  d double precision := pg_temp.sc3_n(c->'annualDemand');
  h double precision := pg_temp.sc3_n(c->'holdingRate') * pg_temp.sc3_n(c->'unitCost');
  q double precision; qr double precision; rc double precision; opt double precision;
begin
  q := sqrt(2.0 * a * d / h);
  if what = 'eoq' then return q; end if;
  qr := pg_temp.sc3_round(q, c->'rounding');
  rc := a * d / qr + h * qr / 2.0;
  if what = 'cost' then return rc; end if;
  opt := sqrt(2.0 * a * d * h);
  if what = 'penalty' then return 100.0 * (rc - opt) / opt; end if;
  raise exception 'sc3_eoq: unknown figure %', what;
end
$f$;

-- The total write-down of a register: each item in the last band whose minimum
-- its months since the last issue reach, written down that band's percentage.
create or replace function pg_temp.sc3_write_down(c jsonb) returns double precision
language sql immutable as $f$
  select sum(pg_temp.sc3_n(it->'onHand') * pg_temp.sc3_n(it->'unitCost') *
             (select pg_temp.sc3_n(b->'writeDownPct') from jsonb_array_elements(c->'bands') with ordinality bb(b, i)
               where pg_temp.sc3_k12(pg_temp.sc3_n(it->'monthsSinceLastIssue')) >= pg_temp.sc3_k12(pg_temp.sc3_n(b->'minMonths'))
               order by i desc limit 1) / 100.0)
    from jsonb_array_elements(c->'items') it
$f$;

-- The quantity-discount order: 'quantity' or 'total' (the total cost a year).
create or replace function pg_temp.sc3_disc(c jsonb, what text) returns double precision
language plpgsql immutable as $f$
declare
  a double precision := pg_temp.sc3_n(c->'orderCost');
  d double precision := pg_temp.sc3_n(c->'annualDemand');
  r double precision := pg_temp.sc3_n(c->'holdingRate');
  allunits boolean := c->>'discountType' = 'all-units';
  nb int := jsonb_array_length(c->'breaks');
  lo double precision[]; v double precision[]; fx double precision[];
  i int; j int; q double precision; hi double precision; cand double precision;
  lot double precision; tc double precision;
  best_q double precision := null; best_tc double precision := null;
begin
  for i in 1..nb loop
    lo[i] := pg_temp.sc3_n(c->'breaks'->(i - 1)->'minQuantity');
    v[i] := pg_temp.sc3_n(c->'breaks'->(i - 1)->'unitPrice');
    fx[i] := case when i = 1 then 0.0 else fx[i - 1] + (v[i - 1] - v[i]) * lo[i] end;
  end loop;
  for i in 1..nb loop
    q := sqrt(2.0 * d * (a + case when allunits then 0.0 else fx[i] end) / (r * v[i]));
    hi := case when i < nb then lo[i + 1] else null end;
    cand := null;
    if q >= lo[i] and (hi is null or q < hi) then
      cand := pg_temp.sc3_round(q, c->'rounding');
    elsif allunits and q < lo[i] then
      cand := lo[i];
    end if;
    if cand is not null then
      j := 1;
      while j < nb and cand >= lo[j + 1] loop j := j + 1; end loop;
      lot := case when allunits then v[j] * cand else fx[j] + v[j] * cand end;
      tc := d * lot / cand + a * d / cand + r * lot / 2.0;
      if best_tc is null or pg_temp.sc3_k12(tc) < pg_temp.sc3_k12(best_tc)
         or (pg_temp.sc3_k12(tc) = pg_temp.sc3_k12(best_tc) and cand < best_q) then
        best_q := cand; best_tc := tc;
      end if;
    end if;
  end loop;
  if what = 'quantity' then return best_q; end if;
  if what = 'total' then return best_tc; end if;
  raise exception 'sc3_disc: unknown figure %', what;
end
$f$;

-- The standard normal density and CDF; the CDF as 0.5 + phi(x) times the
-- Taylor series x + x^3/3 + x^5/(3 x 5) + ... summed to the last term that counts.
create or replace function pg_temp.sc3_pdf(x double precision) returns double precision
language sql immutable as $f$
  select exp(-x * x / 2.0) / sqrt(2.0 * pi())
$f$;

create or replace function pg_temp.sc3_cdf(x double precision) returns double precision
language plpgsql immutable as $f$
declare
  s double precision := x; t double precision := x; i int := 1;
begin
  if x > 9.0 then return 1.0; end if;
  if x < -9.0 then return 0.0; end if;
  loop
    t := t * x * x / (2 * i + 1)::double precision;
    s := s + t;
    exit when abs(t) <= 1e-18 * abs(s) or i > 2000;
    i := i + 1;
  end loop;
  return 0.5 + pg_temp.sc3_pdf(x) * s;
end
$f$;

-- The unit normal loss G(k) = phi(k) - k (1 - Phi(k)).
create or replace function pg_temp.sc3_loss(k double precision) returns double precision
language sql immutable as $f$
  select pg_temp.sc3_pdf(k) - k * (1.0 - pg_temp.sc3_cdf(k))
$f$;

-- Phi^-1(p) by bisection on the CDF.
create or replace function pg_temp.sc3_invnorm(p double precision) returns double precision
language plpgsql immutable as $f$
declare
  lo double precision := -9.0; hi double precision := 9.0; mid double precision; i int;
begin
  for i in 1..400 loop
    mid := (lo + hi) / 2.0;
    exit when mid = lo or mid = hi;
    if pg_temp.sc3_cdf(mid) < p then lo := mid; else hi := mid; end if;
  end loop;
  return hi;
end
$f$;

-- The smallest k with G(k) at or below t, by bisection (G falls strictly).
create or replace function pg_temp.sc3_solve_loss(t double precision) returns double precision
language plpgsql immutable as $f$
declare
  lo double precision := -9.0; hi double precision := 9.0; mid double precision; i int;
begin
  for i in 1..400 loop
    mid := (lo + hi) / 2.0;
    exit when mid = lo or mid = hi;
    if pg_temp.sc3_loss(mid) > t then lo := mid; else hi := mid; end if;
  end loop;
  return hi;
end
$f$;

-- Normal safety stock over the protection period P = leadTime + reviewPeriod:
-- 'k' (the exact safety factor), 'safety' (k x sigma) or 'level' (d P + k sigma).
create or replace function pg_temp.sc3_ss(c jsonb, what text) returns double precision
language plpgsql immutable as $f$
declare
  d double precision := pg_temp.sc3_n(c->'demandMean');
  sd double precision := pg_temp.sc3_n(c->'demandSd');
  p double precision := pg_temp.sc3_n(c->'leadTime') + pg_temp.sc3_n(c->'reviewPeriod');
  sdl double precision := pg_temp.sc3_n(c->'leadTimeSd');
  lvl double precision := pg_temp.sc3_n(c->'serviceLevel');
  sigma double precision; kx double precision; k double precision; mn double precision;
begin
  sigma := sqrt(p * sd * sd + d * d * sdl * sdl);
  if c->>'serviceMeasure' = 'cycle-service' then
    kx := pg_temp.sc3_invnorm(lvl);
  else
    kx := pg_temp.sc3_solve_loss(pg_temp.sc3_n(c->'orderQuantity') * (1.0 - lvl) / sigma);
  end if;
  if what = 'k' then return kx; end if;
  k := kx;
  if c->'safetyFactorRounding'->>'rule' = 'nearest' then
    k := round(kx::numeric, (c->'safetyFactorRounding'->>'decimals')::int)::double precision;
  end if;
  mn := pg_temp.sc3_n(c->'minimumSafetyFactor');
  if mn is not null and k < mn then k := mn; end if;
  if what = 'safety' then return k * sigma; end if;
  if what = 'level' then return d * p + k * sigma; end if;
  raise exception 'sc3_ss: unknown figure %', what;
end
$f$;

-- Poisson(m): P(X <= s) and the units short E[(X - s)+] in closed form,
-- m - s + sum over x <= s of (s - x) p(x).
create or replace function pg_temp.sc3_pcum(m double precision, s int) returns double precision
language plpgsql immutable as $f$
declare
  p double precision := exp(-m); f double precision := 0.0; x int;
begin
  if s < 0 then return 0.0; end if;
  for x in 0..s loop
    if x > 0 then p := p * m / x::double precision; end if;
    f := f + p;
  end loop;
  return f;
end
$f$;

create or replace function pg_temp.sc3_pshort(m double precision, s int) returns double precision
language plpgsql immutable as $f$
declare
  p double precision := exp(-m); acc double precision := 0.0; x int;
begin
  for x in 0..s loop
    if x > 0 then p := p * m / x::double precision; end if;
    acc := acc + (s - x)::double precision * p;
  end loop;
  return m - s::double precision + acc;
end
$f$;

-- The Poisson stock for a slow mover: 'short' (units short a cycle at the
-- level chosen) or 'fill' (1 - short / orderQuantity).
create or replace function pg_temp.sc3_pois(c jsonb, what text) returns double precision
language plpgsql immutable as $f$
declare
  m double precision := pg_temp.sc3_n(c->'demandRate') * (pg_temp.sc3_n(c->'leadTime') + pg_temp.sc3_n(c->'reviewPeriod'));
  lvl double precision := pg_temp.sc3_n(c->'serviceLevel');
  qo double precision := pg_temp.sc3_n(c->'orderQuantity');
  s int := 0; sh double precision;
begin
  loop
    sh := pg_temp.sc3_pshort(m, s);
    if c->>'serviceMeasure' = 'cycle-service' then
      exit when pg_temp.sc3_k12(pg_temp.sc3_pcum(m, s)) >= pg_temp.sc3_k12(lvl);
    else
      exit when pg_temp.sc3_k12(sh) <= pg_temp.sc3_k12(qo * (1.0 - lvl));
    end if;
    s := s + 1;
    if s > 10000 then raise exception 'sc3_pois: no level meets the target'; end if;
  end loop;
  if what = 'short' then return sh; end if;
  if what = 'fill' then return 1.0 - sh / qo; end if;
  raise exception 'sc3_pois: unknown figure %', what;
end
$f$;

-- Insurance spares, one for one: at the cheapest n from 0 to maxSpares (ties
-- to fewer), 'total', 'downtime', 'noshort' P(X <= n) or 'fill' P(X <= n - 1).
create or replace function pg_temp.sc3_spares(c jsonb, what text) returns double precision
language plpgsql immutable as $f$
declare
  days double precision := pg_temp.sc3_n(c->'daysPerYear');
  m double precision := pg_temp.sc3_n(c->'failuresPerYear') * pg_temp.sc3_n(c->'leadTimeDays') / days;
  hold double precision := pg_temp.sc3_n(c->'unitCost') * pg_temp.sc3_n(c->'holdingRate');
  dc double precision := pg_temp.sc3_n(c->'downtimeCostPerDay');
  mx int := (c->>'maxSpares')::int;
  n int; down double precision; tc double precision;
  best int := null; best_tc double precision; best_down double precision;
begin
  for n in 0..mx loop
    down := pg_temp.sc3_pshort(m, n) * days * dc;
    tc := n::double precision * hold + down;
    if best is null or pg_temp.sc3_k12(tc) < pg_temp.sc3_k12(best_tc) then
      best := n; best_tc := tc; best_down := down;
    end if;
  end loop;
  if what = 'total' then return best_tc; end if;
  if what = 'downtime' then return best_down; end if;
  if what = 'noshort' then return pg_temp.sc3_pcum(m, best); end if;
  if what = 'fill' then return pg_temp.sc3_pcum(m, best - 1); end if;
  raise exception 'sc3_spares: unknown figure %', what;
end
$f$;

do $$
#variable_conflict use_column
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_s double precision; v_wrong double precision;
  v_g_igbariam_trim_weighted_score double precision;
  v_g_igbariam_inhibitor_cumulative_pct double precision;
  v_g_igbariam_inhibitor_eoq double precision;
  v_g_igbariam_inhibitor_relevant_cost double precision;
  v_g_igbariam_inhibitor_rounding_penalty_pct double precision;
  v_g_igbariam_total_write_down double precision;
  v_g_ogidi_tubing_discount_quantity double precision;
  v_g_ogidi_tubing_discount_total_cost double precision;
  v_g_ogidi_filter_csl_safety_stock double precision;
  v_g_ogidi_filter_fill_rate_k double precision;
  v_g_ogidi_filter_periodic_level double precision;
  v_g_ogidi_kit_poisson_short double precision;
  v_g_umuchu_motor_total_cost double precision;
  v_g_umuchu_motor_downtime_cost double precision;
  v_g_umuchu_motor_no_shortage double precision;
  v_g_umuchu_motor_fill_rate double precision;
  v_g_umuchu_seal_poisson_short double precision;
  v_g_umuchu_seal_poisson_fill_rate double precision;
  v_case_b jsonb := '{"dataset":"IGBARIAM (synthetic)","label":"IGBARIAM, the materials register of the Igbariam flow station (synthetic)","criticality":{"criteria":[{"id":"safety","label":"Consequence of failure for people and the environment","weight":35},{"id":"production","label":"Consequence of failure for oil throughput","weight":30},{"id":"leadTime","label":"Replacement lead time","weight":20},{"id":"redundancy","label":"Lack of an installed standby","weight":15}],"scoreMax":4,"items":[{"id":"IGB-P101","name":"Crude transfer pump seal kit (synthetic)","scores":{"safety":3,"production":4,"leadTime":3,"redundancy":1}},{"id":"IGB-V204","name":"Separator level control valve trim (synthetic)","scores":{"safety":2,"production":3,"leadTime":3,"redundancy":3}},{"id":"IGB-E310","name":"Flare igniter module (synthetic)","scores":{"safety":4,"production":1,"leadTime":2,"redundancy":2}},{"id":"IGB-F412","name":"Instrument air dryer cartridge (synthetic)","scores":{"safety":1,"production":2,"leadTime":1,"redundancy":3}}],"classes":[{"label":"V","minScore":72},{"label":"E","minScore":45},{"label":"D","minScore":0}],"topClassOnMaxScore":["safety"]},"abcClassification":{"items":[{"id":"IGB-P101","name":"Crude transfer pump seal kit (synthetic)","annualUsage":14,"unitCost":3625},{"id":"IGB-V204","name":"Separator level control valve trim (synthetic)","annualUsage":6,"unitCost":8740},{"id":"IGB-E310","name":"Flare igniter module (synthetic)","annualUsage":3,"unitCost":5210},{"id":"IGB-F412","name":"Instrument air dryer cartridge (synthetic)","annualUsage":48,"unitCost":187.5},{"id":"IGB-C515","name":"Corrosion inhibitor, drum (synthetic)","annualUsage":130,"unitCost":212},{"id":"IGB-G618","name":"Glycol top-up, pail (synthetic)","annualUsage":75,"unitCost":46.8},{"id":"IGB-H721","name":"Hydraulic hose assembly (synthetic)","annualUsage":22,"unitCost":158},{"id":"IGB-K824","name":"Gauge glass kit (synthetic)","annualUsage":9,"unitCost":94.25}],"cutoffs":{"aPct":75,"bPct":92},"boundaryRule":"at-or-below"},"eoq":{"annualDemand":130,"orderCost":1450,"unitCost":212,"holdingRate":0.24,"rounding":{"rule":"up","multiple":6}},"slowMoving":{"items":[{"id":"IGB-P101","name":"Crude transfer pump seal kit (synthetic)","onHand":5,"unitCost":3625,"monthsSinceLastIssue":2.5,"monthlyUsage":1.1667},{"id":"IGB-V204","name":"Separator level control valve trim (synthetic)","onHand":3,"unitCost":8740,"monthsSinceLastIssue":10.5,"monthlyUsage":0.5},{"id":"IGB-E310","name":"Flare igniter module (synthetic)","onHand":4,"unitCost":5210,"monthsSinceLastIssue":21,"monthlyUsage":0.25},{"id":"IGB-M927","name":"Superseded meter prover seal set (synthetic)","onHand":7,"unitCost":1387.35,"monthsSinceLastIssue":33.5,"monthlyUsage":0}],"bands":[{"label":"active","minMonths":0,"writeDownPct":0},{"label":"slow","minMonths":9,"writeDownPct":20},{"label":"very slow","minMonths":18,"writeDownPct":45},{"label":"obsolete","minMonths":30,"writeDownPct":100}],"excessCoverMonths":18}}'::jsonb;
  v_case_i jsonb := '{"dataset":"OGIDI (synthetic)","label":"OGIDI, the stock policy of the Ogidi field (synthetic)","quantityDiscount":{"annualDemand":420,"orderCost":2650,"holdingRate":0.22,"breaks":[{"minQuantity":0,"unitPrice":318},{"minQuantity":100,"unitPrice":296.5},{"minQuantity":250,"unitPrice":281.25}],"discountType":"incremental","rounding":{"rule":"none"}},"safetyStock:cycle-service":{"demandMean":11.5,"demandSd":4.2,"leadTime":1.75,"leadTimeSd":0.35,"reviewPeriod":0,"serviceMeasure":"cycle-service","serviceLevel":0.975,"safetyFactorRounding":{"rule":"none"},"minimumSafetyFactor":0,"rounding":{"rule":"none"}},"safetyStock:fill-rate":{"demandMean":11.5,"demandSd":4.2,"leadTime":1.75,"leadTimeSd":0.35,"reviewPeriod":0,"serviceMeasure":"fill-rate","serviceLevel":0.985,"orderQuantity":46,"safetyFactorRounding":{"rule":"none"},"minimumSafetyFactor":0,"rounding":{"rule":"none"}},"safetyStock:periodic":{"demandMean":11.5,"demandSd":4.2,"leadTime":1.75,"leadTimeSd":0,"reviewPeriod":1,"serviceMeasure":"cycle-service","serviceLevel":0.95,"safetyFactorRounding":{"rule":"none"},"minimumSafetyFactor":0,"rounding":{"rule":"none"}},"poissonStock":{"demandRate":0.35,"leadTime":3.5,"reviewPeriod":1,"serviceMeasure":"fill-rate","serviceLevel":0.97,"orderQuantity":2}}'::jsonb;
  v_case_a jsonb := '{"dataset":"UMUCHU (synthetic)","label":"UMUCHU, the spares of the Umuchu compressor station (synthetic)","insuranceSpares":{"failuresPerYear":3.25,"leadTimeDays":120,"daysPerYear":365,"unitCost":142500,"holdingRate":0.18,"downtimeCostPerDay":24750,"maxSpares":8},"poissonStock":{"demandRate":0.185,"leadTime":5,"reviewPeriod":2,"serviceMeasure":"fill-rate","serviceLevel":0.99,"orderQuantity":3},"leadTimeRisk":{"demandPerDay":{"min":0.004,"mode":0.0065,"max":0.011},"leadTimeDays":{"min":95,"mode":140,"max":235},"reorderPoint":2,"serviceLevel":0.98,"iterations":20000,"seed":20291114}}'::jsonb;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'materials' and active;
  if v_structures <> 3 then
    raise exception 'SC3 go-live refused: materials has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'materials';
  if v_questions <> 396 then
    raise exception 'SC3 go-live refused: materials has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'materials' group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'SC3 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;
  select count(*) into v_n from (select tier, module_key from public.academy_quiz_questions where app_slug = 'materials' and scope = 'module' group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'SC3 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'materials' and scope = 'final' group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'SC3 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = 'materials'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'SC3 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;
  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'materials' and s.active;
  if v_lessons <> 78 then
    raise exception 'SC3 go-live refused: materials carries % lesson keys, expected 78', v_lessons;
  end if;
  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'materials' and s.active;
  if v_modules <> 18 then
    raise exception 'SC3 go-live refused: materials carries % modules, expected 18 (six per tier)', v_modules;
  end if;
  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'materials' and qq.scope = 'module' and not exists (
       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'SC3 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'materials';
  if v_capstones <> 3 then
    raise exception 'SC3 go-live refused: materials has % capstones, expected 3', v_capstones;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'materials';
  if v_graded <> 18 then
    raise exception 'SC3 go-live refused: materials has % graded capstone fields, expected 18', v_graded;
  end if;
  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'materials' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'SC3 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'materials' and module = 'supply_chain' and path_order = 77 and prereq_slug is null) then
    raise exception 'SC3 go-live refused: the materials catalogue row is not supply_chain at path_order 77 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 77 and slug <> 'materials') then
    raise exception 'SC3 go-live refused: another course already holds path_order 77';
  end if;

  -- ------------------------------------------------- the grader is numeric
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or abs((f->>'expected')::numeric) <= 0.001
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric is distinct from (select t.tol from (values ('beginner', 'igbariam_trim_weighted_score', 5e-07::numeric), ('beginner', 'igbariam_inhibitor_cumulative_pct', 5e-07::numeric), ('beginner', 'igbariam_inhibitor_eoq', 5e-07::numeric), ('beginner', 'igbariam_inhibitor_relevant_cost', 5e-07::numeric), ('beginner', 'igbariam_inhibitor_rounding_penalty_pct', 5e-07::numeric), ('beginner', 'igbariam_total_write_down', 5e-07::numeric), ('intermediate', 'ogidi_tubing_discount_quantity', 5e-07::numeric), ('intermediate', 'ogidi_tubing_discount_total_cost', 5e-07::numeric), ('intermediate', 'ogidi_filter_csl_safety_stock', 5e-07::numeric), ('intermediate', 'ogidi_filter_fill_rate_k', 5e-07::numeric), ('intermediate', 'ogidi_filter_periodic_level', 5e-07::numeric), ('intermediate', 'ogidi_kit_poisson_short', 5e-07::numeric), ('advanced', 'umuchu_motor_total_cost', 5e-07::numeric), ('advanced', 'umuchu_motor_downtime_cost', 5e-07::numeric), ('advanced', 'umuchu_motor_no_shortage', 5e-07::numeric), ('advanced', 'umuchu_motor_fill_rate', 5e-07::numeric), ('advanced', 'umuchu_seal_poisson_short', 5e-07::numeric), ('advanced', 'umuchu_seal_poisson_fill_rate', 5e-07::numeric)) t(tier, k, tol) where t.tier = c.tier and t.k = f->>'key')
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'SC3 go-live refused: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;
  end if;
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or ((f->>'tol')::numeric = 0.0000005
              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));
  if v_n <> 0 then
    raise exception 'SC3 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or, at the six-decimal floor, pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;

  -- ---------------------------------------- the prompts the learner reads
  select prompt into v_prompt from public.academy_capstones where app_slug = 'materials' and tier = 'beginner';
  if v_prompt is null or md5(v_prompt) <> '61ca16220a7ab5fd8cf06d59c8d538ef' then
    raise exception 'SC3 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'materials' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'IGBARIAM, the materials register of the Igbariam flow station (synthetic)' and title = 'Criticality, classes and the order quantity') then
    raise exception 'SC3 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['safety', 'production', 'leadTime', 'redundancy', 'V', 'E', 'D', 'safety', 'at-or-below', 'up', 'active', 'slow', 'very slow', 'obsolete', 'igbariam_case.json', 'No value depends on any of the readings the engine states (twelve significant digits, halves upward, a minimum met at or above it, a tie to the smaller quantity or fewer spares, a Poisson target met at or above it, the cover limit exceeded strictly above it, a stockout at equality, the P90 as the low figure) or on a Monte Carlo draw, and every input a value needs is stated here or in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'SC3 go-live refused: % stated setting(s) or case file(s) are not named in the shipped beginner prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'materials' and tier = 'intermediate';
  if v_prompt is null or md5(v_prompt) <> '1d88f6e27608b1de3c21211b0f9c8990' then
    raise exception 'SC3 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'materials' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'OGIDI, the stock policy of the Ogidi field (synthetic)' and title = 'Service levels, safety stock and discounts') then
    raise exception 'SC3 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['incremental', 'cycle-service', 'fill-rate', 'fill-rate', 'Poisson', 'no rounding', 'ogidi_case.json', 'No value depends on any of the readings the engine states (twelve significant digits, halves upward, a minimum met at or above it, a tie to the smaller quantity or fewer spares, a Poisson target met at or above it, the cover limit exceeded strictly above it, a stockout at equality, the P90 as the low figure) or on a Monte Carlo draw, and every input a value needs is stated here or in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'SC3 go-live refused: % stated setting(s) or case file(s) are not named in the shipped intermediate prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'materials' and tier = 'advanced';
  if v_prompt is null or md5(v_prompt) <> '592da0df0c8c820b6cbfc0a0c9c06459' then
    raise exception 'SC3 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'materials' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'UMUCHU, the spares of the Umuchu compressor station (synthetic)' and title = 'Spares, lead-time risk and the limits') then
    raise exception 'SC3 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['one-for-one', 'fill-rate', 'Poisson', 'P90 as the low figure', 'no value below is taken from it', 'umuchu_case.json', 'No value depends on any of the readings the engine states (twelve significant digits, halves upward, a minimum met at or above it, a tie to the smaller quantity or fewer spares, a Poisson target met at or above it, the cover limit exceeded strictly above it, a stockout at equality, the P90 as the low figure) or on a Monte Carlo draw, and every input a value needs is stated here or in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'SC3 go-live refused: % stated setting(s) or case file(s) are not named in the shipped advanced prompt: %', v_n, v_names;
  end if;
  -- No number handed in any capstone text of this course may sit within its
  -- tolerance of any graded value of any tier.
  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names
    from (select c.tier as ctier, m[1]::double precision as x
            from public.academy_capstones c,
                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||
                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),
                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m
           where c.app_slug = 'materials') h,
         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'materials') g
   where abs(abs(h.x) - abs(g.v)) <= g.t;
  if v_n <> 0 then
    raise exception 'SC3 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_igbariam_trim_weighted_score
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'beginner' and f->>'key' = 'igbariam_trim_weighted_score';
  if v_g_igbariam_trim_weighted_score is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: beginner/igbariam_trim_weighted_score]';
  end if;
  select (f->>'expected')::double precision into v_g_igbariam_inhibitor_cumulative_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'beginner' and f->>'key' = 'igbariam_inhibitor_cumulative_pct';
  if v_g_igbariam_inhibitor_cumulative_pct is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: beginner/igbariam_inhibitor_cumulative_pct]';
  end if;
  select (f->>'expected')::double precision into v_g_igbariam_inhibitor_eoq
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'beginner' and f->>'key' = 'igbariam_inhibitor_eoq';
  if v_g_igbariam_inhibitor_eoq is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: beginner/igbariam_inhibitor_eoq]';
  end if;
  select (f->>'expected')::double precision into v_g_igbariam_inhibitor_relevant_cost
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'beginner' and f->>'key' = 'igbariam_inhibitor_relevant_cost';
  if v_g_igbariam_inhibitor_relevant_cost is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: beginner/igbariam_inhibitor_relevant_cost]';
  end if;
  select (f->>'expected')::double precision into v_g_igbariam_inhibitor_rounding_penalty_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'beginner' and f->>'key' = 'igbariam_inhibitor_rounding_penalty_pct';
  if v_g_igbariam_inhibitor_rounding_penalty_pct is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: beginner/igbariam_inhibitor_rounding_penalty_pct]';
  end if;
  select (f->>'expected')::double precision into v_g_igbariam_total_write_down
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'beginner' and f->>'key' = 'igbariam_total_write_down';
  if v_g_igbariam_total_write_down is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: beginner/igbariam_total_write_down]';
  end if;
  select (f->>'expected')::double precision into v_g_ogidi_tubing_discount_quantity
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'intermediate' and f->>'key' = 'ogidi_tubing_discount_quantity';
  if v_g_ogidi_tubing_discount_quantity is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: intermediate/ogidi_tubing_discount_quantity]';
  end if;
  select (f->>'expected')::double precision into v_g_ogidi_tubing_discount_total_cost
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'intermediate' and f->>'key' = 'ogidi_tubing_discount_total_cost';
  if v_g_ogidi_tubing_discount_total_cost is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: intermediate/ogidi_tubing_discount_total_cost]';
  end if;
  select (f->>'expected')::double precision into v_g_ogidi_filter_csl_safety_stock
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'intermediate' and f->>'key' = 'ogidi_filter_csl_safety_stock';
  if v_g_ogidi_filter_csl_safety_stock is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: intermediate/ogidi_filter_csl_safety_stock]';
  end if;
  select (f->>'expected')::double precision into v_g_ogidi_filter_fill_rate_k
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'intermediate' and f->>'key' = 'ogidi_filter_fill_rate_k';
  if v_g_ogidi_filter_fill_rate_k is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: intermediate/ogidi_filter_fill_rate_k]';
  end if;
  select (f->>'expected')::double precision into v_g_ogidi_filter_periodic_level
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'intermediate' and f->>'key' = 'ogidi_filter_periodic_level';
  if v_g_ogidi_filter_periodic_level is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: intermediate/ogidi_filter_periodic_level]';
  end if;
  select (f->>'expected')::double precision into v_g_ogidi_kit_poisson_short
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'intermediate' and f->>'key' = 'ogidi_kit_poisson_short';
  if v_g_ogidi_kit_poisson_short is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: intermediate/ogidi_kit_poisson_short]';
  end if;
  select (f->>'expected')::double precision into v_g_umuchu_motor_total_cost
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'advanced' and f->>'key' = 'umuchu_motor_total_cost';
  if v_g_umuchu_motor_total_cost is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: advanced/umuchu_motor_total_cost]';
  end if;
  select (f->>'expected')::double precision into v_g_umuchu_motor_downtime_cost
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'advanced' and f->>'key' = 'umuchu_motor_downtime_cost';
  if v_g_umuchu_motor_downtime_cost is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: advanced/umuchu_motor_downtime_cost]';
  end if;
  select (f->>'expected')::double precision into v_g_umuchu_motor_no_shortage
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'advanced' and f->>'key' = 'umuchu_motor_no_shortage';
  if v_g_umuchu_motor_no_shortage is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: advanced/umuchu_motor_no_shortage]';
  end if;
  select (f->>'expected')::double precision into v_g_umuchu_motor_fill_rate
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'advanced' and f->>'key' = 'umuchu_motor_fill_rate';
  if v_g_umuchu_motor_fill_rate is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: advanced/umuchu_motor_fill_rate]';
  end if;
  select (f->>'expected')::double precision into v_g_umuchu_seal_poisson_short
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'advanced' and f->>'key' = 'umuchu_seal_poisson_short';
  if v_g_umuchu_seal_poisson_short is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: advanced/umuchu_seal_poisson_short]';
  end if;
  select (f->>'expected')::double precision into v_g_umuchu_seal_poisson_fill_rate
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'materials' and c.tier = 'advanced' and f->>'key' = 'umuchu_seal_poisson_fill_rate';
  if v_g_umuchu_seal_poisson_fill_rate is null then
    raise exception 'SC3 go-live refused: the seeded rows carry no value [graded field: advanced/umuchu_seal_poisson_fill_rate]';
  end if;

  -- ------------------------------------------ 1. against the engine ledger
  if v_g_igbariam_trim_weighted_score <> 66.25::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 66.25 [graded field: beginner/igbariam_trim_weighted_score]', v_g_igbariam_trim_weighted_score;
  end if;
  if v_g_igbariam_inhibitor_cumulative_pct <> 80.10942671978702::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 80.10942671978702 [graded field: beginner/igbariam_inhibitor_cumulative_pct]', v_g_igbariam_inhibitor_cumulative_pct;
  end if;
  if v_g_igbariam_inhibitor_eoq <> 86.07898230676612::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 86.07898230676612 [graded field: beginner/igbariam_inhibitor_eoq]', v_g_igbariam_inhibitor_eoq;
  end if;
  if v_g_igbariam_inhibitor_relevant_cost <> 4384.044444444444::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 4384.044444444444 [graded field: beginner/igbariam_inhibitor_relevant_cost]', v_g_igbariam_inhibitor_relevant_cost;
  end if;
  if v_g_igbariam_inhibitor_rounding_penalty_pct <> 0.09922656907414752::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 0.09922656907414752 [graded field: beginner/igbariam_inhibitor_rounding_penalty_pct]', v_g_igbariam_inhibitor_rounding_penalty_pct;
  end if;
  if v_g_igbariam_total_write_down <> 24333.449999999997::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 24333.449999999997 [graded field: beginner/igbariam_total_write_down]', v_g_igbariam_total_write_down;
  end if;
  if v_g_ogidi_tubing_discount_quantity <> 341.9374388995919::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 341.9374388995919 [graded field: intermediate/ogidi_tubing_discount_quantity]', v_g_ogidi_tubing_discount_quantity;
  end if;
  if v_g_ogidi_tubing_discount_total_cost <> 139938.25403191225::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 139938.25403191225 [graded field: intermediate/ogidi_tubing_discount_total_cost]', v_g_ogidi_tubing_discount_total_cost;
  end if;
  if v_g_ogidi_filter_csl_safety_stock <> 13.446927812769554::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 13.446927812769554 [graded field: intermediate/ogidi_filter_csl_safety_stock]', v_g_ogidi_filter_csl_safety_stock;
  end if;
  if v_g_ogidi_filter_fill_rate_k <> 0.8992388568905528::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 0.8992388568905528 [graded field: intermediate/ogidi_filter_fill_rate_k]', v_g_ogidi_filter_fill_rate_k;
  end if;
  if v_g_ogidi_filter_periodic_level <> 43.081260862871815::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 43.081260862871815 [graded field: intermediate/ogidi_filter_periodic_level]', v_g_ogidi_filter_periodic_level;
  end if;
  if v_g_ogidi_kit_poisson_short <> 0.02944488648478305::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 0.02944488648478305 [graded field: intermediate/ogidi_kit_poisson_short]', v_g_ogidi_kit_poisson_short;
  end if;
  if v_g_umuchu_motor_total_cost <> 137085.77395357136::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 137085.77395357136 [graded field: advanced/umuchu_motor_total_cost]', v_g_umuchu_motor_total_cost;
  end if;
  if v_g_umuchu_motor_downtime_cost <> 8835.77395357136::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 8835.77395357136 [graded field: advanced/umuchu_motor_downtime_cost]', v_g_umuchu_motor_downtime_cost;
  end if;
  if v_g_umuchu_motor_no_shortage <> 0.9991652298224614::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 0.9991652298224614 [graded field: advanced/umuchu_motor_no_shortage]', v_g_umuchu_motor_no_shortage;
  end if;
  if v_g_umuchu_motor_fill_rate <> 0.9951783165594128::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 0.9951783165594128 [graded field: advanced/umuchu_motor_fill_rate]', v_g_umuchu_motor_fill_rate;
  end if;
  if v_g_umuchu_seal_poisson_short <> 0.013157720830544672::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 0.013157720830544672 [graded field: advanced/umuchu_seal_poisson_short]', v_g_umuchu_seal_poisson_short;
  end if;
  if v_g_umuchu_seal_poisson_fill_rate <> 0.9956140930564851::double precision then
    raise exception 'SC3 go-live refused: the seeded value is %, and the engine returned 0.9956140930564851 [graded field: advanced/umuchu_seal_poisson_fill_rate]', v_g_umuchu_seal_poisson_fill_rate;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  v_s := pg_temp.sc3_crit(v_case_b->'criticality', 'IGB-V204');
  if v_s is null or abs(v_s - v_g_igbariam_trim_weighted_score) > 1e-9 * abs(v_g_igbariam_trim_weighted_score) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/igbariam_trim_weighted_score]', v_s, v_g_igbariam_trim_weighted_score;
  end if;
  v_s := pg_temp.sc3_abc_cum(v_case_b->'abcClassification', 'IGB-C515');
  if v_s is null or abs(v_s - v_g_igbariam_inhibitor_cumulative_pct) > 1e-9 * abs(v_g_igbariam_inhibitor_cumulative_pct) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/igbariam_inhibitor_cumulative_pct]', v_s, v_g_igbariam_inhibitor_cumulative_pct;
  end if;
  v_s := pg_temp.sc3_eoq(v_case_b->'eoq', 'eoq');
  if v_s is null or abs(v_s - v_g_igbariam_inhibitor_eoq) > 1e-9 * abs(v_g_igbariam_inhibitor_eoq) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/igbariam_inhibitor_eoq]', v_s, v_g_igbariam_inhibitor_eoq;
  end if;
  v_s := pg_temp.sc3_eoq(v_case_b->'eoq', 'cost');
  if v_s is null or abs(v_s - v_g_igbariam_inhibitor_relevant_cost) > 1e-9 * abs(v_g_igbariam_inhibitor_relevant_cost) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/igbariam_inhibitor_relevant_cost]', v_s, v_g_igbariam_inhibitor_relevant_cost;
  end if;
  v_s := pg_temp.sc3_eoq(v_case_b->'eoq', 'penalty');
  if v_s is null or abs(v_s - v_g_igbariam_inhibitor_rounding_penalty_pct) > 1e-9 * abs(v_g_igbariam_inhibitor_rounding_penalty_pct) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/igbariam_inhibitor_rounding_penalty_pct]', v_s, v_g_igbariam_inhibitor_rounding_penalty_pct;
  end if;
  v_s := pg_temp.sc3_write_down(v_case_b->'slowMoving');
  if v_s is null or abs(v_s - v_g_igbariam_total_write_down) > 1e-9 * abs(v_g_igbariam_total_write_down) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/igbariam_total_write_down]', v_s, v_g_igbariam_total_write_down;
  end if;
  v_s := pg_temp.sc3_disc(v_case_i->'quantityDiscount', 'quantity');
  if v_s is null or abs(v_s - v_g_ogidi_tubing_discount_quantity) > 1e-9 * abs(v_g_ogidi_tubing_discount_quantity) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ogidi_tubing_discount_quantity]', v_s, v_g_ogidi_tubing_discount_quantity;
  end if;
  v_s := pg_temp.sc3_disc(v_case_i->'quantityDiscount', 'total');
  if v_s is null or abs(v_s - v_g_ogidi_tubing_discount_total_cost) > 1e-9 * abs(v_g_ogidi_tubing_discount_total_cost) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ogidi_tubing_discount_total_cost]', v_s, v_g_ogidi_tubing_discount_total_cost;
  end if;
  v_s := pg_temp.sc3_ss(v_case_i->'safetyStock:cycle-service', 'safety');
  if v_s is null or abs(v_s - v_g_ogidi_filter_csl_safety_stock) > 1e-9 * abs(v_g_ogidi_filter_csl_safety_stock) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ogidi_filter_csl_safety_stock]', v_s, v_g_ogidi_filter_csl_safety_stock;
  end if;
  v_s := pg_temp.sc3_ss(v_case_i->'safetyStock:fill-rate', 'k');
  if v_s is null or abs(v_s - v_g_ogidi_filter_fill_rate_k) > 1e-9 * abs(v_g_ogidi_filter_fill_rate_k) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ogidi_filter_fill_rate_k]', v_s, v_g_ogidi_filter_fill_rate_k;
  end if;
  v_s := pg_temp.sc3_ss(v_case_i->'safetyStock:periodic', 'level');
  if v_s is null or abs(v_s - v_g_ogidi_filter_periodic_level) > 1e-9 * abs(v_g_ogidi_filter_periodic_level) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ogidi_filter_periodic_level]', v_s, v_g_ogidi_filter_periodic_level;
  end if;
  v_s := pg_temp.sc3_pois(v_case_i->'poissonStock', 'short');
  if v_s is null or abs(v_s - v_g_ogidi_kit_poisson_short) > 1e-9 * abs(v_g_ogidi_kit_poisson_short) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ogidi_kit_poisson_short]', v_s, v_g_ogidi_kit_poisson_short;
  end if;
  v_s := pg_temp.sc3_spares(v_case_a->'insuranceSpares', 'total');
  if v_s is null or abs(v_s - v_g_umuchu_motor_total_cost) > 1e-9 * abs(v_g_umuchu_motor_total_cost) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/umuchu_motor_total_cost]', v_s, v_g_umuchu_motor_total_cost;
  end if;
  v_s := pg_temp.sc3_spares(v_case_a->'insuranceSpares', 'downtime');
  if v_s is null or abs(v_s - v_g_umuchu_motor_downtime_cost) > 1e-9 * abs(v_g_umuchu_motor_downtime_cost) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/umuchu_motor_downtime_cost]', v_s, v_g_umuchu_motor_downtime_cost;
  end if;
  v_s := pg_temp.sc3_spares(v_case_a->'insuranceSpares', 'noshort');
  if v_s is null or abs(v_s - v_g_umuchu_motor_no_shortage) > 1e-9 * abs(v_g_umuchu_motor_no_shortage) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/umuchu_motor_no_shortage]', v_s, v_g_umuchu_motor_no_shortage;
  end if;
  v_s := pg_temp.sc3_spares(v_case_a->'insuranceSpares', 'fill');
  if v_s is null or abs(v_s - v_g_umuchu_motor_fill_rate) > 1e-9 * abs(v_g_umuchu_motor_fill_rate) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/umuchu_motor_fill_rate]', v_s, v_g_umuchu_motor_fill_rate;
  end if;
  v_s := pg_temp.sc3_pois(v_case_a->'poissonStock', 'short');
  if v_s is null or abs(v_s - v_g_umuchu_seal_poisson_short) > 1e-9 * abs(v_g_umuchu_seal_poisson_short) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/umuchu_seal_poisson_short]', v_s, v_g_umuchu_seal_poisson_short;
  end if;
  v_s := pg_temp.sc3_pois(v_case_a->'poissonStock', 'fill');
  if v_s is null or abs(v_s - v_g_umuchu_seal_poisson_fill_rate) > 1e-9 * abs(v_g_umuchu_seal_poisson_fill_rate) then
    raise exception 'SC3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/umuchu_seal_poisson_fill_rate]', v_s, v_g_umuchu_seal_poisson_fill_rate;
  end if;

  -- ---------------------------------------------------- 3. against the oracle
  -- oracle_check.py --json, run when this file was generated: the value the
  -- vendored stdlib oracle computed, written in, with the module it came from.
  -- igbariam_trim_weighted_score: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_igbariam_trim_weighted_score - 66.25::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 66.25, not within 5e-07 of the seeded % [graded field: beginner/igbariam_trim_weighted_score]', v_g_igbariam_trim_weighted_score;
  end if;
  -- igbariam_inhibitor_cumulative_pct: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_igbariam_inhibitor_cumulative_pct - 80.10942671978702::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 80.10942671978702, not within 5e-07 of the seeded % [graded field: beginner/igbariam_inhibitor_cumulative_pct]', v_g_igbariam_inhibitor_cumulative_pct;
  end if;
  -- igbariam_inhibitor_eoq: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_igbariam_inhibitor_eoq - 86.07898230676612::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 86.07898230676612, not within 5e-07 of the seeded % [graded field: beginner/igbariam_inhibitor_eoq]', v_g_igbariam_inhibitor_eoq;
  end if;
  -- igbariam_inhibitor_relevant_cost: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_igbariam_inhibitor_relevant_cost - 4384.044444444444::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 4384.044444444444, not within 5e-07 of the seeded % [graded field: beginner/igbariam_inhibitor_relevant_cost]', v_g_igbariam_inhibitor_relevant_cost;
  end if;
  -- igbariam_inhibitor_rounding_penalty_pct: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_igbariam_inhibitor_rounding_penalty_pct - 0.09922656907416556::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 0.09922656907416556, not within 5e-07 of the seeded % [graded field: beginner/igbariam_inhibitor_rounding_penalty_pct]', v_g_igbariam_inhibitor_rounding_penalty_pct;
  end if;
  -- igbariam_total_write_down: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_igbariam_total_write_down - 24333.45::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 24333.45, not within 5e-07 of the seeded % [graded field: beginner/igbariam_total_write_down]', v_g_igbariam_total_write_down;
  end if;
  -- ogidi_tubing_discount_quantity: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_ogidi_tubing_discount_quantity - 341.9374388995919::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 341.9374388995919, not within 5e-07 of the seeded % [graded field: intermediate/ogidi_tubing_discount_quantity]', v_g_ogidi_tubing_discount_quantity;
  end if;
  -- ogidi_tubing_discount_total_cost: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_ogidi_tubing_discount_total_cost - 139938.25403191225::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 139938.25403191225, not within 5e-07 of the seeded % [graded field: intermediate/ogidi_tubing_discount_total_cost]', v_g_ogidi_tubing_discount_total_cost;
  end if;
  -- ogidi_filter_csl_safety_stock: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_ogidi_filter_csl_safety_stock - 13.446927812769554::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 13.446927812769554, not within 5e-07 of the seeded % [graded field: intermediate/ogidi_filter_csl_safety_stock]', v_g_ogidi_filter_csl_safety_stock;
  end if;
  -- ogidi_filter_fill_rate_k: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_ogidi_filter_fill_rate_k - 0.8992388568905519::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 0.8992388568905519, not within 5e-07 of the seeded % [graded field: intermediate/ogidi_filter_fill_rate_k]', v_g_ogidi_filter_fill_rate_k;
  end if;
  -- ogidi_filter_periodic_level: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_ogidi_filter_periodic_level - 43.081260862871815::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 43.081260862871815, not within 5e-07 of the seeded % [graded field: intermediate/ogidi_filter_periodic_level]', v_g_ogidi_filter_periodic_level;
  end if;
  -- ogidi_kit_poisson_short: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_ogidi_kit_poisson_short - 0.029444886484783005::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 0.029444886484783005, not within 5e-07 of the seeded % [graded field: intermediate/ogidi_kit_poisson_short]', v_g_ogidi_kit_poisson_short;
  end if;
  -- umuchu_motor_total_cost: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_umuchu_motor_total_cost - 137085.77395357165::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 137085.77395357165, not within 5e-07 of the seeded % [graded field: advanced/umuchu_motor_total_cost]', v_g_umuchu_motor_total_cost;
  end if;
  -- umuchu_motor_downtime_cost: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_umuchu_motor_downtime_cost - 8835.773953571654::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 8835.773953571654, not within 5e-07 of the seeded % [graded field: advanced/umuchu_motor_downtime_cost]', v_g_umuchu_motor_downtime_cost;
  end if;
  -- umuchu_motor_no_shortage: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_umuchu_motor_no_shortage - 0.9991652298224614::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 0.9991652298224614, not within 5e-07 of the seeded % [graded field: advanced/umuchu_motor_no_shortage]', v_g_umuchu_motor_no_shortage;
  end if;
  -- umuchu_motor_fill_rate: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_umuchu_motor_fill_rate - 0.9951783165594128::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 0.9951783165594128, not within 5e-07 of the seeded % [graded field: advanced/umuchu_motor_fill_rate]', v_g_umuchu_motor_fill_rate;
  end if;
  -- umuchu_seal_poisson_short: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_umuchu_seal_poisson_short - 0.013157720830544612::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 0.013157720830544612, not within 5e-07 of the seeded % [graded field: advanced/umuchu_seal_poisson_short]', v_g_umuchu_seal_poisson_short;
  end if;
  -- umuchu_seal_poisson_fill_rate: tools/validation/supplychain/oracle_inventory.py
  if abs(v_g_umuchu_seal_poisson_fill_rate - 0.9956140930564852::double precision) > 5e-07::double precision then
    raise exception 'SC3 go-live refused: the oracle gives 0.9956140930564852, not within 5e-07 of the seeded % [graded field: advanced/umuchu_seal_poisson_fill_rate]', v_g_umuchu_seal_poisson_fill_rate;
  end if;

  -- ------------------------------------------------------------- 4. the traps
  -- Every wrong method discriminate.mjs swept through the engine for a field,
  -- by value: each must miss the seeded value by more than the tolerance, or
  -- the field does not discriminate the trap it is for.
  v_wrong := 68.75::double precision;
  if abs(v_wrong - v_g_igbariam_trim_weighted_score) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (criticality weights ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_trim_weighted_score]', v_wrong, v_g_igbariam_trim_weighted_score;
  end if;
  v_wrong := 53.0::double precision;
  if abs(v_wrong - v_g_igbariam_trim_weighted_score) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (criticality not over score max) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_trim_weighted_score]', v_wrong, v_g_igbariam_trim_weighted_score;
  end if;
  v_wrong := 11.0::double precision;
  if abs(v_wrong - v_g_igbariam_trim_weighted_score) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (criticality scores summed) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_trim_weighted_score]', v_wrong, v_g_igbariam_trim_weighted_score;
  end if;
  v_wrong := 2.6500000000000004::double precision;
  if abs(v_wrong - v_g_igbariam_trim_weighted_score) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (weights times scores over one hundred) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_trim_weighted_score]', v_wrong, v_g_igbariam_trim_weighted_score;
  end if;
  v_wrong := 36.77635378038376::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_cumulative_pct) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (abc ranked lowest first) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_cumulative_pct]', v_wrong, v_g_igbariam_inhibitor_cumulative_pct;
  end if;
  v_wrong := 42.34527687296417::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_cumulative_pct) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (abc value without unit cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_cumulative_pct]', v_wrong, v_g_igbariam_inhibitor_cumulative_pct;
  end if;
  v_wrong := 16.88578050017079::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_cumulative_pct) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (its own share) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_cumulative_pct]', v_wrong, v_g_igbariam_inhibitor_cumulative_pct;
  end if;
  v_wrong := 63.223646219616235::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_cumulative_pct) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (the share before it) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_cumulative_pct]', v_wrong, v_g_igbariam_inhibitor_cumulative_pct;
  end if;
  v_wrong := 60.86703210675117::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_eoq) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (eoq without factor two) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_eoq]', v_wrong, v_g_igbariam_inhibitor_eoq;
  end if;
  v_wrong := 1253.3289007013816::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_eoq) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (eoq holding rate as holding cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_eoq]', v_wrong, v_g_igbariam_inhibitor_eoq;
  end if;
  v_wrong := 24.848861803190225::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_eoq) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (monthly demand in the formula) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_eoq]', v_wrong, v_g_igbariam_inhibitor_eoq;
  end if;
  v_wrong := 90.0::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_eoq) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (the rounded quantity) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_eoq]', v_wrong, v_g_igbariam_inhibitor_eoq;
  end if;
  v_wrong := 4379.69861976826::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_relevant_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (eoq costs at the unrounded quantity) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_relevant_cost]', v_wrong, v_g_igbariam_inhibitor_relevant_cost;
  end if;
  v_wrong := 6673.644444444444::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_relevant_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (eoq holding on whole lot) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_relevant_cost]', v_wrong, v_g_igbariam_inhibitor_relevant_cost;
  end if;
  v_wrong := 4535.100606060606::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_relevant_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (eoq without factor two) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_relevant_cost]', v_wrong, v_g_igbariam_inhibitor_relevant_cost;
  end if;
  v_wrong := 4381.007619047619::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_relevant_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (rounding up taken as nearest) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_relevant_cost]', v_wrong, v_g_igbariam_inhibitor_relevant_cost;
  end if;
  v_wrong := 52.37679630105604::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_rounding_penalty_pct) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (eoq holding on whole lot) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_rounding_penalty_pct]', v_wrong, v_g_igbariam_inhibitor_rounding_penalty_pct;
  end if;
  v_wrong := 0.02988788482958682::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_rounding_penalty_pct) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (rounding up taken as nearest) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_rounding_penalty_pct]', v_wrong, v_g_igbariam_inhibitor_rounding_penalty_pct;
  end if;
  v_wrong := 3.5482347025186107::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_rounding_penalty_pct) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (eoq without factor two) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_rounding_penalty_pct]', v_wrong, v_g_igbariam_inhibitor_rounding_penalty_pct;
  end if;
  v_wrong := 4.555139463963751::double precision;
  if abs(v_wrong - v_g_igbariam_inhibitor_rounding_penalty_pct) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (the quantity difference in percent) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_inhibitor_rounding_penalty_pct]', v_wrong, v_g_igbariam_inhibitor_rounding_penalty_pct;
  end if;
  v_wrong := 2433345.0::double precision;
  if abs(v_wrong - v_g_igbariam_total_write_down) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (write down not over one hundred) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_total_write_down]', v_wrong, v_g_igbariam_total_write_down;
  end if;
  v_wrong := 9.4::double precision;
  if abs(v_wrong - v_g_igbariam_total_write_down) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (write down on quantity) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_total_write_down]', v_wrong, v_g_igbariam_total_write_down;
  end if;
  v_wrong := 8538.1525::double precision;
  if abs(v_wrong - v_g_igbariam_total_write_down) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (band one below) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_total_write_down]', v_wrong, v_g_igbariam_total_write_down;
  end if;
  v_wrong := 74896.45::double precision;
  if abs(v_wrong - v_g_igbariam_total_write_down) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (the whole stock value) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/igbariam_total_write_down]', v_wrong, v_g_igbariam_total_write_down;
  end if;
  v_wrong := 296.1981318869741::double precision;
  if abs(v_wrong - v_g_ogidi_tubing_discount_quantity) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (discount fixed cost not carried) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_tubing_discount_quantity]', v_wrong, v_g_ogidi_tubing_discount_quantity;
  end if;
  v_wrong := 184.7306212358914::double precision;
  if abs(v_wrong - v_g_ogidi_tubing_discount_quantity) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (discount eoq without fixed cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_tubing_discount_quantity]', v_wrong, v_g_ogidi_tubing_discount_quantity;
  end if;
  v_wrong := 178.37651700316894::double precision;
  if abs(v_wrong - v_g_ogidi_tubing_discount_quantity) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (the plain eoq at the list price) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_tubing_discount_quantity]', v_wrong, v_g_ogidi_tubing_discount_quantity;
  end if;
  v_wrong := 250.0::double precision;
  if abs(v_wrong - v_g_ogidi_tubing_discount_quantity) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (the top break quantity) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_tubing_discount_quantity]', v_wrong, v_g_ogidi_tubing_discount_quantity;
  end if;
  v_wrong := 136871.63441050655::double precision;
  if abs(v_wrong - v_g_ogidi_tubing_discount_total_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (discount fixed cost not carried) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_tubing_discount_total_cost]', v_wrong, v_g_ogidi_tubing_discount_total_cost;
  end if;
  v_wrong := 131958.6709054811::double precision;
  if abs(v_wrong - v_g_ogidi_tubing_discount_total_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (discount incremental priced all units) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_tubing_discount_total_cost]', v_wrong, v_g_ogidi_tubing_discount_total_cost;
  end if;
  v_wrong := 141704.67721754118::double precision;
  if abs(v_wrong - v_g_ogidi_tubing_discount_total_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (discount eoq without fixed cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_tubing_discount_total_cost]', v_wrong, v_g_ogidi_tubing_discount_total_cost;
  end if;
  v_wrong := 125448.70812643116::double precision;
  if abs(v_wrong - v_g_ogidi_tubing_discount_total_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (the purchase cost alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_tubing_discount_total_cost]', v_wrong, v_g_ogidi_tubing_discount_total_cost;
  end if;
  v_wrong := 10.889712291646074::double precision;
  if abs(v_wrong - v_g_ogidi_filter_csl_safety_stock) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (sigma without lead time variance) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_filter_csl_safety_stock]', v_wrong, v_g_ogidi_filter_csl_safety_stock;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_ogidi_filter_csl_safety_stock) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (z at one less the level) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_filter_csl_safety_stock]', v_wrong, v_g_ogidi_filter_csl_safety_stock;
  end if;
  v_wrong := 1.9599639845400536::double precision;
  if abs(v_wrong - v_g_ogidi_filter_csl_safety_stock) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (safety stock not scaled by sigma) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_filter_csl_safety_stock]', v_wrong, v_g_ogidi_filter_csl_safety_stock;
  end if;
  v_wrong := 16.424349087496775::double precision;
  if abs(v_wrong - v_g_ogidi_filter_csl_safety_stock) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (sigma sd times period) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_filter_csl_safety_stock]', v_wrong, v_g_ogidi_filter_csl_safety_stock;
  end if;
  v_wrong := -6.604182708197359::double precision;
  if abs(v_wrong - v_g_ogidi_filter_fill_rate_k) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (fill target without one less the level) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_filter_fill_rate_k]', v_wrong, v_g_ogidi_filter_fill_rate_k;
  end if;
  v_wrong := 2.17009037758456::double precision;
  if abs(v_wrong - v_g_ogidi_filter_fill_rate_k) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (fill rate read as cycle service) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_filter_fill_rate_k]', v_wrong, v_g_ogidi_filter_fill_rate_k;
  end if;
  v_wrong := 0.7814449947573402::double precision;
  if abs(v_wrong - v_g_ogidi_filter_fill_rate_k) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (sigma without lead time variance) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_filter_fill_rate_k]', v_wrong, v_g_ogidi_filter_fill_rate_k;
  end if;
  v_wrong := 1.00617963533116::double precision;
  if abs(v_wrong - v_g_ogidi_filter_fill_rate_k) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (sigma sd times period) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_filter_fill_rate_k]', v_wrong, v_g_ogidi_filter_fill_rate_k;
  end if;
  v_wrong := 29.263934644034023::double precision;
  if abs(v_wrong - v_g_ogidi_filter_periodic_level) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (review period left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_filter_periodic_level]', v_wrong, v_g_ogidi_filter_periodic_level;
  end if;
  v_wrong := 31.625::double precision;
  if abs(v_wrong - v_g_ogidi_filter_periodic_level) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (z at one less the level) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_filter_periodic_level]', v_wrong, v_g_ogidi_filter_periodic_level;
  end if;
  v_wrong := 50.6230593912895::double precision;
  if abs(v_wrong - v_g_ogidi_filter_periodic_level) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (sigma sd times period) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_filter_periodic_level]', v_wrong, v_g_ogidi_filter_periodic_level;
  end if;
  v_wrong := 33.26985362695147::double precision;
  if abs(v_wrong - v_g_ogidi_filter_periodic_level) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (safety stock not scaled by sigma) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_filter_periodic_level]', v_wrong, v_g_ogidi_filter_periodic_level;
  end if;
  v_wrong := 1.0000000000004645::double precision;
  if abs(v_wrong - v_g_ogidi_kit_poisson_short) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (poisson loss off by one) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_kit_poisson_short]', v_wrong, v_g_ogidi_kit_poisson_short;
  end if;
  v_wrong := 0.0463895412872547::double precision;
  if abs(v_wrong - v_g_ogidi_kit_poisson_short) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (poisson mean without review) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_kit_poisson_short]', v_wrong, v_g_ogidi_kit_poisson_short;
  end if;
  v_wrong := 1.575::double precision;
  if abs(v_wrong - v_g_ogidi_kit_poisson_short) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (poisson fill limit at the level) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ogidi_kit_poisson_short]', v_wrong, v_g_ogidi_kit_poisson_short;
  end if;
  v_wrong := 26445.205479452055::double precision;
  if abs(v_wrong - v_g_umuchu_motor_total_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance downtime without days) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_total_cost]', v_wrong, v_g_umuchu_motor_total_cost;
  end if;
  v_wrong := 111435.77395357136::double precision;
  if abs(v_wrong - v_g_umuchu_motor_total_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance holding on n less one) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_total_cost]', v_wrong, v_g_umuchu_motor_total_cost;
  end if;
  v_wrong := 622393.656734976::double precision;
  if abs(v_wrong - v_g_umuchu_motor_total_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance holding without rate) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_total_cost]', v_wrong, v_g_umuchu_motor_total_cost;
  end if;
  v_wrong := 26007.051629383594::double precision;
  if abs(v_wrong - v_g_umuchu_motor_total_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance mean without lead time) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_total_cost]', v_wrong, v_g_umuchu_motor_total_cost;
  end if;
  v_wrong := 286678.1958213823::double precision;
  if abs(v_wrong - v_g_umuchu_motor_total_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance mean over a year of lead time) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_total_cost]', v_wrong, v_g_umuchu_motor_total_cost;
  end if;
  v_wrong := 26445.205479452055::double precision;
  if abs(v_wrong - v_g_umuchu_motor_downtime_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance downtime without days) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_downtime_cost]', v_wrong, v_g_umuchu_motor_downtime_cost;
  end if;
  v_wrong := 52393.656734975964::double precision;
  if abs(v_wrong - v_g_umuchu_motor_downtime_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance holding without rate) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_downtime_cost]', v_wrong, v_g_umuchu_motor_downtime_cost;
  end if;
  v_wrong := 357.05162938359246::double precision;
  if abs(v_wrong - v_g_umuchu_motor_downtime_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance mean without lead time) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_downtime_cost]', v_wrong, v_g_umuchu_motor_downtime_cost;
  end if;
  v_wrong := 81478.19582138228::double precision;
  if abs(v_wrong - v_g_umuchu_motor_downtime_cost) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance mean over a year of lead time) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_downtime_cost]', v_wrong, v_g_umuchu_motor_downtime_cost;
  end if;
  v_wrong := 0.34352576918060085::double precision;
  if abs(v_wrong - v_g_umuchu_motor_no_shortage) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance downtime without days) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_no_shortage]', v_wrong, v_g_umuchu_motor_no_shortage;
  end if;
  v_wrong := 0.9951783165594128::double precision;
  if abs(v_wrong - v_g_umuchu_motor_no_shortage) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance holding without rate) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_no_shortage]', v_wrong, v_g_umuchu_motor_no_shortage;
  end if;
  v_wrong := 0.9999605929476854::double precision;
  if abs(v_wrong - v_g_umuchu_motor_no_shortage) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance mean without lead time) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_no_shortage]', v_wrong, v_g_umuchu_motor_no_shortage;
  end if;
  v_wrong := 0.9937088937040996::double precision;
  if abs(v_wrong - v_g_umuchu_motor_no_shortage) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance mean over a year of lead time) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_no_shortage]', v_wrong, v_g_umuchu_motor_no_shortage;
  end if;
  v_wrong := 0.9991652298224614::double precision;
  if abs(v_wrong - v_g_umuchu_motor_fill_rate) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance fill rate as no shortage) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_fill_rate]', v_wrong, v_g_umuchu_motor_fill_rate;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_umuchu_motor_fill_rate) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance downtime without days) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_fill_rate]', v_wrong, v_g_umuchu_motor_fill_rate;
  end if;
  v_wrong := 0.9765216070592495::double precision;
  if abs(v_wrong - v_g_umuchu_motor_fill_rate) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance holding without rate) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_fill_rate]', v_wrong, v_g_umuchu_motor_fill_rate;
  end if;
  v_wrong := 0.9911354145985204::double precision;
  if abs(v_wrong - v_g_umuchu_motor_fill_rate) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (insurance mean without lead time) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_motor_fill_rate]', v_wrong, v_g_umuchu_motor_fill_rate;
  end if;
  v_wrong := 0.999999999999536::double precision;
  if abs(v_wrong - v_g_umuchu_seal_poisson_short) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (poisson loss off by one) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_seal_poisson_short]', v_wrong, v_g_umuchu_seal_poisson_short;
  end if;
  v_wrong := 0.017818480236735712::double precision;
  if abs(v_wrong - v_g_umuchu_seal_poisson_short) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (poisson mean without review) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_seal_poisson_short]', v_wrong, v_g_umuchu_seal_poisson_short;
  end if;
  v_wrong := 1.295::double precision;
  if abs(v_wrong - v_g_umuchu_seal_poisson_short) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (poisson fill limit at the level) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_seal_poisson_short]', v_wrong, v_g_umuchu_seal_poisson_short;
  end if;
  v_wrong := 0.6666666666668213::double precision;
  if abs(v_wrong - v_g_umuchu_seal_poisson_fill_rate) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (poisson loss off by one) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_seal_poisson_fill_rate]', v_wrong, v_g_umuchu_seal_poisson_fill_rate;
  end if;
  v_wrong := 0.9940605065877548::double precision;
  if abs(v_wrong - v_g_umuchu_seal_poisson_fill_rate) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (poisson mean without review) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_seal_poisson_fill_rate]', v_wrong, v_g_umuchu_seal_poisson_fill_rate;
  end if;
  v_wrong := 0.5683333333333334::double precision;
  if abs(v_wrong - v_g_umuchu_seal_poisson_fill_rate) <= 5e-07::double precision then
    raise exception 'SC3 go-live refused: the trap (poisson fill limit at the level) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umuchu_seal_poisson_fill_rate]', v_wrong, v_g_umuchu_seal_poisson_fill_rate;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'materials';
  if not exists (select 1 from public.academy_apps where slug = 'materials' and status = 'available') then
    raise exception 'SC3 go-live refused: materials did not reach status available';
  end if;
  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon from public.academy_apps;
  raise notice 'SC3 go-live: materials available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
