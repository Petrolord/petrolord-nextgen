-- ============================================================================
-- EC8 GO-LIVE (HELD): Gas Commercialisation & Gas Sales Agreements flips to
-- 'available' in the Economics & Commercial module, at path_order 73.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/gsa. The 78 lessons, the teaching lab (gsaLab.js), its
-- three calculator panels (quantity, ledger and contract) and the three
-- capstone case files ship in the ZIP and NOT in this database, so a flip
-- before the upload puts a live catalogue tile in front of a route that does
-- not exist. AN ENGINE COURSE: there is no Suite app and no Suite upload to
-- wait for. This file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values gsa_capstone.mjs returned through
--      the vendored engines/economics/gasContract.js (petrolord-engines
--      7f5d462) when this file was generated, to the last bit;
--   2. by a SECOND ROUTE IN SQL: the clause arithmetic rebuilt in plpgsql over
--      the case files the learner is handed; each to 1e-9 relative;
--   3. by the ORACLE: oracle_check.py's run of the vendored stdlib Python
--      oracle (tools/validation/economics/oracle_gascontract.py), written in by
--      value, each seeded value within its tolerance of the oracle's;
--   4. by the TRAPS the course is built on: every wrong method
--      discriminate.mjs swept through the engine for a field, written in by
--      value, must miss the seeded value by more than the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
--
-- NO BEGIN OR COMMIT. Like every course migration in this repository, the
-- file carries no transaction lines of its own; apply_ec8_gsa.sh wraps it in
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

do $$
#variable_conflict use_column
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_s double precision; v_wrong double precision;
  v_led_b jsonb; v_led_i jsonb; v_led_a jsonb; v_ps_i jsonb; v_ps_a jsonb;
  v_g_ozubu_march_2028_mmbtu double precision;
  v_g_ozubu_2028_acq double precision;
  v_g_ozubu_effective_swing double precision;
  v_g_ozubu_fortnight_buyer_shortfall double precision;
  v_g_ozubu_fortnight_seller_shortfall double precision;
  v_g_ozubu_2029_deficiency_payment double precision;
  v_g_ifeyi_2030_average_price double precision;
  v_g_ifeyi_2028_deficiency_payment double precision;
  v_g_ifeyi_2031_make_up_taken double precision;
  v_g_ifeyi_2031_make_up_expired double precision;
  v_g_ifeyi_total_net_to_seller double precision;
  v_g_ifeyi_2031_dgdo_penalty double precision;
  v_g_nwaka_july_2029_price double precision;
  v_g_nwaka_2034_average_price double precision;
  v_g_nwaka_2030_carry_forward_credit double precision;
  v_g_nwaka_2035_refund double precision;
  v_g_nwaka_npv_seller_revenue double precision;
  v_g_nwaka_2032_royalty double precision;
  v_case_b jsonb := '{"name":"OZUBU","label":"OZUBU, Ekene gas to the Ozubu Tile Works (synthetic), an industrial buyer","energy":{"quantity":16.85,"quantityUnit":"MMSm3","heatingValue":38.62,"heatingValueUnit":"MJ/Sm3","heatingValueBasis":"gross","referenceConditions":"15 C and 101.325 kPa, dry (the Ozubu metering statement, synthetic)"},"quantities":{"dcq":22437.25,"period":{"start":"2028-01-01","end":"2029-01-01"},"maxDcqPct":115,"topPct":85},"fortnight":{"dcq":22437.25,"maxDcqPct":115,"deliveryTolerance":150.5,"days":[{"date":"2029-02-01","nominated":22180.5,"available":22180.5,"taken":22103.75},{"date":"2029-02-02","nominated":24310.5,"available":24310.5,"taken":24310.5},{"date":"2029-02-03","nominated":26980.75,"available":24115.25,"taken":24115.25},{"date":"2029-02-04","nominated":20560.25,"available":20560.25,"taken":20488.25},{"date":"2029-02-05","nominated":0,"available":0,"taken":0},{"date":"2029-02-06","nominated":22437.25,"available":19862.5,"taken":19862.5,"maintenance":1500.25},{"date":"2029-02-07","nominated":22900.75,"available":21340.25,"taken":21340.25},{"date":"2029-02-08","nominated":22050.75,"available":22050.75,"taken":21980.5},{"date":"2029-02-09","nominated":22437.25,"available":12410.75,"taken":12410.75,"forceMajeure":8200.5},{"date":"2029-02-10","nominated":23150.25,"available":18460.5,"taken":18460.5,"buyerCaused":true},{"date":"2029-02-11","nominated":22437.25,"available":22437.25,"taken":22437.25},{"date":"2029-02-12","nominated":22437.25,"available":22320.25,"taken":22320.25},{"date":"2029-02-13","nominated":24990.25,"available":24990.25,"taken":24876.75},{"date":"2029-02-14","nominated":22300.5,"available":22300.5,"taken":22211.375}]},"year":{"topPct":85,"makeUp":{"periodYears":3,"order":"after-adjusted-acq","endOfTerm":"forfeit"},"years":[{"year":2029,"acq":8189596.25,"maintenance":44873.5,"forceMajeure":67311.75,"sellerShortfall":12650.25,"permittedReduction":22437.25,"taken":6180450.5,"contractPrice":3.8625,"topPrice":3.4763,"makeUpPrice":0,"shortfallPrice":1.35}]}}'::jsonb;
  v_case_i jsonb := '{"name":"IFEYI","label":"IFEYI, Ekene gas to the Ifeyi Glass Cluster (synthetic), 2028 to 2033","price":{"months":[{"month":"2027-09","values":{"oil":71.4}},{"month":"2027-10","values":{"oil":73.15}},{"month":"2027-11","values":{"oil":69.8}},{"month":"2027-12","values":{"oil":66.25}},{"month":"2028-01","values":{"oil":64.9}},{"month":"2028-02","values":{"oil":62.35}},{"month":"2028-03","values":{"oil":65.7}},{"month":"2028-04","values":{"oil":68.45}},{"month":"2028-05","values":{"oil":70.1}},{"month":"2028-06","values":{"oil":72.6}},{"month":"2028-07","values":{"oil":74.95}},{"month":"2028-08","values":{"oil":77.3}},{"month":"2028-09","values":{"oil":75.8}},{"month":"2028-10","values":{"oil":73.25}},{"month":"2028-11","values":{"oil":71.9}},{"month":"2028-12","values":{"oil":70.4}},{"month":"2029-01","values":{"oil":68.15}},{"month":"2029-02","values":{"oil":66.7}},{"month":"2029-03","values":{"oil":63.95}},{"month":"2029-04","values":{"oil":61.2}},{"month":"2029-05","values":{"oil":60.45}},{"month":"2029-06","values":{"oil":62.8}},{"month":"2029-07","values":{"oil":65.35}},{"month":"2029-08","values":{"oil":67.9}},{"month":"2029-09","values":{"oil":69.25}},{"month":"2029-10","values":{"oil":71.6}},{"month":"2029-11","values":{"oil":73.05}},{"month":"2029-12","values":{"oil":74.4}},{"month":"2030-01","values":{"oil":76.85}},{"month":"2030-02","values":{"oil":78.2}},{"month":"2030-03","values":{"oil":80.65}},{"month":"2030-04","values":{"oil":82.1}},{"month":"2030-05","values":{"oil":79.55}},{"month":"2030-06","values":{"oil":77.9}},{"month":"2030-07","values":{"oil":75.35}},{"month":"2030-08","values":{"oil":73.8}},{"month":"2030-09","values":{"oil":72.15}},{"month":"2030-10","values":{"oil":70.6}},{"month":"2030-11","values":{"oil":68.95}},{"month":"2030-12","values":{"oil":67.3}},{"month":"2031-01","values":{"oil":65.75}},{"month":"2031-02","values":{"oil":64.2}},{"month":"2031-03","values":{"oil":66.55}},{"month":"2031-04","values":{"oil":68.9}},{"month":"2031-05","values":{"oil":71.25}},{"month":"2031-06","values":{"oil":73.7}},{"month":"2031-07","values":{"oil":75.05}},{"month":"2031-08","values":{"oil":76.4}},{"month":"2031-09","values":{"oil":78.85}},{"month":"2031-10","values":{"oil":80.3}},{"month":"2031-11","values":{"oil":81.65}},{"month":"2031-12","values":{"oil":83.1}},{"month":"2032-01","values":{"oil":84.45}},{"month":"2032-02","values":{"oil":82.9}},{"month":"2032-03","values":{"oil":80.35}},{"month":"2032-04","values":{"oil":78.7}},{"month":"2032-05","values":{"oil":76.15}},{"month":"2032-06","values":{"oil":74.6}},{"month":"2032-07","values":{"oil":73.05}},{"month":"2032-08","values":{"oil":71.5}},{"month":"2032-09","values":{"oil":69.95}},{"month":"2032-10","values":{"oil":68.4}},{"month":"2032-11","values":{"oil":66.85}},{"month":"2032-12","values":{"oil":65.3}},{"month":"2033-01","values":{"oil":63.75}},{"month":"2033-02","values":{"oil":62.2}},{"month":"2033-03","values":{"oil":60.65}},{"month":"2033-04","values":{"oil":62.1}},{"month":"2033-05","values":{"oil":64.55}},{"month":"2033-06","values":{"oil":66.9}},{"month":"2033-07","values":{"oil":69.35}},{"month":"2033-08","values":{"oil":71.8}},{"month":"2033-09","values":{"oil":74.25}},{"month":"2033-10","values":{"oil":76.7}},{"month":"2033-11","values":{"oil":78.15}},{"month":"2033-12","values":{"oil":79.6}}],"formula":{"type":"oil-indexed","index":"oil","slope":0.0915,"constant":0.62,"floor":4.25,"ceiling":11.5},"from":"2028-01","to":"2033-12","averagingMonths":3,"lagMonths":1,"resetMonths":3,"rounding":"model-gsa-4dp"},"pricing":{"contractPrice":"annual-average","topPrice":"annual-average","makeUpPrice":0.35},"contract":{"topPct":82.5,"makeUp":{"periodYears":3,"order":"after-adjusted-acq","endOfTerm":"forfeit"},"years":[{"year":2028,"acq":11437500,"forceMajeure":468750,"maintenance":93750,"permittedReduction":0,"taken":7812500.5},{"year":2029,"acq":11406250,"maintenance":93750,"permittedReduction":0,"taken":11562500.25},{"year":2030,"acq":11406250,"maintenance":62500,"sellerShortfall":125000.5,"shortfallPrice":1.15,"permittedReduction":0,"taken":8750000.75},{"year":2031,"acq":11406250,"maintenance":93750,"permittedReduction":0,"taken":11968750.5},{"year":2032,"acq":11437500,"maintenance":93750,"sellerShortfall":218750.25,"shortfallPrice":1.15,"permittedReduction":0,"taken":11187500},{"year":2033,"acq":11406250,"maintenance":93750,"permittedReduction":0,"taken":11250000.75}]},"dgdo":{"obligation":8760400.4,"delivered":7915260.2,"voluntaryContracts":6250000,"excused":{"forceMajeure":120500.3,"transportUnavailable":95000.25},"agreementPenaltyRate":3.2}}'::jsonb;
  v_case_a jsonb := '{"name":"NWAKA","label":"NWAKA, Ekene gas to the Nwaka Methanol Plant (synthetic), 2029 to 2035","price":{"months":[{"month":"2028-01","values":{"oil":56.2}},{"month":"2028-02","values":{"oil":54.85}},{"month":"2028-03","values":{"oil":53.4}},{"month":"2028-04","values":{"oil":52.95}},{"month":"2028-05","values":{"oil":51.5}},{"month":"2028-06","values":{"oil":50.05}},{"month":"2028-07","values":{"oil":49.6}},{"month":"2028-08","values":{"oil":50.15}},{"month":"2028-09","values":{"oil":51.7}},{"month":"2028-10","values":{"oil":52.25}},{"month":"2028-11","values":{"oil":53.8}},{"month":"2028-12","values":{"oil":54.35}},{"month":"2029-01","values":{"oil":55.9}},{"month":"2029-02","values":{"oil":56.45}},{"month":"2029-03","values":{"oil":57}},{"month":"2029-04","values":{"oil":55.55}},{"month":"2029-05","values":{"oil":54.1}},{"month":"2029-06","values":{"oil":52.65}},{"month":"2029-07","values":{"oil":53.2}},{"month":"2029-08","values":{"oil":54.75}},{"month":"2029-09","values":{"oil":56.3}},{"month":"2029-10","values":{"oil":57.85}},{"month":"2029-11","values":{"oil":59.4}},{"month":"2029-12","values":{"oil":60.95}},{"month":"2030-01","values":{"oil":62.5}},{"month":"2030-02","values":{"oil":64.05}},{"month":"2030-03","values":{"oil":65.6}},{"month":"2030-04","values":{"oil":67.15}},{"month":"2030-05","values":{"oil":68.7}},{"month":"2030-06","values":{"oil":70.25}},{"month":"2030-07","values":{"oil":71.8}},{"month":"2030-08","values":{"oil":73.35}},{"month":"2030-09","values":{"oil":74.9}},{"month":"2030-10","values":{"oil":76.45}},{"month":"2030-11","values":{"oil":78}},{"month":"2030-12","values":{"oil":79.55}},{"month":"2031-01","values":{"oil":78.1}},{"month":"2031-02","values":{"oil":76.65}},{"month":"2031-03","values":{"oil":75.2}},{"month":"2031-04","values":{"oil":73.75}},{"month":"2031-05","values":{"oil":72.3}},{"month":"2031-06","values":{"oil":70.85}},{"month":"2031-07","values":{"oil":71.4}},{"month":"2031-08","values":{"oil":72.95}},{"month":"2031-09","values":{"oil":74.5}},{"month":"2031-10","values":{"oil":76.05}},{"month":"2031-11","values":{"oil":77.6}},{"month":"2031-12","values":{"oil":79.15}},{"month":"2032-01","values":{"oil":80.7}},{"month":"2032-02","values":{"oil":82.25}},{"month":"2032-03","values":{"oil":83.8}},{"month":"2032-04","values":{"oil":85.35}},{"month":"2032-05","values":{"oil":86.9}},{"month":"2032-06","values":{"oil":88.45}},{"month":"2032-07","values":{"oil":87}},{"month":"2032-08","values":{"oil":85.55}},{"month":"2032-09","values":{"oil":84.1}},{"month":"2032-10","values":{"oil":82.65}},{"month":"2032-11","values":{"oil":83.2}},{"month":"2032-12","values":{"oil":84.75}},{"month":"2033-01","values":{"oil":86.3}},{"month":"2033-02","values":{"oil":87.85}},{"month":"2033-03","values":{"oil":89.4}},{"month":"2033-04","values":{"oil":90.95}},{"month":"2033-05","values":{"oil":92.5}},{"month":"2033-06","values":{"oil":94.05}},{"month":"2033-07","values":{"oil":95.6}},{"month":"2033-08","values":{"oil":97.15}},{"month":"2033-09","values":{"oil":98.7}},{"month":"2033-10","values":{"oil":97.25}},{"month":"2033-11","values":{"oil":95.8}},{"month":"2033-12","values":{"oil":94.35}},{"month":"2034-01","values":{"oil":92.9}},{"month":"2034-02","values":{"oil":91.45}},{"month":"2034-03","values":{"oil":92}},{"month":"2034-04","values":{"oil":93.55}},{"month":"2034-05","values":{"oil":95.1}},{"month":"2034-06","values":{"oil":96.65}},{"month":"2034-07","values":{"oil":98.2}},{"month":"2034-08","values":{"oil":99.75}},{"month":"2034-09","values":{"oil":98.3}},{"month":"2034-10","values":{"oil":96.85}},{"month":"2034-11","values":{"oil":95.4}},{"month":"2034-12","values":{"oil":93.95}},{"month":"2035-01","values":{"oil":92.5}},{"month":"2035-02","values":{"oil":91.05}},{"month":"2035-03","values":{"oil":89.6}},{"month":"2035-04","values":{"oil":88.15}},{"month":"2035-05","values":{"oil":86.7}},{"month":"2035-06","values":{"oil":85.25}},{"month":"2035-07","values":{"oil":83.8}},{"month":"2035-08","values":{"oil":82.35}},{"month":"2035-09","values":{"oil":80.9}},{"month":"2035-10","values":{"oil":79.45}},{"month":"2035-11","values":{"oil":78}},{"month":"2035-12","values":{"oil":76.55}}],"formula":{"type":"oil-indexed","index":"oil","slope":0.118,"constant":0.45,"sCurve":{"lowKink":58,"highKink":88,"lowSlope":0.059,"highSlope":0.0472}},"from":"2029-01","to":"2035-12","averagingMonths":6,"lagMonths":2,"resetMonths":3,"rounding":"model-gsa-4dp","reopeners":["2032-01"]},"pricing":{"contractPrice":"annual-average","topPrice":"last-month","makeUpPrice":0.4},"contract":{"topPct":88,"makeUp":{"periodYears":3,"order":"after-top-quantity","endOfTerm":"refund"},"carryForward":{"periodYears":2,"base":"top-quantity","capPct":40},"years":[{"year":2029,"acq":8979000,"maintenance":49200,"permittedReduction":0,"taken":8710250.5},{"year":2030,"acq":8979000,"maintenance":73800,"forceMajeure":98400,"permittedReduction":0,"taken":6550400.25},{"year":2031,"acq":8979000,"maintenance":49200,"permittedReduction":0,"taken":8008910.75},{"year":2032,"acq":9003600,"maintenance":49200,"permittedReduction":0,"taken":8091320.5},{"year":2033,"acq":8979000,"maintenance":49200,"permittedReduction":0,"taken":7956780.25},{"year":2034,"acq":8979000,"maintenance":49200,"sellerShortfall":61500.5,"shortfallPrice":1.4,"permittedReduction":0,"taken":7238650.75},{"year":2035,"acq":8979000,"maintenance":49200,"permittedReduction":0,"taken":8102450.5}]},"royalty":{"terrain":"onshore","inCountrySharePct":100},"discountRate":0.1,"baseYear":2028}'::jsonb;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'gsa' and active;
  if v_structures <> 3 then
    raise exception 'EC8 go-live refused: gsa has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'gsa';
  if v_questions <> 396 then
    raise exception 'EC8 go-live refused: gsa has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'gsa' group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'EC8 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;
  select count(*) into v_n from (select tier, module_key from public.academy_quiz_questions where app_slug = 'gsa' and scope = 'module' group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'EC8 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'gsa' and scope = 'final' group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'EC8 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = 'gsa'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'EC8 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;
  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'gsa' and s.active;
  if v_lessons <> 78 then
    raise exception 'EC8 go-live refused: gsa carries % lesson keys, expected 78', v_lessons;
  end if;
  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'gsa' and s.active;
  if v_modules <> 18 then
    raise exception 'EC8 go-live refused: gsa carries % modules, expected 18 (six per tier)', v_modules;
  end if;
  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'gsa' and qq.scope = 'module' and not exists (
       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'EC8 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'gsa';
  if v_capstones <> 3 then
    raise exception 'EC8 go-live refused: gsa has % capstones, expected 3', v_capstones;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'gsa';
  if v_graded <> 18 then
    raise exception 'EC8 go-live refused: gsa has % graded capstone fields, expected 18', v_graded;
  end if;
  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'gsa' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'EC8 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'gsa' and module = 'economics' and path_order = 73 and prereq_slug is null) then
    raise exception 'EC8 go-live refused: the gsa catalogue row is not economics at path_order 73 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 73 and slug <> 'gsa') then
    raise exception 'EC8 go-live refused: another course already holds path_order 73';
  end if;

  -- ------------------------------------------------- the grader is numeric
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or abs((f->>'expected')::numeric) <= 0.001
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric is distinct from (select t.tol from (values ('beginner', 'ozubu_march_2028_mmbtu', 5e-07::numeric), ('beginner', 'ozubu_2028_acq', 5e-07::numeric), ('beginner', 'ozubu_effective_swing', 5e-07::numeric), ('beginner', 'ozubu_fortnight_buyer_shortfall', 5e-07::numeric), ('beginner', 'ozubu_fortnight_seller_shortfall', 5e-07::numeric), ('beginner', 'ozubu_2029_deficiency_payment', 5e-07::numeric), ('intermediate', 'ifeyi_2030_average_price', 5e-07::numeric), ('intermediate', 'ifeyi_2028_deficiency_payment', 5e-07::numeric), ('intermediate', 'ifeyi_2031_make_up_taken', 5e-07::numeric), ('intermediate', 'ifeyi_2031_make_up_expired', 5e-07::numeric), ('intermediate', 'ifeyi_total_net_to_seller', 5e-07::numeric), ('intermediate', 'ifeyi_2031_dgdo_penalty', 5e-07::numeric), ('advanced', 'nwaka_july_2029_price', 5e-07::numeric), ('advanced', 'nwaka_2034_average_price', 5e-07::numeric), ('advanced', 'nwaka_2030_carry_forward_credit', 5e-07::numeric), ('advanced', 'nwaka_2035_refund', 5e-07::numeric), ('advanced', 'nwaka_npv_seller_revenue', 5e-07::numeric), ('advanced', 'nwaka_2032_royalty', 5e-07::numeric)) t(tier, k, tol) where t.tier = c.tier and t.k = f->>'key')
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'EC8 go-live refused: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;
  end if;
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or ((f->>'tol')::numeric = 0.0000005
              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));
  if v_n <> 0 then
    raise exception 'EC8 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or, at the six-decimal floor, pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;

  -- ---------------------------------------- the prompts the learner reads
  select prompt into v_prompt from public.academy_capstones where app_slug = 'gsa' and tier = 'beginner';
  if v_prompt is null or md5(v_prompt) <> '5256cd5fabfb0ea78b479e2effcba6f5' then
    raise exception 'EC8 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'gsa' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'OZUBU, Ekene gas to the Ozubu Tile Works (synthetic)' and title = 'Quantities and one contract year') then
    raise exception 'EC8 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['22437.25 MMBtu per day', 'MaxDCQ is 115 percent', 'take-or-pay 85 percent', 'delivery tolerance of 150.5 MMBtu', 'after-adjusted-acq', 'permitted reduction', 'priceControlApplies', 'ozubu_case.json']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC8 go-live refused: % stated setting(s) or case file(s) are not named in the shipped beginner prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'gsa' and tier = 'intermediate';
  if v_prompt is null or md5(v_prompt) <> '79b1eb303e1965aa8c393eba264880cc' then
    raise exception 'EC8 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'gsa' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'IFEYI, Ekene gas to the Ifeyi Glass Cluster (synthetic), 2028 to 2033' and title = 'The ledger, the price and the Nigerian rules') then
    raise exception 'EC8 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['Take-or-pay 82.5 percent', 'after-adjusted-acq', '(forfeit)', 'annual-average', 'annual-average', 'model-gsa-4dp', '0.62 + 0.0915 x', 'permitted reduction', 'priceControlApplies', 'ifeyi_case.json']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC8 go-live refused: % stated setting(s) or case file(s) are not named in the shipped intermediate prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'gsa' and tier = 'advanced';
  if v_prompt is null or md5(v_prompt) <> '12962566b4bca5016e756ba44f63e4f8' then
    raise exception 'EC8 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'gsa' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'NWAKA, Ekene gas to the Nwaka Methanol Plant (synthetic), 2029 to 2035' and title = 'Parity, the whole contract and reading the engine') then
    raise exception 'EC8 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['Take-or-pay 88 percent', 'after-top-quantity', '(refund)', 'annual-average', 'last-month', 'model-gsa-4dp', '0.45 + 0.118 x', 'permitted reduction', 'priceControlApplies', 'nwaka_case.json', 'at most 40 percent', 'discount rate of 0.1 to 2028']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC8 go-live refused: % stated setting(s) or case file(s) are not named in the shipped advanced prompt: %', v_n, v_names;
  end if;
  -- No number handed in any capstone text of this course may sit within its
  -- tolerance of any graded value of any tier.
  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names
    from (select c.tier as ctier, m[1]::double precision as x
            from public.academy_capstones c,
                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||
                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),
                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m
           where c.app_slug = 'gsa') h,
         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'gsa') g
   where abs(abs(h.x) - abs(g.v)) <= g.t;
  if v_n <> 0 then
    raise exception 'EC8 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_ozubu_march_2028_mmbtu
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'beginner' and f->>'key' = 'ozubu_march_2028_mmbtu';
  if v_g_ozubu_march_2028_mmbtu is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: beginner/ozubu_march_2028_mmbtu]';
  end if;
  select (f->>'expected')::double precision into v_g_ozubu_2028_acq
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'beginner' and f->>'key' = 'ozubu_2028_acq';
  if v_g_ozubu_2028_acq is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: beginner/ozubu_2028_acq]';
  end if;
  select (f->>'expected')::double precision into v_g_ozubu_effective_swing
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'beginner' and f->>'key' = 'ozubu_effective_swing';
  if v_g_ozubu_effective_swing is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: beginner/ozubu_effective_swing]';
  end if;
  select (f->>'expected')::double precision into v_g_ozubu_fortnight_buyer_shortfall
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'beginner' and f->>'key' = 'ozubu_fortnight_buyer_shortfall';
  if v_g_ozubu_fortnight_buyer_shortfall is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: beginner/ozubu_fortnight_buyer_shortfall]';
  end if;
  select (f->>'expected')::double precision into v_g_ozubu_fortnight_seller_shortfall
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'beginner' and f->>'key' = 'ozubu_fortnight_seller_shortfall';
  if v_g_ozubu_fortnight_seller_shortfall is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: beginner/ozubu_fortnight_seller_shortfall]';
  end if;
  select (f->>'expected')::double precision into v_g_ozubu_2029_deficiency_payment
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'beginner' and f->>'key' = 'ozubu_2029_deficiency_payment';
  if v_g_ozubu_2029_deficiency_payment is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: beginner/ozubu_2029_deficiency_payment]';
  end if;
  select (f->>'expected')::double precision into v_g_ifeyi_2030_average_price
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'intermediate' and f->>'key' = 'ifeyi_2030_average_price';
  if v_g_ifeyi_2030_average_price is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: intermediate/ifeyi_2030_average_price]';
  end if;
  select (f->>'expected')::double precision into v_g_ifeyi_2028_deficiency_payment
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'intermediate' and f->>'key' = 'ifeyi_2028_deficiency_payment';
  if v_g_ifeyi_2028_deficiency_payment is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: intermediate/ifeyi_2028_deficiency_payment]';
  end if;
  select (f->>'expected')::double precision into v_g_ifeyi_2031_make_up_taken
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'intermediate' and f->>'key' = 'ifeyi_2031_make_up_taken';
  if v_g_ifeyi_2031_make_up_taken is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: intermediate/ifeyi_2031_make_up_taken]';
  end if;
  select (f->>'expected')::double precision into v_g_ifeyi_2031_make_up_expired
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'intermediate' and f->>'key' = 'ifeyi_2031_make_up_expired';
  if v_g_ifeyi_2031_make_up_expired is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: intermediate/ifeyi_2031_make_up_expired]';
  end if;
  select (f->>'expected')::double precision into v_g_ifeyi_total_net_to_seller
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'intermediate' and f->>'key' = 'ifeyi_total_net_to_seller';
  if v_g_ifeyi_total_net_to_seller is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: intermediate/ifeyi_total_net_to_seller]';
  end if;
  select (f->>'expected')::double precision into v_g_ifeyi_2031_dgdo_penalty
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'intermediate' and f->>'key' = 'ifeyi_2031_dgdo_penalty';
  if v_g_ifeyi_2031_dgdo_penalty is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: intermediate/ifeyi_2031_dgdo_penalty]';
  end if;
  select (f->>'expected')::double precision into v_g_nwaka_july_2029_price
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'advanced' and f->>'key' = 'nwaka_july_2029_price';
  if v_g_nwaka_july_2029_price is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: advanced/nwaka_july_2029_price]';
  end if;
  select (f->>'expected')::double precision into v_g_nwaka_2034_average_price
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'advanced' and f->>'key' = 'nwaka_2034_average_price';
  if v_g_nwaka_2034_average_price is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: advanced/nwaka_2034_average_price]';
  end if;
  select (f->>'expected')::double precision into v_g_nwaka_2030_carry_forward_credit
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'advanced' and f->>'key' = 'nwaka_2030_carry_forward_credit';
  if v_g_nwaka_2030_carry_forward_credit is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: advanced/nwaka_2030_carry_forward_credit]';
  end if;
  select (f->>'expected')::double precision into v_g_nwaka_2035_refund
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'advanced' and f->>'key' = 'nwaka_2035_refund';
  if v_g_nwaka_2035_refund is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: advanced/nwaka_2035_refund]';
  end if;
  select (f->>'expected')::double precision into v_g_nwaka_npv_seller_revenue
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'advanced' and f->>'key' = 'nwaka_npv_seller_revenue';
  if v_g_nwaka_npv_seller_revenue is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: advanced/nwaka_npv_seller_revenue]';
  end if;
  select (f->>'expected')::double precision into v_g_nwaka_2032_royalty
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'gsa' and c.tier = 'advanced' and f->>'key' = 'nwaka_2032_royalty';
  if v_g_nwaka_2032_royalty is null then
    raise exception 'EC8 go-live refused: the seeded rows carry no value [graded field: advanced/nwaka_2032_royalty]';
  end if;

  -- ------------------------------------------ 1. against the engine ledger
  if v_g_ozubu_march_2028_mmbtu <> 616789.1475925302::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 616789.1475925302 [graded field: beginner/ozubu_march_2028_mmbtu]', v_g_ozubu_march_2028_mmbtu;
  end if;
  if v_g_ozubu_2028_acq <> 8212033.5::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 8212033.5 [graded field: beginner/ozubu_2028_acq]', v_g_ozubu_2028_acq;
  end if;
  if v_g_ozubu_effective_swing <> 1.3529411764705883::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 1.3529411764705883 [graded field: beginner/ozubu_effective_swing]', v_g_ozubu_effective_swing;
  end if;
  if v_g_ozubu_fortnight_buyer_shortfall <> 29797.125::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 29797.125 [graded field: beginner/ozubu_fortnight_buyer_shortfall]', v_g_ozubu_fortnight_buyer_shortfall;
  end if;
  if v_g_ozubu_fortnight_seller_shortfall <> 5546.5875000000015::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 5546.5875000000015 [graded field: beginner/ozubu_fortnight_seller_shortfall]', v_g_ozubu_fortnight_seller_shortfall;
  end if;
  if v_g_ozubu_2029_deficiency_payment <> 2278799.7324424987::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 2278799.7324424987 [graded field: beginner/ozubu_2029_deficiency_payment]', v_g_ozubu_2029_deficiency_payment;
  end if;
  if v_g_ifeyi_2030_average_price <> 7.601474999999998::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 7.601474999999998 [graded field: intermediate/ifeyi_2030_average_price]', v_g_ifeyi_2030_average_price;
  end if;
  if v_g_ifeyi_2028_deficiency_payment <> 8156547.41985::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 8156547.41985 [graded field: intermediate/ifeyi_2028_deficiency_payment]', v_g_ifeyi_2028_deficiency_payment;
  end if;
  if v_g_ifeyi_2031_make_up_taken <> 656250.5::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 656250.5 [graded field: intermediate/ifeyi_2031_make_up_taken]', v_g_ifeyi_2031_make_up_taken;
  end if;
  if v_g_ifeyi_2031_make_up_expired <> 253123.75::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 253123.75 [graded field: intermediate/ifeyi_2031_make_up_expired]', v_g_ifeyi_2031_make_up_expired;
  end if;
  if v_g_ifeyi_total_net_to_seller <> 451290197.49541664::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 451290197.49541664 [graded field: intermediate/ifeyi_total_net_to_seller]', v_g_ifeyi_total_net_to_seller;
  end if;
  if v_g_ifeyi_2031_dgdo_penalty <> 2203738.7750000004::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 2203738.7750000004 [graded field: intermediate/ifeyi_2031_dgdo_penalty]', v_g_ifeyi_2031_dgdo_penalty;
  end if;
  if v_g_nwaka_july_2029_price <> 7.1499::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 7.1499 [graded field: advanced/nwaka_july_2029_price]', v_g_nwaka_july_2029_price;
  end if;
  if v_g_nwaka_2034_average_price <> 11.171475000000003::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 11.171475000000003 [graded field: advanced/nwaka_2034_average_price]', v_g_nwaka_2034_average_price;
  end if;
  if v_g_nwaka_2030_carry_forward_credit <> 479833.5::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 479833.5 [graded field: advanced/nwaka_2030_carry_forward_credit]', v_g_nwaka_2030_carry_forward_credit;
  end if;
  if v_g_nwaka_2035_refund <> 3403424.8770809956::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 3403424.8770809956 [graded field: advanced/nwaka_2035_refund]', v_g_nwaka_2035_refund;
  end if;
  if v_g_nwaka_npv_seller_revenue <> 356188000.85156506::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 356188000.85156506 [graded field: advanced/nwaka_npv_seller_revenue]', v_g_nwaka_npv_seller_revenue;
  end if;
  if v_g_nwaka_2032_royalty <> 2009337.8480662503::double precision then
    raise exception 'EC8 go-live refused: the seeded value is %, and the engine returned 2009337.8480662503 [graded field: advanced/nwaka_2032_royalty]', v_g_nwaka_2032_royalty;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  v_led_b := pg_temp.ec8_top(v_case_b->'year');
  v_ps_i := pg_temp.ec8_price(v_case_i->'price');
  v_led_i := pg_temp.ec8_top(pg_temp.ec8_priced(v_case_i));
  v_ps_a := pg_temp.ec8_price(v_case_a->'price');
  v_led_a := pg_temp.ec8_top(pg_temp.ec8_priced(v_case_a));
  v_s := pg_temp.ec8_energy(v_case_b->'energy');
  if v_s is null or abs(v_s - v_g_ozubu_march_2028_mmbtu) > 1e-9 * abs(v_g_ozubu_march_2028_mmbtu) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ozubu_march_2028_mmbtu]', v_s, v_g_ozubu_march_2028_mmbtu;
  end if;
  v_s := pg_temp.ec8_acq(v_case_b->'quantities');
  if v_s is null or abs(v_s - v_g_ozubu_2028_acq) > 1e-9 * abs(v_g_ozubu_2028_acq) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ozubu_2028_acq]', v_s, v_g_ozubu_2028_acq;
  end if;
  v_s := pg_temp.ec8_swing(v_case_b->'quantities');
  if v_s is null or abs(v_s - v_g_ozubu_effective_swing) > 1e-9 * abs(v_g_ozubu_effective_swing) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ozubu_effective_swing]', v_s, v_g_ozubu_effective_swing;
  end if;
  v_s := pg_temp.ec8_n(pg_temp.ec8_daily(v_case_b->'fortnight')->'buyerShortfall');
  if v_s is null or abs(v_s - v_g_ozubu_fortnight_buyer_shortfall) > 1e-9 * abs(v_g_ozubu_fortnight_buyer_shortfall) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ozubu_fortnight_buyer_shortfall]', v_s, v_g_ozubu_fortnight_buyer_shortfall;
  end if;
  v_s := pg_temp.ec8_n(pg_temp.ec8_daily(v_case_b->'fortnight')->'sellerShortfall');
  if v_s is null or abs(v_s - v_g_ozubu_fortnight_seller_shortfall) > 1e-9 * abs(v_g_ozubu_fortnight_seller_shortfall) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ozubu_fortnight_seller_shortfall]', v_s, v_g_ozubu_fortnight_seller_shortfall;
  end if;
  v_s := pg_temp.ec8_row(v_led_b, 2029, 'deficiencyPayment');
  if v_s is null or abs(v_s - v_g_ozubu_2029_deficiency_payment) > 1e-9 * abs(v_g_ozubu_2029_deficiency_payment) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ozubu_2029_deficiency_payment]', v_s, v_g_ozubu_2029_deficiency_payment;
  end if;
  v_s := pg_temp.ec8_annual(v_ps_i, 2030, 'averagePrice');
  if v_s is null or abs(v_s - v_g_ifeyi_2030_average_price) > 1e-9 * abs(v_g_ifeyi_2030_average_price) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ifeyi_2030_average_price]', v_s, v_g_ifeyi_2030_average_price;
  end if;
  v_s := pg_temp.ec8_row(v_led_i, 2028, 'deficiencyPayment');
  if v_s is null or abs(v_s - v_g_ifeyi_2028_deficiency_payment) > 1e-9 * abs(v_g_ifeyi_2028_deficiency_payment) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ifeyi_2028_deficiency_payment]', v_s, v_g_ifeyi_2028_deficiency_payment;
  end if;
  v_s := pg_temp.ec8_row(v_led_i, 2031, 'makeUpTaken');
  if v_s is null or abs(v_s - v_g_ifeyi_2031_make_up_taken) > 1e-9 * abs(v_g_ifeyi_2031_make_up_taken) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ifeyi_2031_make_up_taken]', v_s, v_g_ifeyi_2031_make_up_taken;
  end if;
  v_s := pg_temp.ec8_row(v_led_i, 2031, 'makeUpExpired');
  if v_s is null or abs(v_s - v_g_ifeyi_2031_make_up_expired) > 1e-9 * abs(v_g_ifeyi_2031_make_up_expired) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ifeyi_2031_make_up_expired]', v_s, v_g_ifeyi_2031_make_up_expired;
  end if;
  v_s := pg_temp.ec8_n(v_led_i->'netToSeller');
  if v_s is null or abs(v_s - v_g_ifeyi_total_net_to_seller) > 1e-9 * abs(v_g_ifeyi_total_net_to_seller) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ifeyi_total_net_to_seller]', v_s, v_g_ifeyi_total_net_to_seller;
  end if;
  v_s := pg_temp.ec8_dgdo(v_case_i->'dgdo');
  if v_s is null or abs(v_s - v_g_ifeyi_2031_dgdo_penalty) > 1e-9 * abs(v_g_ifeyi_2031_dgdo_penalty) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/ifeyi_2031_dgdo_penalty]', v_s, v_g_ifeyi_2031_dgdo_penalty;
  end if;
  v_s := pg_temp.ec8_month(v_ps_a, '2029-07');
  if v_s is null or abs(v_s - v_g_nwaka_july_2029_price) > 1e-9 * abs(v_g_nwaka_july_2029_price) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/nwaka_july_2029_price]', v_s, v_g_nwaka_july_2029_price;
  end if;
  v_s := pg_temp.ec8_annual(v_ps_a, 2034, 'averagePrice');
  if v_s is null or abs(v_s - v_g_nwaka_2034_average_price) > 1e-9 * abs(v_g_nwaka_2034_average_price) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/nwaka_2034_average_price]', v_s, v_g_nwaka_2034_average_price;
  end if;
  v_s := pg_temp.ec8_row(v_led_a, 2030, 'carryForwardApplied');
  if v_s is null or abs(v_s - v_g_nwaka_2030_carry_forward_credit) > 1e-9 * abs(v_g_nwaka_2030_carry_forward_credit) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/nwaka_2030_carry_forward_credit]', v_s, v_g_nwaka_2030_carry_forward_credit;
  end if;
  v_s := pg_temp.ec8_row(v_led_a, 2035, 'refund');
  if v_s is null or abs(v_s - v_g_nwaka_2035_refund) > 1e-9 * abs(v_g_nwaka_2035_refund) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/nwaka_2035_refund]', v_s, v_g_nwaka_2035_refund;
  end if;
  v_s := pg_temp.ec8_npv(v_led_a, 0.1::double precision, 2028);
  if v_s is null or abs(v_s - v_g_nwaka_npv_seller_revenue) > 1e-9 * abs(v_g_nwaka_npv_seller_revenue) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/nwaka_npv_seller_revenue]', v_s, v_g_nwaka_npv_seller_revenue;
  end if;
  v_s := pg_temp.ec8_royalty(v_led_a, 100.0::double precision, 2032);
  if v_s is null or abs(v_s - v_g_nwaka_2032_royalty) > 1e-9 * abs(v_g_nwaka_2032_royalty) then
    raise exception 'EC8 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/nwaka_2032_royalty]', v_s, v_g_nwaka_2032_royalty;
  end if;

  -- ---------------------------------------------------- 3. against the oracle
  -- oracle_check.py --json, run when this file was generated: the value the
  -- vendored stdlib oracle computed, written in, with the module it came from.
  -- ozubu_march_2028_mmbtu: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_ozubu_march_2028_mmbtu - 616789.1475925302::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 616789.1475925302, not within 5e-07 of the seeded % [graded field: beginner/ozubu_march_2028_mmbtu]', v_g_ozubu_march_2028_mmbtu;
  end if;
  -- ozubu_2028_acq: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_ozubu_2028_acq - 8212033.5::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 8212033.5, not within 5e-07 of the seeded % [graded field: beginner/ozubu_2028_acq]', v_g_ozubu_2028_acq;
  end if;
  -- ozubu_effective_swing: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_ozubu_effective_swing - 1.3529411764705883::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 1.3529411764705883, not within 5e-07 of the seeded % [graded field: beginner/ozubu_effective_swing]', v_g_ozubu_effective_swing;
  end if;
  -- ozubu_fortnight_buyer_shortfall: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_ozubu_fortnight_buyer_shortfall - 29797.125::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 29797.125, not within 5e-07 of the seeded % [graded field: beginner/ozubu_fortnight_buyer_shortfall]', v_g_ozubu_fortnight_buyer_shortfall;
  end if;
  -- ozubu_fortnight_seller_shortfall: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_ozubu_fortnight_seller_shortfall - 5546.5875::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 5546.5875, not within 5e-07 of the seeded % [graded field: beginner/ozubu_fortnight_seller_shortfall]', v_g_ozubu_fortnight_seller_shortfall;
  end if;
  -- ozubu_2029_deficiency_payment: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_ozubu_2029_deficiency_payment - 2278799.7324425::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 2278799.7324425, not within 5e-07 of the seeded % [graded field: beginner/ozubu_2029_deficiency_payment]', v_g_ozubu_2029_deficiency_payment;
  end if;
  -- ifeyi_2030_average_price: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_ifeyi_2030_average_price - 7.601475::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 7.601475, not within 5e-07 of the seeded % [graded field: intermediate/ifeyi_2030_average_price]', v_g_ifeyi_2030_average_price;
  end if;
  -- ifeyi_2028_deficiency_payment: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_ifeyi_2028_deficiency_payment - 8156547.41985::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 8156547.41985, not within 5e-07 of the seeded % [graded field: intermediate/ifeyi_2028_deficiency_payment]', v_g_ifeyi_2028_deficiency_payment;
  end if;
  -- ifeyi_2031_make_up_taken: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_ifeyi_2031_make_up_taken - 656250.5::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 656250.5, not within 5e-07 of the seeded % [graded field: intermediate/ifeyi_2031_make_up_taken]', v_g_ifeyi_2031_make_up_taken;
  end if;
  -- ifeyi_2031_make_up_expired: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_ifeyi_2031_make_up_expired - 253123.75::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 253123.75, not within 5e-07 of the seeded % [graded field: intermediate/ifeyi_2031_make_up_expired]', v_g_ifeyi_2031_make_up_expired;
  end if;
  -- ifeyi_total_net_to_seller: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_ifeyi_total_net_to_seller - 451290197.4954166::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 451290197.4954166, not within 5e-07 of the seeded % [graded field: intermediate/ifeyi_total_net_to_seller]', v_g_ifeyi_total_net_to_seller;
  end if;
  -- ifeyi_2031_dgdo_penalty: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_ifeyi_2031_dgdo_penalty - 2203738.775000001::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 2203738.775000001, not within 5e-07 of the seeded % [graded field: intermediate/ifeyi_2031_dgdo_penalty]', v_g_ifeyi_2031_dgdo_penalty;
  end if;
  -- nwaka_july_2029_price: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_nwaka_july_2029_price - 7.1499::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 7.1499, not within 5e-07 of the seeded % [graded field: advanced/nwaka_july_2029_price]', v_g_nwaka_july_2029_price;
  end if;
  -- nwaka_2034_average_price: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_nwaka_2034_average_price - 11.171475::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 11.171475, not within 5e-07 of the seeded % [graded field: advanced/nwaka_2034_average_price]', v_g_nwaka_2034_average_price;
  end if;
  -- nwaka_2030_carry_forward_credit: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_nwaka_2030_carry_forward_credit - 479833.5::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 479833.5, not within 5e-07 of the seeded % [graded field: advanced/nwaka_2030_carry_forward_credit]', v_g_nwaka_2030_carry_forward_credit;
  end if;
  -- nwaka_2035_refund: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_nwaka_2035_refund - 3403424.8770810002::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 3403424.8770810002, not within 5e-07 of the seeded % [graded field: advanced/nwaka_2035_refund]', v_g_nwaka_2035_refund;
  end if;
  -- nwaka_npv_seller_revenue: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_nwaka_npv_seller_revenue - 356188000.8515651::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 356188000.8515651, not within 5e-07 of the seeded % [graded field: advanced/nwaka_npv_seller_revenue]', v_g_nwaka_npv_seller_revenue;
  end if;
  -- nwaka_2032_royalty: tools/validation/economics/oracle_gascontract.py
  if abs(v_g_nwaka_2032_royalty - 2009337.8480662499::double precision) > 5e-07::double precision then
    raise exception 'EC8 go-live refused: the oracle gives 2009337.8480662499, not within 5e-07 of the seeded % [graded field: advanced/nwaka_2032_royalty]', v_g_nwaka_2032_royalty;
  end if;

  -- ------------------------------------------------------------- 4. the traps
  -- Every wrong method discriminate.mjs swept through the engine for a field,
  -- by value: each must miss the seeded value by more than the tolerance, or
  -- the field does not discriminate the trap it is for.
  v_wrong := 616936.4166233726::double precision;
  if abs(v_wrong - v_g_ozubu_march_2028_mmbtu) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (btu 59f) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_march_2028_mmbtu]', v_wrong, v_g_ozubu_march_2028_mmbtu;
  end if;
  v_wrong := 616821.8009478673::double precision;
  if abs(v_wrong - v_g_ozubu_march_2028_mmbtu) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (mj per mmbtu rounded to 1055) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_march_2028_mmbtu]', v_wrong, v_g_ozubu_march_2028_mmbtu;
  end if;
  v_wrong := 616789.0614337059::double precision;
  if abs(v_wrong - v_g_ozubu_march_2028_mmbtu) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (mj per mmbtu as printed 1055 056) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_march_2028_mmbtu]', v_wrong, v_g_ozubu_march_2028_mmbtu;
  end if;
  v_wrong := 650747.0::double precision;
  if abs(v_wrong - v_g_ozubu_march_2028_mmbtu) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (gigajoules read as mmbtu) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_march_2028_mmbtu]', v_wrong, v_g_ozubu_march_2028_mmbtu;
  end if;
  v_wrong := 8234470.75::double precision;
  if abs(v_wrong - v_g_ozubu_2028_acq) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (end date counted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_2028_acq]', v_wrong, v_g_ozubu_2028_acq;
  end if;
  v_wrong := 8189596.25::double precision;
  if abs(v_wrong - v_g_ozubu_2028_acq) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (three hundred sixty five days) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_2028_acq]', v_wrong, v_g_ozubu_2028_acq;
  end if;
  v_wrong := 8077410.0::double precision;
  if abs(v_wrong - v_g_ozubu_2028_acq) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (three hundred sixty day year) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_2028_acq]', v_wrong, v_g_ozubu_2028_acq;
  end if;
  v_wrong := 0.7391304347826086::double precision;
  if abs(v_wrong - v_g_ozubu_effective_swing) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (effective swing inverted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_effective_swing]', v_wrong, v_g_ozubu_effective_swing;
  end if;
  v_wrong := 1.15::double precision;
  if abs(v_wrong - v_g_ozubu_effective_swing) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (swing factor alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_effective_swing]', v_wrong, v_g_ozubu_effective_swing;
  end if;
  v_wrong := 0.9774999999999999::double precision;
  if abs(v_wrong - v_g_ozubu_effective_swing) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (swing times take or pay fraction) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_effective_swing]', v_wrong, v_g_ozubu_effective_swing;
  end if;
  v_wrong := 29379.125::double precision;
  if abs(v_wrong - v_g_ozubu_fortnight_buyer_shortfall) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (tolerance ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_fortnight_buyer_shortfall]', v_wrong, v_g_ozubu_fortnight_buyer_shortfall;
  end if;
  v_wrong := 29496.125::double precision;
  if abs(v_wrong - v_g_ozubu_fortnight_buyer_shortfall) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (fm does not excuse gap) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_fortnight_buyer_shortfall]', v_wrong, v_g_ozubu_fortnight_buyer_shortfall;
  end if;
  v_wrong := 25820.375::double precision;
  if abs(v_wrong - v_g_ozubu_fortnight_buyer_shortfall) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (buyer caused counted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_fortnight_buyer_shortfall]', v_wrong, v_g_ozubu_fortnight_buyer_shortfall;
  end if;
  v_wrong := 6724.5::double precision;
  if abs(v_wrong - v_g_ozubu_fortnight_seller_shortfall) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (nomination not capped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_fortnight_seller_shortfall]', v_wrong, v_g_ozubu_fortnight_seller_shortfall;
  end if;
  v_wrong := 6265.5875000000015::double precision;
  if abs(v_wrong - v_g_ozubu_fortnight_seller_shortfall) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (tolerance ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_fortnight_seller_shortfall]', v_wrong, v_g_ozubu_fortnight_seller_shortfall;
  end if;
  v_wrong := 15247.337500000001::double precision;
  if abs(v_wrong - v_g_ozubu_fortnight_seller_shortfall) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (fm does not excuse gap) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_fortnight_seller_shortfall]', v_wrong, v_g_ozubu_fortnight_seller_shortfall;
  end if;
  v_wrong := 10085.837500000001::double precision;
  if abs(v_wrong - v_g_ozubu_fortnight_seller_shortfall) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (buyer caused counted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_fortnight_seller_shortfall]', v_wrong, v_g_ozubu_fortnight_seller_shortfall;
  end if;
  v_wrong := 2713969.35414375::double precision;
  if abs(v_wrong - v_g_ozubu_2029_deficiency_payment) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (top on unadjusted acq) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_2029_deficiency_payment]', v_wrong, v_g_ozubu_2029_deficiency_payment;
  end if;
  v_wrong := 2477696.1934887515::double precision;
  if abs(v_wrong - v_g_ozubu_2029_deficiency_payment) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (fm not netted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_2029_deficiency_payment]', v_wrong, v_g_ozubu_2029_deficiency_payment;
  end if;
  v_wrong := 2316179.38690625::double precision;
  if abs(v_wrong - v_g_ozubu_2029_deficiency_payment) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (seller shortfall not netted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_2029_deficiency_payment]', v_wrong, v_g_ozubu_2029_deficiency_payment;
  end if;
  v_wrong := 2531963.2846874986::double precision;
  if abs(v_wrong - v_g_ozubu_2029_deficiency_payment) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (deficiency at contract price) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ozubu_2029_deficiency_payment]', v_wrong, v_g_ozubu_2029_deficiency_payment;
  end if;
  v_wrong := 7.593850000000001::double precision;
  if abs(v_wrong - v_g_ifeyi_2030_average_price) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (lag dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2030_average_price]', v_wrong, v_g_ifeyi_2030_average_price;
  end if;
  v_wrong := 5.856075::double precision;
  if abs(v_wrong - v_g_ifeyi_2030_average_price) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (average over one more) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2030_average_price]', v_wrong, v_g_ifeyi_2030_average_price;
  end if;
  v_wrong := 7.585966666666665::double precision;
  if abs(v_wrong - v_g_ifeyi_2030_average_price) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (reset ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2030_average_price]', v_wrong, v_g_ifeyi_2030_average_price;
  end if;
  v_wrong := 7.593425000000001::double precision;
  if abs(v_wrong - v_g_ifeyi_2030_average_price) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (averaging one month short) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2030_average_price]', v_wrong, v_g_ifeyi_2030_average_price;
  end if;
  v_wrong := 7.579350000000001::double precision;
  if abs(v_wrong - v_g_ifeyi_2030_average_price) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (lag one month longer) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2030_average_price]', v_wrong, v_g_ifeyi_2030_average_price;
  end if;
  v_wrong := 11421366.326100001::double precision;
  if abs(v_wrong - v_g_ifeyi_2028_deficiency_payment) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (top on unadjusted acq) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2028_deficiency_payment]', v_wrong, v_g_ifeyi_2028_deficiency_payment;
  end if;
  v_wrong := 10877229.841725001::double precision;
  if abs(v_wrong - v_g_ifeyi_2028_deficiency_payment) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (fm not netted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2028_deficiency_payment]', v_wrong, v_g_ifeyi_2028_deficiency_payment;
  end if;
  v_wrong := 8157445.9350875::double precision;
  if abs(v_wrong - v_g_ifeyi_2028_deficiency_payment) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (lag dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2028_deficiency_payment]', v_wrong, v_g_ifeyi_2028_deficiency_payment;
  end if;
  v_wrong := 8117650.405375001::double precision;
  if abs(v_wrong - v_g_ifeyi_2028_deficiency_payment) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (lag one month longer) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2028_deficiency_payment]', v_wrong, v_g_ifeyi_2028_deficiency_payment;
  end if;
  v_wrong := 505467.5875000004::double precision;
  if abs(v_wrong - v_g_ifeyi_2031_make_up_taken) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (make up taken before the years quantity) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2031_make_up_taken]', v_wrong, v_g_ifeyi_2031_make_up_taken;
  end if;
  v_wrong := 505467.5875000004::double precision;
  if abs(v_wrong - v_g_ifeyi_2031_make_up_taken) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (make up after the take or pay quantity) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2031_make_up_taken]', v_wrong, v_g_ifeyi_2031_make_up_taken;
  end if;
  v_wrong := 505467.5875000004::double precision;
  if abs(v_wrong - v_g_ifeyi_2031_make_up_taken) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (expiry one year early) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2031_make_up_taken]', v_wrong, v_g_ifeyi_2031_make_up_taken;
  end if;
  v_wrong := 562500.5::double precision;
  if abs(v_wrong - v_g_ifeyi_2031_make_up_taken) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (maintenance not netted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2031_make_up_taken]', v_wrong, v_g_ifeyi_2031_make_up_taken;
  end if;
  v_wrong := 758591.3375000004::double precision;
  if abs(v_wrong - v_g_ifeyi_2031_make_up_expired) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (makeup lifo) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2031_make_up_expired]', v_wrong, v_g_ifeyi_2031_make_up_expired;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_ifeyi_2031_make_up_expired) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (expiry one year late) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2031_make_up_expired]', v_wrong, v_g_ifeyi_2031_make_up_expired;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_ifeyi_2031_make_up_expired) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (expiry one year early) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2031_make_up_expired]', v_wrong, v_g_ifeyi_2031_make_up_expired;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_ifeyi_2031_make_up_expired) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (make up taken before the years quantity) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2031_make_up_expired]', v_wrong, v_g_ifeyi_2031_make_up_expired;
  end if;
  v_wrong := 452080824.22041655::double precision;
  if abs(v_wrong - v_g_ifeyi_total_net_to_seller) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (shortfall damages to seller) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_total_net_to_seller]', v_wrong, v_g_ifeyi_total_net_to_seller;
  end if;
  v_wrong := 457766463.68458533::double precision;
  if abs(v_wrong - v_g_ifeyi_total_net_to_seller) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (makeup at contract price) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_total_net_to_seller]', v_wrong, v_g_ifeyi_total_net_to_seller;
  end if;
  v_wrong := 455730872.7013376::double precision;
  if abs(v_wrong - v_g_ifeyi_total_net_to_seller) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (top on unadjusted acq) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_total_net_to_seller]', v_wrong, v_g_ifeyi_total_net_to_seller;
  end if;
  v_wrong := 452537376.4684875::double precision;
  if abs(v_wrong - v_g_ifeyi_total_net_to_seller) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (seller shortfall not netted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_total_net_to_seller]', v_wrong, v_g_ifeyi_total_net_to_seller;
  end if;
  v_wrong := 451623130.94763064::double precision;
  if abs(v_wrong - v_g_ifeyi_total_net_to_seller) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (lag dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_total_net_to_seller]', v_wrong, v_g_ifeyi_total_net_to_seller;
  end if;
  v_wrong := 2014846.8800000006::double precision;
  if abs(v_wrong - v_g_ifeyi_2031_dgdo_penalty) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (dgdo rate three) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2031_dgdo_penalty]', v_wrong, v_g_ifeyi_2031_dgdo_penalty;
  end if;
  v_wrong := 2014846.8800000006::double precision;
  if abs(v_wrong - v_g_ifeyi_2031_dgdo_penalty) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (dgdo agreement below minimum) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2031_dgdo_penalty]', v_wrong, v_g_ifeyi_2031_dgdo_penalty;
  end if;
  v_wrong := 2957990.7000000007::double precision;
  if abs(v_wrong - v_g_ifeyi_2031_dgdo_penalty) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (excuses ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2031_dgdo_penalty]', v_wrong, v_g_ifeyi_2031_dgdo_penalty;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_ifeyi_2031_dgdo_penalty) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (voluntary contracts counted as delivered) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/ifeyi_2031_dgdo_penalty]', v_wrong, v_g_ifeyi_2031_dgdo_penalty;
  end if;
  v_wrong := 7.0059::double precision;
  if abs(v_wrong - v_g_nwaka_july_2029_price) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (scurve low keeps mid slope) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_july_2029_price]', v_wrong, v_g_nwaka_july_2029_price;
  end if;
  v_wrong := 3.7279::double precision;
  if abs(v_wrong - v_g_nwaka_july_2029_price) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (scurve low not anchored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_july_2029_price]', v_wrong, v_g_nwaka_july_2029_price;
  end if;
  v_wrong := 7.1067::double precision;
  if abs(v_wrong - v_g_nwaka_july_2029_price) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (lag dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_july_2029_price]', v_wrong, v_g_nwaka_july_2029_price;
  end if;
  v_wrong := 6.6817::double precision;
  if abs(v_wrong - v_g_nwaka_july_2029_price) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (average over one more) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_july_2029_price]', v_wrong, v_g_nwaka_july_2029_price;
  end if;
  v_wrong := 7.1332::double precision;
  if abs(v_wrong - v_g_nwaka_july_2029_price) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (lag one month shorter) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_july_2029_price]', v_wrong, v_g_nwaka_july_2029_price;
  end if;
  v_wrong := 4.941074999999999::double precision;
  if abs(v_wrong - v_g_nwaka_2034_average_price) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (scurve high not anchored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2034_average_price]', v_wrong, v_g_nwaka_2034_average_price;
  end if;
  v_wrong := 11.175800000000002::double precision;
  if abs(v_wrong - v_g_nwaka_2034_average_price) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (reset ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2034_average_price]', v_wrong, v_g_nwaka_2034_average_price;
  end if;
  v_wrong := 11.180124999999999::double precision;
  if abs(v_wrong - v_g_nwaka_2034_average_price) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (lag dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2034_average_price]', v_wrong, v_g_nwaka_2034_average_price;
  end if;
  v_wrong := 11.175024999999998::double precision;
  if abs(v_wrong - v_g_nwaka_2034_average_price) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (averaging one month short) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2034_average_price]', v_wrong, v_g_nwaka_2034_average_price;
  end if;
  v_wrong := 852026.5::double precision;
  if abs(v_wrong - v_g_nwaka_2030_carry_forward_credit) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (carry forward cap ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2030_carry_forward_credit]', v_wrong, v_g_nwaka_2030_carry_forward_credit;
  end if;
  v_wrong := 514470.3::double precision;
  if abs(v_wrong - v_g_nwaka_2030_carry_forward_credit) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (fm not netted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2030_carry_forward_credit]', v_wrong, v_g_nwaka_2030_carry_forward_credit;
  end if;
  v_wrong := 540447.9::double precision;
  if abs(v_wrong - v_g_nwaka_2030_carry_forward_credit) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (top on unadjusted acq) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2030_carry_forward_credit]', v_wrong, v_g_nwaka_2030_carry_forward_credit;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_nwaka_2030_carry_forward_credit) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (carry forward base swapped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2030_carry_forward_credit]', v_wrong, v_g_nwaka_2030_carry_forward_credit;
  end if;
  v_wrong := 3531200.6725412467::double precision;
  if abs(v_wrong - v_g_nwaka_2035_refund) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (refund at contract price) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2035_refund]', v_wrong, v_g_nwaka_2035_refund;
  end if;
  v_wrong := 3976836.3509250004::double precision;
  if abs(v_wrong - v_g_nwaka_2035_refund) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (seller shortfall not netted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2035_refund]', v_wrong, v_g_nwaka_2035_refund;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_nwaka_2035_refund) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (make up taken before the years quantity) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2035_refund]', v_wrong, v_g_nwaka_2035_refund;
  end if;
  v_wrong := 3594617.4403385976::double precision;
  if abs(v_wrong - v_g_nwaka_2035_refund) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (make up after the adjusted acq) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2035_refund]', v_wrong, v_g_nwaka_2035_refund;
  end if;
  v_wrong := 4894287.250125::double precision;
  if abs(v_wrong - v_g_nwaka_2035_refund) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (top on unadjusted acq) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2035_refund]', v_wrong, v_g_nwaka_2035_refund;
  end if;
  v_wrong := 391806800.9367216::double precision;
  if abs(v_wrong - v_g_nwaka_npv_seller_revenue) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (npv one year early) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_npv_seller_revenue]', v_wrong, v_g_nwaka_npv_seller_revenue;
  end if;
  v_wrong := 360532100.89720076::double precision;
  if abs(v_wrong - v_g_nwaka_npv_seller_revenue) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (makeup at contract price) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_npv_seller_revenue]', v_wrong, v_g_nwaka_npv_seller_revenue;
  end if;
  v_wrong := 356122431.66481125::double precision;
  if abs(v_wrong - v_g_nwaka_npv_seller_revenue) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (refund at contract price) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_npv_seller_revenue]', v_wrong, v_g_nwaka_npv_seller_revenue;
  end if;
  v_wrong := 354154170.27238166::double precision;
  if abs(v_wrong - v_g_nwaka_npv_seller_revenue) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (carry forward cap ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_npv_seller_revenue]', v_wrong, v_g_nwaka_npv_seller_revenue;
  end if;
  v_wrong := 354069003.9282046::double precision;
  if abs(v_wrong - v_g_nwaka_npv_seller_revenue) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (scurve low keeps mid slope) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_npv_seller_revenue]', v_wrong, v_g_nwaka_npv_seller_revenue;
  end if;
  v_wrong := 4018675.6961325007::double precision;
  if abs(v_wrong - v_g_nwaka_2032_royalty) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (royalty share ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2032_royalty]', v_wrong, v_g_nwaka_2032_royalty;
  end if;
  v_wrong := 1735289.8798065623::double precision;
  if abs(v_wrong - v_g_nwaka_2032_royalty) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (average over one more) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2032_royalty]', v_wrong, v_g_nwaka_2032_royalty;
  end if;
  v_wrong := 2058472.3918024995::double precision;
  if abs(v_wrong - v_g_nwaka_2032_royalty) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (lag dropped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2032_royalty]', v_wrong, v_g_nwaka_2032_royalty;
  end if;
  v_wrong := 2034734.4802856252::double precision;
  if abs(v_wrong - v_g_nwaka_2032_royalty) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (reset ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2032_royalty]', v_wrong, v_g_nwaka_2032_royalty;
  end if;
  v_wrong := 1958942.7984400005::double precision;
  if abs(v_wrong - v_g_nwaka_2032_royalty) <= 5e-07::double precision then
    raise exception 'EC8 go-live refused: the trap (royalty on the net to the seller) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/nwaka_2032_royalty]', v_wrong, v_g_nwaka_2032_royalty;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'gsa';
  if not exists (select 1 from public.academy_apps where slug = 'gsa' and status = 'available') then
    raise exception 'EC8 go-live refused: gsa did not reach status available';
  end if;
  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon from public.academy_apps;
  raise notice 'EC8 go-live: gsa available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
