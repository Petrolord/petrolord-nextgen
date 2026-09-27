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
