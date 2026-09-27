-- ------------------------------------------------ the second route's helpers
-- Temporary functions (pg_temp), created with create or replace: they vanish
-- with the session and create nothing in any schema. They rebuild each graded
-- EC10 value from the stated deal arithmetic, in SQL, with no engine code: the
-- split of one earning event's gross cost (the farminee pays its share of the
-- cost, the promote on the cost up to a gross-cost cap with the excess by the
-- stated overrun rule, or the carry held at a carry-amount cap; the farmor
-- pays the rest of its own interest); the promote ratio (share paid over the
-- interest held after the event); the consideration (carry, cash bonus and
-- reimbursement) and the equivalent working interest; each side's payoffs on a
-- risked prospect and their EMV, p x success + (1 - p) x dry hole; the
-- break-even share paid (EMV straight in the share between the earned interest
-- and the farmor's interest) and the break-even chance, -dry / (success - dry);
-- the consent fee of reg. 19(2), seven per cent of the stated value; Bayes on
-- the stated likelihoods and the value of the survey to the farminee; the value
-- per percent of the 100% position and the price over it; the development
-- carry ledger with its uplift on the opening balance, recovered from a share
-- of the farmor's entitlement; the back-in refund received in proportion to
-- the interest each party gives up. Every number is a double precision.

-- A number out of a jsonb value, read through its text (the double JSON.parse gives).
create or replace function pg_temp.ec10_n(v jsonb) returns double precision
language sql immutable as $f$
  select case when v is null or jsonb_typeof(v) = 'null' then null else (v #>> '{}')::double precision end
$f$;

-- The participating interest of one party.
create or replace function pg_temp.ec10_pi(parties jsonb, pid text) returns double precision
language sql immutable as $f$
  select pg_temp.ec10_n(p->'participatingPct') from jsonb_array_elements(parties) p where p->>'id' = pid
$f$;

-- The split of one gross cost c: the farminee pays x percent to hold y percent
-- after the event, out of the farmor's pre-deal f percent, under the stated cap.
-- Returns {fin, farmor, carry}.
create or replace function pg_temp.ec10_split(c double precision, x double precision, y double precision, f double precision, cap jsonb)
returns jsonb language plpgsql immutable as $f$
declare
  v_on text := cap->>'on';
  v_amt double precision := pg_temp.ec10_n(cap->'amount');
  v_base double precision; v_ex double precision; v_fin double precision; v_far double precision; v_carry double precision;
begin
  if v_on = 'gross-cost' then
    v_base := least(c, v_amt);
    v_ex := c - v_base;
    if cap->>'overrunRule' = 'post-deal-interests' then
      v_fin := x * v_base / 100.0 + y * v_ex / 100.0;
      v_far := (f - x) * v_base / 100.0 + (f - y) * v_ex / 100.0;
    else
      v_fin := x * v_base / 100.0;
      v_far := (f - x) * v_base / 100.0 + f * v_ex / 100.0;
    end if;
  elsif v_on = 'carry-amount' then
    v_carry := least((x - y) * c / 100.0, v_amt);
    v_fin := y * c / 100.0 + v_carry;
    v_far := (f - y) * c / 100.0 - v_carry;
  else
    v_fin := x * c / 100.0;
    v_far := (f - x) * c / 100.0;
  end if;
  return jsonb_build_object('fin', v_fin, 'farmor', v_far, 'carry', v_fin - y * c / 100.0);
end $f$;

-- The split of event i (0-based) of an earning call, with the interest held
-- after it the sum of the interests earned up to and including it.
create or replace function pg_temp.ec10_event(e jsonb, i int) returns jsonb
language plpgsql immutable as $f$
declare
  v_f double precision := pg_temp.ec10_pi(e->'parties', e->>'farmor');
  v_y double precision := 0; v_k int; v_ev jsonb;
begin
  for v_k in 0..i loop
    v_y := v_y + pg_temp.ec10_n(e->'events'->v_k->'earnedPct');
  end loop;
  v_ev := e->'events'->i;
  return pg_temp.ec10_split(pg_temp.ec10_n(v_ev->'grossCost'), pg_temp.ec10_n(v_ev->'farmineePaysPct'), v_y, v_f, v_ev->'cap')
    || jsonb_build_object('held', v_y, 'x', pg_temp.ec10_n(v_ev->'farmineePaysPct'));
end $f$;

-- Over the completed events: the consideration (carry + bonus + reimbursement)
-- or the equivalent working interest ((paid + bonus + reimbursement) / gross x 100).
create or replace function pg_temp.ec10_totals(e jsonb, what text) returns double precision
language plpgsql immutable as $f$
declare
  v_n int := (e->>'eventsCompleted')::int;
  v_paid double precision := 0; v_carry double precision := 0; v_gross double precision := 0; v_k int; v_s jsonb;
  v_cash double precision := pg_temp.ec10_n(e->'cashBonus') + pg_temp.ec10_n(e->'pastCosts'->'amount') * pg_temp.ec10_n(e->'pastCosts'->'reimbursedPct') / 100.0;
begin
  for v_k in 0..v_n - 1 loop
    v_s := pg_temp.ec10_event(e, v_k);
    v_paid := v_paid + pg_temp.ec10_n(v_s->'fin');
    v_carry := v_carry + pg_temp.ec10_n(v_s->'carry');
    v_gross := v_gross + pg_temp.ec10_n(e->'events'->v_k->'grossCost');
  end loop;
  if what = 'consideration' then return v_carry + v_cash; end if;
  return (v_paid + v_cash) * 100.0 / v_gross;
end $f$;

-- The farminee's payoffs on a stated deal at share x: {success, dry}.
create or replace function pg_temp.ec10_farminee(d jsonb, x double precision) returns jsonb
language plpgsql immutable as $f$
declare
  v_f double precision := pg_temp.ec10_pi(d->'parties', d->>'farmor');
  v_y double precision := pg_temp.ec10_n(d->'deal'->'earnedPct');
  v_s double precision := pg_temp.ec10_n(d->'project'->'successValue'->'npv');
  v_cash double precision := pg_temp.ec10_n(d->'deal'->'cashBonus') + pg_temp.ec10_n(d->'deal'->'pastCosts'->'amount') * pg_temp.ec10_n(d->'deal'->'pastCosts'->'reimbursedPct') / 100.0;
  v_ws jsonb := pg_temp.ec10_split(pg_temp.ec10_n(d->'project'->'wellCost'->'success'), x, v_y, v_f, d->'deal'->'cap');
  v_wd jsonb := pg_temp.ec10_split(pg_temp.ec10_n(d->'project'->'wellCost'->'dry'), x, v_y, v_f, d->'deal'->'cap');
begin
  return jsonb_build_object('success', v_y * v_s / 100.0 - pg_temp.ec10_n(v_ws->'fin') - v_cash,
                            'dry', -pg_temp.ec10_n(v_wd->'fin') - v_cash);
end $f$;

-- The farminee's EMV at share x.
create or replace function pg_temp.ec10_emv(d jsonb, x double precision) returns double precision
language plpgsql immutable as $f$
declare
  v_p double precision := pg_temp.ec10_n(d->'project'->'chanceOfSuccessPct') / 100.0;
  v_q jsonb := pg_temp.ec10_farminee(d, x);
begin
  return v_p * pg_temp.ec10_n(v_q->'success') + (1.0 - v_p) * pg_temp.ec10_n(v_q->'dry');
end $f$;

-- The break-even share paid: EMV is straight in the share between the earned
-- interest and the farmor's interest (no carry-amount cap), so it is the
-- interpolation of the two end EMVs to 0.
create or replace function pg_temp.ec10_breakeven_share(d jsonb) returns double precision
language plpgsql immutable as $f$
declare
  v_y double precision := pg_temp.ec10_n(d->'deal'->'earnedPct');
  v_f double precision := pg_temp.ec10_pi(d->'parties', d->>'farmor');
  v_a double precision := pg_temp.ec10_emv(d, v_y);
  v_b double precision := pg_temp.ec10_emv(d, v_f);
begin
  if v_a < 0 or v_b > 0 then return null; end if;
  return v_y + v_a * (v_f - v_y) / (v_a - v_b);
end $f$;

-- The farminee's break-even chance of success, in per cent.
create or replace function pg_temp.ec10_breakeven_chance(d jsonb) returns double precision
language plpgsql immutable as $f$
declare
  v_q jsonb := pg_temp.ec10_farminee(d, pg_temp.ec10_n(d->'deal'->'farmineePaysPct'));
  v_s double precision := pg_temp.ec10_n(v_q->'success'); v_d double precision := pg_temp.ec10_n(v_q->'dry');
begin
  return -v_d * 100.0 / (v_s - v_d);
end $f$;

-- The value of the stated survey to the farminee (EVII) or the chance of success
-- after one signal, in per cent: Bayes on the stated likelihoods.
create or replace function pg_temp.ec10_info(a jsonb, what text, sig int) returns double precision
language plpgsql immutable as $f$
declare
  v_p double precision := pg_temp.ec10_n(a->'project'->'chanceOfSuccessPct') / 100.0;
  v_q jsonb := pg_temp.ec10_farminee(a, pg_temp.ec10_n(a->'deal'->'farmineePaysPct'));
  v_s double precision := pg_temp.ec10_n(v_q->'success'); v_d double precision := pg_temp.ec10_n(v_q->'dry');
  v_ls double precision; v_ld double precision; v_ps double precision; v_post double precision;
  v_with double precision := 0; v_k int;
begin
  for v_k in 0..jsonb_array_length(a->'information'->'signals') - 1 loop
    v_ls := pg_temp.ec10_n(a->'information'->'signals'->v_k->'likelihoodsPct'->0) / 100.0;
    v_ld := pg_temp.ec10_n(a->'information'->'signals'->v_k->'likelihoodsPct'->1) / 100.0;
    v_ps := v_p * v_ls + (1.0 - v_p) * v_ld;
    v_post := v_p * v_ls / v_ps;
    if what = 'posterior' and v_k = sig then return v_post * 100.0; end if;
    v_with := v_with + v_ps * greatest(0.0, v_post * v_s + (1.0 - v_post) * v_d);
  end loop;
  return v_with - greatest(0.0, v_p * v_s + (1.0 - v_p) * v_d);
end $f$;

-- The risked value per percent of the 100% position, or the stated price per
-- percent over it.
create or replace function pg_temp.ec10_price(a jsonb, what text) returns double precision
language plpgsql immutable as $f$
declare
  v_p double precision := pg_temp.ec10_n(a->'project'->'chanceOfSuccessPct') / 100.0;
  v_r double precision := v_p * (pg_temp.ec10_n(a->'project'->'successValue'->'npv') - pg_temp.ec10_n(a->'project'->'wellCost'->'success'))
                          - (1.0 - v_p) * pg_temp.ec10_n(a->'project'->'wellCost'->'dry');
begin
  if what = 'perPct' then return v_r / 100.0; end if;
  return (pg_temp.ec10_n(a->'transaction'->'price') / pg_temp.ec10_n(a->'interestPct')) / (v_r / 100.0);
end $f$;

-- The closing balance of a development carry in a year: the farmor keeps its
-- interest less the interest earned; the farminee pays carriedPct of the
-- farmor's cost share; a compound uplift on the opening balance; recovery from
-- recoverFromPct of the farmor's share of each year's entitlement.
create or replace function pg_temp.ec10_devcarry(a jsonb, yr int) returns double precision
language plpgsql immutable as $f$
declare
  v_f double precision := pg_temp.ec10_pi(a->'parties', a->>'farmor') - pg_temp.ec10_n(a->'earnedPct');
  v_rate double precision := pg_temp.ec10_n(a->'uplift'->'ratePctPerYear');
  v_open double precision := 0; v_due double precision; v_avail double precision; v_rec double precision; v_close double precision; v_y jsonb;
begin
  for v_y in select * from jsonb_array_elements(a->'years') loop
    v_due := v_open + v_open * v_rate / 100.0 + pg_temp.ec10_n(v_y->'cost') * v_f / 100.0 * pg_temp.ec10_n(a->'carriedPct') / 100.0;
    v_avail := pg_temp.ec10_n(v_y->'entitlement') * v_f / 100.0 * pg_temp.ec10_n(a->'recoverFromPct') / 100.0;
    v_rec := least(v_avail, v_due);
    v_close := v_due - v_rec;
    if (v_y->>'year')::int = yr then return v_close; end if;
    v_open := v_close;
  end loop;
  return null;
end $f$;

-- The back-in refund a party receives after the farm-in: refund = (target -
-- current) / 100 x the refundable costs, received in proportion to the interest
-- each other party gives up, which is its interest over (100 - current).
create or replace function pg_temp.ec10_backin(a jsonb, pid text) returns double precision
language plpgsql immutable as $f$
declare
  v_b jsonb := a->'backIn';
  v_cur double precision; v_mine double precision; v_ref double precision := 0; v_c jsonb;
begin
  if v_b->>'party' = a->>'farmor' then v_cur := pg_temp.ec10_pi(a->'parties', a->>'farmor') - pg_temp.ec10_n(a->'earnedPct');
  elsif v_b->>'party' = a->'farminee'->>'id' then v_cur := pg_temp.ec10_n(a->'earnedPct');
  else v_cur := pg_temp.ec10_pi(a->'parties', v_b->>'party'); end if;
  if pid = a->>'farmor' then v_mine := pg_temp.ec10_pi(a->'parties', a->>'farmor') - pg_temp.ec10_n(a->'earnedPct');
  elsif pid = a->'farminee'->>'id' then v_mine := pg_temp.ec10_n(a->'earnedPct');
  else v_mine := pg_temp.ec10_pi(a->'parties', pid); end if;
  for v_c in select * from jsonb_array_elements(v_b->'costs') loop
    if exists (select 1 from jsonb_array_elements_text(v_b->'refundableKinds') k where k = v_c->>'kind') then
      v_ref := v_ref + pg_temp.ec10_n(v_c->'amount');
    end if;
  end loop;
  return (pg_temp.ec10_n(v_b->'targetPct') - v_cur) / 100.0 * v_ref * v_mine / (100.0 - v_cur);
end $f$;
