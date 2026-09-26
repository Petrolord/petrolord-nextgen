-- ------------------------------------------------ the second route's helpers
-- Temporary functions (pg_temp), created with create or replace: they vanish
-- with the session and create nothing in any schema. They rebuild each graded
-- EC8 value from the clause arithmetic of the texts the course cites, in SQL,
-- with no engine code: volume to energy through the International Table Btu
-- (NIST SP 811) and the exact cubic foot; the ACQ as DCQ x the days of a
-- period with its end date excluded, and the effective swing; the daily
-- balance (the properly nominated quantity capped at MaxDCQ, the gap less the
-- delivery tolerance against the quantity made available, excused first by the
-- day's force majeure and maintenance, none on a buyer-caused day, the
-- adjusted DCQ and the buyer shortfall); the take-or-pay year and ledger
-- (Commonwealth model GSA definitions and Articles 12.5 to 12.8: the Adjusted
-- ACQ, the take-or-pay quantity, make-up in the stated order drawn first in
-- first out, expiring at the end of its last year, forfeited or refunded at
-- the end of the term, carry-forward capped at a share of the deficiency);
-- the monthly price (window means, lag, reset, the S-curve through its kinks,
-- floor and ceiling, Article 15.4's four-decimal rule) and the annual prices
-- (Article 15.2.6); the Domestic Gas Delivery Obligation penalty (PIA s.110,
-- DGDO Regulations 2022 r.6); the gas royalty (PIA Seventh Schedule para
-- 10(6)); and year-end NPV. Every number is a double precision.

-- A number out of a jsonb value, read through its text (the double JSON.parse gives).
create or replace function pg_temp.ec8_n(v jsonb) returns double precision
language sql immutable as $f$
  select case when v is null or jsonb_typeof(v) = 'null' then null else (v #>> '{}')::double precision end
$f$;

-- Volume to energy in MMBtu.
create or replace function pg_temp.ec8_energy(e jsonb) returns double precision
language plpgsql immutable as $f$
declare q double precision := pg_temp.ec8_n(e->'quantity'); hv double precision := pg_temp.ec8_n(e->'heatingValue');
  u text := e->>'quantityUnit'; hu text := e->>'heatingValueUnit'; m3 double precision; ft3 double precision;
begin
  if u in ('Sm3', 'MSm3', 'MMSm3') then
    m3 := q * (case u when 'Sm3' then 1.0 when 'MSm3' then 1000.0 else 1000000.0 end);
    if hu = 'MJ/Sm3' then return m3 * hv / 1055.05585262; end if;
    return (m3 / 0.028316846592) * hv / 1000000.0;
  end if;
  ft3 := q * (case u when 'scf' then 1.0 when 'Mscf' then 1000.0 else 1000000.0 end);
  if hu = 'Btu/scf' then return ft3 * hv / 1000000.0; end if;
  return ft3 * 0.028316846592 * hv / 1055.05585262;
end
$f$;

-- ACQ = DCQ x the days of a period whose end date is excluded.
create or replace function pg_temp.ec8_acq(c jsonb) returns double precision
language sql immutable as $f$
  select pg_temp.ec8_n(c->'dcq') * ((c->'period'->>'end')::date - (c->'period'->>'start')::date)::double precision
$f$;

-- Effective swing = (MaxDCQ percent / 100) / (take-or-pay percent / 100).
create or replace function pg_temp.ec8_swing(c jsonb) returns double precision
language sql immutable as $f$
  select (pg_temp.ec8_n(c->'maxDcqPct') / 100.0) / (pg_temp.ec8_n(c->'topPct') / 100.0)
$f$;

-- The daily balance: totals of the buyer shortfall and the seller shortfall.
create or replace function pg_temp.ec8_daily(c jsonb) returns jsonb
language plpgsql immutable as $f$
declare d jsonb; dcq double precision := pg_temp.ec8_n(c->'dcq'); maxd double precision; tol double precision;
  pnq double precision; gap double precision; exc double precision; sfq double precision; fm double precision; sm double precision;
  adj double precision; buyer double precision := 0.0; seller double precision := 0.0;
begin
  maxd := case when c ? 'maxDcqPct' then dcq * pg_temp.ec8_n(c->'maxDcqPct') / 100.0 else null end;
  tol := coalesce(pg_temp.ec8_n(c->'deliveryTolerance'), 0.0);
  for d in select * from jsonb_array_elements(c->'days') loop
    fm := coalesce(pg_temp.ec8_n(d->'forceMajeure'), 0.0);
    sm := coalesce(pg_temp.ec8_n(d->'maintenance'), 0.0);
    pnq := pg_temp.ec8_n(d->'nominated');
    if maxd is not null and pnq > maxd then pnq := maxd; end if;
    gap := pnq - tol - pg_temp.ec8_n(d->'available');
    sfq := 0.0;
    if gap > 0 and coalesce((d->>'buyerCaused')::boolean, false) = false then
      exc := least(gap, fm + sm);
      sfq := gap - exc;
    end if;
    adj := dcq - fm - sm - sfq;
    buyer := buyer + greatest(0.0, adj - pg_temp.ec8_n(d->'taken'));
    seller := seller + sfq;
  end loop;
  return jsonb_build_object('buyerShortfall', buyer, 'sellerShortfall', seller);
end
$f$;

-- The take-or-pay ledger over consecutive contract years. Returns an array of
-- rows (year, deficiencyPayment, makeUpTaken, makeUpExpired, carryForwardApplied,
-- refund, netToSeller) and the total net to the seller.
create or replace function pg_temp.ec8_top(k jsonb) returns jsonb
language plpgsql immutable as $f$
declare y jsonb; rows jsonb := '[]'::jsonb; top double precision := pg_temp.ec8_n(k->'topPct');
  period int := (k->'makeUp'->>'periodYears')::int; ord text := k->'makeUp'->>'order'; eot text := k->'makeUp'->>'endOfTerm';
  cfon boolean := k ? 'carryForward'; cfp int; cfbase text; cfcap double precision;
  mu_from int[] := '{}'; mu_last int[] := '{}'; mu_left double precision[] := '{}';
  cf_from int[] := '{}'; cf_last int[] := '{}'; cf_left double precision[] := '{}';
  last_year int; yr int; adj double precision; topq double precision; taken double precision; avail double precision;
  thr double precision; want double precision; left_ double precision; q double precision; i int;
  counted double precision; defi double precision; cfavail double precision; cfapp double precision; paid double precision;
  payment double precision; surplus double precision; expired double precision; refund double precision; sfq double precision;
  net double precision; total double precision := 0.0; base double precision;
begin
  if cfon then
    cfp := (k->'carryForward'->>'periodYears')::int; cfbase := k->'carryForward'->>'base'; cfcap := pg_temp.ec8_n(k->'carryForward'->'capPct');
  end if;
  select max((e->>'year')::int) into last_year from jsonb_array_elements(k->'years') e;
  for y in select * from jsonb_array_elements(k->'years') loop
    yr := (y->>'year')::int;
    sfq := coalesce(pg_temp.ec8_n(y->'sellerShortfall'), 0.0);
    adj := pg_temp.ec8_n(y->'acq') - coalesce(pg_temp.ec8_n(y->'maintenance'), 0.0) - coalesce(pg_temp.ec8_n(y->'forceMajeure'), 0.0)
           - sfq - pg_temp.ec8_n(y->'permittedReduction');
    topq := top * adj / 100.0;
    taken := pg_temp.ec8_n(y->'taken');
    avail := 0.0;
    for i in 1 .. coalesce(array_length(mu_left, 1), 0) loop avail := avail + mu_left[i]; end loop;
    thr := case ord when 'after-adjusted-acq' then adj when 'after-top-quantity' then topq else 0.0 end;
    want := least(avail, greatest(0.0, taken - thr));
    left_ := want;
    for i in 1 .. coalesce(array_length(mu_left, 1), 0) loop
      exit when left_ <= 0;
      continue when mu_left[i] <= 0;
      q := least(mu_left[i], left_);
      mu_left[i] := mu_left[i] - q;
      left_ := left_ - q;
    end loop;
    counted := taken - want;
    defi := greatest(0.0, topq - counted);
    cfapp := 0.0;
    if cfon and defi > 0 then
      cfavail := 0.0;
      for i in 1 .. coalesce(array_length(cf_left, 1), 0) loop cfavail := cfavail + cf_left[i]; end loop;
      if cfavail > 0 then
        cfapp := least(cfavail, cfcap * defi / 100.0);
        left_ := cfapp;
        for i in 1 .. coalesce(array_length(cf_left, 1), 0) loop
          exit when left_ <= 0;
          continue when cf_left[i] <= 0;
          q := least(cf_left[i], left_);
          cf_left[i] := cf_left[i] - q;
          left_ := left_ - q;
        end loop;
      end if;
    end if;
    paid := defi - cfapp;
    payment := paid * pg_temp.ec8_n(y->'topPrice');
    if paid > 0 and period > 0 and yr <> last_year then
      mu_from := mu_from || yr; mu_last := mu_last || (yr + period); mu_left := mu_left || paid;
    end if;
    if cfon then
      base := case when cfbase = 'adjusted-acq' then adj else topq end;
      surplus := greatest(0.0, counted - base);
      if surplus > 0 then
        cf_from := cf_from || yr; cf_last := cf_last || (yr + cfp); cf_left := cf_left || surplus;
      end if;
    end if;
    expired := 0.0;
    for i in 1 .. coalesce(array_length(mu_left, 1), 0) loop
      if mu_last[i] = yr and mu_left[i] > 0 then expired := expired + mu_left[i]; mu_left[i] := 0.0; end if;
    end loop;
    for i in 1 .. coalesce(array_length(cf_left, 1), 0) loop
      if cf_last[i] = yr and cf_left[i] > 0 then cf_left[i] := 0.0; end if;
    end loop;
    refund := 0.0;
    if yr = last_year then
      q := 0.0;
      for i in 1 .. coalesce(array_length(mu_left, 1), 0) loop q := q + mu_left[i]; end loop;
      if eot = 'refund' then refund := q * pg_temp.ec8_n(y->'topPrice'); end if;
    end if;
    net := counted * pg_temp.ec8_n(y->'contractPrice') + want * pg_temp.ec8_n(y->'makeUpPrice') + payment
           - (case when sfq > 0 then sfq * pg_temp.ec8_n(y->'shortfallPrice') else 0.0 end) - refund;
    total := total + net;
    rows := rows || jsonb_build_object('year', yr, 'deficiencyPayment', payment, 'makeUpTaken', want, 'makeUpExpired', expired,
      'carryForwardApplied', cfapp, 'refund', refund, 'netToSeller', net, 'taken', taken, 'contractPrice', pg_temp.ec8_n(y->'contractPrice'));
  end loop;
  return jsonb_build_object('years', rows, 'netToSeller', total);
end
$f$;

-- One ledger row's figure.
create or replace function pg_temp.ec8_row(l jsonb, yr int, line text) returns double precision
language sql immutable as $f$
  select pg_temp.ec8_n(r->line) from jsonb_array_elements(l->'years') r where (r->>'year')::int = yr
$f$;

-- Article 15.4: the price to five decimals without rounding, then rounded to
-- four, half up on the fifth; the double first normalised to twelve
-- significant digits, as the engine states.
create or replace function pg_temp.ec8_round4(x double precision) returns double precision
language plpgsql immutable as $f$
declare v numeric; mag int;
begin
  if x = 0 then return 0.0; end if;
  mag := floor(log(abs(x::numeric)))::int + 1;
  v := round(x::numeric, 12 - mag);
  return round(trunc(v, 5), 4)::double precision;
end
$f$;

-- The monthly prices of an oil-indexed price series: rows (month index, price) and
-- annual rows (year, average price, last month's price).
create or replace function pg_temp.ec8_price(p jsonb) returns jsonb
language plpgsql immutable as $f$
declare f jsonb := p->'formula'; ser double precision[] := '{}'; first_idx int; m jsonb; i int;
  t0 int; t1 int; t int; bstart int; cur_block int := -1; avgm int; lag int; reset int; wend int; wstart int; s double precision;
  x double precision; raw double precision; price double precision; slope double precision; cst double precision;
  lk double precision; hk double precision; ls double precision; hs double precision; months jsonb := '[]'::jsonb;
  ann jsonb := '[]'::jsonb; yr int; ysum double precision; yn int; ylast double precision; cur_year int := null;
begin
  avgm := coalesce((p->>'averagingMonths')::int, 1); lag := coalesce((p->>'lagMonths')::int, 0); reset := coalesce((p->>'resetMonths')::int, 1);
  first_idx := split_part(p->'months'->0->>'month', '-', 1)::int * 12 + split_part(p->'months'->0->>'month', '-', 2)::int - 1;
  for m in select * from jsonb_array_elements(p->'months') loop ser := ser || pg_temp.ec8_n(m->'values'->(f->>'index')); end loop;
  t0 := split_part(p->>'from', '-', 1)::int * 12 + split_part(p->>'from', '-', 2)::int - 1;
  t1 := split_part(p->>'to', '-', 1)::int * 12 + split_part(p->>'to', '-', 2)::int - 1;
  slope := pg_temp.ec8_n(f->'slope'); cst := pg_temp.ec8_n(f->'constant');
  for t in t0 .. t1 loop
    bstart := t0 + div(t - t0, reset) * reset;
    if bstart <> cur_block then
      cur_block := bstart;
      wend := bstart - lag; wstart := wend - avgm + 1;
      s := 0.0;
      for i in wstart .. wend loop s := s + ser[i - first_idx + 1]; end loop;
      x := s / avgm::double precision;
      if f ? 'sCurve' then
        lk := pg_temp.ec8_n(f->'sCurve'->'lowKink'); hk := pg_temp.ec8_n(f->'sCurve'->'highKink');
        ls := pg_temp.ec8_n(f->'sCurve'->'lowSlope'); hs := pg_temp.ec8_n(f->'sCurve'->'highSlope');
        if x < lk then raw := cst + slope * lk + ls * (x - lk);
        elsif x > hk then raw := cst + slope * hk + hs * (x - hk);
        else raw := cst + slope * x; end if;
      else
        raw := cst + slope * x;
      end if;
      price := raw;
      if f ? 'floor' and raw < pg_temp.ec8_n(f->'floor') then price := pg_temp.ec8_n(f->'floor');
      elsif f ? 'ceiling' and raw > pg_temp.ec8_n(f->'ceiling') then price := pg_temp.ec8_n(f->'ceiling'); end if;
      if coalesce(p->>'rounding', 'none') = 'model-gsa-4dp' then price := pg_temp.ec8_round4(price); end if;
    end if;
    months := months || jsonb_build_object('idx', t, 'price', price);
    yr := div(t, 12);
    if cur_year is distinct from yr then
      if cur_year is not null then
        ann := ann || jsonb_build_object('year', cur_year, 'averagePrice', ysum / yn::double precision, 'lastMonthPrice', ylast);
      end if;
      cur_year := yr; ysum := 0.0; yn := 0;
    end if;
    ysum := ysum + price; yn := yn + 1; ylast := price;
  end loop;
  ann := ann || jsonb_build_object('year', cur_year, 'averagePrice', ysum / yn::double precision, 'lastMonthPrice', ylast);
  return jsonb_build_object('months', months, 'annual', ann);
end
$f$;

-- A month's price by 'YYYY-MM', and a year's annual figure.
create or replace function pg_temp.ec8_month(ps jsonb, ym text) returns double precision
language sql immutable as $f$
  select pg_temp.ec8_n(r->'price') from jsonb_array_elements(ps->'months') r
   where (r->>'idx')::int = split_part(ym, '-', 1)::int * 12 + split_part(ym, '-', 2)::int - 1
$f$;
create or replace function pg_temp.ec8_annual(ps jsonb, yr int, line text) returns double precision
language sql immutable as $f$
  select pg_temp.ec8_n(r->line) from jsonb_array_elements(ps->'annual') r where (r->>'year')::int = yr
$f$;

-- The priced contract: each year's contract and take-or-pay price copied from the
-- annual rows by the stated basis, and the stated make-up price.
create or replace function pg_temp.ec8_priced(c jsonb) returns jsonb
language plpgsql immutable as $f$
declare ps jsonb := pg_temp.ec8_price(c->'price'); y jsonb; years jsonb := '[]'::jsonb; cb text; tb text;
begin
  cb := case c->'pricing'->>'contractPrice' when 'annual-average' then 'averagePrice' else 'lastMonthPrice' end;
  tb := case c->'pricing'->>'topPrice' when 'annual-average' then 'averagePrice' else 'lastMonthPrice' end;
  for y in select * from jsonb_array_elements(c->'contract'->'years') loop
    years := years || (y || jsonb_build_object(
      'contractPrice', pg_temp.ec8_annual(ps, (y->>'year')::int, cb),
      'topPrice', pg_temp.ec8_annual(ps, (y->>'year')::int, tb),
      'makeUpPrice', c->'pricing'->'makeUpPrice'));
  end loop;
  return jsonb_set(c->'contract', '{years}', years);
end
$f$;

-- The Domestic Gas Delivery Obligation penalty: undelivered less the s.110(10)
-- excuses in the order (a) to (d), each up to what is left, at US$3.50 per MMBtu
-- or a signed agreement's rate, never below it.
create or replace function pg_temp.ec8_dgdo(g jsonb) returns double precision
language plpgsql immutable as $f$
declare und double precision; left_ double precision; k text; q double precision; rate double precision := 3.5;
begin
  if coalesce(pg_temp.ec8_n(g->'voluntaryContracts'), 0.0) >= pg_temp.ec8_n(g->'obligation') then return 0.0; end if;
  und := greatest(0.0, pg_temp.ec8_n(g->'obligation') - pg_temp.ec8_n(g->'delivered'));
  left_ := und;
  foreach k in array array['forceMajeure', 'purchaserCannotAccept', 'transportUnavailable', 'purchaserNonPayment'] loop
    q := coalesce(pg_temp.ec8_n(g->'excused'->k), 0.0);
    if q > 0 then left_ := left_ - least(q, left_); end if;
  end loop;
  if g ? 'agreementPenaltyRate' then rate := greatest(pg_temp.ec8_n(g->'agreementPenaltyRate'), 3.5); end if;
  return left_ * rate;
end
$f$;

-- The gas royalty of one year: 5 percent, 2.5 percent on gas utilised in-country,
-- on the value of gas delivered (taken x contract price).
create or replace function pg_temp.ec8_royalty(l jsonb, share double precision, yr int) returns double precision
language sql immutable as $f$
  select (0.05 * (1.0 - share / 100.0) + 0.025 * (share / 100.0)) * pg_temp.ec8_row(l, yr, 'taken') * pg_temp.ec8_row(l, yr, 'contractPrice')
$f$;

-- Year-end NPV of the net to the seller, discounted to the base year.
create or replace function pg_temp.ec8_npv(l jsonb, r double precision, base int) returns double precision
language sql immutable as $f$
  select sum(pg_temp.ec8_n(x->'netToSeller') / power(1.0 + r, ((x->>'year')::int - base)::double precision))
    from jsonb_array_elements(l->'years') x
$f$;
