-- ============================================================================
-- EC10 GO-LIVE (HELD): Farm-ins, Farm-outs & Asset Valuation flips to
-- 'available' in the Economics & Commercial module, at path_order
-- 75.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/farmout. The 78 lessons, the teaching lab
-- (farmoutLab.js), its three calculator panels (earning, deal and valuation)
-- and the three capstone case files ship in the ZIP and NOT in this database,
-- so a flip before the upload puts a live catalogue tile in front of a route
-- that does not exist. AN ENGINE COURSE: there is no Suite app and no Suite
-- upload to wait for. This file is written, dry-run and left unapplied on
-- purpose.
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values farmout_capstone.mjs returned
--      through the vendored engines/economics/farmout.js (petrolord-engines
--      fb5a363) when this file was generated, to the last bit;
--   2. by a SECOND ROUTE IN SQL: the deal arithmetic rebuilt in plpgsql over
--      the case files the learner is handed; each to 1e-9 relative;
--   3. by the ORACLE: oracle_check.py's run of the vendored stdlib Python
--      oracle (tools/validation/economics/oracle_farmout.py), written in by
--      value, each seeded value within its tolerance of the oracle's;
--   4. by the TRAPS the course is built on: every wrong method
--      discriminate.mjs swept through the engine for a field, written in by
--      value, must miss the seeded value by more than the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
--
-- NO BEGIN OR COMMIT. Like every course migration in this repository, the
-- file carries no transaction lines of its own; apply_ec10_farmout.sh wraps it
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

do $$
#variable_conflict use_column
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_s double precision; v_wrong double precision;
  v_g_ogbaku_ihe_well_payment double precision;
  v_g_ogbaku_ogb_well_payment double precision;
  v_g_ogbaku_promote_ratio double precision;
  v_g_ogbaku_carry double precision;
  v_g_ogbaku_consideration double precision;
  v_g_ogbaku_equivalent_wi_pct double precision;
  v_g_umunze_well1_amg_payment double precision;
  v_g_umunze_well2_umz_payment double precision;
  v_g_umunze_amg_emv double precision;
  v_g_umunze_breakeven_share_pct double precision;
  v_g_umunze_amg_breakeven_chance_pct double precision;
  v_g_umunze_consent_fee double precision;
  v_g_akpugo_ezi_evii double precision;
  v_g_akpugo_strong_posterior_pct double precision;
  v_g_akpugo_risked_value_per_pct double precision;
  v_g_akpugo_price_to_value double precision;
  v_g_akpugo_2035_carry_balance double precision;
  v_g_akpugo_backin_refund_to_obr double precision;
  v_case_b jsonb := '{"name":"OGBAKU","label":"OGBAKU, a farm-out on the Ogbaku licence (synthetic)","earning":{"parties":[{"id":"OGB","name":"Ogbaku Petroleum (synthetic), operator","participatingPct":60.25},{"id":"NKW","name":"Nkwerre Energy (synthetic)","participatingPct":39.75}],"farmor":"OGB","farminee":{"id":"IHE","name":"Ihembosi Resources (synthetic)"},"events":[{"name":"Ogbaku-1 exploration well","grossCost":37650000.5,"farmineePaysPct":44,"earnedPct":31.75,"cap":{"on":"none"}}],"vesting":"per-event","eventsCompleted":1,"cashBonus":1250000.75,"pastCosts":{"amount":8430000.4,"reimbursedPct":31.75}}}'::jsonb;
  v_case_i jsonb := '{"name":"UMUNZE","label":"UMUNZE, a drill-to-earn farm-out on the Umunze licence (synthetic)","earning":{"parties":[{"id":"UMZ","name":"Umunze Exploration (synthetic), operator","participatingPct":65},{"id":"ORJ","name":"Orji Resources (synthetic)","participatingPct":35}],"farmor":"UMZ","farminee":{"id":"AMG","name":"Amaigbo Energy (synthetic)"},"events":[{"name":"Umunze-1 exploration well","grossCost":52340000.25,"farmineePaysPct":42,"earnedPct":24,"cap":{"on":"gross-cost","amount":48000000,"overrunRule":"post-deal-interests"}},{"name":"Umunze-2 appraisal well","grossCost":31275000.4,"farmineePaysPct":38.5,"earnedPct":12.5,"cap":{"on":"carry-amount","amount":550000.5}}],"vesting":"all-events","eventsCompleted":2,"cashBonus":1875000.25,"pastCosts":{"amount":14300000,"reimbursedPct":24}},"deal":{"parties":[{"id":"UMZ","name":"Umunze Exploration (synthetic), operator","participatingPct":65},{"id":"ORJ","name":"Orji Resources (synthetic)","participatingPct":35}],"farmor":"UMZ","farminee":{"id":"AMG","name":"Amaigbo Energy (synthetic)"},"project":{"chanceOfSuccessPct":22.5,"wellCost":{"success":44650000.75,"dry":39120000.4},"successValue":{"npv":318400000.5}},"deal":{"farmineePaysPct":42,"earnedPct":24,"cap":{"on":"gross-cost","amount":42000000,"overrunRule":"post-deal-interests"},"cashBonus":1875000.25,"pastCosts":{"amount":14300000,"reimbursedPct":24},"assignorFees":618400.25}},"fee":{"licence":"PPL","transactionValue":6437500.6,"valueSource":"contract-amount","intraGroup":false,"basis":"nuprc-2024-r19","payment":{"notifiedOn":"2029-03-02","paidOn":"2029-05-14"}}}'::jsonb;
  v_case_a jsonb := '{"name":"AKPUGO","label":"AKPUGO, a farm-out on the Akpugo licence (synthetic)","information":{"parties":[{"id":"AKP","name":"Akpugo Oil (synthetic), operator","participatingPct":72.5},{"id":"OBR","name":"Obioma Resources (synthetic)","participatingPct":27.5}],"farmor":"AKP","farminee":{"id":"EZI","name":"Ezinifite Energy (synthetic)"},"project":{"chanceOfSuccessPct":18.5,"wellCost":{"success":51380000.5,"dry":45260000.75},"successValue":{"npv":402750000.25}},"deal":{"farmineePaysPct":46,"earnedPct":29.5,"cap":{"on":"none"},"cashBonus":2150000.5,"pastCosts":{"amount":9840000,"reimbursedPct":29.5},"assignorFees":312500.25},"side":"farminee","information":{"cost":1650000.5,"signals":[{"label":"strong amplitude","likelihoodsPct":[72.5,21.3]},{"label":"weak amplitude","likelihoodsPct":[27.5,78.7]}]}},"price":{"project":{"chanceOfSuccessPct":18.5,"wellCost":{"success":51380000.5,"dry":45260000.75},"successValue":{"npv":402750000.25}},"interestPct":29.5,"valueBasis":"risked","transaction":{"price":11240000.5}},"devCarry":{"parties":[{"id":"AKP","name":"Akpugo Oil (synthetic), operator","participatingPct":72.5},{"id":"OBR","name":"Obioma Resources (synthetic)","participatingPct":27.5}],"farmor":"AKP","farminee":{"id":"EZI","name":"Ezinifite Energy (synthetic)"},"earnedPct":29.5,"carriedPct":60,"years":[{"year":2031,"cost":186400000.5,"entitlement":0},{"year":2032,"cost":244750000.25,"entitlement":0},{"year":2033,"cost":97300000,"entitlement":0},{"year":2034,"cost":0,"entitlement":212600000.5},{"year":2035,"cost":0,"entitlement":238450000.75},{"year":2036,"cost":0,"entitlement":221300000},{"year":2037,"cost":0,"entitlement":196800000.25},{"year":2038,"cost":0,"entitlement":174250000}],"uplift":{"type":"compound","ratePctPerYear":7.5},"recoverFromPct":55,"discountRate":0.1,"baseYear":2030},"backIn":{"parties":[{"id":"AKP","name":"Akpugo Oil (synthetic), operator","participatingPct":72.5},{"id":"OBR","name":"Obioma Resources (synthetic)","participatingPct":27.5}],"farmor":"AKP","farminee":{"id":"EZI","name":"Ezinifite Energy (synthetic)"},"earnedPct":29.5,"backIn":{"party":"AKP","targetPct":50,"costs":[{"item":"Akpugo development wells","amount":612400000.5,"kind":"development"},{"item":"Akpugo production facilities","amount":48750000.25,"kind":"production"},{"item":"Akpugo-1 exploration well","amount":51380000.5,"kind":"exploration"}],"basis":"contract","refundableKinds":["development","production"],"refundForm":"upfront"}}}'::jsonb;
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'farmout' and active;
  if v_structures <> 3 then
    raise exception 'EC10 go-live refused: farmout has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'farmout';
  if v_questions <> 396 then
    raise exception 'EC10 go-live refused: farmout has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'farmout' group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'EC10 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;
  select count(*) into v_n from (select tier, module_key from public.academy_quiz_questions where app_slug = 'farmout' and scope = 'module' group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'EC10 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'farmout' and scope = 'final' group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'EC10 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = 'farmout'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'EC10 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;
  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'farmout' and s.active;
  if v_lessons <> 78 then
    raise exception 'EC10 go-live refused: farmout carries % lesson keys, expected 78', v_lessons;
  end if;
  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'farmout' and s.active;
  if v_modules <> 18 then
    raise exception 'EC10 go-live refused: farmout carries % modules, expected 18 (six per tier)', v_modules;
  end if;
  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'farmout' and qq.scope = 'module' and not exists (
       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'EC10 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'farmout';
  if v_capstones <> 3 then
    raise exception 'EC10 go-live refused: farmout has % capstones, expected 3', v_capstones;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'farmout';
  if v_graded <> 18 then
    raise exception 'EC10 go-live refused: farmout has % graded capstone fields, expected 18', v_graded;
  end if;
  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'farmout' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'EC10 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'farmout' and module = 'economics' and path_order = 75 and prereq_slug is null) then
    raise exception 'EC10 go-live refused: the farmout catalogue row is not economics at path_order 75 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 75 and slug <> 'farmout') then
    raise exception 'EC10 go-live refused: another course already holds path_order 75';
  end if;

  -- ------------------------------------------------- the grader is numeric
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or abs((f->>'expected')::numeric) <= 0.001
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric is distinct from (select t.tol from (values ('beginner', 'ogbaku_ihe_well_payment', 5e-07::numeric), ('beginner', 'ogbaku_ogb_well_payment', 5e-07::numeric), ('beginner', 'ogbaku_promote_ratio', 5e-07::numeric), ('beginner', 'ogbaku_carry', 5e-07::numeric), ('beginner', 'ogbaku_consideration', 5e-07::numeric), ('beginner', 'ogbaku_equivalent_wi_pct', 5e-07::numeric), ('intermediate', 'umunze_well1_amg_payment', 5e-07::numeric), ('intermediate', 'umunze_well2_umz_payment', 5e-07::numeric), ('intermediate', 'umunze_amg_emv', 5e-07::numeric), ('intermediate', 'umunze_breakeven_share_pct', 5e-07::numeric), ('intermediate', 'umunze_amg_breakeven_chance_pct', 5e-07::numeric), ('intermediate', 'umunze_consent_fee', 5e-07::numeric), ('advanced', 'akpugo_ezi_evii', 5e-07::numeric), ('advanced', 'akpugo_strong_posterior_pct', 5e-07::numeric), ('advanced', 'akpugo_risked_value_per_pct', 5e-07::numeric), ('advanced', 'akpugo_price_to_value', 5e-07::numeric), ('advanced', 'akpugo_2035_carry_balance', 5e-07::numeric), ('advanced', 'akpugo_backin_refund_to_obr', 5e-07::numeric)) t(tier, k, tol) where t.tier = c.tier and t.k = f->>'key')
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'EC10 go-live refused: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;
  end if;
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or ((f->>'tol')::numeric = 0.0000005
              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));
  if v_n <> 0 then
    raise exception 'EC10 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or, at the six-decimal floor, pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;

  -- ---------------------------------------- the prompts the learner reads
  select prompt into v_prompt from public.academy_capstones where app_slug = 'farmout' and tier = 'beginner';
  if v_prompt is null or md5(v_prompt) <> 'ed0c98533edf9334a13b2118aa21848a' then
    raise exception 'EC10 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'farmout' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'OGBAKU, a farm-out on the Ogbaku licence (synthetic)' and title = 'The deal and what it costs') then
    raise exception 'EC10 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['per-event', 'OGB', 'IHE', 'cap none', 'ogbaku_case.json', 'No value depends on any of the readings the engine states (every cost at the valuation date, the day count of reg. 19(7), the ninetieth surcharge day, how a simple-interest uplift is paid) or on a Monte Carlo draw, and every term a value needs is stated in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC10 go-live refused: % stated setting(s) or case file(s) are not named in the shipped beginner prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'farmout' and tier = 'intermediate';
  if v_prompt is null or md5(v_prompt) <> '97a2bcb216c082101c468a82a716441f' then
    raise exception 'EC10 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'farmout' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'UMUNZE, a drill-to-earn farm-out on the Umunze licence (synthetic)' and title = 'Caps, vesting, value and the fee') then
    raise exception 'EC10 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['all-events', 'post-deal-interests', 'cap gross-cost', 'cap carry-amount', 'PPL', 'nuprc-2024-r19', 'contract-amount', '2029-03-02', '2029-05-14', 'assignorFees', 'successValue npv', 'umunze_case.json', 'No value depends on any of the readings the engine states (every cost at the valuation date, the day count of reg. 19(7), the ninetieth surcharge day, how a simple-interest uplift is paid) or on a Monte Carlo draw, and every term a value needs is stated in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC10 go-live refused: % stated setting(s) or case file(s) are not named in the shipped intermediate prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'farmout' and tier = 'advanced';
  if v_prompt is null or md5(v_prompt) <> '1dc7f04a6a03ee3d4605dfd1f0ffd400' then
    raise exception 'EC10 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'farmout' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'AKPUGO, a farm-out on the Akpugo licence (synthetic)' and title = 'Information, price and after the farm-in') then
    raise exception 'EC10 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['farminee', 'risked', 'compound', 'contract', 'upfront', 'refundableKinds', 'recoverFromPct', 'strong amplitude', 'weak amplitude', 'akpugo_case.json', 'No value depends on any of the readings the engine states (every cost at the valuation date, the day count of reg. 19(7), the ninetieth surcharge day, how a simple-interest uplift is paid) or on a Monte Carlo draw, and every term a value needs is stated in the case file: the engine holds no default for any of them.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'EC10 go-live refused: % stated setting(s) or case file(s) are not named in the shipped advanced prompt: %', v_n, v_names;
  end if;
  -- No number handed in any capstone text of this course may sit within its
  -- tolerance of any graded value of any tier.
  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names
    from (select c.tier as ctier, m[1]::double precision as x
            from public.academy_capstones c,
                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||
                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),
                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m
           where c.app_slug = 'farmout') h,
         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'farmout') g
   where abs(abs(h.x) - abs(g.v)) <= g.t;
  if v_n <> 0 then
    raise exception 'EC10 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_ogbaku_ihe_well_payment
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'beginner' and f->>'key' = 'ogbaku_ihe_well_payment';
  if v_g_ogbaku_ihe_well_payment is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: beginner/ogbaku_ihe_well_payment]';
  end if;
  select (f->>'expected')::double precision into v_g_ogbaku_ogb_well_payment
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'beginner' and f->>'key' = 'ogbaku_ogb_well_payment';
  if v_g_ogbaku_ogb_well_payment is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: beginner/ogbaku_ogb_well_payment]';
  end if;
  select (f->>'expected')::double precision into v_g_ogbaku_promote_ratio
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'beginner' and f->>'key' = 'ogbaku_promote_ratio';
  if v_g_ogbaku_promote_ratio is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: beginner/ogbaku_promote_ratio]';
  end if;
  select (f->>'expected')::double precision into v_g_ogbaku_carry
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'beginner' and f->>'key' = 'ogbaku_carry';
  if v_g_ogbaku_carry is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: beginner/ogbaku_carry]';
  end if;
  select (f->>'expected')::double precision into v_g_ogbaku_consideration
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'beginner' and f->>'key' = 'ogbaku_consideration';
  if v_g_ogbaku_consideration is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: beginner/ogbaku_consideration]';
  end if;
  select (f->>'expected')::double precision into v_g_ogbaku_equivalent_wi_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'beginner' and f->>'key' = 'ogbaku_equivalent_wi_pct';
  if v_g_ogbaku_equivalent_wi_pct is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: beginner/ogbaku_equivalent_wi_pct]';
  end if;
  select (f->>'expected')::double precision into v_g_umunze_well1_amg_payment
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'intermediate' and f->>'key' = 'umunze_well1_amg_payment';
  if v_g_umunze_well1_amg_payment is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: intermediate/umunze_well1_amg_payment]';
  end if;
  select (f->>'expected')::double precision into v_g_umunze_well2_umz_payment
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'intermediate' and f->>'key' = 'umunze_well2_umz_payment';
  if v_g_umunze_well2_umz_payment is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: intermediate/umunze_well2_umz_payment]';
  end if;
  select (f->>'expected')::double precision into v_g_umunze_amg_emv
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'intermediate' and f->>'key' = 'umunze_amg_emv';
  if v_g_umunze_amg_emv is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: intermediate/umunze_amg_emv]';
  end if;
  select (f->>'expected')::double precision into v_g_umunze_breakeven_share_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'intermediate' and f->>'key' = 'umunze_breakeven_share_pct';
  if v_g_umunze_breakeven_share_pct is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: intermediate/umunze_breakeven_share_pct]';
  end if;
  select (f->>'expected')::double precision into v_g_umunze_amg_breakeven_chance_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'intermediate' and f->>'key' = 'umunze_amg_breakeven_chance_pct';
  if v_g_umunze_amg_breakeven_chance_pct is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: intermediate/umunze_amg_breakeven_chance_pct]';
  end if;
  select (f->>'expected')::double precision into v_g_umunze_consent_fee
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'intermediate' and f->>'key' = 'umunze_consent_fee';
  if v_g_umunze_consent_fee is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: intermediate/umunze_consent_fee]';
  end if;
  select (f->>'expected')::double precision into v_g_akpugo_ezi_evii
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'advanced' and f->>'key' = 'akpugo_ezi_evii';
  if v_g_akpugo_ezi_evii is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: advanced/akpugo_ezi_evii]';
  end if;
  select (f->>'expected')::double precision into v_g_akpugo_strong_posterior_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'advanced' and f->>'key' = 'akpugo_strong_posterior_pct';
  if v_g_akpugo_strong_posterior_pct is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: advanced/akpugo_strong_posterior_pct]';
  end if;
  select (f->>'expected')::double precision into v_g_akpugo_risked_value_per_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'advanced' and f->>'key' = 'akpugo_risked_value_per_pct';
  if v_g_akpugo_risked_value_per_pct is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: advanced/akpugo_risked_value_per_pct]';
  end if;
  select (f->>'expected')::double precision into v_g_akpugo_price_to_value
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'advanced' and f->>'key' = 'akpugo_price_to_value';
  if v_g_akpugo_price_to_value is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: advanced/akpugo_price_to_value]';
  end if;
  select (f->>'expected')::double precision into v_g_akpugo_2035_carry_balance
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'advanced' and f->>'key' = 'akpugo_2035_carry_balance';
  if v_g_akpugo_2035_carry_balance is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: advanced/akpugo_2035_carry_balance]';
  end if;
  select (f->>'expected')::double precision into v_g_akpugo_backin_refund_to_obr
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'farmout' and c.tier = 'advanced' and f->>'key' = 'akpugo_backin_refund_to_obr';
  if v_g_akpugo_backin_refund_to_obr is null then
    raise exception 'EC10 go-live refused: the seeded rows carry no value [graded field: advanced/akpugo_backin_refund_to_obr]';
  end if;

  -- ------------------------------------------ 1. against the engine ledger
  if v_g_ogbaku_ihe_well_payment <> 16566000.22::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 16566000.22 [graded field: beginner/ogbaku_ihe_well_payment]', v_g_ogbaku_ihe_well_payment;
  end if;
  if v_g_ogbaku_ogb_well_payment <> 6118125.08125::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 6118125.08125 [graded field: beginner/ogbaku_ogb_well_payment]', v_g_ogbaku_ogb_well_payment;
  end if;
  if v_g_ogbaku_promote_ratio <> 1.3858267716535433::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 1.3858267716535433 [graded field: beginner/ogbaku_promote_ratio]', v_g_ogbaku_promote_ratio;
  end if;
  if v_g_ogbaku_carry <> 4612125.061250001::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 4612125.061250001 [graded field: beginner/ogbaku_carry]', v_g_ogbaku_carry;
  end if;
  if v_g_ogbaku_consideration <> 8538650.938250002::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 8538650.938250002 [graded field: beginner/ogbaku_consideration]', v_g_ogbaku_consideration;
  end if;
  if v_g_ogbaku_equivalent_wi_pct <> 54.429019455125896::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 54.429019455125896 [graded field: beginner/ogbaku_equivalent_wi_pct]', v_g_ogbaku_equivalent_wi_pct;
  end if;
  if v_g_umunze_well1_amg_payment <> 21201600.06::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 21201600.06 [graded field: intermediate/umunze_well1_amg_payment]', v_g_umunze_well1_amg_payment;
  end if;
  if v_g_umunze_well2_umz_payment <> 8363374.614::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 8363374.614 [graded field: intermediate/umunze_well2_umz_payment]', v_g_umunze_well2_umz_payment;
  end if;
  if v_g_umunze_amg_emv <> -4959060.393700002::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned -4959060.393700002 [graded field: intermediate/umunze_amg_emv]', v_g_umunze_amg_emv;
  end if;
  if v_g_umunze_breakeven_share_pct <> 29.530023247226225::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 29.530023247226225 [graded field: intermediate/umunze_breakeven_share_pct]', v_g_umunze_breakeven_share_pct;
  end if;
  if v_g_umunze_amg_breakeven_chance_pct <> 29.15017270460909::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 29.15017270460909 [graded field: intermediate/umunze_amg_breakeven_chance_pct]', v_g_umunze_amg_breakeven_chance_pct;
  end if;
  if v_g_umunze_consent_fee <> 450625.042::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 450625.042 [graded field: intermediate/umunze_consent_fee]', v_g_umunze_consent_fee;
  end if;
  if v_g_akpugo_ezi_evii <> 7596515.0435426915::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 7596515.0435426915 [graded field: advanced/akpugo_ezi_evii]', v_g_akpugo_ezi_evii;
  end if;
  if v_g_akpugo_strong_posterior_pct <> 43.586702196802285::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 43.586702196802285 [graded field: advanced/akpugo_strong_posterior_pct]', v_g_akpugo_strong_posterior_pct;
  end if;
  if v_g_akpugo_risked_value_per_pct <> 281165.493425::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 281165.493425 [graded field: advanced/akpugo_risked_value_per_pct]', v_g_akpugo_risked_value_per_pct;
  end if;
  if v_g_akpugo_price_to_value <> 1.3551341647951192::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 1.3551341647951192 [graded field: advanced/akpugo_price_to_value]', v_g_akpugo_price_to_value;
  end if;
  if v_g_akpugo_2035_carry_balance <> 61235569.92884742::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 61235569.92884742 [graded field: advanced/akpugo_2035_carry_balance]', v_g_akpugo_2035_carry_balance;
  end if;
  if v_g_akpugo_backin_refund_to_obr <> 22328311.42883772::double precision then
    raise exception 'EC10 go-live refused: the seeded value is %, and the engine returned 22328311.42883772 [graded field: advanced/akpugo_backin_refund_to_obr]', v_g_akpugo_backin_refund_to_obr;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  v_s := pg_temp.ec10_n(pg_temp.ec10_event(v_case_b->'earning', 0)->'fin');
  if v_s is null or abs(v_s - v_g_ogbaku_ihe_well_payment) > 1e-9 * abs(v_g_ogbaku_ihe_well_payment) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ogbaku_ihe_well_payment]', v_s, v_g_ogbaku_ihe_well_payment;
  end if;
  v_s := pg_temp.ec10_n(pg_temp.ec10_event(v_case_b->'earning', 0)->'farmor');
  if v_s is null or abs(v_s - v_g_ogbaku_ogb_well_payment) > 1e-9 * abs(v_g_ogbaku_ogb_well_payment) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ogbaku_ogb_well_payment]', v_s, v_g_ogbaku_ogb_well_payment;
  end if;
  v_s := pg_temp.ec10_n(pg_temp.ec10_event(v_case_b->'earning', 0)->'x') / pg_temp.ec10_n(pg_temp.ec10_event(v_case_b->'earning', 0)->'held');
  if v_s is null or abs(v_s - v_g_ogbaku_promote_ratio) > 1e-9 * abs(v_g_ogbaku_promote_ratio) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ogbaku_promote_ratio]', v_s, v_g_ogbaku_promote_ratio;
  end if;
  v_s := pg_temp.ec10_n(pg_temp.ec10_event(v_case_b->'earning', 0)->'carry');
  if v_s is null or abs(v_s - v_g_ogbaku_carry) > 1e-9 * abs(v_g_ogbaku_carry) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ogbaku_carry]', v_s, v_g_ogbaku_carry;
  end if;
  v_s := pg_temp.ec10_totals(v_case_b->'earning', 'consideration');
  if v_s is null or abs(v_s - v_g_ogbaku_consideration) > 1e-9 * abs(v_g_ogbaku_consideration) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ogbaku_consideration]', v_s, v_g_ogbaku_consideration;
  end if;
  v_s := pg_temp.ec10_totals(v_case_b->'earning', 'equivalent');
  if v_s is null or abs(v_s - v_g_ogbaku_equivalent_wi_pct) > 1e-9 * abs(v_g_ogbaku_equivalent_wi_pct) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ogbaku_equivalent_wi_pct]', v_s, v_g_ogbaku_equivalent_wi_pct;
  end if;
  v_s := pg_temp.ec10_n(pg_temp.ec10_event(v_case_i->'earning', 0)->'fin');
  if v_s is null or abs(v_s - v_g_umunze_well1_amg_payment) > 1e-9 * abs(v_g_umunze_well1_amg_payment) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/umunze_well1_amg_payment]', v_s, v_g_umunze_well1_amg_payment;
  end if;
  v_s := pg_temp.ec10_n(pg_temp.ec10_event(v_case_i->'earning', 1)->'farmor');
  if v_s is null or abs(v_s - v_g_umunze_well2_umz_payment) > 1e-9 * abs(v_g_umunze_well2_umz_payment) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/umunze_well2_umz_payment]', v_s, v_g_umunze_well2_umz_payment;
  end if;
  v_s := pg_temp.ec10_emv(v_case_i->'deal', pg_temp.ec10_n(v_case_i->'deal'->'deal'->'farmineePaysPct'));
  if v_s is null or abs(v_s - v_g_umunze_amg_emv) > 1e-9 * abs(v_g_umunze_amg_emv) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/umunze_amg_emv]', v_s, v_g_umunze_amg_emv;
  end if;
  v_s := pg_temp.ec10_breakeven_share(v_case_i->'deal');
  if v_s is null or abs(v_s - v_g_umunze_breakeven_share_pct) > 1e-9 * abs(v_g_umunze_breakeven_share_pct) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/umunze_breakeven_share_pct]', v_s, v_g_umunze_breakeven_share_pct;
  end if;
  v_s := pg_temp.ec10_breakeven_chance(v_case_i->'deal');
  if v_s is null or abs(v_s - v_g_umunze_amg_breakeven_chance_pct) > 1e-9 * abs(v_g_umunze_amg_breakeven_chance_pct) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/umunze_amg_breakeven_chance_pct]', v_s, v_g_umunze_amg_breakeven_chance_pct;
  end if;
  v_s := pg_temp.ec10_n(v_case_i->'fee'->'transactionValue') * 7.0 / 100.0;
  if v_s is null or abs(v_s - v_g_umunze_consent_fee) > 1e-9 * abs(v_g_umunze_consent_fee) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/umunze_consent_fee]', v_s, v_g_umunze_consent_fee;
  end if;
  v_s := pg_temp.ec10_info(v_case_a->'information', 'evii', 0);
  if v_s is null or abs(v_s - v_g_akpugo_ezi_evii) > 1e-9 * abs(v_g_akpugo_ezi_evii) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/akpugo_ezi_evii]', v_s, v_g_akpugo_ezi_evii;
  end if;
  v_s := pg_temp.ec10_info(v_case_a->'information', 'posterior', 0);
  if v_s is null or abs(v_s - v_g_akpugo_strong_posterior_pct) > 1e-9 * abs(v_g_akpugo_strong_posterior_pct) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/akpugo_strong_posterior_pct]', v_s, v_g_akpugo_strong_posterior_pct;
  end if;
  v_s := pg_temp.ec10_price(v_case_a->'price', 'perPct');
  if v_s is null or abs(v_s - v_g_akpugo_risked_value_per_pct) > 1e-9 * abs(v_g_akpugo_risked_value_per_pct) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/akpugo_risked_value_per_pct]', v_s, v_g_akpugo_risked_value_per_pct;
  end if;
  v_s := pg_temp.ec10_price(v_case_a->'price', 'priceToValue');
  if v_s is null or abs(v_s - v_g_akpugo_price_to_value) > 1e-9 * abs(v_g_akpugo_price_to_value) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/akpugo_price_to_value]', v_s, v_g_akpugo_price_to_value;
  end if;
  v_s := pg_temp.ec10_devcarry(v_case_a->'devCarry', 2035);
  if v_s is null or abs(v_s - v_g_akpugo_2035_carry_balance) > 1e-9 * abs(v_g_akpugo_2035_carry_balance) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/akpugo_2035_carry_balance]', v_s, v_g_akpugo_2035_carry_balance;
  end if;
  v_s := pg_temp.ec10_backin(v_case_a->'backIn', 'OBR');
  if v_s is null or abs(v_s - v_g_akpugo_backin_refund_to_obr) > 1e-9 * abs(v_g_akpugo_backin_refund_to_obr) then
    raise exception 'EC10 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/akpugo_backin_refund_to_obr]', v_s, v_g_akpugo_backin_refund_to_obr;
  end if;

  -- ---------------------------------------------------- 3. against the oracle
  -- oracle_check.py --json, run when this file was generated: the value the
  -- vendored stdlib oracle computed, written in, with the module it came from.
  -- ogbaku_ihe_well_payment: tools/validation/economics/oracle_farmout.py
  if abs(v_g_ogbaku_ihe_well_payment - 16566000.22::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 16566000.22, not within 5e-07 of the seeded % [graded field: beginner/ogbaku_ihe_well_payment]', v_g_ogbaku_ihe_well_payment;
  end if;
  -- ogbaku_ogb_well_payment: tools/validation/economics/oracle_farmout.py
  if abs(v_g_ogbaku_ogb_well_payment - 6118125.08125::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 6118125.08125, not within 5e-07 of the seeded % [graded field: beginner/ogbaku_ogb_well_payment]', v_g_ogbaku_ogb_well_payment;
  end if;
  -- ogbaku_promote_ratio: tools/validation/economics/oracle_farmout.py
  if abs(v_g_ogbaku_promote_ratio - 1.3858267716535433::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 1.3858267716535433, not within 5e-07 of the seeded % [graded field: beginner/ogbaku_promote_ratio]', v_g_ogbaku_promote_ratio;
  end if;
  -- ogbaku_carry: tools/validation/economics/oracle_farmout.py
  if abs(v_g_ogbaku_carry - 4612125.06125::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 4612125.06125, not within 5e-07 of the seeded % [graded field: beginner/ogbaku_carry]', v_g_ogbaku_carry;
  end if;
  -- ogbaku_consideration: tools/validation/economics/oracle_farmout.py
  if abs(v_g_ogbaku_consideration - 8538650.93825::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 8538650.93825, not within 5e-07 of the seeded % [graded field: beginner/ogbaku_consideration]', v_g_ogbaku_consideration;
  end if;
  -- ogbaku_equivalent_wi_pct: tools/validation/economics/oracle_farmout.py
  if abs(v_g_ogbaku_equivalent_wi_pct - 54.4290194551259::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 54.4290194551259, not within 5e-07 of the seeded % [graded field: beginner/ogbaku_equivalent_wi_pct]', v_g_ogbaku_equivalent_wi_pct;
  end if;
  -- umunze_well1_amg_payment: tools/validation/economics/oracle_farmout.py
  if abs(v_g_umunze_well1_amg_payment - 21201600.06::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 21201600.06, not within 5e-07 of the seeded % [graded field: intermediate/umunze_well1_amg_payment]', v_g_umunze_well1_amg_payment;
  end if;
  -- umunze_well2_umz_payment: tools/validation/economics/oracle_farmout.py
  if abs(v_g_umunze_well2_umz_payment - 8363374.613999999::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 8363374.613999999, not within 5e-07 of the seeded % [graded field: intermediate/umunze_well2_umz_payment]', v_g_umunze_well2_umz_payment;
  end if;
  -- umunze_amg_emv: tools/validation/economics/oracle_farmout.py
  if abs(v_g_umunze_amg_emv - -4959060.3937::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives -4959060.3937, not within 5e-07 of the seeded % [graded field: intermediate/umunze_amg_emv]', v_g_umunze_amg_emv;
  end if;
  -- umunze_breakeven_share_pct: tools/validation/economics/oracle_farmout.py
  if abs(v_g_umunze_breakeven_share_pct - 29.530023247226232::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 29.530023247226232, not within 5e-07 of the seeded % [graded field: intermediate/umunze_breakeven_share_pct]', v_g_umunze_breakeven_share_pct;
  end if;
  -- umunze_amg_breakeven_chance_pct: tools/validation/economics/oracle_farmout.py
  if abs(v_g_umunze_amg_breakeven_chance_pct - 29.150172704609083::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 29.150172704609083, not within 5e-07 of the seeded % [graded field: intermediate/umunze_amg_breakeven_chance_pct]', v_g_umunze_amg_breakeven_chance_pct;
  end if;
  -- umunze_consent_fee: tools/validation/economics/oracle_farmout.py
  if abs(v_g_umunze_consent_fee - 450625.04199999996::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 450625.04199999996, not within 5e-07 of the seeded % [graded field: intermediate/umunze_consent_fee]', v_g_umunze_consent_fee;
  end if;
  -- akpugo_ezi_evii: tools/validation/economics/oracle_farmout.py
  if abs(v_g_akpugo_ezi_evii - 7596515.043542693::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 7596515.043542693, not within 5e-07 of the seeded % [graded field: advanced/akpugo_ezi_evii]', v_g_akpugo_ezi_evii;
  end if;
  -- akpugo_strong_posterior_pct: tools/validation/economics/oracle_farmout.py
  if abs(v_g_akpugo_strong_posterior_pct - 43.586702196802285::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 43.586702196802285, not within 5e-07 of the seeded % [graded field: advanced/akpugo_strong_posterior_pct]', v_g_akpugo_strong_posterior_pct;
  end if;
  -- akpugo_risked_value_per_pct: tools/validation/economics/oracle_farmout.py
  if abs(v_g_akpugo_risked_value_per_pct - 281165.493425::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 281165.493425, not within 5e-07 of the seeded % [graded field: advanced/akpugo_risked_value_per_pct]', v_g_akpugo_risked_value_per_pct;
  end if;
  -- akpugo_price_to_value: tools/validation/economics/oracle_farmout.py
  if abs(v_g_akpugo_price_to_value - 1.3551341647951192::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 1.3551341647951192, not within 5e-07 of the seeded % [graded field: advanced/akpugo_price_to_value]', v_g_akpugo_price_to_value;
  end if;
  -- akpugo_2035_carry_balance: tools/validation/economics/oracle_farmout.py
  if abs(v_g_akpugo_2035_carry_balance - 61235569.92884742::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 61235569.92884742, not within 5e-07 of the seeded % [graded field: advanced/akpugo_2035_carry_balance]', v_g_akpugo_2035_carry_balance;
  end if;
  -- akpugo_backin_refund_to_obr: tools/validation/economics/oracle_farmout.py
  if abs(v_g_akpugo_backin_refund_to_obr - 22328311.42883772::double precision) > 5e-07::double precision then
    raise exception 'EC10 go-live refused: the oracle gives 22328311.42883772, not within 5e-07 of the seeded % [graded field: advanced/akpugo_backin_refund_to_obr]', v_g_akpugo_backin_refund_to_obr;
  end if;

  -- ------------------------------------------------------------- 4. the traps
  -- Every wrong method discriminate.mjs swept through the engine for a field,
  -- by value: each must miss the seeded value by more than the tolerance, or
  -- the field does not discriminate the trap it is for.
  v_wrong := 11953875.15875::double precision;
  if abs(v_wrong - v_g_ogbaku_ihe_well_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (pays its earned share only) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_ihe_well_payment]', v_wrong, v_g_ogbaku_ihe_well_payment;
  end if;
  v_wrong := 4612125.06125::double precision;
  if abs(v_wrong - v_g_ogbaku_ihe_well_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (pays the promote points only) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_ihe_well_payment]', v_wrong, v_g_ogbaku_ihe_well_payment;
  end if;
  v_wrong := 9981015.13255::double precision;
  if abs(v_wrong - v_g_ogbaku_ihe_well_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (its share of the farmors interest) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_ihe_well_payment]', v_wrong, v_g_ogbaku_ihe_well_payment;
  end if;
  v_wrong := 17816000.97::double precision;
  if abs(v_wrong - v_g_ogbaku_ihe_well_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the bonus counted in the payment) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_ihe_well_payment]', v_wrong, v_g_ogbaku_ihe_well_payment;
  end if;
  v_wrong := 10730250.1425::double precision;
  if abs(v_wrong - v_g_ogbaku_ogb_well_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the farmor pays its post deal share) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_ogb_well_payment]', v_wrong, v_g_ogbaku_ogb_well_payment;
  end if;
  v_wrong := 22684125.30125::double precision;
  if abs(v_wrong - v_g_ogbaku_ogb_well_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the farmor pays its whole interest) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_ogb_well_payment]', v_wrong, v_g_ogbaku_ogb_well_payment;
  end if;
  v_wrong := 4612125.06125::double precision;
  if abs(v_wrong - v_g_ogbaku_ogb_well_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the farmor pays the promote) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_ogb_well_payment]', v_wrong, v_g_ogbaku_ogb_well_payment;
  end if;
  v_wrong := 4868124.33125::double precision;
  if abs(v_wrong - v_g_ogbaku_ogb_well_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the bonus taken off the farmors payment) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_ogb_well_payment]', v_wrong, v_g_ogbaku_ogb_well_payment;
  end if;
  v_wrong := 1.543859649122807::double precision;
  if abs(v_wrong - v_g_ogbaku_promote_ratio) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (promote ratio over retained) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_promote_ratio]', v_wrong, v_g_ogbaku_promote_ratio;
  end if;
  v_wrong := 12.25::double precision;
  if abs(v_wrong - v_g_ogbaku_promote_ratio) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the points as the ratio) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_promote_ratio]', v_wrong, v_g_ogbaku_promote_ratio;
  end if;
  v_wrong := 0.7215909090909091::double precision;
  if abs(v_wrong - v_g_ogbaku_promote_ratio) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the ratio inverted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_promote_ratio]', v_wrong, v_g_ogbaku_promote_ratio;
  end if;
  v_wrong := 0.7302904564315352::double precision;
  if abs(v_wrong - v_g_ogbaku_promote_ratio) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the ratio over the farmors interest) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_promote_ratio]', v_wrong, v_g_ogbaku_promote_ratio;
  end if;
  v_wrong := 16566000.22::double precision;
  if abs(v_wrong - v_g_ogbaku_carry) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the whole payment as the carry) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_carry]', v_wrong, v_g_ogbaku_carry;
  end if;
  v_wrong := 2778805.3494031252::double precision;
  if abs(v_wrong - v_g_ogbaku_carry) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the carry on the farmors share) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_carry]', v_wrong, v_g_ogbaku_carry;
  end if;
  v_wrong := 6118125.08125::double precision;
  if abs(v_wrong - v_g_ogbaku_carry) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the farmors payment as the carry) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_carry]', v_wrong, v_g_ogbaku_carry;
  end if;
  v_wrong := 9788651.688250002::double precision;
  if abs(v_wrong - v_g_ogbaku_consideration) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (consideration bonus twice) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_consideration]', v_wrong, v_g_ogbaku_consideration;
  end if;
  v_wrong := 14292126.211250002::double precision;
  if abs(v_wrong - v_g_ogbaku_consideration) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (reimbursement whole past costs) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_consideration]', v_wrong, v_g_ogbaku_consideration;
  end if;
  v_wrong := 3926525.8770000003::double precision;
  if abs(v_wrong - v_g_ogbaku_consideration) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the carry left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_consideration]', v_wrong, v_g_ogbaku_consideration;
  end if;
  v_wrong := 20492526.097::double precision;
  if abs(v_wrong - v_g_ogbaku_consideration) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the whole payment counted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_consideration]', v_wrong, v_g_ogbaku_consideration;
  end if;
  v_wrong := 44.0::double precision;
  if abs(v_wrong - v_g_ogbaku_equivalent_wi_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (equivalent without cash) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_equivalent_wi_pct]', v_wrong, v_g_ogbaku_equivalent_wi_pct;
  end if;
  v_wrong := 69.71049408086992::double precision;
  if abs(v_wrong - v_g_ogbaku_equivalent_wi_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (reimbursement whole past costs) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_equivalent_wi_pct]', v_wrong, v_g_ogbaku_equivalent_wi_pct;
  end if;
  v_wrong := 44.0::double precision;
  if abs(v_wrong - v_g_ogbaku_equivalent_wi_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the share paid as the equivalent) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_equivalent_wi_pct]', v_wrong, v_g_ogbaku_equivalent_wi_pct;
  end if;
  v_wrong := 90.33862150228364::double precision;
  if abs(v_wrong - v_g_ogbaku_equivalent_wi_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the outlay over the farmors share) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ogbaku_equivalent_wi_pct]', v_wrong, v_g_ogbaku_equivalent_wi_pct;
  end if;
  v_wrong := 21982800.105::double precision;
  if abs(v_wrong - v_g_umunze_well1_amg_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (gross cap ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_well1_amg_payment]', v_wrong, v_g_umunze_well1_amg_payment;
  end if;
  v_wrong := 20160000.0::double precision;
  if abs(v_wrong - v_g_umunze_well1_amg_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (overrun rules swapped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_well1_amg_payment]', v_wrong, v_g_umunze_well1_amg_payment;
  end if;
  v_wrong := 21982801.105::double precision;
  if abs(v_wrong - v_g_umunze_well1_amg_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the excess at the share paid) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_well1_amg_payment]', v_wrong, v_g_umunze_well1_amg_payment;
  end if;
  v_wrong := 22981000.1625::double precision;
  if abs(v_wrong - v_g_umunze_well1_amg_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the excess at the farmors interest) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_well1_amg_payment]', v_wrong, v_g_umunze_well1_amg_payment;
  end if;
  v_wrong := 8287875.106000001::double precision;
  if abs(v_wrong - v_g_umunze_well2_umz_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (carry cap ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_well2_umz_payment]', v_wrong, v_g_umunze_well2_umz_payment;
  end if;
  v_wrong := 8287875.105999999::double precision;
  if abs(v_wrong - v_g_umunze_well2_umz_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the carry cap left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_well2_umz_payment]', v_wrong, v_g_umunze_well2_umz_payment;
  end if;
  v_wrong := 8287875.105999999::double precision;
  if abs(v_wrong - v_g_umunze_well2_umz_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the farmor pays its pre deal share less the share paid) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_well2_umz_payment]', v_wrong, v_g_umunze_well2_umz_payment;
  end if;
  v_wrong := 15869374.71::double precision;
  if abs(v_wrong - v_g_umunze_well2_umz_payment) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the events own interest) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_well2_umz_payment]', v_wrong, v_g_umunze_well2_umz_payment;
  end if;
  v_wrong := 7774499.736499999::double precision;
  if abs(v_wrong - v_g_umunze_amg_emv) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (farminee no dry hole cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_amg_emv]', v_wrong, v_g_umunze_amg_emv;
  end if;
  v_wrong := -6834060.6437::double precision;
  if abs(v_wrong - v_g_umunze_amg_emv) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (bonus double counted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_amg_emv]', v_wrong, v_g_umunze_amg_emv;
  end if;
  v_wrong := -15827060.393700002::double precision;
  if abs(v_wrong - v_g_umunze_amg_emv) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (deal reimbursement whole) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_amg_emv]', v_wrong, v_g_umunze_amg_emv;
  end if;
  v_wrong := -18026196.41422::double precision;
  if abs(v_wrong - v_g_umunze_amg_emv) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (wi scaled twice npv) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_amg_emv]', v_wrong, v_g_umunze_amg_emv;
  end if;
  v_wrong := -5066385.424075002::double precision;
  if abs(v_wrong - v_g_umunze_amg_emv) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (gross cap ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_amg_emv]', v_wrong, v_g_umunze_amg_emv;
  end if;
  v_wrong := 24.81517654791026::double precision;
  if abs(v_wrong - v_g_umunze_breakeven_share_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (bonus double counted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_breakeven_share_pct]', v_wrong, v_g_umunze_breakeven_share_pct;
  end if;
  v_wrong := 34.244869946542195::double precision;
  if abs(v_wrong - v_g_umunze_breakeven_share_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the cash bonus left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_breakeven_share_pct]', v_wrong, v_g_umunze_breakeven_share_pct;
  end if;
  v_wrong := 29.448335187736905::double precision;
  if abs(v_wrong - v_g_umunze_breakeven_share_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the gross cost cap left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_breakeven_share_pct]', v_wrong, v_g_umunze_breakeven_share_pct;
  end if;
  v_wrong := 70.84982729539092::double precision;
  if abs(v_wrong - v_g_umunze_amg_breakeven_chance_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (breakeven chance wrong side) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_amg_breakeven_chance_pct]', v_wrong, v_g_umunze_amg_breakeven_chance_pct;
  end if;
  v_wrong := 9.127967415680738::double precision;
  if abs(v_wrong - v_g_umunze_amg_breakeven_chance_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (farminee no dry hole cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_amg_breakeven_chance_pct]', v_wrong, v_g_umunze_amg_breakeven_chance_pct;
  end if;
  v_wrong := 31.664575533726868::double precision;
  if abs(v_wrong - v_g_umunze_amg_breakeven_chance_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (bonus double counted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_amg_breakeven_chance_pct]', v_wrong, v_g_umunze_amg_breakeven_chance_pct;
  end if;
  v_wrong := 29.337836333494234::double precision;
  if abs(v_wrong - v_g_umunze_amg_breakeven_chance_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (gross cap ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_amg_breakeven_chance_pct]', v_wrong, v_g_umunze_amg_breakeven_chance_pct;
  end if;
  v_wrong := 321875.03::double precision;
  if abs(v_wrong - v_g_umunze_consent_fee) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (fee premium alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_consent_fee]', v_wrong, v_g_umunze_consent_fee;
  end if;
  v_wrong := 128750.01199999999::double precision;
  if abs(v_wrong - v_g_umunze_consent_fee) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the processing fee alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_consent_fee]', v_wrong, v_g_umunze_consent_fee;
  end if;
  v_wrong := 131250.0175::double precision;
  if abs(v_wrong - v_g_umunze_consent_fee) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (seven per cent of the cash bonus) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_consent_fee]', v_wrong, v_g_umunze_consent_fee;
  end if;
  v_wrong := 371490.0175::double precision;
  if abs(v_wrong - v_g_umunze_consent_fee) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (seven per cent of the bonus and the reimbursement) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/umunze_consent_fee]', v_wrong, v_g_umunze_consent_fee;
  end if;
  v_wrong := 7322900.886817656::double precision;
  if abs(v_wrong - v_g_akpugo_ezi_evii) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (voi likelihoods swapped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_ezi_evii]', v_wrong, v_g_akpugo_ezi_evii;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_akpugo_ezi_evii) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (farminee no dry hole cost) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_ezi_evii]', v_wrong, v_g_akpugo_ezi_evii;
  end if;
  v_wrong := 6934916.889682692::double precision;
  if abs(v_wrong - v_g_akpugo_ezi_evii) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (bonus double counted) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_ezi_evii]', v_wrong, v_g_akpugo_ezi_evii;
  end if;
  v_wrong := 16672875.128593747::double precision;
  if abs(v_wrong - v_g_akpugo_ezi_evii) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the evpi as the evii) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_ezi_evii]', v_wrong, v_g_akpugo_ezi_evii;
  end if;
  v_wrong := 6.2519832455416635::double precision;
  if abs(v_wrong - v_g_akpugo_strong_posterior_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (voi likelihoods swapped) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_strong_posterior_pct]', v_wrong, v_g_akpugo_strong_posterior_pct;
  end if;
  v_wrong := 72.5::double precision;
  if abs(v_wrong - v_g_akpugo_strong_posterior_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the likelihood as the posterior) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_strong_posterior_pct]', v_wrong, v_g_akpugo_strong_posterior_pct;
  end if;
  v_wrong := 18.5::double precision;
  if abs(v_wrong - v_g_akpugo_strong_posterior_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the prior unchanged) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_strong_posterior_pct]', v_wrong, v_g_akpugo_strong_posterior_pct;
  end if;
  v_wrong := 30.772::double precision;
  if abs(v_wrong - v_g_akpugo_strong_posterior_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the signal chance as the posterior) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_strong_posterior_pct]', v_wrong, v_g_akpugo_strong_posterior_pct;
  end if;
  v_wrong := 3513699.9975::double precision;
  if abs(v_wrong - v_g_akpugo_risked_value_per_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (risked per pct unrisked) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_risked_value_per_pct]', v_wrong, v_g_akpugo_risked_value_per_pct;
  end if;
  v_wrong := 650034.4995375::double precision;
  if abs(v_wrong - v_g_akpugo_risked_value_per_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (position100 no dry hole) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_risked_value_per_pct]', v_wrong, v_g_akpugo_risked_value_per_pct;
  end if;
  v_wrong := 4027500.0025::double precision;
  if abs(v_wrong - v_g_akpugo_risked_value_per_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the success value per percent before the well) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_risked_value_per_pct]', v_wrong, v_g_akpugo_risked_value_per_pct;
  end if;
  v_wrong := 745087.5004625::double precision;
  if abs(v_wrong - v_g_akpugo_risked_value_per_pct) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the risked success value alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_risked_value_per_pct]', v_wrong, v_g_akpugo_risked_value_per_pct;
  end if;
  v_wrong := 0.10843753489847988::double precision;
  if abs(v_wrong - v_g_akpugo_price_to_value) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (price on unrisked value) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_price_to_value]', v_wrong, v_g_akpugo_price_to_value;
  end if;
  v_wrong := 0.5861488372890804::double precision;
  if abs(v_wrong - v_g_akpugo_price_to_value) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (position100 no dry hole) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_price_to_value]', v_wrong, v_g_akpugo_price_to_value;
  end if;
  v_wrong := 0.3997645786145601::double precision;
  if abs(v_wrong - v_g_akpugo_price_to_value) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the price over the 100 percent value) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_price_to_value]', v_wrong, v_g_akpugo_price_to_value;
  end if;
  v_wrong := 39.97645786145601::double precision;
  if abs(v_wrong - v_g_akpugo_price_to_value) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the interest left out) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_price_to_value]', v_wrong, v_g_akpugo_price_to_value;
  end if;
  v_wrong := 29666774.89787498::double precision;
  if abs(v_wrong - v_g_akpugo_2035_carry_balance) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (carry recovered without uplift) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_2035_carry_balance]', v_wrong, v_g_akpugo_2035_carry_balance;
  end if;
  v_wrong := 0.0::double precision;
  if abs(v_wrong - v_g_akpugo_2035_carry_balance) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (recovered from the whole share) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_2035_carry_balance]', v_wrong, v_g_akpugo_2035_carry_balance;
  end if;
  v_wrong := 175688828.41774154::double precision;
  if abs(v_wrong - v_g_akpugo_2035_carry_balance) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (carried in full) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_2035_carry_balance]', v_wrong, v_g_akpugo_2035_carry_balance;
  end if;
  v_wrong := 24063513.20010965::double precision;
  if abs(v_wrong - v_g_akpugo_backin_refund_to_obr) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (exploration refunded) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_backin_refund_to_obr]', v_wrong, v_g_akpugo_backin_refund_to_obr;
  end if;
  v_wrong := 159487938.7774123::double precision;
  if abs(v_wrong - v_g_akpugo_backin_refund_to_obr) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the refund on the target interest) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_backin_refund_to_obr]', v_wrong, v_g_akpugo_backin_refund_to_obr;
  end if;
  v_wrong := 23140250.02625::double precision;
  if abs(v_wrong - v_g_akpugo_backin_refund_to_obr) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the refund in equal parts) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_backin_refund_to_obr]', v_wrong, v_g_akpugo_backin_refund_to_obr;
  end if;
  v_wrong := 12727137.514437502::double precision;
  if abs(v_wrong - v_g_akpugo_backin_refund_to_obr) <= 5e-07::double precision then
    raise exception 'EC10 go-live refused: the trap (the refund on the licence interest) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/akpugo_backin_refund_to_obr]', v_wrong, v_g_akpugo_backin_refund_to_obr;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'farmout';
  if not exists (select 1 from public.academy_apps where slug = 'farmout' and status = 'available') then
    raise exception 'EC10 go-live refused: farmout did not reach status available';
  end if;
  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon from public.academy_apps;
  raise notice 'EC10 go-live: farmout available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
