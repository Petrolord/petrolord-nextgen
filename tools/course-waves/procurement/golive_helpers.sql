-- ------------------------------------------------ the second route's helpers
-- Temporary functions (pg_temp), created with create or replace: they vanish
-- with the session and create nothing in any schema. Each is written from the
-- published rule the course states (the two-envelope technical percentage,
-- WB SPD ITB 35.1 arithmetic correction, the evaluated cost of WB Reg Annex X
-- 3.5 to 3.8 with the ITB 34.1 average for an omission, the combined score of
-- WB Reg 5.69, the NOGICD Act 2010 content and s.14 lead, the ALB Guidance's
-- relative limit with the population standard deviation, the mulberry32
-- stream and the triangular inverse CDF, the lib/stats floor-index
-- percentile, the wellCost duration forms and the AFE rollup). No engine code
-- is run: the go-live recomputes each graded value from the capstone data.
-- Every number is a double precision; arrays are 1-based.

-- A number out of a jsonb value, read through its text so it is the double
-- the decimal names (the same double JSON.parse gives).
create or replace function pg_temp.sc2_n(v jsonb) returns double precision
language sql immutable as $f$
  select case when v is null or jsonb_typeof(v) = 'null' then null else (v #>> '{}')::double precision end
$f$;

-- One bill line corrected (ITB 35.1(a) and (b)): in discrepancy when
-- |quantity x unit rate - quoted amount| > tol; then the unit rate prevails
-- and the amount is quantity x unit rate, unless the line records
-- decimalMisplaced true, when the quoted amount governs.
create or replace function pg_temp.sc2_line(l jsonb, tol double precision) returns double precision
language plpgsql immutable as $f$
declare q double precision := pg_temp.sc2_n(l->'quantity'); r double precision := pg_temp.sc2_n(l->'unitRate');
        a double precision := pg_temp.sc2_n(l->'quotedAmount');
begin
  if abs(q * r - a) <= tol then return a; end if;
  if coalesce((l->>'decimalMisplaced')::boolean, false) then return a; end if;
  return q * r;
end $f$;

-- The corrected price of a bid: the corrected lines added in bill order.
create or replace function pg_temp.sc2_price(b jsonb, tol double precision) returns double precision
language plpgsql immutable as $f$
declare s double precision := 0; l jsonb;
begin
  for l in select e from jsonb_array_elements(b->'lines') with ordinality t(e, o) order by o loop
    s := s + pg_temp.sc2_line(l, tol);
  end loop;
  return s;
end $f$;

-- The technical percentage, sum of weight x score / maxScore in criteria
-- order; null for a bid that fails a mandatory requirement.
create or replace function pg_temp.sc2_tech_pct(crit jsonb, b jsonb) returns double precision
language plpgsql immutable as $f$
declare s double precision := 0; c jsonb;
begin
  if exists (select 1 from jsonb_array_elements(coalesce(b->'mandatory', '[]'::jsonb)) m where not (m->>'met')::boolean) then
    return null;
  end if;
  for c in select e from jsonb_array_elements(crit) with ordinality t(e, o) order by o loop
    s := s + (pg_temp.sc2_n(c->'weight') * pg_temp.sc2_n(b->'scores'->(c->>'id'))) / pg_temp.sc2_n(c->'maxScore');
  end loop;
  return s;
end $f$;

-- The bids that pass the technical envelope (no failed mandatory requirement
-- and a percentage at or above the pass mark), in bid order.
create or replace function pg_temp.sc2_open(crit jsonb, bids jsonb, passmark double precision) returns jsonb
language sql immutable as $f$
  select coalesce(jsonb_agg(e order by o), '[]'::jsonb)
    from jsonb_array_elements(bids) with ordinality t(e, o)
   where pg_temp.sc2_tech_pct(crit, e) >= passmark
$f$;

-- The net present cost of a life cycle: annual costs at the end of years 1 to
-- N, the residual value credited in year N, discounted at rate.
create or replace function pg_temp.sc2_lcc(b jsonb, rate double precision) returns double precision
language plpgsql immutable as $f$
declare f double precision[] := array(select pg_temp.sc2_n(e) from jsonb_array_elements(b->'annualCosts') with ordinality t(e, o) order by o);
        n int := cardinality(f); s double precision := 0; i int;
begin
  f[n] := f[n] - coalesce(pg_temp.sc2_n(b->'residualValue'), 0);
  for i in 1 .. n loop s := s + f[i] / power(1 + rate, i); end loop;
  return s;
end $f$;

-- The evaluated costs of the opened bids (WB Reg Annex X 3.5 to 3.8):
-- corrected price - discount + deviations + omissions + schedule adjustment +
-- life-cycle cost. A bid offering more than maxWeeks is excluded before any
-- omission is priced; an omitted item is priced at the average (or, for a
-- trap, the highest) corrected amount the OTHER responsive bids quote for it.
-- smin is null for no schedule, lrate null for no life cycle.
-- Returns one row a responsive bid: ord, id, corrected price, omission total,
-- life-cycle cost, evaluated cost.
create or replace function pg_temp.sc2_costs(bids jsonb, rule text, smin double precision, smax double precision,
                                             srate double precision, lrate double precision, tol double precision)
returns table(ord int, id text, price double precision, omission double precision, lcc double precision, cost double precision)
language plpgsql immutable as $f$
#variable_conflict use_column
declare live jsonb := '[]'::jsonb; b jsonb; o jsonb; item text; ps double precision[]; net double precision;
        dev double precision; om double precision; adj double precision; lc double precision; k int := 0; p double precision;
begin
  for b in select e from jsonb_array_elements(bids) with ordinality t(e, i) order by i loop
    if b ? 'rejected' then continue; end if;
    if smin is not null and pg_temp.sc2_n(b->'completionWeeks') > smax then continue; end if;
    live := live || jsonb_build_array(b);
  end loop;
  for b in select e from jsonb_array_elements(live) with ordinality t(e, i) order by i loop
    k := k + 1;
    om := 0;
    for o in select e from jsonb_array_elements(coalesce(b->'omitted', '[]'::jsonb)) with ordinality t(e, i) order by i loop
      item := o #>> '{}';
      ps := array(select pg_temp.sc2_line(l, tol)
                    from jsonb_array_elements(live) with ordinality t(x, i), jsonb_array_elements(x->'lines') l
                   where x->>'id' <> b->>'id' and l->>'id' = item order by i);
      if cardinality(ps) = 0 then return; end if;
      if rule = 'average' then
        p := 0; for i in 1 .. cardinality(ps) loop p := p + ps[i]; end loop;
        om := om + p / cardinality(ps)::double precision;
      else
        om := om + (select max(x) from unnest(ps) x);
      end if;
    end loop;
    price := pg_temp.sc2_price(b, tol);
    net := price - coalesce(pg_temp.sc2_n(b->'discount'), 0);
    dev := coalesce((select sum(pg_temp.sc2_n(d->'amount')) from jsonb_array_elements(b->'deviations') d), 0);
    adj := case when smin is null then 0 else srate * greatest(0, pg_temp.sc2_n(b->'completionWeeks') - smin) * net end;
    lc := case when lrate is null then 0 else pg_temp.sc2_lcc(b, lrate) end;
    ord := k; id := b->>'id'; omission := om; lcc := lc;
    cost := net + dev + om + adj + lc;
    return next;
  end loop;
end $f$;

-- The combined score (WB Reg 5.69) of one bid among the responsive ones:
-- tw x 100 x T / Thigh + (1 - tw) x 100 x Cmin / C. Returns
-- [commercial score, combined score].
create or replace function pg_temp.sc2_combined(t double precision, c double precision, thigh double precision,
                                                cmin double precision, tw double precision) returns double precision[]
language sql immutable as $f$
  select array[(100 * cmin) / c, tw * ((100 * t) / thigh) + (1 - tw) * ((100 * cmin) / c)]
$f$;

-- A bid's overall Nigerian content in mixed units: the weighted mean of the
-- item contents 100 x nigerian / total, weighted by the bid's own quoted
-- amount for each item (items in the order given).
create or replace function pg_temp.sc2_content(b jsonb, items text[]) returns double precision
language plpgsql immutable as $f$
declare num double precision := 0; den double precision := 0; w double precision; i int; r jsonb;
begin
  for i in 1 .. cardinality(items) loop
    r := b->'nc'->items[i];
    w := (select pg_temp.sc2_n(l->'quotedAmount') from jsonb_array_elements(b->'lines') l where l->>'id' = items[i]);
    num := num + w * ((100 * pg_temp.sc2_n(r->'nigerian')) / pg_temp.sc2_n(r->'total'));
  end loop;
  for i in 1 .. cardinality(items) loop
    den := den + (select pg_temp.sc2_n(l->'quotedAmount') from jsonb_array_elements(b->'lines') l where l->>'id' = items[i]);
  end loop;
  return num / den;
end $f$;

-- The s.14 lead: the group within 1% of the lowest evaluated cost,
-- 100 x (C - Cmin) <= Cmin; the leader and the runner-up by content in it.
-- Returns [top - runner-up, 100 x (top - runner-up) / runner-up].
create or replace function pg_temp.sc2_s14(costs double precision[], contents double precision[]) returns double precision[]
language plpgsql immutable as $f$
declare cmin double precision := (select min(x) from unnest(costs) x); g double precision[];
begin
  g := array(select contents[i] from generate_subscripts(costs, 1) i
              where 100 * (costs[i] - cmin) <= 1 * cmin order by contents[i] desc);
  if cardinality(g) < 2 then return null; end if;
  return array[g[1] - g[2], (100 * (g[1] - g[2])) / g[2]];
end $f$;

-- The ALB Guidance's relative limit: the mean less one POPULATION standard
-- deviation of the responsive bids' evaluated costs.
create or replace function pg_temp.sc2_alb(costs double precision[]) returns double precision
language plpgsql immutable as $f$
declare n int := cardinality(costs); m double precision := 0; v double precision := 0; i int;
begin
  for i in 1 .. n loop m := m + costs[i]; end loop;
  m := m / n::double precision;
  for i in 1 .. n loop v := v + (costs[i] - m) * (costs[i] - m); end loop;
  return m - sqrt(v / n::double precision);
end $f$;

-- a x b modulo 2^32 for a, b in [0, 2^32), with b split into 16-bit halves so
-- no product leaves bigint.
create or replace function pg_temp.sc2_imul(a bigint, b bigint) returns bigint
language sql immutable as $f$
  select ((a * (b & 65535)) + (((a * (b >> 16)) & 65535) << 16)) & 4294967295
$f$;

-- The triangular inverse CDF at u for min a, mode c, max b.
create or replace function pg_temp.sc2_tri(u double precision, a double precision, c double precision, b double precision)
returns double precision language sql immutable as $f$
  select case when a = b then a
              when u <= (c - a) / (b - a) then a + sqrt(u * (b - a) * (c - a))
              else b - sqrt((1 - u) * (b - a) * (b - c)) end
$f$;

-- The productive hours of one activity (wellCost's forms): trip 2 x md / v,
-- casing md / v + flat, flat its duration.
create or replace function pg_temp.sc2_hours(a jsonb) returns double precision
language sql immutable as $f$
  select case a->>'kind'
           when 'trip' then (2 * pg_temp.sc2_n(a->'mdM')) / pg_temp.sc2_n(a->'tripSpeedMPerHr')
           when 'casing' then pg_temp.sc2_n(a->'mdM') / pg_temp.sc2_n(a->'runSpeedMPerHr') + coalesce(pg_temp.sc2_n(a->'flatHr'), 0)
           when 'flat' then pg_temp.sc2_n(a->'durationHr') end
$f$;

-- The programme's days at an NPT fraction: each activity stretched by
-- (1 + npt), the hours added in programme order, over 24.
create or replace function pg_temp.sc2_days(prog jsonb, npt double precision) returns double precision
language plpgsql immutable as $f$
declare s double precision := 0; a jsonb;
begin
  for a in select e from jsonb_array_elements(prog) with ordinality t(e, o) order by o loop
    s := s + pg_temp.sc2_hours(a) * (1 + npt);
  end loop;
  return s / 24.0;
end $f$;

-- The same scope under a day rate and a reimbursable, one mulberry32(seed)
-- stream: per iteration a uniform for the NPT fraction (days = productive
-- days x (1 + NPT)) and then one for the daily cost, each through the
-- triangular inverse CDF. Returns [day-rate company cost mean, reimbursable
-- company cost P90 (the value at index floor(0.1 n) of the sorted costs, the
-- LOW cost), day-rate companyPays (the mean over all iterations of pay less
-- planned pay where the contractor cost overruns the plan)].
create or replace function pg_temp.sc2_mc(pdays double precision, n0 double precision, n1 double precision, n2 double precision,
                                          c0 double precision, c1 double precision, c2 double precision, fixed double precision,
                                          mob double precision, rate double precision, fee double precision, iters int, seed bigint)
returns double precision[] language plpgsql immutable as $f$
declare st bigint := seed & 4294967295; t bigint; u double precision; i int; days double precision; dc double precision;
        cost double precision; d0 double precision := pdays * (1 + n1); cost0 double precision; pay0 double precision;
        dr double precision[] := array_fill(0.0::double precision, array[iters]);
        rb double precision[] := array_fill(0.0::double precision, array[iters]); cp double precision := 0; m double precision := 0;
begin
  cost0 := fixed + d0 * c1;
  pay0 := mob + rate * d0;
  for i in 1 .. iters loop
    st := (st + 1831565813) & 4294967295;
    t := pg_temp.sc2_imul(st # (st >> 15), st | 1);
    t := t # ((t + pg_temp.sc2_imul(t # (t >> 7), t | 61)) & 4294967295);
    u := (t # (t >> 14))::double precision / 4294967296.0;
    days := pdays * (1 + pg_temp.sc2_tri(u, n0, n1, n2));
    st := (st + 1831565813) & 4294967295;
    t := pg_temp.sc2_imul(st # (st >> 15), st | 1);
    t := t # ((t + pg_temp.sc2_imul(t # (t >> 7), t | 61)) & 4294967295);
    u := (t # (t >> 14))::double precision / 4294967296.0;
    dc := pg_temp.sc2_tri(u, c0, c1, c2);
    cost := fixed + days * dc;
    dr[i] := mob + rate * days;
    rb[i] := cost * (1 + fee);
    if cost > cost0 then cp := cp + (dr[i] - pay0); end if;
  end loop;
  for i in 1 .. iters loop m := m + dr[i]; end loop;
  rb := array(select x from unnest(rb) x order by x);
  return array[m / iters::double precision, rb[floor(0.1 * iters)::int + 1], cp / iters::double precision];
end $f$;

-- The should-cost (wellCost evaluateProgram then afeCosts): per-day items x
-- the programme's days at the NPT fraction, lump items as valued, tangible and
-- intangible added, contingency a fraction of that base. Returns [estimate,
-- the operator's amount (100 less the partners' working interests)].
create or replace function pg_temp.sc2_should(prog jsonb, npt double precision, items jsonb, cont double precision, partners jsonb)
returns double precision[] language plpgsql immutable as $f$
declare days double precision := pg_temp.sc2_days(prog, npt); tan double precision := 0; itg double precision := 0;
        it jsonb; amt double precision; base double precision; total double precision; pt double precision := 0; p jsonb;
begin
  for it in select e from jsonb_array_elements(items) with ordinality t(e, o) order by o loop
    amt := case it->>'basis' when 'per-day' then pg_temp.sc2_n(it->'rate') * days when 'lump' then pg_temp.sc2_n(it->'value') end;
    if it->>'category' = 'tangible' then tan := tan + amt; elsif it->>'category' = 'intangible' then itg := itg + amt; end if;
  end loop;
  base := tan + itg;
  total := base + cont * base;
  for p in select e from jsonb_array_elements(partners) with ordinality t(e, o) order by o loop
    pt := pt + pg_temp.sc2_n(p->'working_interest');
  end loop;
  return array[total, total * ((100 - pt) / 100.0)];
end $f$;
