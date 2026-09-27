-- ============================================================================
-- SC4 GO-LIVE (HELD): Offshore & Marine Logistics flips to
-- 'available' in the Supply Chain module, at path_order 78.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/marine. The 78 lessons, the teaching lab
-- (marineLab.js), its four calculator panels (voyage and fleet, deck, shore
-- base and variability) and the three capstone case files ship in the ZIP and
-- NOT in this database, so a flip before the upload puts a live catalogue tile
-- in front of a route that does not exist. AN APP COURSE: the Suite app is the
-- Marine Logistics Planner (Suite #741, its tile migrations held for the owner
-- separately), and the course's own calculator panels carry every practical,
-- so this go-live waits on the NextGen upload only and reads nothing of the
-- Suite. This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values marine_capstone.mjs returned
--      through the vendored engines/supplychain/marineLogistics.js
--      (petrolord-engines e67e7ba) when this file was generated, to the last bit;
--   2. by a SECOND ROUTE IN SQL: the stated arithmetic rebuilt in plpgsql over
--      the case files the learner is handed; each to 1e-9 relative;
--   3. by the ORACLE: oracle_check.py's run of the vendored stdlib Python
--      oracle (tools/validation/supplychain/oracle_marine.py), written in by
--      value, each seeded value within its tolerance of the oracle's;
--   4. by the TRAPS the course is built on: every wrong method
--      discriminate.mjs swept through the engine for a field, written in by
--      value, must miss the seeded value by more than the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
--
-- NO BEGIN OR COMMIT. Like every course migration in this repository, the
-- file carries no transaction lines of its own; apply_sc4_marine.sh wraps it
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

do $$
#variable_conflict use_column
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_s double precision; v_wrong double precision;
  v_g_nkerefi_milkrun_hours double precision;
  v_g_nkerefi_milkrun_fuel_t double precision;
  v_g_nkerefi_milkrun_fuel_cost double precision;
  v_g_nkerefi_milkrun_deadweight_t double precision;
  v_g_nkerefi_binding_utilisation double precision;
  v_g_nkerefi_dedicated_days double precision;
  v_g_akokwa_voyages_exact double precision;
  v_g_akokwa_vessel_days double precision;
  v_g_akokwa_vessels_exact double precision;
  v_g_akokwa_spare_vessel_days double precision;
  v_g_akokwa_ffd_v1_area_m2 double precision;
  v_g_akokwa_ffd_v2_load_utilisation double precision;
  v_g_mgbidi_mmc_wait_hours double precision;
  v_g_mgbidi_mmc_probability_wait double precision;
  v_g_mgbidi_mmc_time_at_base_hours double precision;
  v_g_mgbidi_mdc_wait_hours double precision;
  v_g_mgbidi_mdc_mean_queue double precision;
  v_g_mgbidi_target_wait_hours double precision;
  v_case_b jsonb := '{"dataset":"NKEREFI (synthetic)","label":"NKEREFI, one PSV serving the Nkerefi cluster (synthetic)","voyagePlan:milk-run":{"vessel":{"name":"PSV Nkerefi Dawn (synthetic)","speedKnots":11.5,"deckAreaM2":720,"deckUsableFraction":0.8,"deckLoadT":1650,"deadweightT":3100,"tanks":{"diesel":700,"water":900,"mud":500},"fuelTPerHour":{"sailing":0.46,"port":0.035,"field":0.27}},"products":[{"id":"diesel","name":"Marine gas oil (synthetic)","kind":"liquid","densityTPerM3":0.84},{"id":"water","name":"Drill water (synthetic)","kind":"liquid","densityTPerM3":1},{"id":"mud","name":"Oil-based mud (synthetic)","kind":"liquid","densityTPerM3":1.35}],"installations":[{"id":"NK-P","name":"Nkerefi production platform (synthetic)","fieldHours":5.5,"cargo":{"deckAreaM2":212.5,"deckWeightT":246.75,"bulk":{"diesel":185,"water":320}}},{"id":"NK-R","name":"Nkerefi jack-up drilling unit (synthetic)","fieldHours":7.25,"cargo":{"deckAreaM2":238.25,"deckWeightT":402.5,"bulk":{"diesel":210,"water":275,"mud":340}}},{"id":"NK-F","name":"Nkerefi FPSO (synthetic)","fieldHours":4.75,"cargo":{"deckAreaM2":97.75,"deckWeightT":88.25,"bulk":{"diesel":130,"water":145}}}],"route":{"mode":"milk-run","stops":["NK-P","NK-R","NK-F"],"legsNm":[47.5,13.25,21.5,58.75]},"portHours":10.5,"weather":{"factor":1.15,"appliesTo":["sailing","field"]},"fuelPricePerT":845.5},"voyagePlan:dedicated":{"vessel":{"name":"PSV Nkerefi Dawn (synthetic)","speedKnots":11.5,"deckAreaM2":720,"deckUsableFraction":0.8,"deckLoadT":1650,"deadweightT":3100,"tanks":{"diesel":700,"water":900,"mud":500},"fuelTPerHour":{"sailing":0.46,"port":0.035,"field":0.27}},"products":[{"id":"diesel","name":"Marine gas oil (synthetic)","kind":"liquid","densityTPerM3":0.84},{"id":"water","name":"Drill water (synthetic)","kind":"liquid","densityTPerM3":1},{"id":"mud","name":"Oil-based mud (synthetic)","kind":"liquid","densityTPerM3":1.35}],"installations":[{"id":"NK-P","name":"Nkerefi production platform (synthetic)","fieldHours":5.5,"distanceFromBaseNm":47.5,"cargo":{"deckAreaM2":212.5,"deckWeightT":246.75,"bulk":{"diesel":185,"water":320}}},{"id":"NK-R","name":"Nkerefi jack-up drilling unit (synthetic)","fieldHours":7.25,"distanceFromBaseNm":55.25,"cargo":{"deckAreaM2":238.25,"deckWeightT":402.5,"bulk":{"diesel":210,"water":275,"mud":340}}},{"id":"NK-F","name":"Nkerefi FPSO (synthetic)","fieldHours":4.75,"distanceFromBaseNm":58.75,"cargo":{"deckAreaM2":97.75,"deckWeightT":88.25,"bulk":{"diesel":130,"water":145}}}],"route":{"mode":"dedicated"},"portHours":10.5,"weather":{"factor":1.15,"appliesTo":["sailing","field"]},"fuelPricePerT":845.5}}'::jsonb;
  v_case_i jsonb := '{"dataset":"AKOKWA (synthetic)","label":"AKOKWA, a week of supply and one voyage of deck cargo for the Akokwa cluster (synthetic)","fleetSize":{"vessel":{"name":"PSV Akokwa Crest (synthetic)","speedKnots":12.5,"deckAreaM2":860,"deckUsableFraction":0.72,"deckLoadT":2150,"deadweightT":3850,"tanks":{"diesel":850,"water":1100,"brine":450,"cement":280},"fuelTPerHour":{"sailing":0.52,"port":0.04,"field":0.31}},"products":[{"id":"diesel","name":"Marine gas oil (synthetic)","kind":"liquid","densityTPerM3":0.845},{"id":"water","name":"Potable water (synthetic)","kind":"liquid","densityTPerM3":1},{"id":"brine","name":"Completion brine (synthetic)","kind":"liquid","densityTPerM3":1.25},{"id":"cement","name":"Cement, dry bulk (synthetic)","kind":"dry","densityTPerM3":1.45}],"installations":[{"id":"AK-1","name":"Akokwa wellhead platform (synthetic)","fieldHours":4.5,"minVisits":2,"demand":{"deckAreaM2":415.5,"deckWeightT":388.25,"bulk":{"diesel":365,"water":610}}},{"id":"AK-2","name":"Akokwa semi-submersible (synthetic)","fieldHours":9.25,"minVisits":3,"demand":{"deckAreaM2":1037.75,"deckWeightT":1420.5,"bulk":{"diesel":540,"water":820,"brine":395,"cement":215}}},{"id":"AK-3","name":"Akokwa processing platform (synthetic)","fieldHours":6.75,"minVisits":2,"demand":{"deckAreaM2":372.25,"deckWeightT":305.5,"bulk":{"diesel":290,"water":540}}},{"id":"AK-4","name":"Akokwa FSO (synthetic)","fieldHours":3.5,"minVisits":1,"demand":{"deckAreaM2":118.5,"deckWeightT":96.75,"bulk":{"diesel":175,"water":230}}}],"route":{"mode":"milk-run","stops":["AK-1","AK-2","AK-3","AK-4"],"legsNm":[58.5,16.25,11.75,24.5,83.25]},"portHours":14.5,"weather":{"factor":1.25,"appliesTo":["sailing","port"]},"fuelPricePerT":812.75,"periodDays":7,"vesselAvailableDays":6.25,"voyageRounding":"up","vesselRounding":"up"},"deckPlan":{"deck":{"name":"PSV Akokwa Crest clear deck (synthetic)","areaM2":860,"usableFraction":0.72,"loadT":2150},"items":[{"id":"ak-ibc","name":"Chemical IBC in a frame (synthetic)","lengthM":1.25,"widthM":1.05,"weightT":1.35,"quantity":14},{"id":"ak-skip","name":"Waste skip (synthetic)","lengthM":2.6,"widthM":1.75,"weightT":2.9,"quantity":7},{"id":"ak-c10","name":"10 ft offshore container (synthetic)","lengthM":2.99,"widthM":2.44,"weightT":7.5,"quantity":11},{"id":"ak-bskt","name":"8 m cargo basket (synthetic)","lengthM":8,"widthM":2.45,"weightT":7.25,"quantity":6},{"id":"ak-tank","name":"Portable brine tank (synthetic)","lengthM":5.2,"widthM":2.35,"weightT":15.5,"quantity":5},{"id":"ak-c20","name":"20 ft offshore container (synthetic)","lengthM":6.06,"widthM":2.44,"weightT":11.5,"quantity":14},{"id":"ak-riser","name":"Riser joints, bundled (synthetic)","lengthM":15.25,"widthM":2.75,"weightT":41.5,"quantity":3}],"voyages":2,"rule":"first-fit-decreasing-area"}}'::jsonb;
  v_case_a jsonb := '{"dataset":"MGBIDI (synthetic)","label":"MGBIDI, the Mgbidi supply base and its fleet (synthetic)","shoreBase:mmc":{"berths":3,"arrivalsPerDay":4.6,"workingHoursPerDay":20,"service":{"fixedHours":1.5,"lifts":84,"liftsPerHour":14,"bulkM3":540,"bulkM3PerHour":120,"concurrent":true},"model":"M/M/c","targetMeanWaitHours":0.35},"shoreBase:mdc":{"berths":3,"arrivalsPerDay":4.6,"workingHoursPerDay":20,"service":{"fixedHours":1.5,"lifts":84,"liftsPerHour":14,"bulkM3":540,"bulkM3PerHour":120,"concurrent":true},"model":"M/D/c"},"fleetVariability":{"vessel":{"name":"PSV Mgbidi Pride (synthetic)","speedKnots":12,"deckAreaM2":780,"deckUsableFraction":0.74,"deckLoadT":1900,"deadweightT":3400,"tanks":{"diesel":780,"water":1000},"fuelTPerHour":{"sailing":0.49,"port":0.036,"field":0.29}},"products":[{"id":"diesel","name":"Marine gas oil (synthetic)","kind":"liquid","densityTPerM3":0.85},{"id":"water","name":"Potable water (synthetic)","kind":"liquid","densityTPerM3":1}],"installations":[{"id":"MG-A","name":"Mgbidi-A platform (synthetic)","distanceFromBaseNm":71.5,"fieldHours":6.5,"minVisits":2,"demand":{"deckAreaM2":690.5,"deckWeightT":812.25,"bulk":{"diesel":505,"water":880}}},{"id":"MG-B","name":"Mgbidi-B platform (synthetic)","distanceFromBaseNm":88.25,"fieldHours":5.25,"minVisits":2,"demand":{"deckAreaM2":402.75,"deckWeightT":455.5,"bulk":{"diesel":310,"water":520}}}],"route":{"mode":"dedicated"},"portHours":13.5,"weather":{"factor":{"min":1,"mode":1.15,"max":1.55},"appliesTo":["sailing","field"]},"fuelPricePerT":830.25,"periodDays":7,"vesselAvailableDays":6.5,"voyageRounding":"up","vesselRounding":"up","demandFactor":{"min":0.9,"mode":1,"max":1.35},"plannedVessels":2,"iterations":20000,"seed":20291117}}'::jsonb;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'marine' and active;
  if v_structures <> 3 then
    raise exception 'SC4 go-live refused: marine has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'marine';
  if v_questions <> 396 then
    raise exception 'SC4 go-live refused: marine has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'marine' group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'SC4 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;
  select count(*) into v_n from (select tier, module_key from public.academy_quiz_questions where app_slug = 'marine' and scope = 'module' group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'SC4 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'marine' and scope = 'final' group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'SC4 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = 'marine'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'SC4 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;
  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'marine' and s.active;
  if v_lessons <> 78 then
    raise exception 'SC4 go-live refused: marine carries % lesson keys, expected 78', v_lessons;
  end if;
  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'marine' and s.active;
  if v_modules <> 18 then
    raise exception 'SC4 go-live refused: marine carries % modules, expected 18 (six per tier)', v_modules;
  end if;
  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'marine' and qq.scope = 'module' and not exists (
       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'SC4 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'marine';
  if v_capstones <> 3 then
    raise exception 'SC4 go-live refused: marine has % capstones, expected 3', v_capstones;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'marine';
  if v_graded <> 18 then
    raise exception 'SC4 go-live refused: marine has % graded capstone fields, expected 18', v_graded;
  end if;
  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'marine' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'SC4 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'marine' and module = 'supply_chain' and path_order = 78 and prereq_slug is null) then
    raise exception 'SC4 go-live refused: the marine catalogue row is not supply_chain at path_order 78 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 78 and slug <> 'marine') then
    raise exception 'SC4 go-live refused: another course already holds path_order 78';
  end if;

  -- ------------------------------------------------- the grader is numeric
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or abs((f->>'expected')::numeric) <= 0.001
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= (f->>'tol')::numeric
          or (f->>'tol')::numeric is distinct from (select t.tol from (values ('beginner', 'nkerefi_milkrun_hours', 5e-07::numeric), ('beginner', 'nkerefi_milkrun_fuel_t', 5e-07::numeric), ('beginner', 'nkerefi_milkrun_fuel_cost', 5e-07::numeric), ('beginner', 'nkerefi_milkrun_deadweight_t', 5e-07::numeric), ('beginner', 'nkerefi_binding_utilisation', 5e-07::numeric), ('beginner', 'nkerefi_dedicated_days', 5e-07::numeric), ('intermediate', 'akokwa_voyages_exact', 5e-07::numeric), ('intermediate', 'akokwa_vessel_days', 5e-07::numeric), ('intermediate', 'akokwa_vessels_exact', 5e-07::numeric), ('intermediate', 'akokwa_spare_vessel_days', 5e-07::numeric), ('intermediate', 'akokwa_ffd_v1_area_m2', 5e-07::numeric), ('intermediate', 'akokwa_ffd_v2_load_utilisation', 5e-07::numeric), ('advanced', 'mgbidi_mmc_wait_hours', 5e-07::numeric), ('advanced', 'mgbidi_mmc_probability_wait', 5e-07::numeric), ('advanced', 'mgbidi_mmc_time_at_base_hours', 5e-07::numeric), ('advanced', 'mgbidi_mdc_wait_hours', 5e-07::numeric), ('advanced', 'mgbidi_mdc_mean_queue', 5e-07::numeric), ('advanced', 'mgbidi_target_wait_hours', 5e-07::numeric)) t(tier, k, tol) where t.tier = c.tier and t.k = f->>'key')
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'SC4 go-live refused: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;
  end if;
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or ((f->>'tol')::numeric = 0.0000005
              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));
  if v_n <> 0 then
    raise exception 'SC4 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or, at the six-decimal floor, pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;

  -- ---------------------------------------- the prompts the learner reads
  select prompt into v_prompt from public.academy_capstones where app_slug = 'marine' and tier = 'beginner';
  if v_prompt is null or md5(v_prompt) <> '21ee83e603c8db0d9854a10df96ae538' then
    raise exception 'SC4 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'marine' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'NKEREFI, one PSV serving the Nkerefi cluster (synthetic)' and title = 'Voyages, capacity and the binding constraint') then
    raise exception 'SC4 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['milk-run', 'dedicated', 'sailing', 'field', 'NK-P', 'NK-R', 'NK-F', '(and on no other activity)', 'nkerefi_case.json', 'No value depends on any of the readings the engine states (a load exactly at a capacity, the binding tie, the twelve-digit key a count is rounded on, halves to the nearest vessel, a tie of demand and minimum visits, a tie of equal footprints, an exact deck fit, a berth target met exactly, short at equality, the P90 of a requirement) or on a Monte Carlo draw; every choice a value rests on is stated here, and every input a value needs is in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'SC4 go-live refused: % stated setting(s) or case file(s) are not named in the shipped beginner prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'marine' and tier = 'intermediate';
  if v_prompt is null or md5(v_prompt) <> 'a7f900a554cb084cabe62664fcd337f9' then
    raise exception 'SC4 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'marine' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'AKOKWA, a week of supply and one voyage of deck cargo for the Akokwa cluster (synthetic)' and title = 'Fleet sizing and deck planning') then
    raise exception 'SC4 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['voyageRounding up', 'vesselRounding up', 'first-fit-decreasing-area', 'minimum visits', 'sailing', 'port', '(and on no other activity)', 'akokwa_case.json', 'No value depends on any of the readings the engine states (a load exactly at a capacity, the binding tie, the twelve-digit key a count is rounded on, halves to the nearest vessel, a tie of demand and minimum visits, a tie of equal footprints, an exact deck fit, a berth target met exactly, short at equality, the P90 of a requirement) or on a Monte Carlo draw; every choice a value rests on is stated here, and every input a value needs is in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'SC4 go-live refused: % stated setting(s) or case file(s) are not named in the shipped intermediate prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'marine' and tier = 'advanced';
  if v_prompt is null or md5(v_prompt) <> '7927171d080b0cc29c7ea360cee78637' then
    raise exception 'SC4 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'marine' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'MGBIDI, the Mgbidi supply base and its fleet (synthetic)' and title = 'Shore base queues, variability and the limits') then
    raise exception 'SC4 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['M/M/c', 'M/D/c', 'concurrent true', 'none of its figures is graded', 'seed', 'mgbidi_case.json', 'No value depends on any of the readings the engine states (a load exactly at a capacity, the binding tie, the twelve-digit key a count is rounded on, halves to the nearest vessel, a tie of demand and minimum visits, a tie of equal footprints, an exact deck fit, a berth target met exactly, short at equality, the P90 of a requirement) or on a Monte Carlo draw; every choice a value rests on is stated here, and every input a value needs is in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'SC4 go-live refused: % stated setting(s) or case file(s) are not named in the shipped advanced prompt: %', v_n, v_names;
  end if;
  -- No number handed in any capstone text of this course may sit within its
  -- tolerance of any graded value of any tier.
  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names
    from (select c.tier as ctier, m[1]::double precision as x
            from public.academy_capstones c,
                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||
                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),
                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m
           where c.app_slug = 'marine') h,
         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'marine') g
   where abs(abs(h.x) - abs(g.v)) <= g.t;
  if v_n <> 0 then
    raise exception 'SC4 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_nkerefi_milkrun_hours
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'beginner' and f->>'key' = 'nkerefi_milkrun_hours';
  if v_g_nkerefi_milkrun_hours is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: beginner/nkerefi_milkrun_hours]';
  end if;
  select (f->>'expected')::double precision into v_g_nkerefi_milkrun_fuel_t
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'beginner' and f->>'key' = 'nkerefi_milkrun_fuel_t';
  if v_g_nkerefi_milkrun_fuel_t is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: beginner/nkerefi_milkrun_fuel_t]';
  end if;
  select (f->>'expected')::double precision into v_g_nkerefi_milkrun_fuel_cost
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'beginner' and f->>'key' = 'nkerefi_milkrun_fuel_cost';
  if v_g_nkerefi_milkrun_fuel_cost is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: beginner/nkerefi_milkrun_fuel_cost]';
  end if;
  select (f->>'expected')::double precision into v_g_nkerefi_milkrun_deadweight_t
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'beginner' and f->>'key' = 'nkerefi_milkrun_deadweight_t';
  if v_g_nkerefi_milkrun_deadweight_t is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: beginner/nkerefi_milkrun_deadweight_t]';
  end if;
  select (f->>'expected')::double precision into v_g_nkerefi_binding_utilisation
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'beginner' and f->>'key' = 'nkerefi_binding_utilisation';
  if v_g_nkerefi_binding_utilisation is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: beginner/nkerefi_binding_utilisation]';
  end if;
  select (f->>'expected')::double precision into v_g_nkerefi_dedicated_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'beginner' and f->>'key' = 'nkerefi_dedicated_days';
  if v_g_nkerefi_dedicated_days is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: beginner/nkerefi_dedicated_days]';
  end if;
  select (f->>'expected')::double precision into v_g_akokwa_voyages_exact
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'intermediate' and f->>'key' = 'akokwa_voyages_exact';
  if v_g_akokwa_voyages_exact is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: intermediate/akokwa_voyages_exact]';
  end if;
  select (f->>'expected')::double precision into v_g_akokwa_vessel_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'intermediate' and f->>'key' = 'akokwa_vessel_days';
  if v_g_akokwa_vessel_days is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: intermediate/akokwa_vessel_days]';
  end if;
  select (f->>'expected')::double precision into v_g_akokwa_vessels_exact
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'intermediate' and f->>'key' = 'akokwa_vessels_exact';
  if v_g_akokwa_vessels_exact is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: intermediate/akokwa_vessels_exact]';
  end if;
  select (f->>'expected')::double precision into v_g_akokwa_spare_vessel_days
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'intermediate' and f->>'key' = 'akokwa_spare_vessel_days';
  if v_g_akokwa_spare_vessel_days is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: intermediate/akokwa_spare_vessel_days]';
  end if;
  select (f->>'expected')::double precision into v_g_akokwa_ffd_v1_area_m2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'intermediate' and f->>'key' = 'akokwa_ffd_v1_area_m2';
  if v_g_akokwa_ffd_v1_area_m2 is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: intermediate/akokwa_ffd_v1_area_m2]';
  end if;
  select (f->>'expected')::double precision into v_g_akokwa_ffd_v2_load_utilisation
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'intermediate' and f->>'key' = 'akokwa_ffd_v2_load_utilisation';
  if v_g_akokwa_ffd_v2_load_utilisation is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: intermediate/akokwa_ffd_v2_load_utilisation]';
  end if;
  select (f->>'expected')::double precision into v_g_mgbidi_mmc_wait_hours
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'advanced' and f->>'key' = 'mgbidi_mmc_wait_hours';
  if v_g_mgbidi_mmc_wait_hours is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: advanced/mgbidi_mmc_wait_hours]';
  end if;
  select (f->>'expected')::double precision into v_g_mgbidi_mmc_probability_wait
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'advanced' and f->>'key' = 'mgbidi_mmc_probability_wait';
  if v_g_mgbidi_mmc_probability_wait is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: advanced/mgbidi_mmc_probability_wait]';
  end if;
  select (f->>'expected')::double precision into v_g_mgbidi_mmc_time_at_base_hours
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'advanced' and f->>'key' = 'mgbidi_mmc_time_at_base_hours';
  if v_g_mgbidi_mmc_time_at_base_hours is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: advanced/mgbidi_mmc_time_at_base_hours]';
  end if;
  select (f->>'expected')::double precision into v_g_mgbidi_mdc_wait_hours
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'advanced' and f->>'key' = 'mgbidi_mdc_wait_hours';
  if v_g_mgbidi_mdc_wait_hours is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: advanced/mgbidi_mdc_wait_hours]';
  end if;
  select (f->>'expected')::double precision into v_g_mgbidi_mdc_mean_queue
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'advanced' and f->>'key' = 'mgbidi_mdc_mean_queue';
  if v_g_mgbidi_mdc_mean_queue is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: advanced/mgbidi_mdc_mean_queue]';
  end if;
  select (f->>'expected')::double precision into v_g_mgbidi_target_wait_hours
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'marine' and c.tier = 'advanced' and f->>'key' = 'mgbidi_target_wait_hours';
  if v_g_mgbidi_target_wait_hours is null then
    raise exception 'SC4 go-live refused: the seeded rows carry no value [graded field: advanced/mgbidi_target_wait_hours]';
  end if;

  -- ------------------------------------------ 1. against the engine ledger
  if v_g_nkerefi_milkrun_hours <> 44.724999999999994::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 44.724999999999994 [graded field: beginner/nkerefi_milkrun_hours]', v_g_nkerefi_milkrun_hours;
  end if;
  if v_g_nkerefi_milkrun_fuel_t <> 12.28725::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 12.28725 [graded field: beginner/nkerefi_milkrun_fuel_t]', v_g_nkerefi_milkrun_fuel_t;
  end if;
  if v_g_nkerefi_milkrun_fuel_cost <> 10388.869875::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 10388.869875 [graded field: beginner/nkerefi_milkrun_fuel_cost]', v_g_nkerefi_milkrun_fuel_cost;
  end if;
  if v_g_nkerefi_milkrun_deadweight_t <> 2377.5::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 2377.5 [graded field: beginner/nkerefi_milkrun_deadweight_t]', v_g_nkerefi_milkrun_deadweight_t;
  end if;
  if v_g_nkerefi_binding_utilisation <> 0.9522569444444444::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 0.9522569444444444 [graded field: beginner/nkerefi_binding_utilisation]', v_g_nkerefi_binding_utilisation;
  end if;
  if v_g_nkerefi_dedicated_days <> 3.4968749999999993::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 3.4968749999999993 [graded field: beginner/nkerefi_dedicated_days]', v_g_nkerefi_dedicated_days;
  end if;
  if v_g_akokwa_voyages_exact <> 3.1395348837209305::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 3.1395348837209305 [graded field: intermediate/akokwa_voyages_exact]', v_g_akokwa_voyages_exact;
  end if;
  if v_g_akokwa_vessel_days <> 10.258333333333333::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 10.258333333333333 [graded field: intermediate/akokwa_vessel_days]', v_g_akokwa_vessel_days;
  end if;
  if v_g_akokwa_vessels_exact <> 1.6413333333333333::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 1.6413333333333333 [graded field: intermediate/akokwa_vessels_exact]', v_g_akokwa_vessels_exact;
  end if;
  if v_g_akokwa_spare_vessel_days <> 2.241666666666667::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 2.241666666666667 [graded field: intermediate/akokwa_spare_vessel_days]', v_g_akokwa_spare_vessel_days;
  end if;
  if v_g_akokwa_ffd_v1_area_m2 <> 619.0737000000004::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 619.0737000000004 [graded field: intermediate/akokwa_ffd_v1_area_m2]', v_g_akokwa_ffd_v1_area_m2;
  end if;
  if v_g_akokwa_ffd_v2_load_utilisation <> 0.010139534883720932::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 0.010139534883720932 [graded field: intermediate/akokwa_ffd_v2_load_utilisation]', v_g_akokwa_ffd_v2_load_utilisation;
  end if;
  if v_g_mgbidi_mmc_wait_hours <> 1.9018994157247162::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 1.9018994157247162 [graded field: advanced/mgbidi_mmc_wait_hours]', v_g_mgbidi_mmc_wait_hours;
  end if;
  if v_g_mgbidi_mmc_probability_wait <> 0.3233229006732018::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 0.3233229006732018 [graded field: advanced/mgbidi_mmc_probability_wait]', v_g_mgbidi_mmc_probability_wait;
  end if;
  if v_g_mgbidi_mmc_time_at_base_hours <> 9.401899415724717::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 9.401899415724717 [graded field: advanced/mgbidi_mmc_time_at_base_hours]', v_g_mgbidi_mmc_time_at_base_hours;
  end if;
  if v_g_mgbidi_mdc_wait_hours <> 1.020033589096101::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 1.020033589096101 [graded field: advanced/mgbidi_mdc_wait_hours]', v_g_mgbidi_mdc_wait_hours;
  end if;
  if v_g_mgbidi_mdc_mean_queue <> 0.2346077254921032::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 0.2346077254921032 [graded field: advanced/mgbidi_mdc_mean_queue]', v_g_mgbidi_mdc_mean_queue;
  end if;
  if v_g_mgbidi_target_wait_hours <> 0.07902133066152323::double precision then
    raise exception 'SC4 go-live refused: the seeded value is %, and the engine returned 0.07902133066152323 [graded field: advanced/mgbidi_target_wait_hours]', v_g_mgbidi_target_wait_hours;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  v_s := pg_temp.sc4_voyage(v_case_b->'voyagePlan:milk-run', 'hours');
  if v_s is null or abs(v_s - v_g_nkerefi_milkrun_hours) > 1e-9 * abs(v_g_nkerefi_milkrun_hours) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/nkerefi_milkrun_hours]', v_s, v_g_nkerefi_milkrun_hours;
  end if;
  v_s := pg_temp.sc4_voyage(v_case_b->'voyagePlan:milk-run', 'fuel');
  if v_s is null or abs(v_s - v_g_nkerefi_milkrun_fuel_t) > 1e-9 * abs(v_g_nkerefi_milkrun_fuel_t) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/nkerefi_milkrun_fuel_t]', v_s, v_g_nkerefi_milkrun_fuel_t;
  end if;
  v_s := pg_temp.sc4_voyage(v_case_b->'voyagePlan:milk-run', 'cost');
  if v_s is null or abs(v_s - v_g_nkerefi_milkrun_fuel_cost) > 1e-9 * abs(v_g_nkerefi_milkrun_fuel_cost) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/nkerefi_milkrun_fuel_cost]', v_s, v_g_nkerefi_milkrun_fuel_cost;
  end if;
  v_s := pg_temp.sc4_voyage(v_case_b->'voyagePlan:milk-run', 'deadweight');
  if v_s is null or abs(v_s - v_g_nkerefi_milkrun_deadweight_t) > 1e-9 * abs(v_g_nkerefi_milkrun_deadweight_t) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/nkerefi_milkrun_deadweight_t]', v_s, v_g_nkerefi_milkrun_deadweight_t;
  end if;
  v_s := pg_temp.sc4_voyage(v_case_b->'voyagePlan:milk-run', 'binding');
  if v_s is null or abs(v_s - v_g_nkerefi_binding_utilisation) > 1e-9 * abs(v_g_nkerefi_binding_utilisation) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/nkerefi_binding_utilisation]', v_s, v_g_nkerefi_binding_utilisation;
  end if;
  v_s := pg_temp.sc4_voyage(v_case_b->'voyagePlan:dedicated', 'days');
  if v_s is null or abs(v_s - v_g_nkerefi_dedicated_days) > 1e-9 * abs(v_g_nkerefi_dedicated_days) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/nkerefi_dedicated_days]', v_s, v_g_nkerefi_dedicated_days;
  end if;
  v_s := pg_temp.sc4_fleet(v_case_i->'fleetSize', 'voyages_exact');
  if v_s is null or abs(v_s - v_g_akokwa_voyages_exact) > 1e-9 * abs(v_g_akokwa_voyages_exact) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/akokwa_voyages_exact]', v_s, v_g_akokwa_voyages_exact;
  end if;
  v_s := pg_temp.sc4_fleet(v_case_i->'fleetSize', 'vessel_days');
  if v_s is null or abs(v_s - v_g_akokwa_vessel_days) > 1e-9 * abs(v_g_akokwa_vessel_days) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/akokwa_vessel_days]', v_s, v_g_akokwa_vessel_days;
  end if;
  v_s := pg_temp.sc4_fleet(v_case_i->'fleetSize', 'vessels_exact');
  if v_s is null or abs(v_s - v_g_akokwa_vessels_exact) > 1e-9 * abs(v_g_akokwa_vessels_exact) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/akokwa_vessels_exact]', v_s, v_g_akokwa_vessels_exact;
  end if;
  v_s := pg_temp.sc4_fleet(v_case_i->'fleetSize', 'spare');
  if v_s is null or abs(v_s - v_g_akokwa_spare_vessel_days) > 1e-9 * abs(v_g_akokwa_spare_vessel_days) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/akokwa_spare_vessel_days]', v_s, v_g_akokwa_spare_vessel_days;
  end if;
  v_s := pg_temp.sc4_deck(v_case_i->'deckPlan', 'area', 1);
  if v_s is null or abs(v_s - v_g_akokwa_ffd_v1_area_m2) > 1e-9 * abs(v_g_akokwa_ffd_v1_area_m2) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/akokwa_ffd_v1_area_m2]', v_s, v_g_akokwa_ffd_v1_area_m2;
  end if;
  v_s := pg_temp.sc4_deck(v_case_i->'deckPlan', 'load', 2);
  if v_s is null or abs(v_s - v_g_akokwa_ffd_v2_load_utilisation) > 1e-9 * abs(v_g_akokwa_ffd_v2_load_utilisation) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/akokwa_ffd_v2_load_utilisation]', v_s, v_g_akokwa_ffd_v2_load_utilisation;
  end if;
  v_s := pg_temp.sc4_base(v_case_a->'shoreBase:mmc', 'wait');
  if v_s is null or abs(v_s - v_g_mgbidi_mmc_wait_hours) > 1e-9 * abs(v_g_mgbidi_mmc_wait_hours) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/mgbidi_mmc_wait_hours]', v_s, v_g_mgbidi_mmc_wait_hours;
  end if;
  v_s := pg_temp.sc4_base(v_case_a->'shoreBase:mmc', 'pwait');
  if v_s is null or abs(v_s - v_g_mgbidi_mmc_probability_wait) > 1e-9 * abs(v_g_mgbidi_mmc_probability_wait) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/mgbidi_mmc_probability_wait]', v_s, v_g_mgbidi_mmc_probability_wait;
  end if;
  v_s := pg_temp.sc4_base(v_case_a->'shoreBase:mmc', 'time');
  if v_s is null or abs(v_s - v_g_mgbidi_mmc_time_at_base_hours) > 1e-9 * abs(v_g_mgbidi_mmc_time_at_base_hours) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/mgbidi_mmc_time_at_base_hours]', v_s, v_g_mgbidi_mmc_time_at_base_hours;
  end if;
  v_s := pg_temp.sc4_base(v_case_a->'shoreBase:mdc', 'wait');
  if v_s is null or abs(v_s - v_g_mgbidi_mdc_wait_hours) > 1e-9 * abs(v_g_mgbidi_mdc_wait_hours) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/mgbidi_mdc_wait_hours]', v_s, v_g_mgbidi_mdc_wait_hours;
  end if;
  v_s := pg_temp.sc4_base(v_case_a->'shoreBase:mdc', 'queue');
  if v_s is null or abs(v_s - v_g_mgbidi_mdc_mean_queue) > 1e-9 * abs(v_g_mgbidi_mdc_mean_queue) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/mgbidi_mdc_mean_queue]', v_s, v_g_mgbidi_mdc_mean_queue;
  end if;
  v_s := pg_temp.sc4_base(v_case_a->'shoreBase:mmc', 'target');
  if v_s is null or abs(v_s - v_g_mgbidi_target_wait_hours) > 1e-9 * abs(v_g_mgbidi_target_wait_hours) then
    raise exception 'SC4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/mgbidi_target_wait_hours]', v_s, v_g_mgbidi_target_wait_hours;
  end if;

  -- ---------------------------------------------------- 3. against the oracle
  -- oracle_check.py --json, run when this file was generated: the value the
  -- vendored stdlib oracle computed, written in, with the module it came from.
  -- nkerefi_milkrun_hours: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_nkerefi_milkrun_hours - 44.725::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 44.725, not within 5e-07 of the seeded % [graded field: beginner/nkerefi_milkrun_hours]', v_g_nkerefi_milkrun_hours;
  end if;
  -- nkerefi_milkrun_fuel_t: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_nkerefi_milkrun_fuel_t - 12.28725::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 12.28725, not within 5e-07 of the seeded % [graded field: beginner/nkerefi_milkrun_fuel_t]', v_g_nkerefi_milkrun_fuel_t;
  end if;
  -- nkerefi_milkrun_fuel_cost: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_nkerefi_milkrun_fuel_cost - 10388.869875::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 10388.869875, not within 5e-07 of the seeded % [graded field: beginner/nkerefi_milkrun_fuel_cost]', v_g_nkerefi_milkrun_fuel_cost;
  end if;
  -- nkerefi_milkrun_deadweight_t: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_nkerefi_milkrun_deadweight_t - 2377.5::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 2377.5, not within 5e-07 of the seeded % [graded field: beginner/nkerefi_milkrun_deadweight_t]', v_g_nkerefi_milkrun_deadweight_t;
  end if;
  -- nkerefi_binding_utilisation: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_nkerefi_binding_utilisation - 0.9522569444444444::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 0.9522569444444444, not within 5e-07 of the seeded % [graded field: beginner/nkerefi_binding_utilisation]', v_g_nkerefi_binding_utilisation;
  end if;
  -- nkerefi_dedicated_days: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_nkerefi_dedicated_days - 3.496875::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 3.496875, not within 5e-07 of the seeded % [graded field: beginner/nkerefi_dedicated_days]', v_g_nkerefi_dedicated_days;
  end if;
  -- akokwa_voyages_exact: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_akokwa_voyages_exact - 3.13953488372093::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 3.13953488372093, not within 5e-07 of the seeded % [graded field: intermediate/akokwa_voyages_exact]', v_g_akokwa_voyages_exact;
  end if;
  -- akokwa_vessel_days: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_akokwa_vessel_days - 10.258333333333333::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 10.258333333333333, not within 5e-07 of the seeded % [graded field: intermediate/akokwa_vessel_days]', v_g_akokwa_vessel_days;
  end if;
  -- akokwa_vessels_exact: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_akokwa_vessels_exact - 1.6413333333333333::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 1.6413333333333333, not within 5e-07 of the seeded % [graded field: intermediate/akokwa_vessels_exact]', v_g_akokwa_vessels_exact;
  end if;
  -- akokwa_spare_vessel_days: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_akokwa_spare_vessel_days - 2.2416666666666667::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 2.2416666666666667, not within 5e-07 of the seeded % [graded field: intermediate/akokwa_spare_vessel_days]', v_g_akokwa_spare_vessel_days;
  end if;
  -- akokwa_ffd_v1_area_m2: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_akokwa_ffd_v1_area_m2 - 619.0737::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 619.0737, not within 5e-07 of the seeded % [graded field: intermediate/akokwa_ffd_v1_area_m2]', v_g_akokwa_ffd_v1_area_m2;
  end if;
  -- akokwa_ffd_v2_load_utilisation: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_akokwa_ffd_v2_load_utilisation - 0.01013953488372093::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 0.01013953488372093, not within 5e-07 of the seeded % [graded field: intermediate/akokwa_ffd_v2_load_utilisation]', v_g_akokwa_ffd_v2_load_utilisation;
  end if;
  -- mgbidi_mmc_wait_hours: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_mgbidi_mmc_wait_hours - 1.9018994157247167::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 1.9018994157247167, not within 5e-07 of the seeded % [graded field: advanced/mgbidi_mmc_wait_hours]', v_g_mgbidi_mmc_wait_hours;
  end if;
  -- mgbidi_mmc_probability_wait: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_mgbidi_mmc_probability_wait - 0.32332290067320185::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 0.32332290067320185, not within 5e-07 of the seeded % [graded field: advanced/mgbidi_mmc_probability_wait]', v_g_mgbidi_mmc_probability_wait;
  end if;
  -- mgbidi_mmc_time_at_base_hours: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_mgbidi_mmc_time_at_base_hours - 9.401899415724717::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 9.401899415724717, not within 5e-07 of the seeded % [graded field: advanced/mgbidi_mmc_time_at_base_hours]', v_g_mgbidi_mmc_time_at_base_hours;
  end if;
  -- mgbidi_mdc_wait_hours: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_mgbidi_mdc_wait_hours - 1.0200335890961012::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 1.0200335890961012, not within 5e-07 of the seeded % [graded field: advanced/mgbidi_mdc_wait_hours]', v_g_mgbidi_mdc_wait_hours;
  end if;
  -- mgbidi_mdc_mean_queue: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_mgbidi_mdc_mean_queue - 0.2346077254921033::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 0.2346077254921033, not within 5e-07 of the seeded % [graded field: advanced/mgbidi_mdc_mean_queue]', v_g_mgbidi_mdc_mean_queue;
  end if;
  -- mgbidi_target_wait_hours: tools/validation/supplychain/oracle_marine.py
  if abs(v_g_mgbidi_target_wait_hours - 0.07902133066152325::double precision) > 5e-07::double precision then
    raise exception 'SC4 go-live refused: the oracle gives 0.07902133066152325, not within 5e-07 of the seeded % [graded field: advanced/mgbidi_target_wait_hours]', v_g_mgbidi_target_wait_hours;
  end if;

  -- ------------------------------------------------------------- 4. the traps
  -- Every wrong method discriminate.mjs swept through the engine for a field,
  -- by value: each must miss the seeded value by more than the tolerance, or
  -- the field does not discriminate the trap it is for.
  v_wrong := 40.26086956521739::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (weather ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_hours]', v_wrong, v_g_nkerefi_milkrun_hours;
  end if;
  v_wrong := 38.2383909287257::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (speed read as kmh) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_hours]', v_wrong, v_g_nkerefi_milkrun_hours;
  end if;
  v_wrong := 38.85::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (return leg dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_hours]', v_wrong, v_g_nkerefi_milkrun_hours;
  end if;
  v_wrong := 46.3::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (weather on every activity stated) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_hours]', v_wrong, v_g_nkerefi_milkrun_hours;
  end if;
  v_wrong := 14.099999999999998::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (sailing hours only) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_hours]', v_wrong, v_g_nkerefi_milkrun_hours;
  end if;
  v_wrong := 10.7325::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_fuel_t) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (weather ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_fuel_t]', v_wrong, v_g_nkerefi_milkrun_fuel_t;
  end if;
  v_wrong := 20.5735::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_fuel_t) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (every activity at sailing rate) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_fuel_t]', v_wrong, v_g_nkerefi_milkrun_fuel_t;
  end if;
  v_wrong := 9.58475::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_fuel_t) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (return leg dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_fuel_t]', v_wrong, v_g_nkerefi_milkrun_fuel_t;
  end if;
  v_wrong := 12.342375::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_fuel_t) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (weather on every activity stated) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_fuel_t]', v_wrong, v_g_nkerefi_milkrun_fuel_t;
  end if;
  v_wrong := 6.485999999999999::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_fuel_t) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (sailing fuel only) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_fuel_t]', v_wrong, v_g_nkerefi_milkrun_fuel_t;
  end if;
  v_wrong := 10.388869875000001::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_fuel_cost) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (fuel price per thousand tonnes) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_fuel_cost]', v_wrong, v_g_nkerefi_milkrun_fuel_cost;
  end if;
  v_wrong := 17394.894249999998::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_fuel_cost) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (every activity at sailing rate) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_fuel_cost]', v_wrong, v_g_nkerefi_milkrun_fuel_cost;
  end if;
  v_wrong := 9074.32875::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_fuel_cost) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (weather ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_fuel_cost]', v_wrong, v_g_nkerefi_milkrun_fuel_cost;
  end if;
  v_wrong := 10435.4780625::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_fuel_cost) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (weather on every activity stated) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_fuel_cost]', v_wrong, v_g_nkerefi_milkrun_fuel_cost;
  end if;
  v_wrong := 37814.987499999996::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_fuel_cost) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the hours times the price) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_fuel_cost]', v_wrong, v_g_nkerefi_milkrun_fuel_cost;
  end if;
  v_wrong := 737.5::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_deadweight_t) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (deadweight without bulk) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_deadweight_t]', v_wrong, v_g_nkerefi_milkrun_deadweight_t;
  end if;
  v_wrong := 2342.5::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_deadweight_t) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (bulk m3 as tonnes) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_deadweight_t]', v_wrong, v_g_nkerefi_milkrun_deadweight_t;
  end if;
  v_wrong := 912.5::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_deadweight_t) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the deck load capacity less the deck weight) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_deadweight_t]', v_wrong, v_g_nkerefi_milkrun_deadweight_t;
  end if;
  v_wrong := 2900.5::double precision;
  if abs(v_wrong - v_g_nkerefi_milkrun_deadweight_t) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the tank capacities at their densities) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_milkrun_deadweight_t]', v_wrong, v_g_nkerefi_milkrun_deadweight_t;
  end if;
  v_wrong := 0.8222222222222222::double precision;
  if abs(v_wrong - v_g_nkerefi_binding_utilisation) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (usable fraction ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_binding_utilisation]', v_wrong, v_g_nkerefi_binding_utilisation;
  end if;
  v_wrong := 0.44696969696969696::double precision;
  if abs(v_wrong - v_g_nkerefi_binding_utilisation) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the deck load utilisation) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_binding_utilisation]', v_wrong, v_g_nkerefi_binding_utilisation;
  end if;
  v_wrong := 0.7669354838709678::double precision;
  if abs(v_wrong - v_g_nkerefi_binding_utilisation) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the deadweight utilisation) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_binding_utilisation]', v_wrong, v_g_nkerefi_binding_utilisation;
  end if;
  v_wrong := 0.8222222222222222::double precision;
  if abs(v_wrong - v_g_nkerefi_binding_utilisation) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the highest tank utilisation) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_binding_utilisation]', v_wrong, v_g_nkerefi_binding_utilisation;
  end if;
  v_wrong := 2.823958333333333::double precision;
  if abs(v_wrong - v_g_nkerefi_dedicated_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (dedicated one way) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_dedicated_days]', v_wrong, v_g_nkerefi_dedicated_days;
  end if;
  v_wrong := 3.211956521739131::double precision;
  if abs(v_wrong - v_g_nkerefi_dedicated_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (weather ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_dedicated_days]', v_wrong, v_g_nkerefi_dedicated_days;
  end if;
  v_wrong := 2.877733531317494::double precision;
  if abs(v_wrong - v_g_nkerefi_dedicated_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (speed read as kmh) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_dedicated_days]', v_wrong, v_g_nkerefi_dedicated_days;
  end if;
  v_wrong := 3.6937499999999996::double precision;
  if abs(v_wrong - v_g_nkerefi_dedicated_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (weather on every activity stated) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_dedicated_days]', v_wrong, v_g_nkerefi_dedicated_days;
  end if;
  v_wrong := 83.92499999999998::double precision;
  if abs(v_wrong - v_g_nkerefi_dedicated_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the total hours read as days) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/nkerefi_dedicated_days]', v_wrong, v_g_nkerefi_dedicated_days;
  end if;
  v_wrong := 3.0::double precision;
  if abs(v_wrong - v_g_akokwa_voyages_exact) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (usable fraction ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_voyages_exact]', v_wrong, v_g_akokwa_voyages_exact;
  end if;
  v_wrong := 3.0::double precision;
  if abs(v_wrong - v_g_akokwa_voyages_exact) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the minimum visits of the run) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_voyages_exact]', v_wrong, v_g_akokwa_voyages_exact;
  end if;
  v_wrong := 1.0283720930232558::double precision;
  if abs(v_wrong - v_g_akokwa_voyages_exact) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the deck load ratio) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_voyages_exact]', v_wrong, v_g_akokwa_voyages_exact;
  end if;
  v_wrong := 4.0::double precision;
  if abs(v_wrong - v_g_akokwa_voyages_exact) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the rounded count) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_voyages_exact]', v_wrong, v_g_akokwa_voyages_exact;
  end if;
  v_wrong := 7.69375::double precision;
  if abs(v_wrong - v_g_akokwa_vessel_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (voyages rounded nearest) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_vessel_days]', v_wrong, v_g_akokwa_vessel_days;
  end if;
  v_wrong := 7.69375::double precision;
  if abs(v_wrong - v_g_akokwa_vessel_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (usable fraction ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_vessel_days]', v_wrong, v_g_akokwa_vessel_days;
  end if;
  v_wrong := 9.006666666666666::double precision;
  if abs(v_wrong - v_g_akokwa_vessel_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (weather ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_vessel_days]', v_wrong, v_g_akokwa_vessel_days;
  end if;
  v_wrong := 8.051598837209303::double precision;
  if abs(v_wrong - v_g_akokwa_vessel_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (voyages not rounded) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_vessel_days]', v_wrong, v_g_akokwa_vessel_days;
  end if;
  v_wrong := 11.258333333333333::double precision;
  if abs(v_wrong - v_g_akokwa_vessel_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (weather on every activity stated) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_vessel_days]', v_wrong, v_g_akokwa_vessel_days;
  end if;
  v_wrong := 7.69375::double precision;
  if abs(v_wrong - v_g_akokwa_vessel_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the minimum visits times the voyage days) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_vessel_days]', v_wrong, v_g_akokwa_vessel_days;
  end if;
  v_wrong := 1.4654761904761904::double precision;
  if abs(v_wrong - v_g_akokwa_vessels_exact) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (vessels over the period) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_vessels_exact]', v_wrong, v_g_akokwa_vessels_exact;
  end if;
  v_wrong := 1.2309999999999999::double precision;
  if abs(v_wrong - v_g_akokwa_vessels_exact) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (voyages rounded nearest) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_vessels_exact]', v_wrong, v_g_akokwa_vessels_exact;
  end if;
  v_wrong := 1.4410666666666665::double precision;
  if abs(v_wrong - v_g_akokwa_vessels_exact) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (weather ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_vessels_exact]', v_wrong, v_g_akokwa_vessels_exact;
  end if;
  v_wrong := 1.2882558139534885::double precision;
  if abs(v_wrong - v_g_akokwa_vessels_exact) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (voyages not rounded) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_vessels_exact]', v_wrong, v_g_akokwa_vessels_exact;
  end if;
  v_wrong := 1.8013333333333332::double precision;
  if abs(v_wrong - v_g_akokwa_vessels_exact) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (weather on every activity stated) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_vessels_exact]', v_wrong, v_g_akokwa_vessels_exact;
  end if;
  v_wrong := 4.80625::double precision;
  if abs(v_wrong - v_g_akokwa_spare_vessel_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (voyages rounded nearest) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_spare_vessel_days]', v_wrong, v_g_akokwa_spare_vessel_days;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_akokwa_spare_vessel_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (vessels not rounded) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_spare_vessel_days]', v_wrong, v_g_akokwa_spare_vessel_days;
  end if;
  v_wrong := 4.448401162790697::double precision;
  if abs(v_wrong - v_g_akokwa_spare_vessel_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (voyages not rounded) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_spare_vessel_days]', v_wrong, v_g_akokwa_spare_vessel_days;
  end if;
  v_wrong := 3.741666666666667::double precision;
  if abs(v_wrong - v_g_akokwa_spare_vessel_days) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the period in place of the available days) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_spare_vessel_days]', v_wrong, v_g_akokwa_spare_vessel_days;
  end if;
  v_wrong := 600.0612000000002::double precision;
  if abs(v_wrong - v_g_akokwa_ffd_v1_area_m2) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (ffd ascending) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_ffd_v1_area_m2]', v_wrong, v_g_akokwa_ffd_v1_area_m2;
  end if;
  v_wrong := 641.9987000000003::double precision;
  if abs(v_wrong - v_g_akokwa_ffd_v1_area_m2) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (deck usable fraction ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_ffd_v1_area_m2]', v_wrong, v_g_akokwa_ffd_v1_area_m2;
  end if;
  v_wrong := 22.925::double precision;
  if abs(v_wrong - v_g_akokwa_ffd_v1_area_m2) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (last fit) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_ffd_v1_area_m2]', v_wrong, v_g_akokwa_ffd_v1_area_m2;
  end if;
  v_wrong := 600.0612000000003::double precision;
  if abs(v_wrong - v_g_akokwa_ffd_v1_area_m2) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (first fit in the stated order) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_ffd_v1_area_m2]', v_wrong, v_g_akokwa_ffd_v1_area_m2;
  end if;
  v_wrong := 0.019302325581395347::double precision;
  if abs(v_wrong - v_g_akokwa_ffd_v2_load_utilisation) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (ffd ascending) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_ffd_v2_load_utilisation]', v_wrong, v_g_akokwa_ffd_v2_load_utilisation;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_akokwa_ffd_v2_load_utilisation) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (deck usable fraction ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_ffd_v2_load_utilisation]', v_wrong, v_g_akokwa_ffd_v2_load_utilisation;
  end if;
  v_wrong := 0.23553488372093018::double precision;
  if abs(v_wrong - v_g_akokwa_ffd_v2_load_utilisation) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (last fit) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_ffd_v2_load_utilisation]', v_wrong, v_g_akokwa_ffd_v2_load_utilisation;
  end if;
  v_wrong := 0.019302325581395347::double precision;
  if abs(v_wrong - v_g_akokwa_ffd_v2_load_utilisation) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (first fit in the stated order) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/akokwa_ffd_v2_load_utilisation]', v_wrong, v_g_akokwa_ffd_v2_load_utilisation;
  end if;
  v_wrong := 1.093592164041712::double precision;
  if abs(v_wrong - v_g_mgbidi_mmc_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (erlang b one step too far) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mmc_wait_hours]', v_wrong, v_g_mgbidi_mmc_wait_hours;
  end if;
  v_wrong := 0.8083072516830044::double precision;
  if abs(v_wrong - v_g_mgbidi_mmc_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (wait without one minus rho) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mmc_wait_hours]', v_wrong, v_g_mgbidi_mmc_wait_hours;
  end if;
  v_wrong := 1.0319762510602208::double precision;
  if abs(v_wrong - v_g_mgbidi_mmc_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (twenty four hour clock) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mmc_wait_hours]', v_wrong, v_g_mgbidi_mmc_wait_hours;
  end if;
  v_wrong := 1.020033589096101::double precision;
  if abs(v_wrong - v_g_mgbidi_mmc_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the other queue model) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mmc_wait_hours]', v_wrong, v_g_mgbidi_mmc_wait_hours;
  end if;
  v_wrong := 42.633054311855126::double precision;
  if abs(v_wrong - v_g_mgbidi_mmc_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (service one after the other) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mmc_wait_hours]', v_wrong, v_g_mgbidi_mmc_wait_hours;
  end if;
  v_wrong := 0.18591066788709104::double precision;
  if abs(v_wrong - v_g_mgbidi_mmc_probability_wait) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (erlang b one step too far) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mmc_probability_wait]', v_wrong, v_g_mgbidi_mmc_probability_wait;
  end if;
  v_wrong := 0.21499505230421265::double precision;
  if abs(v_wrong - v_g_mgbidi_mmc_probability_wait) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (twenty four hour clock) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mmc_probability_wait]', v_wrong, v_g_mgbidi_mmc_probability_wait;
  end if;
  v_wrong := 0.8526610862371032::double precision;
  if abs(v_wrong - v_g_mgbidi_mmc_probability_wait) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (concurrent service summed) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mmc_probability_wait]', v_wrong, v_g_mgbidi_mmc_probability_wait;
  end if;
  v_wrong := 0.575::double precision;
  if abs(v_wrong - v_g_mgbidi_mmc_probability_wait) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the berth utilisation) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mmc_probability_wait]', v_wrong, v_g_mgbidi_mmc_probability_wait;
  end if;
  v_wrong := 8.593592164041713::double precision;
  if abs(v_wrong - v_g_mgbidi_mmc_time_at_base_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (erlang b one step too far) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mmc_time_at_base_hours]', v_wrong, v_g_mgbidi_mmc_time_at_base_hours;
  end if;
  v_wrong := 8.308307251683004::double precision;
  if abs(v_wrong - v_g_mgbidi_mmc_time_at_base_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (wait without one minus rho) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mmc_time_at_base_hours]', v_wrong, v_g_mgbidi_mmc_time_at_base_hours;
  end if;
  v_wrong := 8.531976251060222::double precision;
  if abs(v_wrong - v_g_mgbidi_mmc_time_at_base_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (twenty four hour clock) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mmc_time_at_base_hours]', v_wrong, v_g_mgbidi_mmc_time_at_base_hours;
  end if;
  v_wrong := 54.633054311855126::double precision;
  if abs(v_wrong - v_g_mgbidi_mmc_time_at_base_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (service one after the other) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mmc_time_at_base_hours]', v_wrong, v_g_mgbidi_mmc_time_at_base_hours;
  end if;
  v_wrong := 1.9018994157247162::double precision;
  if abs(v_wrong - v_g_mgbidi_mmc_time_at_base_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the mean wait alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mmc_time_at_base_hours]', v_wrong, v_g_mgbidi_mmc_time_at_base_hours;
  end if;
  v_wrong := 0.9509497078623581::double precision;
  if abs(v_wrong - v_g_mgbidi_mdc_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (cosmetatos correction dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mdc_wait_hours]', v_wrong, v_g_mgbidi_mdc_wait_hours;
  end if;
  v_wrong := 1.9018994157247162::double precision;
  if abs(v_wrong - v_g_mgbidi_mdc_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (mdc answered as mmc) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mdc_wait_hours]', v_wrong, v_g_mgbidi_mdc_wait_hours;
  end if;
  v_wrong := 0.5865193137302581::double precision;
  if abs(v_wrong - v_g_mgbidi_mdc_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (erlang b one step too far) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mdc_wait_hours]', v_wrong, v_g_mgbidi_mdc_wait_hours;
  end if;
  v_wrong := 0.5711132996330321::double precision;
  if abs(v_wrong - v_g_mgbidi_mdc_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (twenty four hour clock) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mdc_wait_hours]', v_wrong, v_g_mgbidi_mdc_wait_hours;
  end if;
  v_wrong := 21.498713871101742::double precision;
  if abs(v_wrong - v_g_mgbidi_mdc_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (service one after the other) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mdc_wait_hours]', v_wrong, v_g_mgbidi_mdc_wait_hours;
  end if;
  v_wrong := 0.21871843280834236::double precision;
  if abs(v_wrong - v_g_mgbidi_mdc_mean_queue) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (cosmetatos correction dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mdc_mean_queue]', v_wrong, v_g_mgbidi_mdc_mean_queue;
  end if;
  v_wrong := 0.4374368656166847::double precision;
  if abs(v_wrong - v_g_mgbidi_mdc_mean_queue) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (mdc answered as mmc) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mdc_mean_queue]', v_wrong, v_g_mgbidi_mdc_mean_queue;
  end if;
  v_wrong := 0.09970828333414387::double precision;
  if abs(v_wrong - v_g_mgbidi_mdc_mean_queue) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (wait without one minus rho) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mdc_mean_queue]', v_wrong, v_g_mgbidi_mdc_mean_queue;
  end if;
  v_wrong := 4.9447041903534::double precision;
  if abs(v_wrong - v_g_mgbidi_mdc_mean_queue) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (service one after the other) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mdc_mean_queue]', v_wrong, v_g_mgbidi_mdc_mean_queue;
  end if;
  v_wrong := 1.020033589096101::double precision;
  if abs(v_wrong - v_g_mgbidi_mdc_mean_queue) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the mean wait as the queue) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_mdc_mean_queue]', v_wrong, v_g_mgbidi_mdc_mean_queue;
  end if;
  v_wrong := 0.16131191799207717::double precision;
  if abs(v_wrong - v_g_mgbidi_target_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (erlang b one step too far) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_target_wait_hours]', v_wrong, v_g_mgbidi_target_wait_hours;
  end if;
  v_wrong := 0.1915529800263745::double precision;
  if abs(v_wrong - v_g_mgbidi_target_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (twenty four hour clock) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_target_wait_hours]', v_wrong, v_g_mgbidi_target_wait_hours;
  end if;
  v_wrong := 0.26379684861438274::double precision;
  if abs(v_wrong - v_g_mgbidi_target_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (concurrent service summed) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_target_wait_hours]', v_wrong, v_g_mgbidi_target_wait_hours;
  end if;
  v_wrong := 0.22054692652697663::double precision;
  if abs(v_wrong - v_g_mgbidi_target_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the other queue model) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_target_wait_hours]', v_wrong, v_g_mgbidi_target_wait_hours;
  end if;
  v_wrong := 1.9018994157247162::double precision;
  if abs(v_wrong - v_g_mgbidi_target_wait_hours) <= 5e-07::double precision then
    raise exception 'SC4 go-live refused: the trap (the wait at the stated berths) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/mgbidi_target_wait_hours]', v_wrong, v_g_mgbidi_target_wait_hours;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'marine';
  if not exists (select 1 from public.academy_apps where slug = 'marine' and status = 'available') then
    raise exception 'SC4 go-live refused: marine did not reach status available';
  end if;
  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon from public.academy_apps;
  raise notice 'SC4 go-live: marine available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
