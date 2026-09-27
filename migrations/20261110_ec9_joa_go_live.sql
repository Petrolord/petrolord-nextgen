-- ============================================================================
-- EC9 GO-LIVE (HELD): Joint Ventures, Operating Agreements & Cost Recovery
-- flips to 'available' in the Economics & Commercial module, at path_order
-- 74.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/joa. The 78 lessons, the teaching lab (joaLab.js), its
-- three calculator panels (account, recovery and agreement) and the three
-- capstone case files ship in the ZIP and NOT in this database, so a flip
-- before the upload puts a live catalogue tile in front of a route that does
-- not exist. AN ENGINE COURSE: there is no Suite app and no Suite upload to
-- wait for. This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values joa_capstone.mjs returned through
--      the vendored engines/economics/jointVenture.js (petrolord-engines
--      3ae56e7) when this file was generated, to the last bit;
--   2. by a SECOND ROUTE IN SQL: the clause arithmetic rebuilt in plpgsql over
--      the case files the learner is handed; each to 1e-9 relative;
--   3. by the ORACLE: oracle_check.py's run of the vendored stdlib Python
--      oracle (tools/validation/economics/oracle_jointventure.py), written in
--      by value, each seeded value within its tolerance of the oracle's;
--   4. by the TRAPS the course is built on: every wrong method
--      discriminate.mjs swept through the engine for a field, written in by
--      value, must miss the seeded value by more than the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
--
-- NO BEGIN OR COMMIT. Like every course migration in this repository, the
-- file carries no transaction lines of its own; apply_ec9_joa.sh wraps it in
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
-- with the session and create nothing in any schema. They rebuild each graded
-- EC9 value from the clause arithmetic of the texts the course cites, in SQL,
-- with no engine code: paying interests under a carry (Norway JOA Art. 8.1,
-- carriers pro rata among the parties no carry names); the monthly cash call
-- ledger (Norway Accounting Agreement Art. 1.2.1: a called month's difference
-- adjusts the call a stated lag later, a month below the stated threshold is
-- not called and is billed in arrears the next month, a credit above a
-- forecast share carried or refunded as stated); the budget tolerance, the
-- lower of a percentage of the approved total and an amount (Norway JOA Art.
-- 12.5); overhead on a marginal scale after exclusions (Norway Accounting
-- Agreement Art. 2.2.2); the carry recovery ledger (uplift on the opening
-- balance or a multiple of the year's carried cost, recovery from a share of
-- the carried party's entitlement, a cap); the back-in refund of PIA 2021
-- s.85(4)(c) received by a party in proportion to the interest it gives up;
-- default interest compounded monthly from the due date to, but excluding,
-- the cure date (Kenya Model PSC 2015 Art. 6.7), whole months keeping the day
-- of the month or the month end; pro rata cover (Norway JOA Art. 9.1); the PSC
-- cost pool year by year (royalty first, the limit, the pool carried forward,
-- profit oil split); the non-consent premium on the proportionate share and
-- its recovery from max(0, gross value - deductions) with reversion inside the
-- payout year; the buy-in apportioned by share of the project (Norway JOA Art.
-- 18.12); year-end NPV; the interests after a forfeiture (Norway JOA Art. 9.4).
-- Every number is a double precision.

-- A number out of a jsonb value, read through its text (the double JSON.parse gives).
create or replace function pg_temp.ec9_n(v jsonb) returns double precision
language sql immutable as $f$
  select case when v is null or jsonb_typeof(v) = 'null' then null else (v #>> '{}')::double precision end
$f$;

-- The participating interest of one party.
create or replace function pg_temp.ec9_pi(parties jsonb, pid text) returns double precision
language sql immutable as $f$
  select pg_temp.ec9_n(p->'participatingPct') from jsonb_array_elements(parties) p where p->>'id' = pid
$f$;

-- The paying interest of one party under the stated carries: the carried party
-- pays its interest less carriedPct percent of it; each carrier adds its share
-- of every carried amount, pro rata among the parties no carry names, or in the
-- stated shares.
create or replace function pg_temp.ec9_paying(parties jsonb, carries jsonb, pid text) returns double precision
language plpgsql immutable as $f$
declare c jsonb; pay double precision := pg_temp.ec9_pi(parties, pid); amount double precision;
  payer_total double precision; carried_ids text[];
begin
  if carries is null or jsonb_typeof(carries) <> 'array' then return pay; end if;
  select coalesce(array_agg(x->>'carried'), '{}') into carried_ids from jsonb_array_elements(carries) x;
  select sum(pg_temp.ec9_n(p->'participatingPct')) into payer_total
    from jsonb_array_elements(parties) p where not (p->>'id' = any(carried_ids));
  for c in select * from jsonb_array_elements(carries) loop
    amount := pg_temp.ec9_pi(parties, c->>'carried') * pg_temp.ec9_n(c->'carriedPct') / 100.0;
    if c->>'carried' = pid then pay := pay - amount; end if;
    if jsonb_typeof(c->'carriers') = 'string' then
      if not (pid = any(carried_ids)) then pay := pay + amount * pg_temp.ec9_pi(parties, pid) / payer_total; end if;
    elsif c->'carriers' ? pid then
      pay := pay + amount * pg_temp.ec9_n(c->'carriers'->pid) / 100.0;
    end if;
  end loop;
  return pay;
end
$f$;

-- One party's cash call ledger: { "YYYY-MM": { "call": x, "paid": y } }.
create or replace function pg_temp.ec9_cc(c jsonb, pid text) returns jsonb
language plpgsql immutable as $f$
declare pay double precision := pg_temp.ec9_paying(c->'parties', c->'carries', pid);
  lag int := (c->>'reconciliationLagMonths')::int; neg text := c->>'negativeCall';
  thr double precision := pg_temp.ec9_n(c->'noCallBelow');
  m jsonb; t int := 0; diffs double precision[] := '{}'; carried double precision := 0; arrears double precision := null;
  fcast double precision; act double precision; fs double precision; ash double precision; pending double precision;
  called boolean; callv double precision; carry_out double precision; billing double precision; d double precision;
  out jsonb := '{}'::jsonb; raw double precision;
begin
  for m in select * from jsonb_array_elements(c->'months') loop
    fcast := pg_temp.ec9_n(m->'forecast'); act := pg_temp.ec9_n(m->'actual');
    called := thr is null or fcast >= thr;
    fs := fcast * pay / 100.0; ash := act * pay / 100.0;
    pending := (case when t - lag >= 0 then diffs[t - lag + 1] else 0 end) + carried;
    callv := 0; carry_out := 0;
    if called then
      raw := fs - pending;
      if raw >= 0 or neg = 'refund' then callv := raw; else carry_out := -raw; end if;
    else
      carry_out := pending;
    end if;
    billing := coalesce(arrears, 0);
    d := case when called then fs - ash else 0 end;
    carried := carry_out;
    out := out || jsonb_build_object(m->>'month', jsonb_build_object('call', callv, 'paid', callv + billing));
    diffs := diffs || d;
    arrears := case when called then null else ash end;
    t := t + 1;
  end loop;
  return out;
end
$f$;

-- The allowed overrun of a budget: the lower of pct percent of the approved total and the stated amount.
create or replace function pg_temp.ec9_allowed(b jsonb) returns double precision
language sql immutable as $f$
  select case when b->'budgetTolerance'->'amount' is null then x.by_pct else least(x.by_pct, pg_temp.ec9_n(b->'budgetTolerance'->'amount')) end
    from (select sum(pg_temp.ec9_n(i->'approved')) * pg_temp.ec9_n(b->'budgetTolerance'->'pct') / 100.0 as by_pct
            from jsonb_array_elements(b->'items') i) x
$f$;

-- The overhead charge of one category: the base after exclusions, charged band by band, and above the last band.
create or replace function pg_temp.ec9_overhead(o jsonb, cat text) returns double precision
language plpgsql immutable as $f$
declare base double precision := pg_temp.ec9_n(o->'costs'->cat) - coalesce(pg_temp.ec9_n(o->'excluded'->cat), 0);
  b jsonb; lo double precision := 0; charge double precision := 0; up double precision;
begin
  for b in select * from jsonb_array_elements(o->'scale'->cat->'bands') loop
    up := pg_temp.ec9_n(b->'upTo');
    charge := charge + greatest(0, least(base, up) - lo) * pg_temp.ec9_n(b->'pct') / 100.0;
    lo := up;
  end loop;
  return charge + greatest(0, base - lo) * pg_temp.ec9_n(o->'scale'->cat->'abovePct') / 100.0;
end
$f$;

-- The carry recovery ledger: { year: { closing, recovered } } and, for every
-- party, its net cash flow by year { "flows": { id: [..] } }.
create or replace function pg_temp.ec9_carry(k jsonb) returns jsonb
language plpgsql immutable as $f$
declare cr jsonb; c jsonb; y jsonb; p jsonb; carried text := k->>'carried';
  pi_c double precision; carried_pct double precision; u jsonb := k->'uplift'; utype text;
  bal double precision := 0; opening double precision; upl double precision; added double precision; due double precision;
  share double precision; avail double precision; rec double precision; to_date double precision := 0; closing double precision;
  cap double precision := pg_temp.ec9_n(k->'cap'); from_pct double precision := pg_temp.ec9_n(k->'recoverFromPct');
  out jsonb := '{}'::jsonb; flows jsonb := '{}'::jsonb; payer_total double precision; net double precision; recv double precision;
begin
  utype := u->>'type';
  select x into c from jsonb_array_elements(k->'carries') x where x->>'carried' = carried;
  pi_c := pg_temp.ec9_pi(k->'parties', carried); carried_pct := pg_temp.ec9_n(c->'carriedPct');
  select sum(pg_temp.ec9_n(q->'participatingPct')) into payer_total from jsonb_array_elements(k->'parties') q
   where q->>'id' not in (select x->>'carried' from jsonb_array_elements(k->'carries') x);
  for p in select * from jsonb_array_elements(k->'parties') loop flows := flows || jsonb_build_object(p->>'id', '[]'::jsonb); end loop;
  for y in select * from jsonb_array_elements(k->'years') loop
    opening := bal;
    added := pg_temp.ec9_n(y->'cost') * pi_c * carried_pct / 10000.0;
    upl := case utype when 'compound' then opening * pg_temp.ec9_n(u->'ratePctPerYear') / 100.0
                      when 'multiple' then added * (pg_temp.ec9_n(u->'multiplePct') - 100.0) / 100.0 else 0 end;
    due := opening + upl + added;
    share := pg_temp.ec9_n(y->'entitlement') * pi_c / 100.0;
    avail := share * from_pct / 100.0;
    rec := least(avail, due, case when cap is null then 'Infinity'::double precision else cap - to_date end);
    to_date := to_date + rec;
    closing := due - rec;
    if cap is not null and to_date >= cap and closing > 0 then closing := 0; end if;
    bal := closing;
    out := out || jsonb_build_object((y->>'year'), jsonb_build_object('closing', closing, 'recovered', rec));
    for p in select * from jsonb_array_elements(k->'parties') loop
      recv := 0;
      if p->>'id' = carried then recv := -rec; end if;
      if c->>'carriers' = 'pro-rata' and p->>'id' <> carried and jsonb_typeof(c->'carriers') = 'string' then
        recv := recv + rec * pg_temp.ec9_n(p->'participatingPct') / payer_total;
      end if;
      net := pg_temp.ec9_n(y->'entitlement') * pg_temp.ec9_n(p->'participatingPct') / 100.0 + recv
             - pg_temp.ec9_n(y->'cost') * pg_temp.ec9_paying(k->'parties', k->'carries', p->>'id') / 100.0;
      flows := jsonb_set(flows, array[p->>'id'], (flows->(p->>'id')) || to_jsonb(net));
    end loop;
  end loop;
  return out || jsonb_build_object('flows', flows);
end
$f$;

-- Year-end NPV of a list of flows, the first in year first_year, discounted to base.
create or replace function pg_temp.ec9_npv(flows jsonb, r double precision, base int, first_year int) returns double precision
language sql immutable as $f$
  select sum(pg_temp.ec9_n(x) / power(1.0 + r, ((first_year + (i - 1)::int) - base)::double precision))
    from jsonb_array_elements(flows) with ordinality t(x, i)
$f$;

-- The back-in refund a party receives under PIA s.85(4): development and
-- production costs only (s.85(4)(c)); the refund is the interest acquired x the
-- refundable costs, received in proportion to the interest each party gives up.
create or replace function pg_temp.ec9_backin(b jsonb, pid text) returns double precision
language plpgsql immutable as $f$
declare cur double precision := pg_temp.ec9_pi(b->'parties', b->>'backInParty'); tgt double precision := pg_temp.ec9_n(b->'targetPct');
  refundable double precision;
begin
  select sum(pg_temp.ec9_n(x->'amount')) into refundable from jsonb_array_elements(b->'costs') x where x->>'kind' in ('development', 'production');
  return ((tgt - cur) * refundable / 100.0) * pg_temp.ec9_pi(b->'parties', pid) / (100.0 - cur);
end
$f$;

-- A date n months on, keeping the day of the month or the month end when the month is shorter.
create or replace function pg_temp.ec9_add_months(d date, n int) returns date
language sql immutable as $f$
  select (date_trunc('month', d) + make_interval(months => n))::date
         + (least(extract(day from d)::int,
                  extract(day from (date_trunc('month', d) + make_interval(months => n + 1)) - interval '1 day')::int) - 1)
$f$;

-- Default interest of one defaulter, simple or compounded monthly, from the due
-- date to, but excluding, the cure date (or asOf), with the stated grace.
create or replace function pg_temp.ec9_default_interest(dflt jsonb, pid text) returns double precision
language plpgsql immutable as $f$
declare d jsonb; i jsonb := dflt->'interest'; due date := (dflt->>'dueDate')::date; fin date; days int;
  pay double precision; unpaid double precision; r double precision := pg_temp.ec9_n(dflt->'interest'->'annualRatePct');
  basis double precision := pg_temp.ec9_n(dflt->'interest'->'dayBasis'); wm int := 0; rem int;
begin
  select x into d from jsonb_array_elements(dflt->'defaulters') x where x->>'id' = pid;
  pay := pg_temp.ec9_paying(dflt->'parties', dflt->'carries', pid);
  unpaid := pg_temp.ec9_n(dflt->'callTotal') * pay / 100.0 - pg_temp.ec9_n(d->'paid');
  fin := coalesce((d->>'curedOn')::date, (dflt->>'asOf')::date);
  days := fin - due;
  if days * 24.0 <= pg_temp.ec9_n(i->'graceHours') then return 0; end if;
  if i->>'interestMethod' = 'simple' then
    return unpaid * r * days / (100.0 * basis);
  end if;
  while pg_temp.ec9_add_months(due, wm + 1) <= fin loop wm := wm + 1; end loop;
  rem := fin - pg_temp.ec9_add_months(due, wm);
  return unpaid * (power(1.0 + r / 1200.0, wm::double precision) * (1.0 + r * rem / (100.0 * basis)) - 1.0);
end
$f$;

-- The cover a non-defaulting party advances: the unpaid total in proportion to
-- the paying interests of the non-defaulting parties that pay cost.
create or replace function pg_temp.ec9_cover(dflt jsonb, pid text) returns double precision
language plpgsql immutable as $f$
declare unpaid double precision := 0; d jsonb; tot double precision := 0; p jsonb; pp double precision; ids text[];
begin
  select array_agg(x->>'id') into ids from jsonb_array_elements(dflt->'defaulters') x;
  for d in select * from jsonb_array_elements(dflt->'defaulters') loop
    unpaid := unpaid + pg_temp.ec9_n(dflt->'callTotal') * pg_temp.ec9_paying(dflt->'parties', dflt->'carries', d->>'id') / 100.0 - pg_temp.ec9_n(d->'paid');
  end loop;
  for p in select * from jsonb_array_elements(dflt->'parties') loop
    pp := pg_temp.ec9_paying(dflt->'parties', dflt->'carries', p->>'id');
    if not (p->>'id' = any(ids)) and pp > 0 then tot := tot + pp; end if;
  end loop;
  return unpaid * pg_temp.ec9_paying(dflt->'parties', dflt->'carries', pid) / tot;
end
$f$;

-- The participating interest a party holds if every uncured defaulter's
-- interest is assigned: pro rata among the others (Norway JOA Art. 9.4).
create or replace function pg_temp.ec9_after_forfeiture(dflt jsonb, pid text) returns double precision
language sql immutable as $f$
  select pg_temp.ec9_pi(dflt->'parties', pid) * 100.0 / sum(pg_temp.ec9_n(p->'participatingPct'))
    from jsonb_array_elements(dflt->'parties') p
   where p->>'id' not in (select x->>'id' from jsonb_array_elements(dflt->'defaulters') x)
$f$;

-- The PSC cost pool year by year: { year: { costRecovered, governmentProfitOil } }.
create or replace function pg_temp.ec9_psc(s jsonb) returns jsonb
language plpgsql immutable as $f$
declare y jsonb; pool double precision := pg_temp.ec9_n(s->'openingCostPool'); roy double precision := pg_temp.ec9_n(s->'royaltyPct');
  pct double precision := pg_temp.ec9_n(s->'costOilLimitPct'); frac double precision; gross double precision; rar double precision;
  recoverable double precision; rec double precision; profit double precision; share double precision; out jsonb := '{}'::jsonb;
begin
  frac := case when s->>'costOilLimitBase' = 'gross' then pct / (100.0 - roy) else pct / 100.0 end;
  for y in select * from jsonb_array_elements(s->'years') loop
    gross := pg_temp.ec9_n(y->'grossRevenue');
    rar := gross - gross * (roy / 100.0);
    recoverable := pool + pg_temp.ec9_n(y->'capex') + pg_temp.ec9_n(y->'opex');
    rec := least(recoverable, rar * frac);
    pool := recoverable - rec;
    profit := rar - rec;
    share := coalesce(pg_temp.ec9_n(y->'contractorProfitSharePct'), pg_temp.ec9_n(s->'contractorProfitSharePct'));
    out := out || jsonb_build_object(y->>'year', jsonb_build_object('costRecovered', rec, 'governmentProfitOil', profit - profit * (share / 100.0)));
  end loop;
  return out;
end
$f$;

-- The premium of a non-consenting party: its proportionate share of the cost x the stated multiple.
create or replace function pg_temp.ec9_premium(n jsonb, pid text) returns double precision
language sql immutable as $f$
  select pg_temp.ec9_n(n->'operation'->'cost') * pg_temp.ec9_pi(n->'parties', pid) * pg_temp.ec9_n(n->'premiumMultiplePct') / 10000.0
$f$;

-- What a non-consenting party receives of its share of a year's net value: its
-- share of max(0, gross value - deductions), less what that year recovers of
-- the premium still owed; the rest of the payout year's share is its own.
create or replace function pg_temp.ec9_nc_receipt(n jsonb, pid text, yr int) returns double precision
language plpgsql immutable as $f$
declare y jsonb; bal double precision := pg_temp.ec9_premium(n, pid); pi double precision := pg_temp.ec9_pi(n->'parties', pid);
  share double precision; rec double precision;
begin
  for y in select * from jsonb_array_elements(n->'years') loop
    share := greatest(0, pg_temp.ec9_n(y->'grossValue') - pg_temp.ec9_n(y->'deductions')) * pi / 100.0;
    rec := least(share, bal);
    bal := bal - rec;
    if (y->>'year')::int = yr then return share - rec; end if;
  end loop;
  return null;
end
$f$;

-- A buy-in payment's part for one consenting party: the payment in proportion
-- to that party's participating interest among the consenting parties.
create or replace function pg_temp.ec9_buyin_to(n jsonb, payer text, pid text) returns double precision
language sql immutable as $f$
  select pg_temp.ec9_premium(n, payer) * pg_temp.ec9_pi(n->'parties', pid)
         / (select sum(pg_temp.ec9_pi(n->'parties', c #>> '{}')) from jsonb_array_elements(n->'consenting') c)
$f$;

do $$
#variable_conflict use_column
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_s double precision; v_wrong double precision;
  v_cc_b jsonb; v_cc_i jsonb; v_carry_i jsonb; v_carry_a jsonb; v_psc_i jsonb; v_psc_a jsonb;
  v_g_idumu_zed_paying_pct double precision;
  v_g_idumu_zed_june_call double precision;
  v_g_idumu_zed_august_paid double precision;
  v_g_idumu_budget_allowed_overrun double precision;
  v_g_idumu_operating_overhead double precision;
  v_g_idumu_development_overhead double precision;
  v_g_okwelle_2031_carry_balance double precision;
  v_g_okwelle_backin_refund_to_pra double precision;
  v_g_okwelle_default_interest double precision;
  v_g_okwelle_default_cover_oko double precision;
  v_g_okwelle_prb_june_call double precision;
  v_g_okwelle_2032_cost_recovered double precision;
  v_g_abiama_spb_premium double precision;
  v_g_abiama_spb_2036_receipt double precision;
  v_g_abiama_buy_in_to_spa double precision;
  v_g_abiama_spa_carry_npv double precision;
  v_g_abiama_2035_government_profit_oil double precision;
  v_g_abiama_abo_after_forfeiture_pct double precision;
  v_case_b jsonb := '{"name":"IDUMU","label":"IDUMU, the Idumu satellite joint venture on the Ekene licence (synthetic)","interests":{"parties":[{"id":"IOP","name":"Idumu Operating (synthetic), operator","participatingPct":42.5},{"id":"KAP","name":"Kapa Energy (synthetic)","participatingPct":23.75},{"id":"ZED","name":"Zedora Energy (synthetic)","participatingPct":18.75},{"id":"SNP","name":"State participant (synthetic)","participatingPct":15}],"carries":[{"carried":"SNP","carriedPct":80,"carriers":"pro-rata"}]},"cashCalls":{"parties":[{"id":"IOP","name":"Idumu Operating (synthetic), operator","participatingPct":42.5},{"id":"KAP","name":"Kapa Energy (synthetic)","participatingPct":23.75},{"id":"ZED","name":"Zedora Energy (synthetic)","participatingPct":18.75},{"id":"SNP","name":"State participant (synthetic)","participatingPct":15}],"carries":[{"carried":"SNP","carriedPct":80,"carriers":"pro-rata"}],"reconciliationLagMonths":1,"negativeCall":"refund","noCallBelow":750000,"months":[{"month":"2029-03","forecast":5250000,"actual":4812500.5},{"month":"2029-04","forecast":7125000,"actual":7390250.25},{"month":"2029-05","forecast":6480000,"actual":6915125.5},{"month":"2029-06","forecast":8905500,"actual":8212750.75},{"month":"2029-07","forecast":620000,"actual":704300.25},{"month":"2029-08","forecast":9240000,"actual":9011000.5}]},"budget":{"itemTolerancePct":10,"budgetTolerance":{"pct":4,"amount":3500000},"unbudgetedAllowance":400000,"items":[{"item":"subsurface studies","approved":7850000,"actual":8535500.5},{"item":"appraisal well Idumu-2","approved":41600000,"actual":46212750.25},{"item":"facilities concept","approved":9400000,"actual":8975250},{"item":"logistics and marine","approved":12300000,"actual":12960400.75},{"item":"general and administration","approved":3950012.5,"actual":4012300.5},{"item":"community baseline study","approved":0,"actual":180250}]},"overhead":{"costs":{"exploration":4275500.5,"operating":68412250.25,"development":136950000.75},"excluded":{"operating":2860000},"scale":{"exploration":{"bands":[{"upTo":25000000,"pct":2.4}],"abovePct":0},"operating":{"bands":[{"upTo":50000000,"pct":2.6},{"upTo":110000000,"pct":1.1}],"abovePct":0.5},"development":{"bands":[{"upTo":60000000,"pct":2.4},{"upTo":120000000,"pct":1.2}],"abovePct":0.6}}}}'::jsonb;
  v_case_i jsonb := '{"name":"OKWELLE","label":"OKWELLE, the Okwelle gas-condensate joint venture (synthetic)","carry":{"parties":[{"id":"OKO","name":"Okwelle Operating (synthetic), operator","participatingPct":35},{"id":"PRA","name":"Partner Ranu A (synthetic)","participatingPct":27.5},{"id":"PRB","name":"Partner Ranu B (synthetic)","participatingPct":22.5},{"id":"NCP","name":"State participant (synthetic)","participatingPct":15}],"carries":[{"carried":"NCP","carriedPct":100,"carriers":"pro-rata"}],"carried":"NCP","basis":"contract","uplift":{"type":"compound","ratePctPerYear":7.5},"recoverFromPct":60,"years":[{"year":2028,"cost":96500000.4,"entitlement":0},{"year":2029,"cost":71250000,"entitlement":0},{"year":2030,"cost":18400000,"entitlement":88400000},{"year":2031,"cost":0,"entitlement":102750000.4},{"year":2032,"cost":0,"entitlement":97300000},{"year":2033,"cost":0,"entitlement":90150000.25},{"year":2034,"cost":0,"entitlement":83600000},{"year":2035,"cost":0,"entitlement":77250000}]},"cashCalls":{"parties":[{"id":"OKO","name":"Okwelle Operating (synthetic), operator","participatingPct":35},{"id":"PRA","name":"Partner Ranu A (synthetic)","participatingPct":27.5},{"id":"PRB","name":"Partner Ranu B (synthetic)","participatingPct":22.5},{"id":"NCP","name":"State participant (synthetic)","participatingPct":15}],"carries":[{"carried":"NCP","carriedPct":100,"carriers":"pro-rata"}],"reconciliationLagMonths":2,"negativeCall":"carry","noCallBelow":1000000,"months":[{"month":"2030-01","forecast":6200000,"actual":5710250.5},{"month":"2030-02","forecast":8450000,"actual":8912400.25},{"month":"2030-03","forecast":11300000,"actual":9150000},{"month":"2030-04","forecast":850000,"actual":910500.75},{"month":"2030-05","forecast":1250000,"actual":1250000},{"month":"2030-06","forecast":14650000,"actual":14120750.5},{"month":"2030-07","forecast":9800000,"actual":10235000.25},{"month":"2030-08","forecast":5400000,"actual":5400000},{"month":"2030-09","forecast":7300000,"actual":7015500.5}]},"backIn":{"parties":[{"id":"OKO","name":"Okwelle Operating (synthetic), operator","participatingPct":35},{"id":"PRA","name":"Partner Ranu A (synthetic)","participatingPct":27.5},{"id":"PRB","name":"Partner Ranu B (synthetic)","participatingPct":22.5},{"id":"NCP","name":"State participant (synthetic)","participatingPct":15}],"backInParty":"NCP","targetPct":37.5,"basis":"pia-s85-4","refundForm":"from-future-entitlement","recoverFromPct":55,"costs":[{"item":"exploration wells Okwelle-1 and Okwelle-2","amount":118400000,"kind":"exploration"},{"item":"development wells and the gas plant to date","amount":386750000.5,"kind":"development"},{"item":"early production costs","amount":24300000,"kind":"production"},{"item":"signature bonus","amount":12000000,"kind":"bonus"},{"item":"interest on the carry finance","amount":6500000,"kind":"interest"},{"item":"operator markup on shared services","amount":1850000,"kind":"markup"}],"years":[{"year":2032,"entitlement":97300000},{"year":2033,"entitlement":90150000.25},{"year":2034,"entitlement":83600000},{"year":2035,"entitlement":77250000},{"year":2036,"entitlement":71400000},{"year":2037,"entitlement":65900000}]},"default":{"parties":[{"id":"OKO","name":"Okwelle Operating (synthetic), operator","participatingPct":35},{"id":"PRA","name":"Partner Ranu A (synthetic)","participatingPct":27.5},{"id":"PRB","name":"Partner Ranu B (synthetic)","participatingPct":22.5},{"id":"NCP","name":"State participant (synthetic)","participatingPct":15}],"callTotal":14650000,"dueDate":"2030-06-01","asOf":"2030-09-30","defaulters":[{"id":"PRA","paid":1250000.5,"curedOn":"2030-08-19"}],"interest":{"annualRatePct":9.5,"dayBasis":365,"interestMethod":"monthly-compound","graceHours":0},"suspension":{"after":5,"unit":"working-days","from":"2030-06-01"},"forfeiture":{"after":90,"unit":"calendar-days","from":"2030-06-08"}},"psc":{"royaltyPct":10,"costOilLimitPct":55,"costOilLimitBase":"gross","contractorProfitSharePct":45,"taxRatePct":30,"openingCostPool":186000000,"parties":[{"id":"OKO","name":"Okwelle Operating (synthetic), operator","participatingPct":35},{"id":"PRA","name":"Partner Ranu A (synthetic)","participatingPct":27.5},{"id":"PRB","name":"Partner Ranu B (synthetic)","participatingPct":22.5},{"id":"NCP","name":"State participant (synthetic)","participatingPct":15}],"years":[{"year":2030,"grossRevenue":142500000,"capex":64000000,"opex":11200000},{"year":2031,"grossRevenue":168300000.4,"capex":22500000,"opex":12400000},{"year":2032,"grossRevenue":159750000.4,"capex":8000000,"opex":13100000.25},{"year":2033,"grossRevenue":147200000,"capex":0,"opex":13600000},{"year":2034,"grossRevenue":133850000.5,"capex":0,"opex":14050000},{"year":2035,"grossRevenue":121400000,"capex":0,"opex":14500000}]}}'::jsonb;
  v_case_a jsonb := '{"name":"ABIAMA","label":"ABIAMA, the Abiama deepwater joint venture (synthetic)","soleRisk":{"parties":[{"id":"ABO","name":"Abiama Operating (synthetic), operator","participatingPct":45},{"id":"SPA","name":"Sepal Offshore A (synthetic)","participatingPct":25},{"id":"SPB","name":"Sepal Offshore B (synthetic)","participatingPct":17.5},{"id":"SNC","name":"State participant (synthetic)","participatingPct":12.5}],"consenting":["ABO","SPA","SNC"],"operation":{"name":"Abiama-3 appraisal sidetrack","cost":26750000.4},"premiumMultiplePct":300,"mode":"recover-from-production","years":[{"year":2032,"grossValue":21400000,"deductions":23150000},{"year":2033,"grossValue":38650000.5,"deductions":12400000},{"year":2034,"grossValue":35200000,"deductions":11850000.25},{"year":2035,"grossValue":31900000,"deductions":11300000},{"year":2036,"grossValue":28750000,"deductions":10800000},{"year":2037,"grossValue":25600000.5,"deductions":10250000}]},"buyIn":{"parties":[{"id":"ABO","name":"Abiama Operating (synthetic), operator","participatingPct":45},{"id":"SPA","name":"Sepal Offshore A (synthetic)","participatingPct":25},{"id":"SPB","name":"Sepal Offshore B (synthetic)","participatingPct":17.5},{"id":"SNC","name":"State participant (synthetic)","participatingPct":12.5}],"consenting":["ABO","SPA","SPB"],"operation":{"name":"Abiama-4 exploration well","cost":31400000.25},"premiumMultiplePct":750,"mode":"buy-in"},"carry":{"parties":[{"id":"ABO","name":"Abiama Operating (synthetic), operator","participatingPct":45},{"id":"SPA","name":"Sepal Offshore A (synthetic)","participatingPct":25},{"id":"SPB","name":"Sepal Offshore B (synthetic)","participatingPct":17.5},{"id":"SNC","name":"State participant (synthetic)","participatingPct":12.5}],"carries":[{"carried":"SNC","carriedPct":100,"carriers":"pro-rata"}],"carried":"SNC","basis":"contract","uplift":{"type":"multiple","multiplePct":250},"recoverFromPct":100,"discountRate":0.1,"baseYear":2031,"years":[{"year":2031,"cost":142600000,"entitlement":0},{"year":2032,"cost":88350000.5,"entitlement":0},{"year":2033,"cost":21000000,"entitlement":186400000},{"year":2034,"cost":0,"entitlement":214750000.5},{"year":2035,"cost":0,"entitlement":198300000},{"year":2036,"cost":0,"entitlement":176900000.25},{"year":2037,"cost":0,"entitlement":158200000},{"year":2038,"cost":0,"entitlement":141650000}]},"psc":{"royaltyPct":7.5,"costOilLimitPct":62.5,"costOilLimitBase":"gross","contractorProfitSharePct":50,"taxRatePct":35,"openingCostPool":312000000,"years":[{"year":2033,"grossRevenue":196400000,"capex":58000000,"opex":18200000,"contractorProfitSharePct":50},{"year":2034,"grossRevenue":231750000.5,"capex":21000000,"opex":19400000,"contractorProfitSharePct":45},{"year":2035,"grossRevenue":244100000.75,"capex":6500000,"opex":20150000.75,"contractorProfitSharePct":40},{"year":2036,"grossRevenue":226300000,"capex":0,"opex":20800000,"contractorProfitSharePct":40},{"year":2037,"grossRevenue":205650000.5,"capex":0,"opex":21300000,"contractorProfitSharePct":45}]},"default":{"parties":[{"id":"ABO","name":"Abiama Operating (synthetic), operator","participatingPct":45},{"id":"SPA","name":"Sepal Offshore A (synthetic)","participatingPct":25},{"id":"SPB","name":"Sepal Offshore B (synthetic)","participatingPct":17.5},{"id":"SNC","name":"State participant (synthetic)","participatingPct":12.5}],"callTotal":22800000,"dueDate":"2034-02-01","asOf":"2034-07-15","defaulters":[{"id":"SPB","paid":1500000.5}],"interest":{"annualRatePct":10.25,"dayBasis":360,"interestMethod":"simple","graceHours":0},"suspension":{"after":5,"unit":"working-days","from":"2034-02-01"},"forfeiture":{"after":3,"unit":"months","from":"2034-02-12"}}}'::jsonb;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'joa' and active;
  if v_structures <> 3 then
    raise exception 'EC9 go-live refused: joa has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'joa';
  if v_questions <> 396 then
    raise exception 'EC9 go-live refused: joa has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'joa' group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'EC9 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;
  select count(*) into v_n from (select tier, module_key from public.academy_quiz_questions where app_slug = 'joa' and scope = 'module' group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'EC9 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'joa' and scope = 'final' group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'EC9 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = 'joa'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'EC9 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;
  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'joa' and s.active;
  if v_lessons <> 78 then
    raise exception 'EC9 go-live refused: joa carries % lesson keys, expected 78', v_lessons;
  end if;
  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'joa' and s.active;
  if v_modules <> 18 then
    raise exception 'EC9 go-live refused: joa carries % modules, expected 18 (six per tier)', v_modules;
  end if;
  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'joa' and qq.scope = 'module' and not exists (
       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'EC9 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'joa';
  if v_capstones <> 3 then
    raise exception 'EC9 go-live refused: joa has % capstones, expected 3', v_capstones;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'joa';
  if v_graded <> 18 then
    raise exception 'EC9 go-live refused: joa has % graded capstone fields, expected 18', v_graded;
  end if;
  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'joa' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'EC9 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'joa' and module = 'economics' and path_order = 74 and prereq_slug is null) then
    raise exception 'EC9 go-live refused: the joa catalogue row is not economics at path_order 74 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 74 and slug <> 'joa') then
    raise exception 'EC9 go-live refused: another course already holds path_order 74';
  end if;

  -- ------------------------------------------------- the grader is numeric
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or abs((f->>'expected')::numeric) <= 0.001
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric is distinct from (select t.tol from (values ('beginner', 'idumu_zed_paying_pct', 5e-07::numeric), ('beginner', 'idumu_zed_june_call', 5e-07::numeric), ('beginner', 'idumu_zed_august_paid', 5e-07::numeric), ('beginner', 'idumu_budget_allowed_overrun', 5e-07::numeric), ('beginner', 'idumu_operating_overhead', 5e-07::numeric), ('beginner', 'idumu_development_overhead', 5e-07::numeric), ('intermediate', 'okwelle_2031_carry_balance', 5e-07::numeric), ('intermediate', 'okwelle_backin_refund_to_pra', 5e-07::numeric), ('intermediate', 'okwelle_default_interest', 5e-07::numeric), ('intermediate', 'okwelle_default_cover_oko', 5e-07::numeric), ('intermediate', 'okwelle_prb_june_call', 5e-07::numeric), ('intermediate', 'okwelle_2032_cost_recovered', 5e-07::numeric), ('advanced', 'abiama_spb_premium', 5e-07::numeric), ('advanced', 'abiama_spb_2036_receipt', 5e-07::numeric), ('advanced', 'abiama_buy_in_to_spa', 5e-07::numeric), ('advanced', 'abiama_spa_carry_npv', 5e-07::numeric), ('advanced', 'abiama_2035_government_profit_oil', 5e-07::numeric), ('advanced', 'abiama_abo_after_forfeiture_pct', 5e-07::numeric)) t(tier, k, tol) where t.tier = c.tier and t.k = f->>'key')
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'EC9 go-live refused: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;
  end if;
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or ((f->>'tol')::numeric = 0.0000005
              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));
  if v_n <> 0 then
    raise exception 'EC9 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or, at the six-decimal floor, pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;

  -- ---------------------------------------- the prompts the learner reads
  select prompt into v_prompt from public.academy_capstones where app_slug = 'joa' and tier = 'beginner';
  if v_prompt is null or md5(v_prompt) <> 'f5acad03190b76ab9a913af4dfb75e9e' then
    raise exception 'EC9 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'joa' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'IDUMU, the Idumu satellite joint venture (synthetic)' and title = 'Interests and the joint account') then
    raise exception 'EC9 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['refund', 'pro-rata', 'noCallBelow', 'budgetTolerance', 'idumu_case.json', 'No value depends on any of the three readings the engine states (the PSC income tax on the contractor''s profit oil, interest from the due date once a grace is exceeded, the default cover by paying interest), and every term a value needs is stated in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC9 go-live refused: % stated setting(s) or case file(s) are not named in the shipped beginner prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'joa' and tier = 'intermediate';
  if v_prompt is null or md5(v_prompt) <> 'd5d85e44e6a7e888580da2093f348eb3' then
    raise exception 'EC9 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'joa' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'OKWELLE, the Okwelle gas-condensate joint venture (synthetic)' and title = 'Recovery, default and cost recovery') then
    raise exception 'EC9 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['compound', 'contract', 'carry', 'pia-s85-4', 'from-future-entitlement', 'monthly-compound', 'graceHours', 'gross', '2030-06-01', '2030-08-19', 'okwelle_case.json', 'No value depends on any of the three readings the engine states (the PSC income tax on the contractor''s profit oil, interest from the due date once a grace is exceeded, the default cover by paying interest), and every term a value needs is stated in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC9 go-live refused: % stated setting(s) or case file(s) are not named in the shipped intermediate prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'joa' and tier = 'advanced';
  if v_prompt is null or md5(v_prompt) <> '5d1d62f9a0ba298722121f8e63dfcbf4' then
    raise exception 'EC9 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'joa' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'ABIAMA, the Abiama deepwater joint venture (synthetic)' and title = 'Sole risk, the readings and reading the engine') then
    raise exception 'EC9 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['recover-from-production', 'buy-in', 'multiple', 'contract', 'simple', 'graceHours', 'gross', '2034-02-01', '2034-07-15', 'abiama_case.json', 'No value depends on any of the three readings the engine states (the PSC income tax on the contractor''s profit oil, interest from the due date once a grace is exceeded, the default cover by paying interest), and every term a value needs is stated in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC9 go-live refused: % stated setting(s) or case file(s) are not named in the shipped advanced prompt: %', v_n, v_names;
  end if;
  -- No number handed in any capstone text of this course may sit within its
  -- tolerance of any graded value of any tier.
  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names
    from (select c.tier as ctier, m[1]::double precision as x
            from public.academy_capstones c,
                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||
                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),
                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m
           where c.app_slug = 'joa') h,
         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'joa') g
   where abs(abs(h.x) - abs(g.v)) <= g.t;
  if v_n <> 0 then
    raise exception 'EC9 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_idumu_zed_paying_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'beginner' and f->>'key' = 'idumu_zed_paying_pct';
  if v_g_idumu_zed_paying_pct is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: beginner/idumu_zed_paying_pct]';
  end if;
  select (f->>'expected')::double precision into v_g_idumu_zed_june_call
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'beginner' and f->>'key' = 'idumu_zed_june_call';
  if v_g_idumu_zed_june_call is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: beginner/idumu_zed_june_call]';
  end if;
  select (f->>'expected')::double precision into v_g_idumu_zed_august_paid
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'beginner' and f->>'key' = 'idumu_zed_august_paid';
  if v_g_idumu_zed_august_paid is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: beginner/idumu_zed_august_paid]';
  end if;
  select (f->>'expected')::double precision into v_g_idumu_budget_allowed_overrun
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'beginner' and f->>'key' = 'idumu_budget_allowed_overrun';
  if v_g_idumu_budget_allowed_overrun is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: beginner/idumu_budget_allowed_overrun]';
  end if;
  select (f->>'expected')::double precision into v_g_idumu_operating_overhead
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'beginner' and f->>'key' = 'idumu_operating_overhead';
  if v_g_idumu_operating_overhead is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: beginner/idumu_operating_overhead]';
  end if;
  select (f->>'expected')::double precision into v_g_idumu_development_overhead
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'beginner' and f->>'key' = 'idumu_development_overhead';
  if v_g_idumu_development_overhead is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: beginner/idumu_development_overhead]';
  end if;
  select (f->>'expected')::double precision into v_g_okwelle_2031_carry_balance
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'intermediate' and f->>'key' = 'okwelle_2031_carry_balance';
  if v_g_okwelle_2031_carry_balance is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: intermediate/okwelle_2031_carry_balance]';
  end if;
  select (f->>'expected')::double precision into v_g_okwelle_backin_refund_to_pra
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'intermediate' and f->>'key' = 'okwelle_backin_refund_to_pra';
  if v_g_okwelle_backin_refund_to_pra is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: intermediate/okwelle_backin_refund_to_pra]';
  end if;
  select (f->>'expected')::double precision into v_g_okwelle_default_interest
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'intermediate' and f->>'key' = 'okwelle_default_interest';
  if v_g_okwelle_default_interest is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: intermediate/okwelle_default_interest]';
  end if;
  select (f->>'expected')::double precision into v_g_okwelle_default_cover_oko
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'intermediate' and f->>'key' = 'okwelle_default_cover_oko';
  if v_g_okwelle_default_cover_oko is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: intermediate/okwelle_default_cover_oko]';
  end if;
  select (f->>'expected')::double precision into v_g_okwelle_prb_june_call
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'intermediate' and f->>'key' = 'okwelle_prb_june_call';
  if v_g_okwelle_prb_june_call is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: intermediate/okwelle_prb_june_call]';
  end if;
  select (f->>'expected')::double precision into v_g_okwelle_2032_cost_recovered
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'intermediate' and f->>'key' = 'okwelle_2032_cost_recovered';
  if v_g_okwelle_2032_cost_recovered is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: intermediate/okwelle_2032_cost_recovered]';
  end if;
  select (f->>'expected')::double precision into v_g_abiama_spb_premium
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'advanced' and f->>'key' = 'abiama_spb_premium';
  if v_g_abiama_spb_premium is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: advanced/abiama_spb_premium]';
  end if;
  select (f->>'expected')::double precision into v_g_abiama_spb_2036_receipt
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'advanced' and f->>'key' = 'abiama_spb_2036_receipt';
  if v_g_abiama_spb_2036_receipt is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: advanced/abiama_spb_2036_receipt]';
  end if;
  select (f->>'expected')::double precision into v_g_abiama_buy_in_to_spa
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'advanced' and f->>'key' = 'abiama_buy_in_to_spa';
  if v_g_abiama_buy_in_to_spa is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: advanced/abiama_buy_in_to_spa]';
  end if;
  select (f->>'expected')::double precision into v_g_abiama_spa_carry_npv
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'advanced' and f->>'key' = 'abiama_spa_carry_npv';
  if v_g_abiama_spa_carry_npv is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: advanced/abiama_spa_carry_npv]';
  end if;
  select (f->>'expected')::double precision into v_g_abiama_2035_government_profit_oil
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'advanced' and f->>'key' = 'abiama_2035_government_profit_oil';
  if v_g_abiama_2035_government_profit_oil is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: advanced/abiama_2035_government_profit_oil]';
  end if;
  select (f->>'expected')::double precision into v_g_abiama_abo_after_forfeiture_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'joa' and c.tier = 'advanced' and f->>'key' = 'abiama_abo_after_forfeiture_pct';
  if v_g_abiama_abo_after_forfeiture_pct is null then
    raise exception 'EC9 go-live refused: the seeded rows carry no value [graded field: advanced/abiama_abo_after_forfeiture_pct]';
  end if;

  -- ------------------------------------------ 1. against the engine ledger
  if v_g_idumu_zed_paying_pct <> 21.397058823529413::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 21.397058823529413 [graded field: beginner/idumu_zed_paying_pct]', v_g_idumu_zed_paying_pct;
  end if;
  if v_g_idumu_zed_june_call <> 1998619.1327205882::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 1998619.1327205882 [graded field: beginner/idumu_zed_june_call]', v_g_idumu_zed_june_call;
  end if;
  if v_g_idumu_zed_august_paid <> 1979559.8095588237::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 1979559.8095588237 [graded field: beginner/idumu_zed_august_paid]', v_g_idumu_zed_august_paid;
  end if;
  if v_g_idumu_budget_allowed_overrun <> 3004000.5::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 3004000.5 [graded field: beginner/idumu_budget_allowed_overrun]', v_g_idumu_budget_allowed_overrun;
  end if;
  if v_g_idumu_operating_overhead <> 1471074.75275::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 1471074.75275 [graded field: beginner/idumu_operating_overhead]', v_g_idumu_operating_overhead;
  end if;
  if v_g_idumu_development_overhead <> 2261700.0045::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 2261700.0045 [graded field: beginner/idumu_development_overhead]', v_g_idumu_development_overhead;
  end if;
  if v_g_okwelle_2031_carry_balance <> 15499789.491662813::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 15499789.491662813 [graded field: intermediate/okwelle_2031_carry_balance]', v_g_okwelle_2031_carry_balance;
  end if;
  if v_g_okwelle_backin_refund_to_pra <> 29922022.09522059::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 29922022.09522059 [graded field: intermediate/okwelle_backin_refund_to_pra]', v_g_okwelle_backin_refund_to_pra;
  end if;
  if v_g_okwelle_default_interest <> 57396.210640669764::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 57396.210640669764 [graded field: intermediate/okwelle_default_interest]', v_g_okwelle_default_interest;
  end if;
  if v_g_okwelle_default_cover_oko <> 1341465.2758620689::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 1341465.2758620689 [graded field: intermediate/okwelle_default_cover_oko]', v_g_okwelle_default_cover_oko;
  end if;
  if v_g_okwelle_prb_june_call <> 3762105.9485294116::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 3762105.9485294116 [graded field: intermediate/okwelle_prb_june_call]', v_g_okwelle_prb_june_call;
  end if;
  if v_g_okwelle_2032_cost_recovered <> 87862500.22000001::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 87862500.22000001 [graded field: intermediate/okwelle_2032_cost_recovered]', v_g_okwelle_2032_cost_recovered;
  end if;
  if v_g_abiama_spb_premium <> 14043750.21::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 14043750.21 [graded field: advanced/abiama_spb_premium]', v_g_abiama_spb_premium;
  end if;
  if v_g_abiama_spb_2036_receipt <> 1382499.8337499993::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 1382499.8337499993 [graded field: advanced/abiama_spb_2036_receipt]', v_g_abiama_spb_2036_receipt;
  end if;
  if v_g_abiama_buy_in_to_spa <> 8410714.35267857::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 8410714.35267857 [graded field: advanced/abiama_buy_in_to_spa]', v_g_abiama_buy_in_to_spa;
  end if;
  if v_g_abiama_spa_carry_npv <> 128792800.24269654::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 128792800.24269654 [graded field: advanced/abiama_spa_carry_npv]', v_g_abiama_spa_carry_npv;
  end if;
  if v_g_abiama_2035_government_profit_oil <> 43938000.13499999::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 43938000.13499999 [graded field: advanced/abiama_2035_government_profit_oil]', v_g_abiama_2035_government_profit_oil;
  end if;
  if v_g_abiama_abo_after_forfeiture_pct <> 54.54545454545455::double precision then
    raise exception 'EC9 go-live refused: the seeded value is %, and the engine returned 54.54545454545455 [graded field: advanced/abiama_abo_after_forfeiture_pct]', v_g_abiama_abo_after_forfeiture_pct;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  v_cc_b := pg_temp.ec9_cc(v_case_b->'cashCalls', 'ZED');
  v_cc_i := pg_temp.ec9_cc(v_case_i->'cashCalls', 'PRB');
  v_carry_i := pg_temp.ec9_carry(v_case_i->'carry');
  v_carry_a := pg_temp.ec9_carry(v_case_a->'carry');
  v_psc_i := pg_temp.ec9_psc(v_case_i->'psc');
  v_psc_a := pg_temp.ec9_psc(v_case_a->'psc');
  v_s := pg_temp.ec9_paying(v_case_b->'interests'->'parties', v_case_b->'interests'->'carries', 'ZED');
  if v_s is null or abs(v_s - v_g_idumu_zed_paying_pct) > 1e-9 * abs(v_g_idumu_zed_paying_pct) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/idumu_zed_paying_pct]', v_s, v_g_idumu_zed_paying_pct;
  end if;
  v_s := pg_temp.ec9_n(v_cc_b->'2029-06'->'call');
  if v_s is null or abs(v_s - v_g_idumu_zed_june_call) > 1e-9 * abs(v_g_idumu_zed_june_call) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/idumu_zed_june_call]', v_s, v_g_idumu_zed_june_call;
  end if;
  v_s := pg_temp.ec9_n(v_cc_b->'2029-08'->'paid');
  if v_s is null or abs(v_s - v_g_idumu_zed_august_paid) > 1e-9 * abs(v_g_idumu_zed_august_paid) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/idumu_zed_august_paid]', v_s, v_g_idumu_zed_august_paid;
  end if;
  v_s := pg_temp.ec9_allowed(v_case_b->'budget');
  if v_s is null or abs(v_s - v_g_idumu_budget_allowed_overrun) > 1e-9 * abs(v_g_idumu_budget_allowed_overrun) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/idumu_budget_allowed_overrun]', v_s, v_g_idumu_budget_allowed_overrun;
  end if;
  v_s := pg_temp.ec9_overhead(v_case_b->'overhead', 'operating');
  if v_s is null or abs(v_s - v_g_idumu_operating_overhead) > 1e-9 * abs(v_g_idumu_operating_overhead) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/idumu_operating_overhead]', v_s, v_g_idumu_operating_overhead;
  end if;
  v_s := pg_temp.ec9_overhead(v_case_b->'overhead', 'development');
  if v_s is null or abs(v_s - v_g_idumu_development_overhead) > 1e-9 * abs(v_g_idumu_development_overhead) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/idumu_development_overhead]', v_s, v_g_idumu_development_overhead;
  end if;
  v_s := pg_temp.ec9_n(v_carry_i->'2031'->'closing');
  if v_s is null or abs(v_s - v_g_okwelle_2031_carry_balance) > 1e-9 * abs(v_g_okwelle_2031_carry_balance) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/okwelle_2031_carry_balance]', v_s, v_g_okwelle_2031_carry_balance;
  end if;
  v_s := pg_temp.ec9_backin(v_case_i->'backIn', 'PRA');
  if v_s is null or abs(v_s - v_g_okwelle_backin_refund_to_pra) > 1e-9 * abs(v_g_okwelle_backin_refund_to_pra) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/okwelle_backin_refund_to_pra]', v_s, v_g_okwelle_backin_refund_to_pra;
  end if;
  v_s := pg_temp.ec9_default_interest(v_case_i->'default', 'PRA');
  if v_s is null or abs(v_s - v_g_okwelle_default_interest) > 1e-9 * abs(v_g_okwelle_default_interest) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/okwelle_default_interest]', v_s, v_g_okwelle_default_interest;
  end if;
  v_s := pg_temp.ec9_cover(v_case_i->'default', 'OKO');
  if v_s is null or abs(v_s - v_g_okwelle_default_cover_oko) > 1e-9 * abs(v_g_okwelle_default_cover_oko) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/okwelle_default_cover_oko]', v_s, v_g_okwelle_default_cover_oko;
  end if;
  v_s := pg_temp.ec9_n(v_cc_i->'2030-06'->'call');
  if v_s is null or abs(v_s - v_g_okwelle_prb_june_call) > 1e-9 * abs(v_g_okwelle_prb_june_call) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/okwelle_prb_june_call]', v_s, v_g_okwelle_prb_june_call;
  end if;
  v_s := pg_temp.ec9_n(v_psc_i->'2032'->'costRecovered');
  if v_s is null or abs(v_s - v_g_okwelle_2032_cost_recovered) > 1e-9 * abs(v_g_okwelle_2032_cost_recovered) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/okwelle_2032_cost_recovered]', v_s, v_g_okwelle_2032_cost_recovered;
  end if;
  v_s := pg_temp.ec9_premium(v_case_a->'soleRisk', 'SPB');
  if v_s is null or abs(v_s - v_g_abiama_spb_premium) > 1e-9 * abs(v_g_abiama_spb_premium) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/abiama_spb_premium]', v_s, v_g_abiama_spb_premium;
  end if;
  v_s := pg_temp.ec9_nc_receipt(v_case_a->'soleRisk', 'SPB', 2036);
  if v_s is null or abs(v_s - v_g_abiama_spb_2036_receipt) > 1e-9 * abs(v_g_abiama_spb_2036_receipt) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/abiama_spb_2036_receipt]', v_s, v_g_abiama_spb_2036_receipt;
  end if;
  v_s := pg_temp.ec9_buyin_to(v_case_a->'buyIn', 'SNC', 'SPA');
  if v_s is null or abs(v_s - v_g_abiama_buy_in_to_spa) > 1e-9 * abs(v_g_abiama_buy_in_to_spa) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/abiama_buy_in_to_spa]', v_s, v_g_abiama_buy_in_to_spa;
  end if;
  v_s := pg_temp.ec9_npv(v_carry_a->'flows'->'SPA', 0.1::double precision, 2031, 2031);
  if v_s is null or abs(v_s - v_g_abiama_spa_carry_npv) > 1e-9 * abs(v_g_abiama_spa_carry_npv) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/abiama_spa_carry_npv]', v_s, v_g_abiama_spa_carry_npv;
  end if;
  v_s := pg_temp.ec9_n(v_psc_a->'2035'->'governmentProfitOil');
  if v_s is null or abs(v_s - v_g_abiama_2035_government_profit_oil) > 1e-9 * abs(v_g_abiama_2035_government_profit_oil) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/abiama_2035_government_profit_oil]', v_s, v_g_abiama_2035_government_profit_oil;
  end if;
  v_s := pg_temp.ec9_after_forfeiture(v_case_a->'default', 'ABO');
  if v_s is null or abs(v_s - v_g_abiama_abo_after_forfeiture_pct) > 1e-9 * abs(v_g_abiama_abo_after_forfeiture_pct) then
    raise exception 'EC9 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/abiama_abo_after_forfeiture_pct]', v_s, v_g_abiama_abo_after_forfeiture_pct;
  end if;

  -- ---------------------------------------------------- 3. against the oracle
  -- oracle_check.py --json, run when this file was generated: the value the
  -- vendored stdlib oracle computed, written in, with the module it came from.
  -- idumu_zed_paying_pct: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_idumu_zed_paying_pct - 21.397058823529413::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 21.397058823529413, not within 5e-07 of the seeded % [graded field: beginner/idumu_zed_paying_pct]', v_g_idumu_zed_paying_pct;
  end if;
  -- idumu_zed_june_call: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_idumu_zed_june_call - 1998619.1327205882::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 1998619.1327205882, not within 5e-07 of the seeded % [graded field: beginner/idumu_zed_june_call]', v_g_idumu_zed_june_call;
  end if;
  -- idumu_zed_august_paid: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_idumu_zed_august_paid - 1979559.8095588235::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 1979559.8095588235, not within 5e-07 of the seeded % [graded field: beginner/idumu_zed_august_paid]', v_g_idumu_zed_august_paid;
  end if;
  -- idumu_budget_allowed_overrun: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_idumu_budget_allowed_overrun - 3004000.5::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 3004000.5, not within 5e-07 of the seeded % [graded field: beginner/idumu_budget_allowed_overrun]', v_g_idumu_budget_allowed_overrun;
  end if;
  -- idumu_operating_overhead: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_idumu_operating_overhead - 1471074.75275::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 1471074.75275, not within 5e-07 of the seeded % [graded field: beginner/idumu_operating_overhead]', v_g_idumu_operating_overhead;
  end if;
  -- idumu_development_overhead: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_idumu_development_overhead - 2261700.0045::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 2261700.0045, not within 5e-07 of the seeded % [graded field: beginner/idumu_development_overhead]', v_g_idumu_development_overhead;
  end if;
  -- okwelle_2031_carry_balance: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_okwelle_2031_carry_balance - 15499789.491662813::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 15499789.491662813, not within 5e-07 of the seeded % [graded field: intermediate/okwelle_2031_carry_balance]', v_g_okwelle_2031_carry_balance;
  end if;
  -- okwelle_backin_refund_to_pra: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_okwelle_backin_refund_to_pra - 29922022.09522059::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 29922022.09522059, not within 5e-07 of the seeded % [graded field: intermediate/okwelle_backin_refund_to_pra]', v_g_okwelle_backin_refund_to_pra;
  end if;
  -- okwelle_default_interest: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_okwelle_default_interest - 57396.21064067035::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 57396.21064067035, not within 5e-07 of the seeded % [graded field: intermediate/okwelle_default_interest]', v_g_okwelle_default_interest;
  end if;
  -- okwelle_default_cover_oko: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_okwelle_default_cover_oko - 1341465.2758620689::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 1341465.2758620689, not within 5e-07 of the seeded % [graded field: intermediate/okwelle_default_cover_oko]', v_g_okwelle_default_cover_oko;
  end if;
  -- okwelle_prb_june_call: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_okwelle_prb_june_call - 3762105.9485294116::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 3762105.9485294116, not within 5e-07 of the seeded % [graded field: intermediate/okwelle_prb_june_call]', v_g_okwelle_prb_june_call;
  end if;
  -- okwelle_2032_cost_recovered: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_okwelle_2032_cost_recovered - 87862500.22::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 87862500.22, not within 5e-07 of the seeded % [graded field: intermediate/okwelle_2032_cost_recovered]', v_g_okwelle_2032_cost_recovered;
  end if;
  -- abiama_spb_premium: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_abiama_spb_premium - 14043750.209999999::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 14043750.209999999, not within 5e-07 of the seeded % [graded field: advanced/abiama_spb_premium]', v_g_abiama_spb_premium;
  end if;
  -- abiama_spb_2036_receipt: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_abiama_spb_2036_receipt - 1382499.8337500007::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 1382499.8337500007, not within 5e-07 of the seeded % [graded field: advanced/abiama_spb_2036_receipt]', v_g_abiama_spb_2036_receipt;
  end if;
  -- abiama_buy_in_to_spa: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_abiama_buy_in_to_spa - 8410714.35267857::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 8410714.35267857, not within 5e-07 of the seeded % [graded field: advanced/abiama_buy_in_to_spa]', v_g_abiama_buy_in_to_spa;
  end if;
  -- abiama_spa_carry_npv: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_abiama_spa_carry_npv - 128792800.24269658::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 128792800.24269658, not within 5e-07 of the seeded % [graded field: advanced/abiama_spa_carry_npv]', v_g_abiama_spa_carry_npv;
  end if;
  -- abiama_2035_government_profit_oil: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_abiama_2035_government_profit_oil - 43938000.135::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 43938000.135, not within 5e-07 of the seeded % [graded field: advanced/abiama_2035_government_profit_oil]', v_g_abiama_2035_government_profit_oil;
  end if;
  -- abiama_abo_after_forfeiture_pct: tools/validation/economics/oracle_jointventure.py
  if abs(v_g_abiama_abo_after_forfeiture_pct - 54.54545454545455::double precision) > 5e-07::double precision then
    raise exception 'EC9 go-live refused: the oracle gives 54.54545454545455, not within 5e-07 of the seeded % [graded field: advanced/abiama_abo_after_forfeiture_pct]', v_g_abiama_abo_after_forfeiture_pct;
  end if;

  -- ------------------------------------------------------------- 4. the traps
  -- Every wrong method discriminate.mjs swept through the engine for a field,
  -- by value: each must miss the seeded value by more than the tolerance, or
  -- the field does not discriminate the trap it is for.
  v_wrong := 18.75::double precision;
  if abs(v_wrong - v_g_idumu_zed_paying_pct) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (paying is beneficial) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_zed_paying_pct]', v_wrong, v_g_idumu_zed_paying_pct;
  end if;
  v_wrong := 21.0::double precision;
  if abs(v_wrong - v_g_idumu_zed_paying_pct) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (carry pro rata over every party) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_zed_paying_pct]', v_wrong, v_g_idumu_zed_paying_pct;
  end if;
  v_wrong := 22.75::double precision;
  if abs(v_wrong - v_g_idumu_zed_paying_pct) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (carry in equal shares) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_zed_paying_pct]', v_wrong, v_g_idumu_zed_paying_pct;
  end if;
  v_wrong := 22.058823529411764::double precision;
  if abs(v_wrong - v_g_idumu_zed_paying_pct) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (carried in full) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_zed_paying_pct]', v_wrong, v_g_idumu_zed_paying_pct;
  end if;
  v_wrong := 1751367.28125::double precision;
  if abs(v_wrong - v_g_idumu_zed_june_call) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (paying is beneficial) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_zed_june_call]', v_wrong, v_g_idumu_zed_june_call;
  end if;
  v_wrong := 1905515.0735294118::double precision;
  if abs(v_wrong - v_g_idumu_zed_june_call) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (adjustment not carried) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_zed_june_call]', v_wrong, v_g_idumu_zed_june_call;
  end if;
  v_wrong := 1961531.355::double precision;
  if abs(v_wrong - v_g_idumu_zed_june_call) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (carry pro rata over every party) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_zed_june_call]', v_wrong, v_g_idumu_zed_june_call;
  end if;
  v_wrong := 1962270.8255514705::double precision;
  if abs(v_wrong - v_g_idumu_zed_june_call) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (lag two months) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_zed_june_call]', v_wrong, v_g_idumu_zed_june_call;
  end if;
  v_wrong := 1828860.270772059::double precision;
  if abs(v_wrong - v_g_idumu_zed_august_paid) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (arrears not billed) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_zed_august_paid]', v_wrong, v_g_idumu_zed_august_paid;
  end if;
  v_wrong := 2127787.7740808823::double precision;
  if abs(v_wrong - v_g_idumu_zed_august_paid) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (adjustment not carried) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_zed_august_paid]', v_wrong, v_g_idumu_zed_august_paid;
  end if;
  v_wrong := 1734665.8125::double precision;
  if abs(v_wrong - v_g_idumu_zed_august_paid) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (paying is beneficial) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_zed_august_paid]', v_wrong, v_g_idumu_zed_august_paid;
  end if;
  v_wrong := 1995126.009375::double precision;
  if abs(v_wrong - v_g_idumu_zed_august_paid) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (threshold dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_zed_august_paid]', v_wrong, v_g_idumu_zed_august_paid;
  end if;
  v_wrong := 3500000.0::double precision;
  if abs(v_wrong - v_g_idumu_budget_allowed_overrun) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (budget tolerance higher) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_budget_allowed_overrun]', v_wrong, v_g_idumu_budget_allowed_overrun;
  end if;
  v_wrong := 3235058.08::double precision;
  if abs(v_wrong - v_g_idumu_budget_allowed_overrun) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (percentage of the actual total) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_budget_allowed_overrun]', v_wrong, v_g_idumu_budget_allowed_overrun;
  end if;
  v_wrong := 3500000.0::double precision;
  if abs(v_wrong - v_g_idumu_budget_allowed_overrun) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (the reference texts five percent) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_budget_allowed_overrun]', v_wrong, v_g_idumu_budget_allowed_overrun;
  end if;
  v_wrong := 1502534.75275::double precision;
  if abs(v_wrong - v_g_idumu_operating_overhead) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (overhead exclusions ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_operating_overhead]', v_wrong, v_g_idumu_operating_overhead;
  end if;
  v_wrong := 2425433.25925::double precision;
  if abs(v_wrong - v_g_idumu_operating_overhead) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (overhead whole base at each band rate) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_operating_overhead]', v_wrong, v_g_idumu_operating_overhead;
  end if;
  v_wrong := 721074.7527500001::double precision;
  if abs(v_wrong - v_g_idumu_operating_overhead) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (whole base at the rate of its band) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_operating_overhead]', v_wrong, v_g_idumu_operating_overhead;
  end if;
  v_wrong := 1704358.5065000001::double precision;
  if abs(v_wrong - v_g_idumu_operating_overhead) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (whole base at the first band rate) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_operating_overhead]', v_wrong, v_g_idumu_operating_overhead;
  end if;
  v_wrong := 5031900.0315000005::double precision;
  if abs(v_wrong - v_g_idumu_development_overhead) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (overhead whole base at each band rate) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_development_overhead]', v_wrong, v_g_idumu_development_overhead;
  end if;
  v_wrong := 821700.0045::double precision;
  if abs(v_wrong - v_g_idumu_development_overhead) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (whole base at the rate above the bands) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_development_overhead]', v_wrong, v_g_idumu_development_overhead;
  end if;
  v_wrong := 3286800.018::double precision;
  if abs(v_wrong - v_g_idumu_development_overhead) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (whole base at the first band rate) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_development_overhead]', v_wrong, v_g_idumu_development_overhead;
  end if;
  v_wrong := 2160000.0::double precision;
  if abs(v_wrong - v_g_idumu_development_overhead) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (the part above the last band dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/idumu_development_overhead]', v_wrong, v_g_idumu_development_overhead;
  end if;
  v_wrong := 10719000.024000002::double precision;
  if abs(v_wrong - v_g_okwelle_2031_carry_balance) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (carry recovered without uplift) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_2031_carry_balance]', v_wrong, v_g_okwelle_2031_carry_balance;
  end if;
  v_wrong := 17997288.706237525::double precision;
  if abs(v_wrong - v_g_okwelle_2031_carry_balance) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (uplift on new cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_2031_carry_balance]', v_wrong, v_g_okwelle_2031_carry_balance;
  end if;
  v_wrong := 3632989.467662813::double precision;
  if abs(v_wrong - v_g_okwelle_2031_carry_balance) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (recovery share ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_2031_carry_balance]', v_wrong, v_g_okwelle_2031_carry_balance;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_okwelle_2031_carry_balance) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (carried cost on paying) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_2031_carry_balance]', v_wrong, v_g_okwelle_2031_carry_balance;
  end if;
  v_wrong := 38540845.62463235::double precision;
  if abs(v_wrong - v_g_okwelle_backin_refund_to_pra) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (pia refund includes exploration) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_backin_refund_to_pra]', v_wrong, v_g_okwelle_backin_refund_to_pra;
  end if;
  v_wrong := 49870036.825367644::double precision;
  if abs(v_wrong - v_g_okwelle_backin_refund_to_pra) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (refund on target interest) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_backin_refund_to_pra]', v_wrong, v_g_okwelle_backin_refund_to_pra;
  end if;
  v_wrong := 31403382.389338236::double precision;
  if abs(v_wrong - v_g_okwelle_backin_refund_to_pra) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (bonus interest and markup refunded) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_backin_refund_to_pra]', v_wrong, v_g_okwelle_backin_refund_to_pra;
  end if;
  v_wrong := 30828750.037499998::double precision;
  if abs(v_wrong - v_g_okwelle_backin_refund_to_pra) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (refund received in equal parts) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_backin_refund_to_pra]', v_wrong, v_g_okwelle_backin_refund_to_pra;
  end if;
  v_wrong := 57135.65752739726::double precision;
  if abs(v_wrong - v_g_okwelle_default_interest) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (simple interest) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_default_interest]', v_wrong, v_g_okwelle_default_interest;
  end if;
  v_wrong := 568649.8277413253::double precision;
  if abs(v_wrong - v_g_okwelle_default_interest) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (monthly rate as annual) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_default_interest]', v_wrong, v_g_okwelle_default_interest;
  end if;
  v_wrong := 44171.02134887102::double precision;
  if abs(v_wrong - v_g_okwelle_default_interest) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (remaining days dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_default_interest]', v_wrong, v_g_okwelle_default_interest;
  end if;
  v_wrong := 58130.94337910316::double precision;
  if abs(v_wrong - v_g_okwelle_default_interest) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (value date counted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_default_interest]', v_wrong, v_g_okwelle_default_interest;
  end if;
  v_wrong := 926249.8333333334::double precision;
  if abs(v_wrong - v_g_okwelle_default_cover_oko) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (cover in equal shares) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_default_cover_oko]', v_wrong, v_g_okwelle_default_cover_oko;
  end if;
  v_wrong := 972562.325::double precision;
  if abs(v_wrong - v_g_okwelle_default_cover_oko) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (defaulter left in cover base) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_default_cover_oko]', v_wrong, v_g_okwelle_default_cover_oko;
  end if;
  v_wrong := 1944913.7931034483::double precision;
  if abs(v_wrong - v_g_okwelle_default_cover_oko) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (the whole share of the call covered) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_default_cover_oko]', v_wrong, v_g_okwelle_default_cover_oko;
  end if;
  v_wrong := 3877941.176470588::double precision;
  if abs(v_wrong - v_g_okwelle_prb_june_call) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (adjustment not carried) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_prb_june_call]', v_wrong, v_g_okwelle_prb_june_call;
  end if;
  v_wrong := 3197790.05625::double precision;
  if abs(v_wrong - v_g_okwelle_prb_june_call) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (paying is beneficial) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_prb_june_call]', v_wrong, v_g_okwelle_prb_june_call;
  end if;
  v_wrong := 3639705.8823529407::double precision;
  if abs(v_wrong - v_g_okwelle_prb_june_call) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (lag one month) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_prb_june_call]', v_wrong, v_g_okwelle_prb_june_call;
  end if;
  v_wrong := 3877941.176470588::double precision;
  if abs(v_wrong - v_g_okwelle_prb_june_call) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (negative call refunded) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_prb_june_call]', v_wrong, v_g_okwelle_prb_june_call;
  end if;
  v_wrong := 79076250.19800001::double precision;
  if abs(v_wrong - v_g_okwelle_2032_cost_recovered) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (psc gross limit on after royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_2032_cost_recovered]', v_wrong, v_g_okwelle_2032_cost_recovered;
  end if;
  v_wrong := 21100000.25::double precision;
  if abs(v_wrong - v_g_okwelle_2032_cost_recovered) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (opening pool left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_2032_cost_recovered]', v_wrong, v_g_okwelle_2032_cost_recovered;
  end if;
  v_wrong := 21100000.25::double precision;
  if abs(v_wrong - v_g_okwelle_2032_cost_recovered) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (the years costs recovered whole) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/okwelle_2032_cost_recovered]', v_wrong, v_g_okwelle_2032_cost_recovered;
  end if;
  v_wrong := 80250001.2::double precision;
  if abs(v_wrong - v_g_abiama_spb_premium) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (premium on whole cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_spb_premium]', v_wrong, v_g_abiama_spb_premium;
  end if;
  v_wrong := 66206250.99::double precision;
  if abs(v_wrong - v_g_abiama_spb_premium) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (premium on consenting cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_spb_premium]', v_wrong, v_g_abiama_spb_premium;
  end if;
  v_wrong := 9362500.14::double precision;
  if abs(v_wrong - v_g_abiama_spb_premium) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (the premium above the cost alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_spb_premium]', v_wrong, v_g_abiama_spb_premium;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_abiama_spb_2036_receipt) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (reversion one period late) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_spb_2036_receipt]', v_wrong, v_g_abiama_spb_2036_receipt;
  end if;
  v_wrong := 5031250.0::double precision;
  if abs(v_wrong - v_g_abiama_spb_2036_receipt) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (deductions not taken off) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_spb_2036_receipt]', v_wrong, v_g_abiama_spb_2036_receipt;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_abiama_spb_2036_receipt) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (premium on whole cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_spb_2036_receipt]', v_wrong, v_g_abiama_spb_2036_receipt;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_abiama_spb_2036_receipt) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (premium on consenting cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_spb_2036_receipt]', v_wrong, v_g_abiama_spb_2036_receipt;
  end if;
  v_wrong := 7359375.05859375::double precision;
  if abs(v_wrong - v_g_abiama_buy_in_to_spa) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (buy in apportioned over 100) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_buy_in_to_spa]', v_wrong, v_g_abiama_buy_in_to_spa;
  end if;
  v_wrong := 67285714.82142857::double precision;
  if abs(v_wrong - v_g_abiama_buy_in_to_spa) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (premium on whole cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_buy_in_to_spa]', v_wrong, v_g_abiama_buy_in_to_spa;
  end if;
  v_wrong := 9812500.078125::double precision;
  if abs(v_wrong - v_g_abiama_buy_in_to_spa) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (the buy in in equal parts) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_buy_in_to_spa]', v_wrong, v_g_abiama_buy_in_to_spa;
  end if;
  v_wrong := 141672080.2669662::double precision;
  if abs(v_wrong - v_g_abiama_spa_carry_npv) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (npv one year early) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_spa_carry_npv]', v_wrong, v_g_abiama_spa_carry_npv;
  end if;
  v_wrong := 119277469.23508316::double precision;
  if abs(v_wrong - v_g_abiama_spa_carry_npv) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (carry recovered without uplift) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_spa_carry_npv]', v_wrong, v_g_abiama_spa_carry_npv;
  end if;
  v_wrong := 154602286.4652432::double precision;
  if abs(v_wrong - v_g_abiama_spa_carry_npv) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (entitlement on paying) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_spa_carry_npv]', v_wrong, v_g_abiama_spa_carry_npv;
  end if;
  v_wrong := 137373998.60603774::double precision;
  if abs(v_wrong - v_g_abiama_spa_carry_npv) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (paying is beneficial) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_spa_carry_npv]', v_wrong, v_g_abiama_spa_carry_npv;
  end if;
  v_wrong := 36615000.1125::double precision;
  if abs(v_wrong - v_g_abiama_2035_government_profit_oil) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (psc year share ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_2035_government_profit_oil]', v_wrong, v_g_abiama_2035_government_profit_oil;
  end if;
  v_wrong := 50803312.65609375::double precision;
  if abs(v_wrong - v_g_abiama_2035_government_profit_oil) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (psc gross limit on after royalty) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_2035_government_profit_oil]', v_wrong, v_g_abiama_2035_government_profit_oil;
  end if;
  v_wrong := 119485499.96624999::double precision;
  if abs(v_wrong - v_g_abiama_2035_government_profit_oil) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (opening pool left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_2035_government_profit_oil]', v_wrong, v_g_abiama_2035_government_profit_oil;
  end if;
  v_wrong := 50803312.65609375::double precision;
  if abs(v_wrong - v_g_abiama_2035_government_profit_oil) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (limit base swapped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_2035_government_profit_oil]', v_wrong, v_g_abiama_2035_government_profit_oil;
  end if;
  v_wrong := 45.0::double precision;
  if abs(v_wrong - v_g_abiama_abo_after_forfeiture_pct) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (forfeiture over every party) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_abo_after_forfeiture_pct]', v_wrong, v_g_abiama_abo_after_forfeiture_pct;
  end if;
  v_wrong := 50.833333333333336::double precision;
  if abs(v_wrong - v_g_abiama_abo_after_forfeiture_pct) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (the forfeited interest in equal parts) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_abo_after_forfeiture_pct]', v_wrong, v_g_abiama_abo_after_forfeiture_pct;
  end if;
  v_wrong := 62.5::double precision;
  if abs(v_wrong - v_g_abiama_abo_after_forfeiture_pct) <= 5e-07::double precision then
    raise exception 'EC9 go-live refused: the trap (the forfeited interest to the operator alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/abiama_abo_after_forfeiture_pct]', v_wrong, v_g_abiama_abo_after_forfeiture_pct;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'joa';
  if not exists (select 1 from public.academy_apps where slug = 'joa' and status = 'available') then
    raise exception 'EC9 go-live refused: joa did not reach status available';
  end if;
  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon from public.academy_apps;
  raise notice 'EC9 go-live: joa available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
