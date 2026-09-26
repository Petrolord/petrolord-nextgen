-- ============================================================================
-- SC2 GO-LIVE (HELD): Procurement, Tendering & Contracting flips to
-- 'available', the SECOND course of the Supply Chain module, at path_order
-- 71.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/procurement. The 78 lessons, the teaching lab
-- (tenderLab.js), its three calculator panels (envelope, award and contract)
-- and the three capstone case files ship in the ZIP and NOT in this database,
-- so a flip before the upload puts a live catalogue tile in front of a route
-- that does not exist. AN ENGINE COURSE: there is no Suite app and no Suite
-- upload to wait for. This file is written, dry-run and left unapplied on
-- purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values sc2_capstone.mjs returned through
--      the vendored engines/supplychain/tender.js when this file was
--      generated, to the last bit, so a capstone row an earlier seed left
--      behind, or a move of one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the data in the case files and the
--      settings the prompts state: the technical percentage, the ITB 35.1
--      arithmetic correction, the evaluated cost (discount, deviations, the
--      ITB 34.1 average for an omission, the schedule adjustment, the
--      life-cycle net present cost), the combined score, the Nigerian content
--      weighted by spend, the s.14 lead under both readings, the ALB limit
--      with the population standard deviation, the Monte Carlo on the
--      mulberry32 stream rebuilt in 64-bit integer arithmetic with the
--      triangular inverse CDF and the floor-index percentile, the wellCost
--      duration forms, the AFE rollup, the partner split, and the OKIGWE
--      tender evaluated again for its award; each to 1e-9 relative;
--   3. by the ORACLE: oracle_check.py's run of the vendored stdlib Python
--      oracle (tools/validation/supplychain/oracle_tender.py), written in by
--      value, each seeded value within its tolerance of the oracle's;
--   4. by the TRAPS the course is built on: every wrong method
--      discriminate.mjs swept through the engine for a field, written in by
--      value, must miss the seeded value by more than the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
--
-- NO BEGIN OR COMMIT. Like every course migration in this repository, the
-- file carries no transaction lines of its own; apply_sc2_procurement.sh wraps
-- it in one transaction.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. Every field must
-- carry a non-zero, non-whole expected value at its own shipped tolerance
-- (the one gradedTolerance.js derives, never below the six-decimal floor
-- 5e-7) with a label and a unit, the six-decimal answer the prompt asks for
-- must pass, and at the six-decimal floor one unit either side of it in the
-- sixth decimal must fail.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and the generator refuses a bare integer denominator.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================
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

do $$
#variable_conflict use_column
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_s double precision; v_wrong double precision;
  v_open jsonb; v_th double precision; v_cmin double precision; v_top text; v_k double precision[];
  v_costs double precision[]; v_ids text[]; v_nc double precision[]; v_pd double precision;
  v_g_onitsha_on3_technical_percent double precision;
  v_g_onitsha_on2_corrected_price double precision;
  v_g_onitsha_on3_omission_amount double precision;
  v_g_onitsha_on1_evaluated_cost double precision;
  v_g_onitsha_on2_commercial_score double precision;
  v_g_onitsha_top_combined_score double precision;
  v_g_umuahia_um2_life_cycle_cost double precision;
  v_g_umuahia_um4_evaluated_cost double precision;
  v_g_umuahia_alb_limit double precision;
  v_g_umuahia_um3_overall_content double precision;
  v_g_umuahia_s14_lead_points double precision;
  v_g_umuahia_s14_lead_relative double precision;
  v_g_okigwe_dayrate_mean_cost double precision;
  v_g_okigwe_reimbursable_p90_cost double precision;
  v_g_okigwe_dayrate_company_pays double precision;
  v_g_okigwe_should_cost_estimate double precision;
  v_g_okigwe_operator_amount double precision;
  v_g_okigwe_award_ratio double precision;
  v_on jsonb := '{"dataset":"ONITSHA (synthetic)","tender":"EK-11/WS/2027-19 (synthetic)","scope":"Coiled tubing scale cleanout with nitrogen lift on Ekene-2 and Ekene-6","criteria":[{"id":"methodology","weight":32,"maxScore":5},{"id":"personnel","weight":27,"maxScore":5},{"id":"equipment","weight":19,"maxScore":5},{"id":"hse","weight":13,"maxScore":5},{"id":"schedule","weight":9,"maxScore":5}],"bids":[{"id":"ON1","receivedAt":"2027-08-02T09:05:00Z","mandatory":[{"id":"bid-security","met":true},{"id":"signed-bid-form","met":true}],"scores":{"methodology":4,"personnel":4,"equipment":3,"hse":4,"schedule":3},"discount":12500,"completionWeeks":5,"lines":[{"id":"mob","quantity":1,"unitRate":112000,"quotedAmount":112000},{"id":"ct-spread","quantity":15,"unitRate":27450.35,"quotedAmount":411755.25},{"id":"pump-spread","quantity":5,"unitRate":19875.5,"quotedAmount":99377.5},{"id":"dissolver","quantity":40,"unitRate":1612.4,"quotedAmount":64496},{"id":"nitrogen","quantity":100,"unitRate":305.75,"quotedAmount":30575},{"id":"demob","quantity":1,"unitRate":58000,"quotedAmount":58000}]},{"id":"ON2","receivedAt":"2027-08-02T11:47:00Z","mandatory":[{"id":"bid-security","met":true},{"id":"signed-bid-form","met":true}],"scores":{"methodology":3,"personnel":4,"equipment":4,"hse":4,"schedule":3},"completionWeeks":8,"deviations":[{"id":"payment-terms","amount":7250,"reason":"asks for payment in 30 days where the conditions give 60; priced at the interest on the earlier payment"}],"lines":[{"id":"mob","quantity":1,"unitRate":98500,"quotedAmount":98500},{"id":"ct-spread","quantity":15,"unitRate":26980.4,"quotedAmount":406980},{"id":"pump-spread","quantity":5,"unitRate":19210.25,"quotedAmount":96051.25},{"id":"dissolver","quantity":40,"unitRate":1575.8,"quotedAmount":63032},{"id":"nitrogen","quantity":100,"unitRate":298.6,"quotedAmount":29860},{"id":"demob","quantity":1,"unitRate":52500,"quotedAmount":52500}]},{"id":"ON3","receivedAt":"2027-08-03T08:20:00Z","mandatory":[{"id":"bid-security","met":true},{"id":"signed-bid-form","met":true}],"scores":{"methodology":4,"personnel":4,"equipment":4,"hse":5,"schedule":3},"completionWeeks":7,"omitted":["nitrogen"],"lines":[{"id":"mob","quantity":1,"unitRate":104000,"quotedAmount":104000},{"id":"ct-spread","quantity":15,"unitRate":28120.6,"quotedAmount":421809},{"id":"pump-spread","quantity":5,"unitRate":20480.75,"quotedAmount":102403.75},{"id":"dissolver","quantity":40,"unitRate":1650.25,"quotedAmount":66010},{"id":"demob","quantity":1,"unitRate":55500,"quotedAmount":55500}]},{"id":"ON4","receivedAt":"2027-08-03T10:02:00Z","mandatory":[{"id":"bid-security","met":true},{"id":"signed-bid-form","met":true}],"scores":{"methodology":3,"personnel":2,"equipment":3,"hse":3,"schedule":2},"completionWeeks":6,"lines":[{"id":"mob","quantity":1,"unitRate":82000,"quotedAmount":82000},{"id":"ct-spread","quantity":15,"unitRate":23840.5,"quotedAmount":357607.5},{"id":"pump-spread","quantity":5,"unitRate":16950,"quotedAmount":84750},{"id":"dissolver","quantity":40,"unitRate":1380.6,"quotedAmount":55224},{"id":"nitrogen","quantity":100,"unitRate":262.4,"quotedAmount":26240},{"id":"demob","quantity":1,"unitRate":41000,"quotedAmount":41000}]},{"id":"ON5","receivedAt":"2027-08-03T14:36:00Z","mandatory":[{"id":"bid-security","met":true},{"id":"signed-bid-form","met":true}],"scores":{"methodology":4,"personnel":3,"equipment":3,"hse":3,"schedule":3},"completionWeeks":9,"lines":[{"id":"mob","quantity":1,"unitRate":99000,"quotedAmount":99000},{"id":"ct-spread","quantity":15,"unitRate":26250.8,"quotedAmount":393762},{"id":"pump-spread","quantity":5,"unitRate":18990.4,"quotedAmount":94952},{"id":"dissolver","quantity":40,"unitRate":15.482,"quotedAmount":61928,"decimalMisplaced":true},{"id":"nitrogen","quantity":100,"unitRate":289.15,"quotedAmount":28915},{"id":"demob","quantity":1,"unitRate":49750,"quotedAmount":49750}]},{"id":"ON6","receivedAt":"2027-08-04T16:41:00Z","mandatory":[{"id":"bid-security","met":false},{"id":"signed-bid-form","met":true}],"scores":{"methodology":5,"personnel":4,"equipment":4,"hse":4,"schedule":4},"completionWeeks":6,"lines":[{"id":"mob","quantity":1,"unitRate":126000,"quotedAmount":126000},{"id":"ct-spread","quantity":15,"unitRate":29900,"quotedAmount":448500},{"id":"pump-spread","quantity":5,"unitRate":22400,"quotedAmount":112000},{"id":"dissolver","quantity":40,"unitRate":1720,"quotedAmount":68800},{"id":"nitrogen","quantity":100,"unitRate":318,"quotedAmount":31800},{"id":"demob","quantity":1,"unitRate":63000,"quotedAmount":63000}]}]}'::jsonb;
  v_um jsonb := '{"dataset":"UMUAHIA (synthetic)","tender":"EK-11/MS/2027-23 (synthetic)","scope":"Casing, gate valves, cement, baryte and inspection for two Ekene infill wells","criteria":[{"id":"specification","weight":55,"maxScore":4},{"id":"delivery","weight":30,"maxScore":4},{"id":"after-sales","weight":15,"maxScore":4}],"contentItems":[{"id":"casing","scheduleLine":"steel-pipes"},{"id":"valves","scheduleLine":"valves"},{"id":"cement","scheduleLine":"cement-portland"},{"id":"baryte","scheduleLine":"drilling-mud-baryte-bentonite"}],"bids":[{"id":"UM1","receivedAt":"2027-09-06T09:30:00Z","mandatory":[{"id":"bid-security","met":true},{"id":"manufacturer-authorisation","met":true}],"scores":{"specification":3,"delivery":3,"after-sales":3},"completionWeeks":10,"annualCosts":[5200,5200,5200,5200,5200,5200],"lines":[{"id":"casing","quantity":200,"unitRate":1612.5,"quotedAmount":322500},{"id":"valves","quantity":30,"unitRate":3965,"quotedAmount":118950},{"id":"cement","quantity":160,"unitRate":302.4,"quotedAmount":48384},{"id":"baryte","quantity":220,"unitRate":405.2,"quotedAmount":89144},{"id":"inspection","quantity":1,"unitRate":11800,"quotedAmount":11800}],"nc":{"casing":{"measure":"tonnage","nigerian":118,"total":200},"valves":{"measure":"number","nigerian":19,"total":30},"cement":{"measure":"tonnage","nigerian":131,"total":160},"baryte":{"measure":"tonnage","nigerian":139,"total":220}},"indigenous":false,"capacity":true},{"id":"UM2","receivedAt":"2027-09-06T13:10:00Z","mandatory":[{"id":"bid-security","met":true},{"id":"manufacturer-authorisation","met":true}],"scores":{"specification":3,"delivery":3,"after-sales":3},"completionWeeks":9,"annualCosts":[4850,4850,4850,4850,4850,4850],"lines":[{"id":"casing","quantity":200,"unitRate":1628.4,"quotedAmount":325680},{"id":"valves","quantity":30,"unitRate":4015.5,"quotedAmount":120465},{"id":"cement","quantity":160,"unitRate":298.75,"quotedAmount":47800},{"id":"baryte","quantity":220,"unitRate":399.6,"quotedAmount":87912},{"id":"inspection","quantity":1,"unitRate":10400,"quotedAmount":10400}],"nc":{"casing":{"measure":"tonnage","nigerian":124,"total":200},"valves":{"measure":"number","nigerian":18,"total":30},"cement":{"measure":"tonnage","nigerian":128,"total":160},"baryte":{"measure":"tonnage","nigerian":134,"total":220}},"indigenous":false,"capacity":true,"residualValue":3000},{"id":"UM3","receivedAt":"2027-09-07T08:55:00Z","mandatory":[{"id":"bid-security","met":true},{"id":"manufacturer-authorisation","met":true}],"scores":{"specification":4,"delivery":3,"after-sales":3},"completionWeeks":8,"annualCosts":[4600,4600,4600,4600,4600,4600],"lines":[{"id":"casing","quantity":200,"unitRate":1705.2,"quotedAmount":341040},{"id":"valves","quantity":30,"unitRate":4180,"quotedAmount":125400},{"id":"cement","quantity":160,"unitRate":316.5,"quotedAmount":50640},{"id":"baryte","quantity":220,"unitRate":421.8,"quotedAmount":92796},{"id":"inspection","quantity":1,"unitRate":14100,"quotedAmount":14100}],"nc":{"casing":{"measure":"tonnage","nigerian":196,"total":200},"valves":{"measure":"number","nigerian":21,"total":30},"cement":{"measure":"tonnage","nigerian":144,"total":160},"baryte":{"measure":"tonnage","nigerian":150,"total":220}},"indigenous":true,"capacity":true},{"id":"UM4","receivedAt":"2027-09-07T11:25:00Z","mandatory":[{"id":"bid-security","met":true},{"id":"manufacturer-authorisation","met":true}],"scores":{"specification":3,"delivery":2,"after-sales":4},"completionWeeks":11,"annualCosts":[6100,6100,6100,6100,6100,6100],"lines":[{"id":"casing","quantity":200,"unitRate":1571.8,"quotedAmount":314360},{"id":"valves","quantity":30,"unitRate":3902.25,"quotedAmount":117067.5},{"id":"cement","quantity":160,"unitRate":294.6,"quotedAmount":47136},{"id":"baryte","quantity":220,"unitRate":396.4,"quotedAmount":87208}],"nc":{"casing":{"measure":"tonnage","nigerian":112,"total":200},"valves":{"measure":"number","nigerian":17,"total":30},"cement":{"measure":"tonnage","nigerian":129,"total":160},"baryte":{"measure":"tonnage","nigerian":136,"total":220}},"indigenous":false,"capacity":true,"omitted":["inspection"]},{"id":"UM5","receivedAt":"2027-09-07T15:40:00Z","mandatory":[{"id":"bid-security","met":true},{"id":"manufacturer-authorisation","met":true}],"scores":{"specification":3,"delivery":3,"after-sales":2},"completionWeeks":12,"annualCosts":[5600,5600,5600,5600,5600,5600],"lines":[{"id":"casing","quantity":200,"unitRate":1650.7,"quotedAmount":330140},{"id":"valves","quantity":30,"unitRate":4088,"quotedAmount":122640},{"id":"cement","quantity":160,"unitRate":309.9,"quotedAmount":49584},{"id":"baryte","quantity":220,"unitRate":411.5,"quotedAmount":90530},{"id":"inspection","quantity":1,"unitRate":12650,"quotedAmount":12650}],"nc":{"casing":{"measure":"tonnage","nigerian":140,"total":200},"valves":{"measure":"number","nigerian":20,"total":30},"cement":{"measure":"tonnage","nigerian":134,"total":160},"baryte":{"measure":"tonnage","nigerian":141,"total":220}},"indigenous":true,"capacity":true},{"id":"UM6","receivedAt":"2027-09-08T10:15:00Z","mandatory":[{"id":"bid-security","met":true},{"id":"manufacturer-authorisation","met":true}],"scores":{"specification":2,"delivery":2,"after-sales":2},"completionWeeks":9,"annualCosts":[6400,6400,6400,6400,6400,6400],"lines":[{"id":"casing","quantity":200,"unitRate":1498.3,"quotedAmount":299660},{"id":"valves","quantity":30,"unitRate":3780,"quotedAmount":113400},{"id":"cement","quantity":160,"unitRate":281.2,"quotedAmount":44992},{"id":"baryte","quantity":220,"unitRate":377.9,"quotedAmount":83138},{"id":"inspection","quantity":1,"unitRate":8900,"quotedAmount":8900}],"nc":{"casing":{"measure":"tonnage","nigerian":100,"total":200},"valves":{"measure":"number","nigerian":14,"total":30},"cement":{"measure":"tonnage","nigerian":110,"total":160},"baryte":{"measure":"tonnage","nigerian":118,"total":220}},"indigenous":false,"capacity":true}]}'::jsonb;
  v_ok jsonb := '{"dataset":"OKIGWE (synthetic)","scope":"Fishing and recompletion workover on Ekene-4 (synthetic)","program":[{"id":"rigup","kind":"flat","label":"Move in and rig up on Ekene-4","durationHr":36},{"id":"kill","kind":"flat","label":"Kill the well and set the barrier","durationHr":14},{"id":"pull","kind":"trip","label":"Pull the completion","mdM":1580,"tripSpeedMPerHr":450},{"id":"fish-trip","kind":"trip","label":"Run and pull the fishing string","mdM":1560,"tripSpeedMPerHr":700},{"id":"fish","kind":"flat","label":"Fish the parted tubing","durationHr":30},{"id":"clean","kind":"flat","label":"Clean out to the perforations","durationHr":18},{"id":"run","kind":"casing","label":"Run the new completion","mdM":1580,"runSpeedMPerHr":400,"flatHr":10},{"id":"test","kind":"flat","label":"Test and hand over","durationHr":20},{"id":"rigdown","kind":"flat","label":"Rig down and move off","durationHr":30}],"costItems":[{"id":"rig","label":"Workover rig spread","basis":"per-day","rate":21800,"category":"intangible"},{"id":"supervision","label":"Company supervision","basis":"per-day","rate":2900,"category":"intangible"},{"id":"fishing","label":"Fishing tools and operator","basis":"lump","value":64000,"category":"intangible"},{"id":"fluids","label":"Completion fluids","basis":"lump","value":38500,"category":"tangible"},{"id":"completion","label":"Completion string","basis":"lump","value":142000,"category":"tangible"},{"id":"mob-demob","label":"Mobilisation and demobilisation","basis":"lump","value":118000,"category":"intangible"}],"partners":[{"name":"Partner EK-B (synthetic)","working_interest":35},{"name":"Partner EK-D (synthetic)","working_interest":22.5}],"criteria":[{"id":"method","weight":40,"maxScore":4},{"id":"crew","weight":30,"maxScore":4},{"id":"equipment","weight":20,"maxScore":4},{"id":"hse","weight":10,"maxScore":4}],"bids":[{"id":"OK1","receivedAt":"2027-10-11T09:00:00Z","mandatory":[{"id":"bid-security","met":true}],"scores":{"method":3,"crew":3,"equipment":3,"hse":4},"completionWeeks":4,"lines":[{"id":"mob","quantity":1,"unitRate":118500,"quotedAmount":118500},{"id":"rig","quantity":16,"unitRate":23150.5,"quotedAmount":370408},{"id":"fishing","quantity":1,"unitRate":61200,"quotedAmount":61200},{"id":"fluids","quantity":1,"unitRate":40150,"quotedAmount":40150},{"id":"completion","quantity":1,"unitRate":139800,"quotedAmount":139800}]},{"id":"OK2","receivedAt":"2027-10-11T10:30:00Z","mandatory":[{"id":"bid-security","met":true}],"scores":{"method":4,"crew":3,"equipment":4,"hse":3},"completionWeeks":3,"lines":[{"id":"mob","quantity":1,"unitRate":126000,"quotedAmount":126000},{"id":"rig","quantity":16,"unitRate":24480.25,"quotedAmount":391684},{"id":"fishing","quantity":1,"unitRate":66800,"quotedAmount":66800},{"id":"fluids","quantity":1,"unitRate":41200,"quotedAmount":41200},{"id":"completion","quantity":1,"unitRate":146250,"quotedAmount":146250}]},{"id":"OK3","receivedAt":"2027-10-12T08:45:00Z","mandatory":[{"id":"bid-security","met":true}],"scores":{"method":3,"crew":2,"equipment":3,"hse":3},"completionWeeks":5,"lines":[{"id":"mob","quantity":1,"unitRate":104000,"quotedAmount":104000},{"id":"rig","quantity":16,"unitRate":21870.4,"quotedAmount":349926.4},{"id":"fishing","quantity":1,"unitRate":58900,"quotedAmount":58900},{"id":"fluids","quantity":1,"unitRate":37600,"quotedAmount":37600},{"id":"completion","quantity":1,"unitRate":133400,"quotedAmount":133400}]},{"id":"OK4","receivedAt":"2027-10-12T14:05:00Z","mandatory":[{"id":"bid-security","met":true}],"scores":{"method":2,"crew":2,"equipment":2,"hse":3},"completionWeeks":4,"lines":[{"id":"mob","quantity":1,"unitRate":96000,"quotedAmount":96000},{"id":"rig","quantity":16,"unitRate":20450,"quotedAmount":327200},{"id":"fishing","quantity":1,"unitRate":52000,"quotedAmount":52000},{"id":"fluids","quantity":1,"unitRate":33900,"quotedAmount":33900},{"id":"completion","quantity":1,"unitRate":128700,"quotedAmount":128700}]},{"id":"OK5","receivedAt":"2027-10-13T11:20:00Z","mandatory":[{"id":"bid-security","met":true}],"scores":{"method":4,"crew":4,"equipment":3,"hse":4},"completionWeeks":5,"lines":[{"id":"mob","quantity":1,"unitRate":131000,"quotedAmount":131000},{"id":"rig","quantity":16,"unitRate":25320.8,"quotedAmount":405132.8},{"id":"fishing","quantity":1,"unitRate":69500,"quotedAmount":69500},{"id":"fluids","quantity":1,"unitRate":42800,"quotedAmount":42800},{"id":"completion","quantity":1,"unitRate":151300,"quotedAmount":151300}]}]}'::jsonb;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'procurement' and active;
  if v_structures <> 3 then
    raise exception 'SC2 go-live refused: procurement has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'procurement';
  if v_questions <> 396 then
    raise exception 'SC2 go-live refused: procurement has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'procurement' group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'SC2 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;
  select count(*) into v_n from (select tier, module_key from public.academy_quiz_questions where app_slug = 'procurement' and scope = 'module' group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'SC2 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'procurement' and scope = 'final' group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'SC2 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = 'procurement'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'SC2 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;
  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'procurement' and s.active;
  if v_lessons <> 78 then
    raise exception 'SC2 go-live refused: procurement carries % lesson keys, expected 78', v_lessons;
  end if;
  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'procurement' and s.active;
  if v_modules <> 18 then
    raise exception 'SC2 go-live refused: procurement carries % modules, expected 18 (six per tier)', v_modules;
  end if;
  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'procurement' and qq.scope = 'module' and not exists (
       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'SC2 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'procurement';
  if v_capstones <> 3 then
    raise exception 'SC2 go-live refused: procurement has % capstones, expected 3', v_capstones;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'procurement';
  if v_graded <> 18 then
    raise exception 'SC2 go-live refused: procurement has % graded capstone fields, expected 18', v_graded;
  end if;
  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'procurement' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'SC2 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'procurement' and module = 'supply_chain' and path_order = 71 and prereq_slug is null) then
    raise exception 'SC2 go-live refused: the procurement catalogue row is not supply_chain at path_order 71 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 71 and slug <> 'procurement') then
    raise exception 'SC2 go-live refused: another course already holds path_order 71';
  end if;

  -- ------------------------------------------------- the grader is numeric
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or abs((f->>'expected')::numeric) <= 0.001
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric is distinct from (select t.tol from (values ('beginner', 'onitsha_on3_technical_percent', 5e-07::numeric), ('beginner', 'onitsha_on2_corrected_price', 5e-07::numeric), ('beginner', 'onitsha_on3_omission_amount', 5e-07::numeric), ('beginner', 'onitsha_on1_evaluated_cost', 5e-07::numeric), ('beginner', 'onitsha_on2_commercial_score', 5e-07::numeric), ('beginner', 'onitsha_top_combined_score', 5e-07::numeric), ('intermediate', 'umuahia_um2_life_cycle_cost', 5e-07::numeric), ('intermediate', 'umuahia_um4_evaluated_cost', 5e-07::numeric), ('intermediate', 'umuahia_alb_limit', 5e-07::numeric), ('intermediate', 'umuahia_um3_overall_content', 5e-07::numeric), ('intermediate', 'umuahia_s14_lead_points', 5e-07::numeric), ('intermediate', 'umuahia_s14_lead_relative', 5e-07::numeric), ('advanced', 'okigwe_dayrate_mean_cost', 5e-07::numeric), ('advanced', 'okigwe_reimbursable_p90_cost', 5e-07::numeric), ('advanced', 'okigwe_dayrate_company_pays', 5e-07::numeric), ('advanced', 'okigwe_should_cost_estimate', 5e-07::numeric), ('advanced', 'okigwe_operator_amount', 5e-07::numeric), ('advanced', 'okigwe_award_ratio', 5e-07::numeric)) t(tier, k, tol) where t.tier = c.tier and t.k = f->>'key')
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'SC2 go-live refused: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;
  end if;
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or ((f->>'tol')::numeric = 0.0000005
              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));
  if v_n <> 0 then
    raise exception 'SC2 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or, at the six-decimal floor, pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;

  -- ---------------------------------------- the prompts the learner reads
  select prompt into v_prompt from public.academy_capstones where app_slug = 'procurement' and tier = 'beginner';
  if v_prompt is null or md5(v_prompt) <> '50f2f102121eea670db5534fa23700ff' then
    raise exception 'SC2 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'procurement' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'ONITSHA, 6 well services bids in two envelopes' and title = 'Two envelopes, by hand') then
    raise exception 'SC2 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['pass mark 65', 'minWeeks 6', 'ratePerWeek 0.0035', 'maxWeeks 10', 'technical weight 0.65', 'average of the corrected amounts', 'lowest-ratio commercial score', 'relative technical score', 'no credit is given', 'ties at twelve significant digits go to the lower evaluated cost, then the earlier receipt, then the bidder id', 'onitsha_case.json']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'SC2 go-live refused: % stated setting(s) or case file(s) are not named in the shipped beginner prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'procurement' and tier = 'intermediate';
  if v_prompt is null or md5(v_prompt) <> 'e9e4c858d8eb8ae57ed6a82055af4a99' then
    raise exception 'SC2 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'procurement' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'UMUAHIA, 6 materials bids, a life cycle and the content Act' and title = 'The lowest evaluated cost and the content Act') then
    raise exception 'SC2 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['pass mark 62', 'minWeeks 8', 'ratePerWeek 0.003', 'maxWeeks 13', 'discountRate of 0.08', '6 years', 'residual value credited in the last year', 'its own quoted amount for each item, its spend on the item', 'population standard deviation', 'within 1 percent of the lowest evaluated cost', 'percentage points', 'closest competitor''s content', 'ties at twelve significant digits go to the lower evaluated cost, then the earlier receipt, then the bidder id', 'umuahia_case.json']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'SC2 go-live refused: % stated setting(s) or case file(s) are not named in the shipped intermediate prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'procurement' and tier = 'advanced';
  if v_prompt is null or md5(v_prompt) <> 'd4041a59efcfd1976c3d833ffd9cd881' then
    raise exception 'SC2 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'procurement' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'OKIGWE, one workover under three contract types, its should-cost and its tender' and title = 'Contracts, should-cost and the whole tender') then
    raise exception 'SC2 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['min 0.04, mode 0.12 and max 0.5', 'min 31000, mode 34500 and max 46000', 'fixed cost 95000', 'lump sum 640000', 'day rate 41500 a day plus a mobilisation fee of 120000', 'cost plus 0.1 of cost', 'the plan at the modes', '4000 iterations on seed 70611', 'NPT fraction 0.12', 'contingency 0.12', 'pass mark 60', 'minWeeks 3', 'ratePerWeek 0.006', 'maxWeeks 6', 'technical weight 0.75', 'the LOW cost', 'ties at twelve significant digits go to the lower evaluated cost, then the earlier receipt, then the bidder id', 'okigwe_case.json']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'SC2 go-live refused: % stated setting(s) or case file(s) are not named in the shipped advanced prompt: %', v_n, v_names;
  end if;
  -- No number handed in any capstone text of this course may sit within its
  -- tolerance of any graded value of any tier.
  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names
    from (select c.tier as ctier, m[1]::double precision as x
            from public.academy_capstones c,
                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||
                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),
                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m
           where c.app_slug = 'procurement') h,
         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'procurement') g
   where abs(abs(h.x) - abs(g.v)) <= g.t;
  if v_n <> 0 then
    raise exception 'SC2 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_onitsha_on3_technical_percent
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'beginner' and f->>'key' = 'onitsha_on3_technical_percent';
  if v_g_onitsha_on3_technical_percent is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: beginner/onitsha_on3_technical_percent]';
  end if;
  select (f->>'expected')::double precision into v_g_onitsha_on2_corrected_price
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'beginner' and f->>'key' = 'onitsha_on2_corrected_price';
  if v_g_onitsha_on2_corrected_price is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: beginner/onitsha_on2_corrected_price]';
  end if;
  select (f->>'expected')::double precision into v_g_onitsha_on3_omission_amount
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'beginner' and f->>'key' = 'onitsha_on3_omission_amount';
  if v_g_onitsha_on3_omission_amount is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: beginner/onitsha_on3_omission_amount]';
  end if;
  select (f->>'expected')::double precision into v_g_onitsha_on1_evaluated_cost
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'beginner' and f->>'key' = 'onitsha_on1_evaluated_cost';
  if v_g_onitsha_on1_evaluated_cost is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: beginner/onitsha_on1_evaluated_cost]';
  end if;
  select (f->>'expected')::double precision into v_g_onitsha_on2_commercial_score
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'beginner' and f->>'key' = 'onitsha_on2_commercial_score';
  if v_g_onitsha_on2_commercial_score is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: beginner/onitsha_on2_commercial_score]';
  end if;
  select (f->>'expected')::double precision into v_g_onitsha_top_combined_score
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'beginner' and f->>'key' = 'onitsha_top_combined_score';
  if v_g_onitsha_top_combined_score is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: beginner/onitsha_top_combined_score]';
  end if;
  select (f->>'expected')::double precision into v_g_umuahia_um2_life_cycle_cost
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'intermediate' and f->>'key' = 'umuahia_um2_life_cycle_cost';
  if v_g_umuahia_um2_life_cycle_cost is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: intermediate/umuahia_um2_life_cycle_cost]';
  end if;
  select (f->>'expected')::double precision into v_g_umuahia_um4_evaluated_cost
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'intermediate' and f->>'key' = 'umuahia_um4_evaluated_cost';
  if v_g_umuahia_um4_evaluated_cost is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: intermediate/umuahia_um4_evaluated_cost]';
  end if;
  select (f->>'expected')::double precision into v_g_umuahia_alb_limit
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'intermediate' and f->>'key' = 'umuahia_alb_limit';
  if v_g_umuahia_alb_limit is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: intermediate/umuahia_alb_limit]';
  end if;
  select (f->>'expected')::double precision into v_g_umuahia_um3_overall_content
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'intermediate' and f->>'key' = 'umuahia_um3_overall_content';
  if v_g_umuahia_um3_overall_content is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: intermediate/umuahia_um3_overall_content]';
  end if;
  select (f->>'expected')::double precision into v_g_umuahia_s14_lead_points
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'intermediate' and f->>'key' = 'umuahia_s14_lead_points';
  if v_g_umuahia_s14_lead_points is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: intermediate/umuahia_s14_lead_points]';
  end if;
  select (f->>'expected')::double precision into v_g_umuahia_s14_lead_relative
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'intermediate' and f->>'key' = 'umuahia_s14_lead_relative';
  if v_g_umuahia_s14_lead_relative is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: intermediate/umuahia_s14_lead_relative]';
  end if;
  select (f->>'expected')::double precision into v_g_okigwe_dayrate_mean_cost
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'advanced' and f->>'key' = 'okigwe_dayrate_mean_cost';
  if v_g_okigwe_dayrate_mean_cost is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: advanced/okigwe_dayrate_mean_cost]';
  end if;
  select (f->>'expected')::double precision into v_g_okigwe_reimbursable_p90_cost
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'advanced' and f->>'key' = 'okigwe_reimbursable_p90_cost';
  if v_g_okigwe_reimbursable_p90_cost is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: advanced/okigwe_reimbursable_p90_cost]';
  end if;
  select (f->>'expected')::double precision into v_g_okigwe_dayrate_company_pays
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'advanced' and f->>'key' = 'okigwe_dayrate_company_pays';
  if v_g_okigwe_dayrate_company_pays is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: advanced/okigwe_dayrate_company_pays]';
  end if;
  select (f->>'expected')::double precision into v_g_okigwe_should_cost_estimate
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'advanced' and f->>'key' = 'okigwe_should_cost_estimate';
  if v_g_okigwe_should_cost_estimate is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: advanced/okigwe_should_cost_estimate]';
  end if;
  select (f->>'expected')::double precision into v_g_okigwe_operator_amount
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'advanced' and f->>'key' = 'okigwe_operator_amount';
  if v_g_okigwe_operator_amount is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: advanced/okigwe_operator_amount]';
  end if;
  select (f->>'expected')::double precision into v_g_okigwe_award_ratio
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'procurement' and c.tier = 'advanced' and f->>'key' = 'okigwe_award_ratio';
  if v_g_okigwe_award_ratio is null then
    raise exception 'SC2 go-live refused: the seeded rows carry no value [graded field: advanced/okigwe_award_ratio]';
  end if;

  -- ------------------------------------------ 1. against the engine ledger
  if v_g_onitsha_on3_technical_percent <> 80.80000000000001::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 80.80000000000001 [graded field: beginner/onitsha_on3_technical_percent]', v_g_onitsha_on3_technical_percent;
  end if;
  if v_g_onitsha_on2_corrected_price <> 744649.25::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 744649.25 [graded field: beginner/onitsha_on2_corrected_price]', v_g_onitsha_on2_corrected_price;
  end if;
  if v_g_onitsha_on3_omission_amount <> 29783.333333333332::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 29783.333333333332 [graded field: beginner/onitsha_on3_omission_amount]', v_g_onitsha_on3_omission_amount;
  end if;
  if v_g_onitsha_on1_evaluated_cost <> 763703.75::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 763703.75 [graded field: beginner/onitsha_on1_evaluated_cost]', v_g_onitsha_on1_evaluated_cost;
  end if;
  if v_g_onitsha_on2_commercial_score <> 97.20548915012131::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 97.20548915012131 [graded field: beginner/onitsha_on2_commercial_score]', v_g_onitsha_on2_commercial_score;
  end if;
  if v_g_onitsha_top_combined_score <> 97.93364798993775::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 97.93364798993775 [graded field: beginner/onitsha_top_combined_score]', v_g_onitsha_top_combined_score;
  end if;
  if v_g_umuahia_um2_life_cycle_cost <> 20530.457489562454::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 20530.457489562454 [graded field: intermediate/umuahia_um2_life_cycle_cost]', v_g_umuahia_um2_life_cycle_cost;
  end if;
  if v_g_umuahia_um4_evaluated_cost <> 611300.5094501633::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 611300.5094501633 [graded field: intermediate/umuahia_um4_evaluated_cost]', v_g_umuahia_um4_evaluated_cost;
  end if;
  if v_g_umuahia_alb_limit <> 611951.112477194::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 611951.112477194 [graded field: intermediate/umuahia_alb_limit]', v_g_umuahia_alb_limit;
  end if;
  if v_g_umuahia_um3_overall_content <> 87.04149696003778::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 87.04149696003778 [graded field: intermediate/umuahia_um3_overall_content]', v_g_umuahia_um3_overall_content;
  end if;
  if v_g_umuahia_s14_lead_points <> 3.8134829361852667::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 3.8134829361852667 [graded field: intermediate/umuahia_s14_lead_points]', v_g_umuahia_s14_lead_points;
  end if;
  if v_g_umuahia_s14_lead_relative <> 6.45408598407401::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 6.45408598407401 [graded field: intermediate/umuahia_s14_lead_relative]', v_g_umuahia_s14_lead_relative;
  end if;
  if v_g_okigwe_dayrate_mean_cost <> 485297.525439615::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 485297.525439615 [graded field: advanced/okigwe_dayrate_mean_cost]', v_g_okigwe_dayrate_mean_cost;
  end if;
  if v_g_okigwe_reimbursable_p90_cost <> 412328.0252625307::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 412328.0252625307 [graded field: advanced/okigwe_reimbursable_p90_cost]', v_g_okigwe_reimbursable_p90_cost;
  end if;
  if v_g_okigwe_dayrate_company_pays <> 29822.041700703197::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 29822.041700703197 [graded field: advanced/okigwe_dayrate_company_pays]', v_g_okigwe_dayrate_company_pays;
  end if;
  if v_g_okigwe_should_cost_estimate <> 629894.997925926::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 629894.997925926 [graded field: advanced/okigwe_should_cost_estimate]', v_g_okigwe_should_cost_estimate;
  end if;
  if v_g_okigwe_operator_amount <> 267705.37411851855::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 267705.37411851855 [graded field: advanced/okigwe_operator_amount]', v_g_okigwe_operator_amount;
  end if;
  if v_g_okigwe_award_ratio <> 1.2848642968509094::double precision then
    raise exception 'SC2 go-live refused: the seeded value is %, and the engine returned 1.2848642968509094 [graded field: advanced/okigwe_award_ratio]', v_g_okigwe_award_ratio;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  v_open := pg_temp.sc2_open(v_on->'criteria', v_on->'bids', 65.0::double precision);
  v_th := (select max(pg_temp.sc2_tech_pct(v_on->'criteria', e)) from jsonb_array_elements(v_open) e);
  select array_agg(c.id order by c.ord), array_agg(c.cost order by c.ord) into v_ids, v_costs from pg_temp.sc2_costs(v_open, 'average', 6.0::double precision, 10.0::double precision, 0.0035::double precision, null, 0.005::double precision) c;
  v_cmin := (select min(x) from unnest(v_costs) x);
  v_s := pg_temp.sc2_tech_pct(v_on->'criteria', (select e from jsonb_array_elements(v_on->'bids') e where e->>'id' = 'ON3'));
  if v_s is null or abs(v_s - v_g_onitsha_on3_technical_percent) > 1e-9 * abs(v_g_onitsha_on3_technical_percent) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/onitsha_on3_technical_percent]', v_s, v_g_onitsha_on3_technical_percent;
  end if;
  v_s := pg_temp.sc2_price((select e from jsonb_array_elements(v_on->'bids') e where e->>'id' = 'ON2'), 0.005::double precision);
  if v_s is null or abs(v_s - v_g_onitsha_on2_corrected_price) > 1e-9 * abs(v_g_onitsha_on2_corrected_price) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/onitsha_on2_corrected_price]', v_s, v_g_onitsha_on2_corrected_price;
  end if;
  v_s := (select c.omission from pg_temp.sc2_costs(v_open, 'average', 6.0::double precision, 10.0::double precision, 0.0035::double precision, null, 0.005::double precision) c where c.id = 'ON3');
  if v_s is null or abs(v_s - v_g_onitsha_on3_omission_amount) > 1e-9 * abs(v_g_onitsha_on3_omission_amount) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/onitsha_on3_omission_amount]', v_s, v_g_onitsha_on3_omission_amount;
  end if;
  v_s := (select c.cost from pg_temp.sc2_costs(v_open, 'average', 6.0::double precision, 10.0::double precision, 0.0035::double precision, null, 0.005::double precision) c where c.id = 'ON1');
  if v_s is null or abs(v_s - v_g_onitsha_on1_evaluated_cost) > 1e-9 * abs(v_g_onitsha_on1_evaluated_cost) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/onitsha_on1_evaluated_cost]', v_s, v_g_onitsha_on1_evaluated_cost;
  end if;
  v_s := (pg_temp.sc2_combined(pg_temp.sc2_tech_pct(v_on->'criteria', (select e from jsonb_array_elements(v_on->'bids') e where e->>'id' = 'ON2')),
            v_costs[array_position(v_ids, 'ON2')], v_th, v_cmin, 0.65::double precision))[1];
  if v_s is null or abs(v_s - v_g_onitsha_on2_commercial_score) > 1e-9 * abs(v_g_onitsha_on2_commercial_score) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/onitsha_on2_commercial_score]', v_s, v_g_onitsha_on2_commercial_score;
  end if;
  v_s := (select max((pg_temp.sc2_combined(pg_temp.sc2_tech_pct(v_on->'criteria', e),
            v_costs[array_position(v_ids, e->>'id')], v_th, v_cmin, 0.65::double precision))[2])
            from jsonb_array_elements(v_on->'bids') e where e->>'id' = any(v_ids));
  if v_s is null or abs(v_s - v_g_onitsha_top_combined_score) > 1e-9 * abs(v_g_onitsha_top_combined_score) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/onitsha_top_combined_score]', v_s, v_g_onitsha_top_combined_score;
  end if;
  v_open := pg_temp.sc2_open(v_um->'criteria', v_um->'bids', 62.0::double precision);
  v_th := (select max(pg_temp.sc2_tech_pct(v_um->'criteria', e)) from jsonb_array_elements(v_open) e);
  select array_agg(c.id order by c.ord), array_agg(c.cost order by c.ord) into v_ids, v_costs from pg_temp.sc2_costs(v_open, 'average', 8.0::double precision, 13.0::double precision, 0.003::double precision, 0.08::double precision, 0.005::double precision) c;
  v_cmin := (select min(x) from unnest(v_costs) x);
  v_nc := array(select pg_temp.sc2_content((select e from jsonb_array_elements(v_um->'bids') e where e->>'id' = i), array['casing', 'valves', 'cement', 'baryte']::text[])
                  from unnest(v_ids) with ordinality u(i, o) order by o);
  v_s := (select c.lcc from pg_temp.sc2_costs(v_open, 'average', 8.0::double precision, 13.0::double precision, 0.003::double precision, 0.08::double precision, 0.005::double precision) c where c.id = 'UM2');
  if v_s is null or abs(v_s - v_g_umuahia_um2_life_cycle_cost) > 1e-9 * abs(v_g_umuahia_um2_life_cycle_cost) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/umuahia_um2_life_cycle_cost]', v_s, v_g_umuahia_um2_life_cycle_cost;
  end if;
  v_s := v_costs[array_position(v_ids, 'UM4')];
  if v_s is null or abs(v_s - v_g_umuahia_um4_evaluated_cost) > 1e-9 * abs(v_g_umuahia_um4_evaluated_cost) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/umuahia_um4_evaluated_cost]', v_s, v_g_umuahia_um4_evaluated_cost;
  end if;
  v_s := pg_temp.sc2_alb(v_costs);
  if v_s is null or abs(v_s - v_g_umuahia_alb_limit) > 1e-9 * abs(v_g_umuahia_alb_limit) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/umuahia_alb_limit]', v_s, v_g_umuahia_alb_limit;
  end if;
  v_s := pg_temp.sc2_content((select e from jsonb_array_elements(v_um->'bids') e where e->>'id' = 'UM3'), array['casing', 'valves', 'cement', 'baryte']::text[]);
  if v_s is null or abs(v_s - v_g_umuahia_um3_overall_content) > 1e-9 * abs(v_g_umuahia_um3_overall_content) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/umuahia_um3_overall_content]', v_s, v_g_umuahia_um3_overall_content;
  end if;
  v_s := (pg_temp.sc2_s14(v_costs, v_nc))[1];
  if v_s is null or abs(v_s - v_g_umuahia_s14_lead_points) > 1e-9 * abs(v_g_umuahia_s14_lead_points) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/umuahia_s14_lead_points]', v_s, v_g_umuahia_s14_lead_points;
  end if;
  v_s := (pg_temp.sc2_s14(v_costs, v_nc))[2];
  if v_s is null or abs(v_s - v_g_umuahia_s14_lead_relative) > 1e-9 * abs(v_g_umuahia_s14_lead_relative) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/umuahia_s14_lead_relative]', v_s, v_g_umuahia_s14_lead_relative;
  end if;
  v_pd := pg_temp.sc2_days(v_ok->'program', 0.0::double precision);
  v_k := pg_temp.sc2_mc(v_pd, 0.04::double precision, 0.12::double precision, 0.5::double precision, 31000.0::double precision, 34500.0::double precision, 46000.0::double precision, 95000.0::double precision, 120000.0::double precision, 41500.0::double precision, 0.1::double precision, 4000, 70611);
  v_s := v_k[1];
  if v_s is null or abs(v_s - v_g_okigwe_dayrate_mean_cost) > 1e-9 * abs(v_g_okigwe_dayrate_mean_cost) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/okigwe_dayrate_mean_cost]', v_s, v_g_okigwe_dayrate_mean_cost;
  end if;
  v_s := v_k[2];
  if v_s is null or abs(v_s - v_g_okigwe_reimbursable_p90_cost) > 1e-9 * abs(v_g_okigwe_reimbursable_p90_cost) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/okigwe_reimbursable_p90_cost]', v_s, v_g_okigwe_reimbursable_p90_cost;
  end if;
  v_s := v_k[3];
  if v_s is null or abs(v_s - v_g_okigwe_dayrate_company_pays) > 1e-9 * abs(v_g_okigwe_dayrate_company_pays) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/okigwe_dayrate_company_pays]', v_s, v_g_okigwe_dayrate_company_pays;
  end if;
  v_k := pg_temp.sc2_should(v_ok->'program', 0.12::double precision, v_ok->'costItems', 0.12::double precision, v_ok->'partners');
  v_s := v_k[1];
  if v_s is null or abs(v_s - v_g_okigwe_should_cost_estimate) > 1e-9 * abs(v_g_okigwe_should_cost_estimate) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/okigwe_should_cost_estimate]', v_s, v_g_okigwe_should_cost_estimate;
  end if;
  v_s := v_k[2];
  if v_s is null or abs(v_s - v_g_okigwe_operator_amount) > 1e-9 * abs(v_g_okigwe_operator_amount) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/okigwe_operator_amount]', v_s, v_g_okigwe_operator_amount;
  end if;
  v_open := pg_temp.sc2_open(v_ok->'criteria', v_ok->'bids', 60.0::double precision);
  v_th := (select max(pg_temp.sc2_tech_pct(v_ok->'criteria', e)) from jsonb_array_elements(v_open) e);
  select array_agg(c.id order by c.ord), array_agg(c.cost order by c.ord) into v_ids, v_costs from pg_temp.sc2_costs(v_open, 'average', 3.0::double precision, 6.0::double precision, 0.006::double precision, null, 0.005::double precision) c;
  v_cmin := (select min(x) from unnest(v_costs) x);
  select e->>'id' into v_top from jsonb_array_elements(v_ok->'bids') e where e->>'id' = any(v_ids)
   order by (pg_temp.sc2_combined(pg_temp.sc2_tech_pct(v_ok->'criteria', e), v_costs[array_position(v_ids, e->>'id')], v_th, v_cmin, 0.75::double precision))[2] desc limit 1;
  v_s := v_costs[array_position(v_ids, v_top)] / v_k[1];
  if v_s is null or abs(v_s - v_g_okigwe_award_ratio) > 1e-9 * abs(v_g_okigwe_award_ratio) then
    raise exception 'SC2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/okigwe_award_ratio]', v_s, v_g_okigwe_award_ratio;
  end if;

  -- ---------------------------------------------------- 3. against the oracle
  -- oracle_check.py --json, run when this file was generated: the value the
  -- vendored stdlib oracle computed, written in, with the module it came from.
  -- onitsha_on3_technical_percent: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_onitsha_on3_technical_percent - 80.8::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 80.8, not within 5e-07 of the seeded % [graded field: beginner/onitsha_on3_technical_percent]', v_g_onitsha_on3_technical_percent;
  end if;
  -- onitsha_on2_corrected_price: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_onitsha_on2_corrected_price - 744649.25::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 744649.25, not within 5e-07 of the seeded % [graded field: beginner/onitsha_on2_corrected_price]', v_g_onitsha_on2_corrected_price;
  end if;
  -- onitsha_on3_omission_amount: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_onitsha_on3_omission_amount - 29783.333333333332::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 29783.333333333332, not within 5e-07 of the seeded % [graded field: beginner/onitsha_on3_omission_amount]', v_g_onitsha_on3_omission_amount;
  end if;
  -- onitsha_on1_evaluated_cost: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_onitsha_on1_evaluated_cost - 763703.75::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 763703.75, not within 5e-07 of the seeded % [graded field: beginner/onitsha_on1_evaluated_cost]', v_g_onitsha_on1_evaluated_cost;
  end if;
  -- onitsha_on2_commercial_score: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_onitsha_on2_commercial_score - 97.20548915012131::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 97.20548915012131, not within 5e-07 of the seeded % [graded field: beginner/onitsha_on2_commercial_score]', v_g_onitsha_on2_commercial_score;
  end if;
  -- onitsha_top_combined_score: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_onitsha_top_combined_score - 97.93364798993775::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 97.93364798993775, not within 5e-07 of the seeded % [graded field: beginner/onitsha_top_combined_score]', v_g_onitsha_top_combined_score;
  end if;
  -- umuahia_um2_life_cycle_cost: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_umuahia_um2_life_cycle_cost - 20530.457489562457::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 20530.457489562457, not within 5e-07 of the seeded % [graded field: intermediate/umuahia_um2_life_cycle_cost]', v_g_umuahia_um2_life_cycle_cost;
  end if;
  -- umuahia_um4_evaluated_cost: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_umuahia_um4_evaluated_cost - 611300.5094501632::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 611300.5094501632, not within 5e-07 of the seeded % [graded field: intermediate/umuahia_um4_evaluated_cost]', v_g_umuahia_um4_evaluated_cost;
  end if;
  -- umuahia_alb_limit: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_umuahia_alb_limit - 611951.112477194::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 611951.112477194, not within 5e-07 of the seeded % [graded field: intermediate/umuahia_alb_limit]', v_g_umuahia_alb_limit;
  end if;
  -- umuahia_um3_overall_content: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_umuahia_um3_overall_content - 87.04149696003778::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 87.04149696003778, not within 5e-07 of the seeded % [graded field: intermediate/umuahia_um3_overall_content]', v_g_umuahia_um3_overall_content;
  end if;
  -- umuahia_s14_lead_points: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_umuahia_s14_lead_points - 3.8134829361852667::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 3.8134829361852667, not within 5e-07 of the seeded % [graded field: intermediate/umuahia_s14_lead_points]', v_g_umuahia_s14_lead_points;
  end if;
  -- umuahia_s14_lead_relative: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_umuahia_s14_lead_relative - 6.45408598407401::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 6.45408598407401, not within 5e-07 of the seeded % [graded field: intermediate/umuahia_s14_lead_relative]', v_g_umuahia_s14_lead_relative;
  end if;
  -- okigwe_dayrate_mean_cost: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_okigwe_dayrate_mean_cost - 485297.525439615::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 485297.525439615, not within 5e-07 of the seeded % [graded field: advanced/okigwe_dayrate_mean_cost]', v_g_okigwe_dayrate_mean_cost;
  end if;
  -- okigwe_reimbursable_p90_cost: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_okigwe_reimbursable_p90_cost - 412328.0252625306::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 412328.0252625306, not within 5e-07 of the seeded % [graded field: advanced/okigwe_reimbursable_p90_cost]', v_g_okigwe_reimbursable_p90_cost;
  end if;
  -- okigwe_dayrate_company_pays: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_okigwe_dayrate_company_pays - 29822.0417007031::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 29822.0417007031, not within 5e-07 of the seeded % [graded field: advanced/okigwe_dayrate_company_pays]', v_g_okigwe_dayrate_company_pays;
  end if;
  -- okigwe_should_cost_estimate: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_okigwe_should_cost_estimate - 629894.9979259259::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 629894.9979259259, not within 5e-07 of the seeded % [graded field: advanced/okigwe_should_cost_estimate]', v_g_okigwe_should_cost_estimate;
  end if;
  -- okigwe_operator_amount: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_okigwe_operator_amount - 267705.3741185185::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 267705.3741185185, not within 5e-07 of the seeded % [graded field: advanced/okigwe_operator_amount]', v_g_okigwe_operator_amount;
  end if;
  -- okigwe_award_ratio: tools/validation/supplychain/oracle_tender.py
  if abs(v_g_okigwe_award_ratio - 1.2848642968509096::double precision) > 5e-07::double precision then
    raise exception 'SC2 go-live refused: the oracle gives 1.2848642968509096, not within 5e-07 of the seeded % [graded field: advanced/okigwe_award_ratio]', v_g_okigwe_award_ratio;
  end if;

  -- ------------------------------------------------------------- 4. the traps
  -- Every wrong method discriminate.mjs swept through the engine for a field,
  -- by value: each must miss the seeded value by more than the tolerance, or
  -- the field does not discriminate the trap it is for.
  v_wrong := 404.0::double precision;
  if abs(v_wrong - v_g_onitsha_on3_technical_percent) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (weighted points quoted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on3_technical_percent]', v_wrong, v_g_onitsha_on3_technical_percent;
  end if;
  v_wrong := 80.0::double precision;
  if abs(v_wrong - v_g_onitsha_on3_technical_percent) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (unweighted mean of the scores) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on3_technical_percent]', v_wrong, v_g_onitsha_on3_technical_percent;
  end if;
  v_wrong := 79.0::double precision;
  if abs(v_wrong - v_g_onitsha_on3_technical_percent) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (weights reversed) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on3_technical_percent]', v_wrong, v_g_onitsha_on3_technical_percent;
  end if;
  v_wrong := 97.75::double precision;
  if abs(v_wrong - v_g_onitsha_on3_technical_percent) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (scores read out of four) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on3_technical_percent]', v_wrong, v_g_onitsha_on3_technical_percent;
  end if;
  v_wrong := 100.0::double precision;
  if abs(v_wrong - v_g_onitsha_on3_technical_percent) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the top bid s relative score) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on3_technical_percent]', v_wrong, v_g_onitsha_on3_technical_percent;
  end if;
  v_wrong := 746923.25::double precision;
  if abs(v_wrong - v_g_onitsha_on2_corrected_price) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (quoted total governs) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on2_corrected_price]', v_wrong, v_g_onitsha_on2_corrected_price;
  end if;
  v_wrong := 751899.25::double precision;
  if abs(v_wrong - v_g_onitsha_on2_corrected_price) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the deviation added) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on2_corrected_price]', v_wrong, v_g_onitsha_on2_corrected_price;
  end if;
  v_wrong := 757111.79475::double precision;
  if abs(v_wrong - v_g_onitsha_on2_corrected_price) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the evaluated cost quoted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on2_corrected_price]', v_wrong, v_g_onitsha_on2_corrected_price;
  end if;
  v_wrong := 746923.25::double precision;
  if abs(v_wrong - v_g_onitsha_on2_corrected_price) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the quoted amount governs every line) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on2_corrected_price]', v_wrong, v_g_onitsha_on2_corrected_price;
  end if;
  v_wrong := 30575.0::double precision;
  if abs(v_wrong - v_g_onitsha_on3_omission_amount) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (highest rule) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on3_omission_amount]', v_wrong, v_g_onitsha_on3_omission_amount;
  end if;
  v_wrong := 28897.5::double precision;
  if abs(v_wrong - v_g_onitsha_on3_omission_amount) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the failed bid prices it) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on3_omission_amount]', v_wrong, v_g_onitsha_on3_omission_amount;
  end if;
  v_wrong := 29478.0::double precision;
  if abs(v_wrong - v_g_onitsha_on3_omission_amount) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the excluded bids price it) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on3_omission_amount]', v_wrong, v_g_onitsha_on3_omission_amount;
  end if;
  v_wrong := 28915.0::double precision;
  if abs(v_wrong - v_g_onitsha_on3_omission_amount) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the lowest price) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on3_omission_amount]', v_wrong, v_g_onitsha_on3_omission_amount;
  end if;
  v_wrong := 29860.0::double precision;
  if abs(v_wrong - v_g_onitsha_on3_omission_amount) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the median price) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on3_omission_amount]', v_wrong, v_g_onitsha_on3_omission_amount;
  end if;
  v_wrong := 776203.75::double precision;
  if abs(v_wrong - v_g_onitsha_on1_evaluated_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (discount not deducted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on1_evaluated_cost]', v_wrong, v_g_onitsha_on1_evaluated_cost;
  end if;
  v_wrong := 761030.786875::double precision;
  if abs(v_wrong - v_g_onitsha_on1_evaluated_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (credit for early completion) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on1_evaluated_cost]', v_wrong, v_g_onitsha_on1_evaluated_cost;
  end if;
  v_wrong := 751203.75::double precision;
  if abs(v_wrong - v_g_onitsha_on1_evaluated_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the discount deducted twice) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on1_evaluated_cost]', v_wrong, v_g_onitsha_on1_evaluated_cost;
  end if;
  v_wrong := 777068.565625::double precision;
  if abs(v_wrong - v_g_onitsha_on1_evaluated_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the rate on every week) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on1_evaluated_cost]', v_wrong, v_g_onitsha_on1_evaluated_cost;
  end if;
  v_wrong := 54.18047925402393::double precision;
  if abs(v_wrong - v_g_onitsha_on2_commercial_score) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (linear price method) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on2_commercial_score]', v_wrong, v_g_onitsha_on2_commercial_score;
  end if;
  v_wrong := 85.43275966445377::double precision;
  if abs(v_wrong - v_g_onitsha_on2_commercial_score) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the failed bid in cmin) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on2_commercial_score]', v_wrong, v_g_onitsha_on2_commercial_score;
  end if;
  v_wrong := 97.50760871347893::double precision;
  if abs(v_wrong - v_g_onitsha_on2_commercial_score) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the quoted totals scored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on2_commercial_score]', v_wrong, v_g_onitsha_on2_commercial_score;
  end if;
  v_wrong := 102.87484881184325::double precision;
  if abs(v_wrong - v_g_onitsha_on2_commercial_score) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the ratio inverted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on2_commercial_score]', v_wrong, v_g_onitsha_on2_commercial_score;
  end if;
  v_wrong := 91.78182219264147::double precision;
  if abs(v_wrong - v_g_onitsha_on2_commercial_score) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the combined score quoted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_on2_commercial_score]', v_wrong, v_g_onitsha_on2_commercial_score;
  end if;
  v_wrong := 96.1624891241701::double precision;
  if abs(v_wrong - v_g_onitsha_top_combined_score) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (weights swapped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_top_combined_score]', v_wrong, v_g_onitsha_top_combined_score;
  end if;
  v_wrong := 85.45364798993776::double precision;
  if abs(v_wrong - v_g_onitsha_top_combined_score) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (absolute technical method) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_top_combined_score]', v_wrong, v_g_onitsha_top_combined_score;
  end if;
  v_wrong := 65.0::double precision;
  if abs(v_wrong - v_g_onitsha_top_combined_score) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (linear price method) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_top_combined_score]', v_wrong, v_g_onitsha_top_combined_score;
  end if;
  v_wrong := 97.90034648779043::double precision;
  if abs(v_wrong - v_g_onitsha_top_combined_score) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (highest omission rule) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_top_combined_score]', v_wrong, v_g_onitsha_top_combined_score;
  end if;
  v_wrong := 88.4158415841584::double precision;
  if abs(v_wrong - v_g_onitsha_top_combined_score) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the lowest cost bid s score) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/onitsha_top_combined_score]', v_wrong, v_g_onitsha_top_combined_score;
  end if;
  v_wrong := 22420.96637021177::double precision;
  if abs(v_wrong - v_g_umuahia_um2_life_cycle_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (residual not credited) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um2_life_cycle_cost]', v_wrong, v_g_umuahia_um2_life_cycle_cost;
  end if;
  v_wrong := 22172.894088727455::double precision;
  if abs(v_wrong - v_g_umuahia_um2_life_cycle_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (discounted from year 0) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um2_life_cycle_cost]', v_wrong, v_g_umuahia_um2_life_cycle_cost;
  end if;
  v_wrong := 26100.0::double precision;
  if abs(v_wrong - v_g_umuahia_um2_life_cycle_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (undiscounted sum) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um2_life_cycle_cost]', v_wrong, v_g_umuahia_um2_life_cycle_cost;
  end if;
  v_wrong := 19420.96637021177::double precision;
  if abs(v_wrong - v_g_umuahia_um2_life_cycle_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (residual taken off undiscounted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um2_life_cycle_cost]', v_wrong, v_g_umuahia_um2_life_cycle_cost;
  end if;
  v_wrong := 19429.59260223046::double precision;
  if abs(v_wrong - v_g_umuahia_um2_life_cycle_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (ten percent rate) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um2_life_cycle_cost]', v_wrong, v_g_umuahia_um2_life_cycle_cost;
  end if;
  v_wrong := 613163.0094501633::double precision;
  if abs(v_wrong - v_g_umuahia_um4_evaluated_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (highest omission rule) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um4_evaluated_cost]', v_wrong, v_g_umuahia_um4_evaluated_cost;
  end if;
  v_wrong := 583100.9435::double precision;
  if abs(v_wrong - v_g_umuahia_um4_evaluated_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (no life cycle) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um4_evaluated_cost]', v_wrong, v_g_umuahia_um4_evaluated_cost;
  end if;
  v_wrong := 606208.5659501633::double precision;
  if abs(v_wrong - v_g_umuahia_um4_evaluated_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (no delivery adjustment) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um4_evaluated_cost]', v_wrong, v_g_umuahia_um4_evaluated_cost;
  end if;
  v_wrong := 599063.0094501633::double precision;
  if abs(v_wrong - v_g_umuahia_um4_evaluated_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the omission left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um4_evaluated_cost]', v_wrong, v_g_umuahia_um4_evaluated_cost;
  end if;
  v_wrong := 610633.0094501633::double precision;
  if abs(v_wrong - v_g_umuahia_um4_evaluated_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the failed bid prices the omission) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um4_evaluated_cost]', v_wrong, v_g_umuahia_um4_evaluated_cost;
  end if;
  v_wrong := 610336.154484496::double precision;
  if abs(v_wrong - v_g_umuahia_alb_limit) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (sample standard deviation) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_alb_limit]', v_wrong, v_g_umuahia_alb_limit;
  end if;
  v_wrong := 597394.9306988103::double precision;
  if abs(v_wrong - v_g_umuahia_alb_limit) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the failed bid kept) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_alb_limit]', v_wrong, v_g_umuahia_alb_limit;
  end if;
  v_wrong := 598268.9688014425::double precision;
  if abs(v_wrong - v_g_umuahia_alb_limit) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (two standard deviations) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_alb_limit]', v_wrong, v_g_umuahia_alb_limit;
  end if;
  v_wrong := 625633.2561529456::double precision;
  if abs(v_wrong - v_g_umuahia_alb_limit) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the mean quoted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_alb_limit]', v_wrong, v_g_umuahia_alb_limit;
  end if;
  v_wrong := 576543.4489557104::double precision;
  if abs(v_wrong - v_g_umuahia_alb_limit) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the quoted totals used) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_alb_limit]', v_wrong, v_g_umuahia_alb_limit;
  end if;
  v_wrong := 83.77049180327869::double precision;
  if abs(v_wrong - v_g_umuahia_um3_overall_content) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (pooled across units) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um3_overall_content]', v_wrong, v_g_umuahia_um3_overall_content;
  end if;
  v_wrong := 81.54545454545455::double precision;
  if abs(v_wrong - v_g_umuahia_um3_overall_content) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (unweighted mean of the items) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um3_overall_content]', v_wrong, v_g_umuahia_um3_overall_content;
  end if;
  v_wrong := 83.77049180327869::double precision;
  if abs(v_wrong - v_g_umuahia_um3_overall_content) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (weighted by quantity) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um3_overall_content]', v_wrong, v_g_umuahia_um3_overall_content;
  end if;
  v_wrong := 98.0::double precision;
  if abs(v_wrong - v_g_umuahia_um3_overall_content) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the casing content alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um3_overall_content]', v_wrong, v_g_umuahia_um3_overall_content;
  end if;
  v_wrong := 85.07461825454826::double precision;
  if abs(v_wrong - v_g_umuahia_um3_overall_content) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (weighted by the whole bid price) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_um3_overall_content]', v_wrong, v_g_umuahia_um3_overall_content;
  end if;
  v_wrong := 6.45408598407401::double precision;
  if abs(v_wrong - v_g_umuahia_s14_lead_points) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (read as relative) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_s14_lead_points]', v_wrong, v_g_umuahia_s14_lead_points;
  end if;
  v_wrong := 17.48334659926502::double precision;
  if abs(v_wrong - v_g_umuahia_s14_lead_points) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (lead over the whole field) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_s14_lead_points]', v_wrong, v_g_umuahia_s14_lead_points;
  end if;
  v_wrong := 1.639344262295083::double precision;
  if abs(v_wrong - v_g_umuahia_s14_lead_points) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (pooled contents) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_s14_lead_points]', v_wrong, v_g_umuahia_s14_lead_points;
  end if;
  v_wrong := 1.949810606060602::double precision;
  if abs(v_wrong - v_g_umuahia_s14_lead_points) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (unweighted contents) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_s14_lead_points]', v_wrong, v_g_umuahia_s14_lead_points;
  end if;
  v_wrong := 3.8134829361852667::double precision;
  if abs(v_wrong - v_g_umuahia_s14_lead_relative) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (read as points) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_s14_lead_relative]', v_wrong, v_g_umuahia_s14_lead_relative;
  end if;
  v_wrong := 6.062788407238374::double precision;
  if abs(v_wrong - v_g_umuahia_s14_lead_relative) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (relative to the leader) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_s14_lead_relative]', v_wrong, v_g_umuahia_s14_lead_relative;
  end if;
  v_wrong := 25.134864151196197::double precision;
  if abs(v_wrong - v_g_umuahia_s14_lead_relative) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (lead over the whole field) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_s14_lead_relative]', v_wrong, v_g_umuahia_s14_lead_relative;
  end if;
  v_wrong := 106.454085984074::double precision;
  if abs(v_wrong - v_g_umuahia_s14_lead_relative) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (ratio not less one) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umuahia_s14_lead_relative]', v_wrong, v_g_umuahia_s14_lead_relative;
  end if;
  v_wrong := 486918.89813189843::double precision;
  if abs(v_wrong - v_g_okigwe_dayrate_mean_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (next seed) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_dayrate_mean_cost]', v_wrong, v_g_okigwe_dayrate_mean_cost;
  end if;
  v_wrong := 455874.8703703704::double precision;
  if abs(v_wrong - v_g_okigwe_dayrate_mean_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the planned payment) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_dayrate_mean_cost]', v_wrong, v_g_okigwe_dayrate_mean_cost;
  end if;
  v_wrong := 480730.67594903754::double precision;
  if abs(v_wrong - v_g_okigwe_dayrate_mean_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the p50) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_dayrate_mean_cost]', v_wrong, v_g_okigwe_dayrate_mean_cost;
  end if;
  v_wrong := 365297.525439615::double precision;
  if abs(v_wrong - v_g_okigwe_dayrate_mean_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (no mobilisation fee) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_dayrate_mean_cost]', v_wrong, v_g_okigwe_dayrate_mean_cost;
  end if;
  v_wrong := 422093.34349961986::double precision;
  if abs(v_wrong - v_g_okigwe_dayrate_mean_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the contractor cost mean) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_dayrate_mean_cost]', v_wrong, v_g_okigwe_dayrate_mean_cost;
  end if;
  v_wrong := 522655.02297178993::double precision;
  if abs(v_wrong - v_g_okigwe_reimbursable_p90_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the 90th percentile quoted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_reimbursable_p90_cost]', v_wrong, v_g_okigwe_reimbursable_p90_cost;
  end if;
  v_wrong := 460135.8878898474::double precision;
  if abs(v_wrong - v_g_okigwe_reimbursable_p90_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the p50) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_reimbursable_p90_cost]', v_wrong, v_g_okigwe_reimbursable_p90_cost;
  end if;
  v_wrong := 414099.42800028843::double precision;
  if abs(v_wrong - v_g_okigwe_reimbursable_p90_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (next seed) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_reimbursable_p90_cost]', v_wrong, v_g_okigwe_reimbursable_p90_cost;
  end if;
  v_wrong := 374843.65932957333::double precision;
  if abs(v_wrong - v_g_okigwe_reimbursable_p90_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the fee left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_reimbursable_p90_cost]', v_wrong, v_g_okigwe_reimbursable_p90_cost;
  end if;
  v_wrong := 464302.6778495819::double precision;
  if abs(v_wrong - v_g_okigwe_reimbursable_p90_cost) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the mean) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_reimbursable_p90_cost]', v_wrong, v_g_okigwe_reimbursable_p90_cost;
  end if;
  v_wrong := 19146.099796289353::double precision;
  if abs(v_wrong - v_g_okigwe_dayrate_company_pays) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the contractor part) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_dayrate_company_pays]', v_wrong, v_g_okigwe_dayrate_company_pays;
  end if;
  v_wrong := 48968.14149699255::double precision;
  if abs(v_wrong - v_g_okigwe_dayrate_company_pays) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the whole expected overrun) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_dayrate_company_pays]', v_wrong, v_g_okigwe_dayrate_company_pays;
  end if;
  v_wrong := 31311.851253999328::double precision;
  if abs(v_wrong - v_g_okigwe_dayrate_company_pays) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (next seed) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_dayrate_company_pays]', v_wrong, v_g_okigwe_dayrate_company_pays;
  end if;
  v_wrong := 0.6090090575019017::double precision;
  if abs(v_wrong - v_g_okigwe_dayrate_company_pays) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the share quoted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_dayrate_company_pays]', v_wrong, v_g_okigwe_dayrate_company_pays;
  end if;
  v_wrong := 53864.95564669178::double precision;
  if abs(v_wrong - v_g_okigwe_dayrate_company_pays) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the reimbursable company part) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_dayrate_company_pays]', v_wrong, v_g_okigwe_dayrate_company_pays;
  end if;
  v_wrong := 562406.2481481482::double precision;
  if abs(v_wrong - v_g_okigwe_should_cost_estimate) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (contingency dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_should_cost_estimate]', v_wrong, v_g_okigwe_should_cost_estimate;
  end if;
  v_wrong := 605906.2481481482::double precision;
  if abs(v_wrong - v_g_okigwe_should_cost_estimate) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (npt at zero) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_should_cost_estimate]', v_wrong, v_g_okigwe_should_cost_estimate;
  end if;
  v_wrong := 705859.3722222222::double precision;
  if abs(v_wrong - v_g_okigwe_should_cost_estimate) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (npt at the maximum) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_should_cost_estimate]', v_wrong, v_g_okigwe_should_cost_estimate;
  end if;
  v_wrong := 586394.997925926::double precision;
  if abs(v_wrong - v_g_okigwe_should_cost_estimate) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (contingency on the per day items only) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_should_cost_estimate]', v_wrong, v_g_okigwe_should_cost_estimate;
  end if;
  v_wrong := 640000.0::double precision;
  if abs(v_wrong - v_g_okigwe_should_cost_estimate) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the lump sum price) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_should_cost_estimate]', v_wrong, v_g_okigwe_should_cost_estimate;
  end if;
  v_wrong := 362189.62380740745::double precision;
  if abs(v_wrong - v_g_okigwe_operator_amount) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the partners total) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_operator_amount]', v_wrong, v_g_okigwe_operator_amount;
  end if;
  v_wrong := 220463.2492740741::double precision;
  if abs(v_wrong - v_g_okigwe_operator_amount) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the larger partner s share) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_operator_amount]', v_wrong, v_g_okigwe_operator_amount;
  end if;
  v_wrong := 239022.65546296298::double precision;
  if abs(v_wrong - v_g_okigwe_operator_amount) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (contingency dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_operator_amount]', v_wrong, v_g_okigwe_operator_amount;
  end if;
  v_wrong := 629894.997925926::double precision;
  if abs(v_wrong - v_g_okigwe_operator_amount) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the whole estimate) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_operator_amount]', v_wrong, v_g_okigwe_operator_amount;
  end if;
  v_wrong := 1.0986471063886447::double precision;
  if abs(v_wrong - v_g_okigwe_award_ratio) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (lowest cost award) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_award_ratio]', v_wrong, v_g_okigwe_award_ratio;
  end if;
  v_wrong := 0.7782923087293444::double precision;
  if abs(v_wrong - v_g_okigwe_award_ratio) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (inverted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_award_ratio]', v_wrong, v_g_okigwe_award_ratio;
  end if;
  v_wrong := 1.4390480124730187::double precision;
  if abs(v_wrong - v_g_okigwe_award_ratio) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (against the base without contingency) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_award_ratio]', v_wrong, v_g_okigwe_award_ratio;
  end if;
  v_wrong := 1.269628751828962::double precision;
  if abs(v_wrong - v_g_okigwe_award_ratio) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (the quoted total) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_award_ratio]', v_wrong, v_g_okigwe_award_ratio;
  end if;
  v_wrong := 1.26457749::double precision;
  if abs(v_wrong - v_g_okigwe_award_ratio) <= 5e-07::double precision then
    raise exception 'SC2 go-live refused: the trap (against the lump sum) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/okigwe_award_ratio]', v_wrong, v_g_okigwe_award_ratio;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'procurement';
  if not exists (select 1 from public.academy_apps where slug = 'procurement' and status = 'available') then
    raise exception 'SC2 go-live refused: procurement did not reach status available';
  end if;
  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon from public.academy_apps;
  raise notice 'SC2 go-live: procurement available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
