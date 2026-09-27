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
