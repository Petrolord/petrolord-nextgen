-- ------------------------------------------------ the second route's helpers
-- Temporary functions (pg_temp), created with create or replace: they vanish
-- with the session and create nothing in any schema. They rebuild each graded
-- SC4 value from the stated inputs of the case files, in SQL, with no engine
-- code: a voyage's hours (distance over speed, the stated port and field
-- hours, the weather factor on the stated activities only), its fuel (hours in
-- each activity x the stated burn) and fuel cost (x the price), its deadweight
-- load (deck weight + bulk m3 x the stated density) and the utilisation of its
-- binding constraint (the largest of deck area over deck area x the usable
-- fraction, deck load, deadweight and each tank); the days of dedicated
-- voyages out and back; the fleet for a period (voyages of demand = the
-- largest demand over capacity, or the minimum visits when that is larger,
-- rounded as stated on the twelve-digit figure; vessel-days = voyages x voyage
-- days; vessels = vessel-days over the available days; spare = the planned
-- capacity less the need); first-fit decreasing (or first fit) onto a stated
-- number of decks, units ordered by footprint, then weight, then item id and
-- unit number; and the shore base queue, where Erlang C is summed DIRECTLY,
-- (a^c / c!) / (1 - rho) over sum_{k<c} a^k / k! + (a^c / c!) / (1 - rho)
-- (the engine uses the Erlang B recursion and remark 11.3.2), the M/M/c wait
-- C x S / (c - a), the Cosmetatos factor on top for M/D/c, Little's law for
-- the queue, and the fewest berths from floor(a) + 1 whose wait is at or
-- below the target. Every number is a double precision.

-- A number out of a jsonb value, read through its text (the double JSON.parse gives).
create or replace function pg_temp.sc4_n(v jsonb) returns double precision
language sql immutable as $f$
  select case when v is null or jsonb_typeof(v) = 'null' then null else (v #>> '{}')::double precision end
$f$;

-- A figure at 12 significant digits, the engine's stated comparison.
create or replace function pg_temp.sc4_k12(x double precision) returns double precision
language sql immutable as $f$
  select case when x = 0 then 0::double precision
              else round(x::numeric, (11 - floor(log(abs(x)::numeric)))::int)::double precision end
$f$;

-- The weather multiplier on one activity: the factor when the plan names it, else 1.
create or replace function pg_temp.sc4_wx(w jsonb, activity text) returns double precision
language sql immutable as $f$
  select case when (w->'appliesTo') ? activity then pg_temp.sc4_n(w->'factor') else 1::double precision end
$f$;

-- The hours of one voyage: sailing nm / speed, the port hours, the field hours,
-- each x its weather multiplier; 'fuel' gives the tonnes at the stated burns.
create or replace function pg_temp.sc4_hours(c jsonb, nm double precision, field double precision, what text) returns double precision
language plpgsql immutable as $f$
declare
  v jsonb := c->'vessel';
  hs double precision := nm / pg_temp.sc4_n(v->'speedKnots') * pg_temp.sc4_wx(c->'weather', 'sailing');
  hp double precision := pg_temp.sc4_n(c->'portHours') * pg_temp.sc4_wx(c->'weather', 'port');
  hf double precision := field * pg_temp.sc4_wx(c->'weather', 'field');
begin
  if what = 'hours' then return hs + hp + hf; end if;
  if what = 'fuel' then
    return hs * pg_temp.sc4_n(v->'fuelTPerHour'->'sailing') + hp * pg_temp.sc4_n(v->'fuelTPerHour'->'port')
         + hf * pg_temp.sc4_n(v->'fuelTPerHour'->'field');
  end if;
  raise exception 'sc4_hours: an unknown figure %', what;
end
$f$;

-- The load of a list of installations' cargo (or demand) under key k:
-- 'area', 'weight', 'deadweight', or 'tank:<product id>'.
create or replace function pg_temp.sc4_load(c jsonb, members jsonb, k text, what text) returns double precision
language plpgsql immutable as $f$
declare
  s double precision;
begin
  if what = 'area' then
    select coalesce(sum(pg_temp.sc4_n(m->k->'deckAreaM2')), 0) into s from jsonb_array_elements(members) m;
  elsif what = 'weight' then
    select coalesce(sum(pg_temp.sc4_n(m->k->'deckWeightT')), 0) into s from jsonb_array_elements(members) m;
  elsif what = 'deadweight' then
    select coalesce(sum(pg_temp.sc4_n(m->k->'deckWeightT')), 0) into s from jsonb_array_elements(members) m;
    s := s + coalesce((select sum(coalesce(pg_temp.sc4_n(m->k->'bulk'->(p->>'id')), 0) * pg_temp.sc4_n(p->'densityTPerM3'))
                         from jsonb_array_elements(members) m, jsonb_array_elements(c->'products') p), 0);
  elsif what like 'tank:%' then
    select coalesce(sum(coalesce(pg_temp.sc4_n(m->k->'bulk'->(substr(what, 6))), 0)), 0) into s from jsonb_array_elements(members) m;
  else
    raise exception 'sc4_load: an unknown load %', what;
  end if;
  return s;
end
$f$;

-- The largest load over capacity across every constraint (a tank of 0 counts 0).
create or replace function pg_temp.sc4_maxratio(c jsonb, members jsonb, k text) returns double precision
language plpgsql immutable as $f$
declare
  v jsonb := c->'vessel';
  r double precision;
  t double precision;
  p jsonb;
begin
  r := greatest(pg_temp.sc4_load(c, members, k, 'area') / (pg_temp.sc4_n(v->'deckAreaM2') * pg_temp.sc4_n(v->'deckUsableFraction')),
                pg_temp.sc4_load(c, members, k, 'weight') / pg_temp.sc4_n(v->'deckLoadT'),
                pg_temp.sc4_load(c, members, k, 'deadweight') / pg_temp.sc4_n(v->'deadweightT'));
  for p in select * from jsonb_array_elements(c->'products') loop
    t := pg_temp.sc4_n(v->'tanks'->(p->>'id'));
    if t > 0 then r := greatest(r, pg_temp.sc4_load(c, members, k, 'tank:' || (p->>'id')) / t); end if;
  end loop;
  return r;
end
$f$;

-- A voyage plan (the voyagePlan block): the milk run's 'hours', 'fuel', 'cost',
-- 'deadweight' and 'binding' utilisation, or the dedicated voyages' total 'days'.
create or replace function pg_temp.sc4_voyage(c jsonb, what text) returns double precision
language plpgsql immutable as $f$
declare
  nm double precision; fld double precision; d double precision := 0; i jsonb;
begin
  if what = 'days' then
    if c->'route'->>'mode' <> 'dedicated' then raise exception 'sc4_voyage: days is read on the dedicated plan'; end if;
    for i in select * from jsonb_array_elements(c->'installations') loop
      d := d + pg_temp.sc4_hours(c, 2 * pg_temp.sc4_n(i->'distanceFromBaseNm'), pg_temp.sc4_n(i->'fieldHours'), 'hours') / 24.0::double precision;
    end loop;
    return d;
  end if;
  if c->'route'->>'mode' <> 'milk-run' then raise exception 'sc4_voyage: % is read on the milk run', what; end if;
  select sum(pg_temp.sc4_n(x)) into nm from jsonb_array_elements(c->'route'->'legsNm') x;
  select sum(pg_temp.sc4_n(i2->'fieldHours')) into fld from jsonb_array_elements(c->'installations') i2;
  if what = 'hours' then return pg_temp.sc4_hours(c, nm, fld, 'hours'); end if;
  if what = 'fuel' then return pg_temp.sc4_hours(c, nm, fld, 'fuel'); end if;
  if what = 'cost' then return pg_temp.sc4_hours(c, nm, fld, 'fuel') * pg_temp.sc4_n(c->'fuelPricePerT'); end if;
  if what = 'deadweight' then return pg_temp.sc4_load(c, c->'installations', 'cargo', 'deadweight'); end if;
  if what = 'binding' then return pg_temp.sc4_maxratio(c, c->'installations', 'cargo'); end if;
  raise exception 'sc4_voyage: an unknown figure %', what;
end
$f$;

-- The fleet for a period (the fleetSize block): 'voyages_exact' of the first
-- voyage set, 'vessel_days', 'vessels_exact' or 'spare'.
create or replace function pg_temp.sc4_fleet(c jsonb, what text) returns double precision
language plpgsql immutable as $f$
declare
  members jsonb; r double precision; mv double precision; ex double precision; vy double precision;
  nm double precision; fld double precision; vd double precision := 0; first_exact double precision;
  avail double precision := pg_temp.sc4_n(c->'vesselAvailableDays'); vs double precision; cap double precision;
  i jsonb;
begin
  for members in
    select jsonb_build_array(i3) from jsonb_array_elements(c->'installations') i3 where c->'route'->>'mode' = 'dedicated'
    union all
    select c->'installations' where c->'route'->>'mode' = 'milk-run'
  loop
    r := pg_temp.sc4_maxratio(c, members, 'demand');
    select max(pg_temp.sc4_n(m->'minVisits')) into mv from jsonb_array_elements(members) m;
    ex := case when pg_temp.sc4_k12(r) > 0 and pg_temp.sc4_k12(r) >= mv then r else mv end;
    if first_exact is null then first_exact := ex; end if;
    vy := case c->>'voyageRounding' when 'up' then ceil(pg_temp.sc4_k12(ex)) when 'none' then ex end;
    if vy is null then raise exception 'sc4_fleet: an unstated voyage rounding %', c->>'voyageRounding'; end if;
    select sum(pg_temp.sc4_n(m->'fieldHours')) into fld from jsonb_array_elements(members) m;
    if c->'route'->>'mode' = 'milk-run' then
      select sum(pg_temp.sc4_n(x)) into nm from jsonb_array_elements(c->'route'->'legsNm') x;
    else
      nm := 2 * pg_temp.sc4_n(members->0->'distanceFromBaseNm');
    end if;
    vd := vd + vy * (pg_temp.sc4_hours(c, nm, fld, 'hours') / 24.0::double precision);
  end loop;
  if what = 'voyages_exact' then return first_exact; end if;
  if what = 'vessel_days' then return vd; end if;
  if what = 'vessels_exact' then return vd / avail; end if;
  vs := case c->>'vesselRounding' when 'up' then ceil(pg_temp.sc4_k12(vd / avail))
                                  when 'nearest' then floor(pg_temp.sc4_k12(vd / avail) + 0.5)
                                  when 'none' then vd / avail end;
  cap := vs * avail;
  if what = 'spare' then return case when pg_temp.sc4_k12(vd) > pg_temp.sc4_k12(cap) then 0 else cap - vd end; end if;
  raise exception 'sc4_fleet: an unknown figure %', what;
end
$f$;

-- A deck plan (the deckPlan block) by its stated rule: voyage n's 'area' in m2
-- or its 'load' utilisation.
create or replace function pg_temp.sc4_deck(c jsonb, what text, n int) returns double precision
language plpgsql immutable as $f$
declare
  usable double precision := pg_temp.sc4_n(c->'deck'->'areaM2') * pg_temp.sc4_n(c->'deck'->'usableFraction');
  cap double precision := pg_temp.sc4_n(c->'deck'->'loadT');
  nv int := (c->>'voyages')::int;
  ar double precision[] := array_fill(0::double precision, array[nv]);
  wt double precision[] := array_fill(0::double precision, array[nv]);
  u record; b int; placed boolean;
begin
  if c->>'rule' not in ('first-fit-decreasing-area', 'first-fit') then raise exception 'sc4_deck: an unstated rule %', c->>'rule'; end if;
  for u in
    select pg_temp.sc4_n(it->'lengthM') * pg_temp.sc4_n(it->'widthM') as area, pg_temp.sc4_n(it->'weightT') as weight,
           it->>'id' as id, k, ln
      from jsonb_array_elements(c->'items') with ordinality as t(it, ln), generate_series(1, (it->>'quantity')::int) k
     order by case when c->>'rule' = 'first-fit-decreasing-area' then -pg_temp.sc4_k12(pg_temp.sc4_n(it->'lengthM') * pg_temp.sc4_n(it->'widthM')) else 0 end,
              case when c->>'rule' = 'first-fit-decreasing-area' then -pg_temp.sc4_k12(pg_temp.sc4_n(it->'weightT')) else 0 end,
              case when c->>'rule' = 'first-fit-decreasing-area' then it->>'id' else '' end collate "C",
              case when c->>'rule' = 'first-fit-decreasing-area' then 0 else ln end,
              k
  loop
    placed := false;
    for b in 1 .. nv loop
      if pg_temp.sc4_k12(ar[b] + u.area) <= pg_temp.sc4_k12(usable) and pg_temp.sc4_k12(wt[b] + u.weight) <= pg_temp.sc4_k12(cap) then
        ar[b] := ar[b] + u.area; wt[b] := wt[b] + u.weight; placed := true; exit;
      end if;
    end loop;
  end loop;
  if what = 'area' then return ar[n]; end if;
  if what = 'load' then return wt[n] / cap; end if;
  raise exception 'sc4_deck: an unknown figure %', what;
end
$f$;

-- Erlang C summed directly at c berths and an offered load a (a below c).
create or replace function pg_temp.sc4_erlang_c(c int, a double precision) returns double precision
language plpgsql immutable as $f$
declare
  term double precision := 1; s double precision := 0; k int; top double precision;
begin
  for k in 0 .. c - 1 loop
    if k > 0 then term := term * a / k::double precision; end if;
    s := s + term;
  end loop;
  top := term * a / c::double precision / (1 - a / c::double precision);
  return top / (s + top);
end
$f$;

-- The mean wait in the queue at c berths, for the stated model.
create or replace function pg_temp.sc4_wq(c int, a double precision, sv double precision, model text) returns double precision
language plpgsql immutable as $f$
declare
  rho double precision := a / c::double precision;
  wm double precision := pg_temp.sc4_erlang_c(c, a) * sv / (c::double precision - a);
begin
  if model = 'M/M/c' then return wm; end if;
  if model = 'M/D/c' then
    return wm / 2.0::double precision * (1 + (1 - rho) * (c - 1)::double precision * (sqrt(4 + 5 * c::double precision) - 2) / (16 * rho * c::double precision));
  end if;
  raise exception 'sc4_wq: an unstated queue model %', model;
end
$f$;

-- The shore base (a shoreBase block): 'wait', 'pwait' (M/M/c only), 'time' at
-- the base, 'queue', or the wait at the fewest berths meeting the 'target'.
create or replace function pg_temp.sc4_base(c jsonb, what text) returns double precision
language plpgsql immutable as $f$
declare
  s jsonb := c->'service';
  lh double precision := pg_temp.sc4_n(s->'lifts') / pg_temp.sc4_n(s->'liftsPerHour');
  bh double precision := pg_temp.sc4_n(s->'bulkM3') / pg_temp.sc4_n(s->'bulkM3PerHour');
  sv double precision := pg_temp.sc4_n(s->'fixedHours') + case when (s->>'concurrent')::boolean then greatest(lh, bh) else lh + bh end;
  lam double precision := pg_temp.sc4_n(c->'arrivalsPerDay') / pg_temp.sc4_n(c->'workingHoursPerDay');
  a double precision := lam * sv;
  nb int := (c->>'berths')::int;
  k int; w double precision;
begin
  if a / nb::double precision >= 1 then raise exception 'sc4_base: no steady state at % berths', nb; end if;
  if what = 'wait' then return pg_temp.sc4_wq(nb, a, sv, c->>'model'); end if;
  if what = 'pwait' then
    if c->>'model' <> 'M/M/c' then raise exception 'sc4_base: the probability of waiting is read on M/M/c'; end if;
    return pg_temp.sc4_erlang_c(nb, a);
  end if;
  if what = 'time' then return pg_temp.sc4_wq(nb, a, sv, c->>'model') + sv; end if;
  if what = 'queue' then return lam * pg_temp.sc4_wq(nb, a, sv, c->>'model'); end if;
  if what = 'target' then
    for k in floor(a)::int + 1 .. 100 loop
      w := pg_temp.sc4_wq(k, a, sv, c->>'model');
      if pg_temp.sc4_k12(w) <= pg_temp.sc4_k12(pg_temp.sc4_n(c->'targetMeanWaitHours')) then return w; end if;
    end loop;
    return null;
  end if;
  raise exception 'sc4_base: an unknown figure %', what;
end
$f$;
