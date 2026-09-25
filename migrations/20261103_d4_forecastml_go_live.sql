-- ============================================================================
-- D4 GO-LIVE (HELD): Data-Driven Production Forecasting flips to 'available',
-- the FOURTH course of the Data & AI module, at path_order 69.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/forecastml. The 78 lessons, the teaching lab
-- (forecastLab.js), its three explorer panels and the three capstone case
-- files ship in the ZIP and NOT in this database, so a flip before the upload
-- puts a live catalogue tile in front of a route that does not exist. This
-- file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values d4_capstone.mjs returned through
--      the vendored engines/dataai/forecast.js when this file was generated,
--      to the last bit, so a capstone row an earlier seed left behind, or a
--      move of one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the data in the case files: the
--      smoothing recursions from their published form, the fit by the stated
--      grid and compass rule rebuilt in PL/pgSQL, the metrics and the naive
--      scale from their definitions, the residual bootstrap on the mulberry32
--      stream rebuilt in 64-bit integer arithmetic with the quantile rule on
--      the sorted paths, the Arps fits by the SQL regression aggregates, and
--      the backtests and the comparison with every window refitted, each to
--      1e-9 relative; a near tie (an Arps choice or two ranked methods within
--      1e-9 relative) is refused rather than decided;
--   3. by the TRAPS the course is built on, each of which must bite on these
--      inputs: the reading a learner who missed the lesson would give is
--      computed and refused if it lands within the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
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
-- with the session and create nothing in any schema. Every series is a
-- double precision array, 1-based, oldest month first; "index t" in a comment
-- is the engine's 0-based month, which is element t + 1 here.

-- a x b modulo 2^32 for a, b in [0, 2^32), with b split into 16-bit halves so
-- no product leaves bigint.
create or replace function pg_temp.d4_imul(a bigint, b bigint) returns bigint
language sql immutable as $f$
  select ((a * (b & 65535)) + (((a * (b >> 16)) & 65535) << 16)) & 4294967295
$f$;

-- n draws of mulberry32(seed), each in [0, 1), rebuilt in 64-bit integer
-- arithmetic.
create or replace function pg_temp.d4_u(p_seed bigint, p_n int) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  a bigint := p_seed & 4294967295; t bigint; u double precision[] := '{}'; i int;
begin
  for i in 1 .. p_n loop
    a := (a + 1831565813) & 4294967295;
    t := pg_temp.d4_imul(a # (a >> 15), a | 1);
    t := t # ((t + pg_temp.d4_imul(t # (t >> 7), t | 61)) & 4294967295);
    u := u || ((t # (t >> 14))::double precision / 4294967296.0);
  end loop;
  return u;
end $f$;

-- The recursions from their published form (Gardner and McKenzie 1985 for the
-- damped trend; ses and Holt are phi = 1 with the trend off or on), started
-- at the first observation: l = y[1], and b = y[2] - y[1] with a trend.
-- Returns sse, the final level, the final trend, then the scored one-step
-- residuals in order (from index 1 for ses, index 2 with a trend).
create or replace function pg_temp.d4_run(y double precision[], method text, a double precision,
                                          b double precision, phi double precision) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(y, 1); tr_on boolean := method <> 'ses';
  ph double precision := case when method = 'damped' then phi else 1.0 end;
  sf int := case when method = 'ses' then 1 else 2 end;
  l double precision := y[1]; tr double precision := case when method = 'ses' then 0.0 else y[2] - y[1] end;
  f double precision; e double precision; ln double precision; sse double precision := 0.0;
  res double precision[] := '{}'; t int;
begin
  for t in 2 .. n loop
    f := case when tr_on then l + ph * tr else l end;
    e := y[t] - f;
    if t - 1 >= sf then sse := sse + e * e; res := res || e; end if;
    ln := a * y[t] + (1 - a) * f;
    if tr_on then tr := b * (ln - l) + (1 - b) * ph * tr; end if;
    l := ln;
  end loop;
  return array[sse, l, tr] || res;
end $f$;

-- h point forecasts from a final level and trend.
create or replace function pg_temp.d4_fc(method text, l double precision, tr double precision,
                                         phi double precision, h int) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare out double precision[] := '{}'; s double precision := 0.0; p double precision := 1.0; j int;
begin
  for j in 1 .. h loop
    if method = 'ses' then out := out || l;
    elsif method = 'holt' then out := out || (l + j * tr);
    else p := p * phi; s := s + p; out := out || (l + s * tr);
    end if;
  end loop;
  return out;
end $f$;

-- The least one-step SSE, found by the stated rule: the coarse grid (alpha
-- outermost, then beta, then phi; a later point replaces the best only when
-- below best x (1 - 1e-12)), then the compass search (+step before -step,
-- alpha before beta before phi, a trial clipped to the box and skipped when
-- the clip leaves it where it was; move to the best trial that lowers the
-- SSE; halve after a sweep that improves nothing; stop when a sweep at a step
-- of at most 2^-30 of the range improves nothing). Returns alpha, beta, phi
-- (null where the method has none), the SSE, and 1 when it stopped by the
-- rule (0 at the 200000-evaluation cap).
create or replace function pg_temp.d4_opt(y double precision[], method text) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  d int := case method when 'ses' then 1 when 'holt' then 2 else 3 end;
  ga double precision[] := array[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]::double precision[];
  gp double precision[] := array[0.8, 0.85, 0.9, 0.95, 0.98]::double precision[];
  lo double precision[] := array[0.0, 0.0, 0.8]; hi double precision[] := array[1.0, 1.0, 0.98];
  rg double precision[]; x double precision[]; bx double precision[]; c double precision[];
  fx double precision; bf double precision; f double precision; frac double precision := 0.05;
  ev int := 0; conv int := 0; i int; s int; ia int; ib int; ip int; improved boolean;
begin
  rg := array[hi[1] - lo[1], hi[2] - lo[2], hi[3] - lo[3]];
  fx := null;
  for ia in 1 .. 11 loop
    for ib in 1 .. case when d >= 2 then 11 else 1 end loop
      for ip in 1 .. case when d = 3 then 5 else 1 end loop
        c := array[ga[ia], case when d >= 2 then ga[ib] end, case when d = 3 then gp[ip] end];
        f := (pg_temp.d4_run(y, method, c[1], c[2], c[3]))[1]; ev := ev + 1;
        if fx is null or f < fx - fx * 1e-12 then x := c; fx := f; end if;
      end loop;
    end loop;
  end loop;
  while ev < 200000 loop
    bx := null; bf := fx;
    for i in 1 .. d loop
      foreach s in array array[1, -1] loop
        c := x;
        c[i] := x[i] + s * frac * rg[i];
        if c[i] < lo[i] then c[i] := lo[i]; elsif c[i] > hi[i] then c[i] := hi[i]; end if;
        continue when c[i] = x[i];
        f := (pg_temp.d4_run(y, method, c[1], c[2], c[3]))[1]; ev := ev + 1;
        if f < bf then bx := c; bf := f; end if;
      end loop;
    end loop;
    if bx is not null then x := bx; fx := bf; continue; end if;
    if frac <= 9.313225746154785e-10 then conv := 1; exit; end if;
    frac := frac / 2.0;
  end loop;
  return array[x[1], x[2], x[3], fx, conv];
end $f$;

-- The in-sample lag-m naive MAE of a training series (Hyndman and Koehler
-- 2006), null when it has m values or fewer or every difference is 0.
create or replace function pg_temp.d4_q(y double precision[], m int) returns double precision
language sql immutable as $f$
  select case when array_length(y, 1) <= m then null
              when sum(abs(y[t] - y[t - m])) = 0 then null
              else sum(abs(y[t] - y[t - m])) / (array_length(y, 1) - m)::double precision end
    from generate_series(m + 1, array_length(y, 1)) t
$f$;

-- The quantile rule of lib/stats on SORTED values: idx = n p; a fractional
-- idx takes the ceil(idx)-th value; a whole idx on an even count takes the
-- mean of the idx-th and (idx + 1)-th; on an odd count the (idx + 1)-th.
create or replace function pg_temp.d4_quant(x double precision[], p double precision) returns double precision
language plpgsql immutable as $f$
#variable_conflict use_column
declare n int := array_length(x, 1); idx double precision := array_length(x, 1) * p;
begin
  if p = 1 then return x[n]; end if;
  if p = 0 then return x[1]; end if;
  if idx <> floor(idx) then return x[ceil(idx)::int]; end if;
  if n % 2 = 0 then return (x[idx::int] + x[idx::int + 1]) / 2.0; end if;
  return x[idx::int + 1];
end $f$;

-- The residual bootstrap, rebuilt: nsims paths on one mulberry32 stream,
-- path by path and step by step; each step adds a scored residual drawn with
-- replacement (index floor(u m)) to the one-step forecast, and the simulated
-- value updates the level and trend. Returns the 10th, 50th and 90th
-- percentiles of the paths at each step, 3h numbers: the P90 (low) run,
-- then the P50 run, then the P10 (high) run; a negative percentile is 0
-- when nonneg.
create or replace function pg_temp.d4_boot(y double precision[], method text, a double precision, b double precision,
                                           phi double precision, h int, nsims int, seed bigint, nonneg boolean)
  returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  r double precision[] := pg_temp.d4_run(y, method, a, b, phi);
  pool double precision[] := r[4:array_length(r, 1)];
  m int := array_length(r, 1) - 3; tr_on boolean := method <> 'ses';
  ph double precision := case when method = 'damped' then phi else 1.0 end;
  u double precision[] := pg_temp.d4_u(seed, nsims * h);
  paths double precision[] := array_fill(0.0::double precision, array[h * nsims]);
  l double precision; tr double precision; f double precision; ys double precision; ln double precision;
  k int; j int; q int := 0; srt double precision[];
  lo double precision[] := '{}'; md double precision[] := '{}'; hi double precision[] := '{}';
  v double precision;
begin
  for k in 1 .. nsims loop
    l := r[2]; tr := case when tr_on then r[3] else 0.0 end;
    for j in 1 .. h loop
      q := q + 1;
      f := case when tr_on then l + ph * tr else l end;
      ys := f + pool[floor(u[q] * m)::int + 1];
      paths[(j - 1) * nsims + k] := ys;
      ln := a * ys + (1 - a) * f;
      if tr_on then tr := b * (ln - l) + (1 - b) * ph * tr; end if;
      l := ln;
    end loop;
  end loop;
  for j in 1 .. h loop
    srt := array(select v from unnest(paths[(j - 1) * nsims + 1:j * nsims]) v order by v);
    v := pg_temp.d4_quant(srt, 0.1); lo := lo || case when nonneg and v < 0 then 0.0 else v end;
    v := pg_temp.d4_quant(srt, 0.5); md := md || case when nonneg and v < 0 then 0.0 else v end;
    v := pg_temp.d4_quant(srt, 0.9); hi := hi || case when nonneg and v < 0 then 0.0 else v end;
  end loop;
  return lo || md || hi;
end $f$;

-- The Arps rate at t (calculateArpsHyperbolic's published forms).
create or replace function pg_temp.d4_arps_q(qi double precision, di double precision, b double precision,
                                             t double precision) returns double precision
language sql immutable as $f$
  select case when qi <= 0 or di < 0 or t < 0 then 0.0
              when b <= 0 then qi * exp(-di * t)
              else qi / power(1 + b * di * t, 1 / b) end
$f$;

-- An Arps fit by least squares on the linearised rate, with the SQL
-- regression aggregates regr_slope and regr_intercept: the exponential on
-- ln q, the harmonic on 1/q, and the hyperbolic on q^-b for b from 0.05 by
-- 0.05 to 2 (the steps accumulated as the decline curve engine accumulates
-- them, the harmonic b skipped), each kept only with finite qi > 0 and
-- Di > 0; the lowest RMSE on the rate scale wins (Auto-Select), or the
-- model named. Zero and negative rates are dropped and t = 0 is the first
-- positive month, each later month at its own index. Returns qi, Di, b,
-- RMSE, the 0-based index of t = 0, and the smallest relative RMSE gap the
-- choice turned on (the route refuses to decide a near tie).
create or replace function pg_temp.d4_arps(y double precision[], model text) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  t0 int; tt double precision[]; qq double precision[];
  bb double precision; sl double precision; ic double precision; qi double precision; di double precision;
  rm double precision; best double precision[] := null; hyp double precision[] := null; second double precision := null;
  cands double precision[] := '{}'; gap double precision := 'Infinity'; k int; nc int;
begin
  select min(i) - 1 into t0 from generate_subscripts(y, 1) i where y[i] > 0;
  tt := array(select (i - 1 - t0)::double precision from generate_subscripts(y, 1) i where y[i] > 0 order by i);
  qq := array(select y[i] from generate_subscripts(y, 1) i where y[i] > 0 order by i);
  if model in ('Exponential', 'Auto-Select') then
    select regr_slope(ln(q), t), regr_intercept(ln(q), t) into sl, ic from unnest(tt, qq) p(t, q);
    qi := exp(ic); di := -sl;
    if qi > 0 and di > 0 and qi < 'Infinity' and di < 'Infinity' then
      select sqrt(avg((q - pg_temp.d4_arps_q(qi, di, 0.0, t)) ^ 2)) into rm from unnest(tt, qq) p(t, q);
      cands := cands || array[qi, di, 0.0, rm];
    end if;
  end if;
  if model in ('Harmonic', 'Auto-Select') then
    select regr_slope(1 / q, t), regr_intercept(1 / q, t) into sl, ic from unnest(tt, qq) p(t, q);
    if ic <> 0 then
      qi := 1 / ic; di := sl * qi;
      if qi > 0 and di > 0 and qi < 'Infinity' and di < 'Infinity' then
        select sqrt(avg((q - qi / (1 + di * t)) ^ 2)) into rm from unnest(tt, qq) p(t, q);
        cands := cands || array[qi, di, 1.0, rm];
      end if;
    end if;
  end if;
  if model in ('Hyperbolic', 'Auto-Select') then
    bb := 0.05;
    while bb <= 2 loop
      if abs(bb - 1) >= 0.001 then
        select regr_slope(power(q, -bb), t), regr_intercept(power(q, -bb), t) into sl, ic from unnest(tt, qq) p(t, q);
        if ic > 0 then
          qi := power(ic, -1 / bb); di := sl / (bb * power(qi, -bb));
          if qi > 0 and di > 0 and qi < 'Infinity' and di < 'Infinity' then
            select sqrt(avg((q - pg_temp.d4_arps_q(qi, di, bb, t)) ^ 2)) into rm from unnest(tt, qq) p(t, q);
            if hyp is null or rm < hyp[4] then
              if hyp is not null then second := hyp[4]; end if;
              hyp := array[qi, di, bb, rm];
            elsif second is null or rm < second then
              second := rm;
            end if;
          end if;
        end if;
      end if;
      bb := bb + 0.05;
    end loop;
    if second is not null then gap := least(gap, (second - hyp[4]) / hyp[4]); end if;
    if hyp is not null then cands := cands || hyp; end if;
  end if;
  nc := (coalesce(array_length(cands, 1), 0) / 4.0)::int;
  if nc = 0 then return null; end if;
  for k in 0 .. nc - 1 loop
    if best is null or cands[k * 4 + 4] < best[4] then best := cands[k * 4 + 1:k * 4 + 4]; end if;
  end loop;
  if model = 'Auto-Select' then
    for k in 0 .. nc - 1 loop
      if cands[k * 4 + 4] <> best[4] then gap := least(gap, (cands[k * 4 + 4] - best[4]) / best[4]); end if;
    end loop;
  end if;
  return best || array[t0::double precision, gap];
end $f$;

-- The coarse grid alone (the first stage of d4_opt): the grid point the
-- search would start from, alpha, beta, phi.
create or replace function pg_temp.d4_grid(y double precision[], method text) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  d int := case method when 'ses' then 1 when 'holt' then 2 else 3 end;
  ga double precision[] := array[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]::double precision[];
  gp double precision[] := array[0.8, 0.85, 0.9, 0.95, 0.98]::double precision[];
  x double precision[]; c double precision[]; fx double precision := null; f double precision; ia int; ib int; ip int;
begin
  for ia in 1 .. 11 loop
    for ib in 1 .. case when d >= 2 then 11 else 1 end loop
      for ip in 1 .. case when d = 3 then 5 else 1 end loop
        c := array[ga[ia], case when d >= 2 then ga[ib] end, case when d = 3 then gp[ip] end];
        f := (pg_temp.d4_run(y, method, c[1], c[2], c[3]))[1];
        if fx is null or f < fx - fx * 1e-12 then x := c; fx := f; end if;
      end loop;
    end loop;
  end loop;
  return x;
end $f$;

-- A rolling-origin backtest with an expanding window: origins fo, fo + st,
-- ... while o + hz <= n; at each origin months 0 to o - 1 are fitted
-- (refitted by d4_opt, or held at the first origin's parameters) and hz steps
-- are forecast; e = actual - forecast; each |e| is scaled by its own origin's
-- lag-m naive in-sample MAE. method 'arps' fits d4_arps(model) on every
-- window instead. Returns the pooled RMSE, MAE, MASE (null when any origin
-- has no scale) and ME, then the MAE at each step ahead, then the number of
-- origins, then 1 when every fit stopped by the rule (for arps: the smallest
-- relative RMSE gap its model choices turned on).
create or replace function pg_temp.d4_bt(y double precision[], method text, fo int, hz int, st int,
                                         refit boolean, m int, model text) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(y, 1); o int; j int; k int := 0; tr double precision[]; p double precision[];
  hp double precision[] := null; r double precision[]; fc double precision[]; ar double precision[];
  q double precision; e double precision; se double precision := 0.0; sa double precision := 0.0;
  sm double precision := 0.0; sq double precision := 0.0; qnull boolean := false; cnt int := 0;
  byh double precision[] := array_fill(0.0::double precision, array[hz]); conv double precision := 1.0;
  gap double precision := 'Infinity';
begin
  o := fo;
  while o + hz <= n loop
    k := k + 1;
    tr := y[1:o];
    if method = 'arps' then
      ar := pg_temp.d4_arps(tr, model);
      gap := least(gap, ar[6]);
      fc := array(select pg_temp.d4_arps_q(ar[1], ar[2], ar[3], (o + j - 1 - ar[5])::double precision) from generate_series(1, hz) j order by j);
    else
      if refit or hp is null then p := pg_temp.d4_opt(tr, method); conv := least(conv, p[5]); hp := p; else p := hp; end if;
      r := pg_temp.d4_run(tr, method, p[1], p[2], p[3]);
      fc := pg_temp.d4_fc(method, r[2], r[3], p[3], hz);
    end if;
    q := pg_temp.d4_q(tr, m);
    if q is null then qnull := true; end if;
    for j in 1 .. hz loop
      e := y[o + j] - fc[j];
      cnt := cnt + 1; se := se + e; sa := sa + abs(e); sq := sq + e * e;
      if q is not null then sm := sm + abs(e) / q; end if;
      byh[j] := byh[j] + abs(e);
    end loop;
    o := o + st;
  end loop;
  return array[sqrt(sq / cnt), sa / cnt, case when qnull then null else sm / cnt end, se / cnt]
         || array(select byh[j] / k from generate_series(1, hz) j order by j)
         || array[k::double precision, case when method = 'arps' then gap else conv end];
end $f$;

do $$
#variable_conflict use_column
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int; i int; j int;
  v_names text; v_prompt text; v_s double precision; v_wrong double precision;
  v_p double precision[]; v_r double precision[]; v_f double precision[]; v_y double precision[];
  v_a double precision[]; v_b double precision[]; v_ar double precision[]; v_q double precision;
  v_bt double precision[]; v_bh double precision[]; v_cm double precision[]; v_rk double precision[];
  v_g_agulu2_ses_alpha double precision;
  v_g_agulu1_holt_fixed_mse_bopd2 double precision;
  v_g_agulu1_holt_beta double precision;
  v_g_agulu1_holt_forecast_h12_bopd double precision;
  v_g_agulu1_damped_phi double precision;
  v_g_agulu1_damped_forecast_h24_bopd double precision;
  v_g_nanka1_holdout_damped_smape_pct double precision;
  v_g_nanka1_holdout_damped_mase double precision;
  v_g_nanka1_holdout_damped_me_bopd double precision;
  v_g_nanka2_backtest_holt_rmse_bopd double precision;
  v_g_nanka2_backtest_holt_held_mase double precision;
  v_g_nanka2_backtest_holt_step6_mae_bopd double precision;
  v_g_umunze1_damped_p90_h12_bopd double precision;
  v_g_umunze1_damped_p10_h12_bopd double precision;
  v_g_umunze1_damped_p50_h6_bopd double precision;
  v_g_umunze1_arps_di_per_month double precision;
  v_g_umunze2_compare_arps_mase double precision;
  v_g_umunze2_compare_best_mase double precision;
  v_ag1 double precision[] := array[1396.9, 1352.0, 1211.8, 1153.3, 1063.3, 1035.7, 1015.6, 953.4, 958.2, 827.9, 869.2, 795.1, 700.3, 725.8, 663.9, 662.8, 659.0, 631.1, 605.3, 554.0, 569.6, 542.4, 521.2, 498.9, 482.5, 484.7, 446.0, 424.7, 401.8, 379.4, 395.1, 367.1, 353.0, 328.7, 345.6, 338.4, 331.8, 320.0, 306.5, 298.3, 275.7, 287.3]::double precision[];
  v_ag2 double precision[] := array[627.4, 624.8, 661.6, 640.6, 677.8, 692.7, 588.8, 546.3, 540.6, 587.3, 520.4, 513.4, 520.1, 588.2, 448.4, 468.7, 390.3, 444.9, 449.8, 417.8, 447.3, 408.2, 378.3, 486.5, 379.8, 318.3, 349.1, 363.9, 321.5, 317.7, 337.7, 329.3, 343.9, 289.5, 316.0, 314.3, 255.7, 326.5, 283.0, 303.6, 328.4, 320.3]::double precision[];
  v_nk1 double precision[] := array[1143.6, 962.1, 971.7, 991.2, 912.7, 938.7, 795.4, 837.9, 765.7, 760.3, 785.0, 649.5, 702.6, 636.7, 623.7, 600.4, 554.6, 541.5, 520.3, 553.3, 556.1, 528.4, 491.4, 476.3, 456.2, 442.9, 423.8, 386.2, 402.5, 361.8, 398.4, 376.6, 378.7, 354.7, 377.3, 337.1, 345.7, 322.1, 318.7, 333.5, 0.0, 0.0, 275.6, 270.2, 270.6, 257.8, 268.2, 263.4]::double precision[];
  v_nk2 double precision[] := array[1047.3, 937.2, 993.7, 891.5, 807.8, 764.4, 661.2, 637.8, 597.3, 627.8, 620.6, 551.3, 521.1, 507.4, 424.9, 426.5, 463.4, 378.4, 382.8, 359.7, 391.2, 341.6, 344.1, 306.3, 327.0, 274.7, 277.4, 284.7, 270.2, 267.9, 241.1, 233.5, 221.3, 229.9, 215.5, 216.3, 208.7, 181.6, 188.0, 188.3, 159.3, 157.6, 172.7, 152.8, 153.7, 153.0, 143.4, 140.7, 128.5, 130.0]::double precision[];
  v_um1 double precision[] := array[912.7, 836.1, 795.2, 789.5, 804.6, 696.1, 688.4, 649.3, 592.3, 629.5, 563.0, 568.3, 492.4, 493.6, 509.9, 467.6, 456.5, 428.1, 473.6, 407.1, 424.0, 392.0, 367.3, 346.2, 351.7, 337.4, 324.1, 326.8, 342.9, 312.5, 312.7, 293.0, 282.8, 271.4, 250.7, 239.8, 277.1, 241.8, 245.1, 231.3, 226.8, 225.4, 221.5, 229.7, 206.6]::double precision[];
  v_um2 double precision[] := array[1230.0, 1233.7, 1026.9, 967.7, 942.5, 935.9, 874.5, 803.2, 817.2, 742.2, 742.4, 697.5, 682.1, 638.9, 605.9, 545.7, 605.3, 556.5, 478.1, 470.4, 479.1, 444.8, 455.8, 389.5, 414.3, 388.1, 366.9, 329.5, 0.0, 0.0, 0.0, 464.2, 429.0, 424.9, 406.6, 391.3, 349.9, 354.9, 357.0, 330.8, 323.5, 320.4, 337.7, 303.8, 302.6, 276.2, 284.1, 241.9, 282.5, 243.5, 267.6, 243.4]::double precision[];
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'forecastml' and active;
  if v_structures <> 3 then
    raise exception 'D4 go-live refused: forecastml has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'forecastml';
  if v_questions <> 396 then
    raise exception 'D4 go-live refused: forecastml has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'forecastml' group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'D4 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;
  select count(*) into v_n from (select tier, module_key from public.academy_quiz_questions where app_slug = 'forecastml' and scope = 'module' group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'D4 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'forecastml' and scope = 'final' group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'D4 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = 'forecastml'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'D4 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;
  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'forecastml' and s.active;
  if v_lessons <> 78 then
    raise exception 'D4 go-live refused: forecastml carries % lesson keys, expected 78', v_lessons;
  end if;
  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'forecastml' and s.active;
  if v_modules <> 18 then
    raise exception 'D4 go-live refused: forecastml carries % modules, expected 18 (six per tier)', v_modules;
  end if;
  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'forecastml' and qq.scope = 'module' and not exists (
       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'D4 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'forecastml';
  if v_capstones <> 3 then
    raise exception 'D4 go-live refused: forecastml has % capstones, expected 3', v_capstones;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'forecastml';
  if v_graded <> 18 then
    raise exception 'D4 go-live refused: forecastml has % graded capstone fields, expected 18', v_graded;
  end if;
  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'forecastml' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'D4 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'forecastml' and module = 'data_ai' and path_order = 69 and prereq_slug is null) then
    raise exception 'D4 go-live refused: the forecastml catalogue row is not data_ai at path_order 69 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 69 and slug <> 'forecastml') then
    raise exception 'D4 go-live refused: another course already holds path_order 69';
  end if;

  -- ------------------------------------------------- the grader is numeric
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or abs((f->>'expected')::numeric) <= 0.001
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric is distinct from (select t.tol from (values ('beginner', 'agulu2_ses_alpha', 5e-07::numeric), ('beginner', 'agulu1_holt_fixed_mse_bopd2', 5e-07::numeric), ('beginner', 'agulu1_holt_beta', 5e-07::numeric), ('beginner', 'agulu1_holt_forecast_h12_bopd', 1e-05::numeric), ('beginner', 'agulu1_damped_phi', 5e-07::numeric), ('beginner', 'agulu1_damped_forecast_h24_bopd', 0.0001::numeric), ('intermediate', 'nanka1_holdout_damped_smape_pct', 1e-05::numeric), ('intermediate', 'nanka1_holdout_damped_mase', 5e-07::numeric), ('intermediate', 'nanka1_holdout_damped_me_bopd', 1e-05::numeric), ('intermediate', 'nanka2_backtest_holt_rmse_bopd', 1e-05::numeric), ('intermediate', 'nanka2_backtest_holt_held_mase', 5e-07::numeric), ('intermediate', 'nanka2_backtest_holt_step6_mae_bopd', 1e-05::numeric), ('advanced', 'umunze1_damped_p90_h12_bopd', 0.0001::numeric), ('advanced', 'umunze1_damped_p10_h12_bopd', 1e-05::numeric), ('advanced', 'umunze1_damped_p50_h6_bopd', 1e-05::numeric), ('advanced', 'umunze1_arps_di_per_month', 5e-07::numeric), ('advanced', 'umunze2_compare_arps_mase', 5e-07::numeric), ('advanced', 'umunze2_compare_best_mase', 5e-07::numeric)) t(tier, k, tol) where t.tier = c.tier and t.k = f->>'key')
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'D4 go-live refused: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;
  end if;
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or ((f->>'tol')::numeric = 0.0000005
              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));
  if v_n <> 0 then
    raise exception 'D4 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or, at the six-decimal floor, pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;

  -- ---------------------------------------- the prompts the learner reads
  select prompt into v_prompt from public.academy_capstones where app_slug = 'forecastml' and tier = 'beginner';
  if v_prompt is null or md5(v_prompt) <> '6f11ad4f5764b23c06ee5760acf46788' then
    raise exception 'D4 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'forecastml' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'AGULU, 2 producing wells, 42 months each' and title = 'Smoothing a rate series into a forecast') then
    raise exception 'D4 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['alpha 0.4 and beta 0.15 given', 'forecast at step 12', 'forecast at step 24', 'with alpha and beta both left free', 'with alpha, beta and phi all left free', 'Fit on every month of the well named', 'agulu_rates.csv']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D4 go-live refused: % stated setting(s) or case file(s) are not named in the shipped beginner prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'forecastml' and tier = 'intermediate';
  if v_prompt is null or md5(v_prompt) <> '2ebfa1607e5cc9383fd821af4edb1987' then
    raise exception 'D4 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'forecastml' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'NANKA, 2 producing wells, one shut in' and title = 'Testing a forecast honestly') then
    raise exception 'D4 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['months 0 to 35', 'forecasting 12 steps', 'first origin 18, horizon 6, step 4', 'refitted at every origin, m 1', 'with refit false', 'as the in-sample series and m 1', 'shut in for months 40 and 41', 'nanka_rates.csv']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D4 go-live refused: % stated setting(s) or case file(s) are not named in the shipped intermediate prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'forecastml' and tier = 'advanced';
  if v_prompt is null or md5(v_prompt) <> '0e72e1ec97623da91768e53d7775a13d' then
    raise exception 'D4 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'forecastml' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'UMUNZE, 2 producing wells, one shut in and restarted' and title = 'Uncertainty, the Arps baseline and the engine''s rules') then
    raise exception 'D4 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['h 12, 1000 paths, seed 29, nonNegative true', 'P50 at step 6', 'with the model Auto-Select', 'first origin 33, horizon 6, step 3, refit true, m 1', 'ranked by MASE', 'shut in for months 28 to 30', 'umunze_rates.csv']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D4 go-live refused: % stated setting(s) or case file(s) are not named in the shipped advanced prompt: %', v_n, v_names;
  end if;
  -- No number handed in any capstone text of this course may sit within its
  -- tolerance of any graded value of any tier.
  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names
    from (select c.tier as ctier, m[1]::double precision as x
            from public.academy_capstones c,
                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||
                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),
                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m
           where c.app_slug = 'forecastml') h,
         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'forecastml') g
   where abs(abs(h.x) - abs(g.v)) <= g.t;
  if v_n <> 0 then
    raise exception 'D4 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_agulu2_ses_alpha
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'beginner' and f->>'key' = 'agulu2_ses_alpha';
  if v_g_agulu2_ses_alpha is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: beginner/agulu2_ses_alpha]';
  end if;
  select (f->>'expected')::double precision into v_g_agulu1_holt_fixed_mse_bopd2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'beginner' and f->>'key' = 'agulu1_holt_fixed_mse_bopd2';
  if v_g_agulu1_holt_fixed_mse_bopd2 is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: beginner/agulu1_holt_fixed_mse_bopd2]';
  end if;
  select (f->>'expected')::double precision into v_g_agulu1_holt_beta
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'beginner' and f->>'key' = 'agulu1_holt_beta';
  if v_g_agulu1_holt_beta is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: beginner/agulu1_holt_beta]';
  end if;
  select (f->>'expected')::double precision into v_g_agulu1_holt_forecast_h12_bopd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'beginner' and f->>'key' = 'agulu1_holt_forecast_h12_bopd';
  if v_g_agulu1_holt_forecast_h12_bopd is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: beginner/agulu1_holt_forecast_h12_bopd]';
  end if;
  select (f->>'expected')::double precision into v_g_agulu1_damped_phi
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'beginner' and f->>'key' = 'agulu1_damped_phi';
  if v_g_agulu1_damped_phi is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: beginner/agulu1_damped_phi]';
  end if;
  select (f->>'expected')::double precision into v_g_agulu1_damped_forecast_h24_bopd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'beginner' and f->>'key' = 'agulu1_damped_forecast_h24_bopd';
  if v_g_agulu1_damped_forecast_h24_bopd is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: beginner/agulu1_damped_forecast_h24_bopd]';
  end if;
  select (f->>'expected')::double precision into v_g_nanka1_holdout_damped_smape_pct
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'intermediate' and f->>'key' = 'nanka1_holdout_damped_smape_pct';
  if v_g_nanka1_holdout_damped_smape_pct is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: intermediate/nanka1_holdout_damped_smape_pct]';
  end if;
  select (f->>'expected')::double precision into v_g_nanka1_holdout_damped_mase
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'intermediate' and f->>'key' = 'nanka1_holdout_damped_mase';
  if v_g_nanka1_holdout_damped_mase is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: intermediate/nanka1_holdout_damped_mase]';
  end if;
  select (f->>'expected')::double precision into v_g_nanka1_holdout_damped_me_bopd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'intermediate' and f->>'key' = 'nanka1_holdout_damped_me_bopd';
  if v_g_nanka1_holdout_damped_me_bopd is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: intermediate/nanka1_holdout_damped_me_bopd]';
  end if;
  select (f->>'expected')::double precision into v_g_nanka2_backtest_holt_rmse_bopd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'intermediate' and f->>'key' = 'nanka2_backtest_holt_rmse_bopd';
  if v_g_nanka2_backtest_holt_rmse_bopd is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: intermediate/nanka2_backtest_holt_rmse_bopd]';
  end if;
  select (f->>'expected')::double precision into v_g_nanka2_backtest_holt_held_mase
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'intermediate' and f->>'key' = 'nanka2_backtest_holt_held_mase';
  if v_g_nanka2_backtest_holt_held_mase is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: intermediate/nanka2_backtest_holt_held_mase]';
  end if;
  select (f->>'expected')::double precision into v_g_nanka2_backtest_holt_step6_mae_bopd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'intermediate' and f->>'key' = 'nanka2_backtest_holt_step6_mae_bopd';
  if v_g_nanka2_backtest_holt_step6_mae_bopd is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: intermediate/nanka2_backtest_holt_step6_mae_bopd]';
  end if;
  select (f->>'expected')::double precision into v_g_umunze1_damped_p90_h12_bopd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'advanced' and f->>'key' = 'umunze1_damped_p90_h12_bopd';
  if v_g_umunze1_damped_p90_h12_bopd is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: advanced/umunze1_damped_p90_h12_bopd]';
  end if;
  select (f->>'expected')::double precision into v_g_umunze1_damped_p10_h12_bopd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'advanced' and f->>'key' = 'umunze1_damped_p10_h12_bopd';
  if v_g_umunze1_damped_p10_h12_bopd is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: advanced/umunze1_damped_p10_h12_bopd]';
  end if;
  select (f->>'expected')::double precision into v_g_umunze1_damped_p50_h6_bopd
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'advanced' and f->>'key' = 'umunze1_damped_p50_h6_bopd';
  if v_g_umunze1_damped_p50_h6_bopd is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: advanced/umunze1_damped_p50_h6_bopd]';
  end if;
  select (f->>'expected')::double precision into v_g_umunze1_arps_di_per_month
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'advanced' and f->>'key' = 'umunze1_arps_di_per_month';
  if v_g_umunze1_arps_di_per_month is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: advanced/umunze1_arps_di_per_month]';
  end if;
  select (f->>'expected')::double precision into v_g_umunze2_compare_arps_mase
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'advanced' and f->>'key' = 'umunze2_compare_arps_mase';
  if v_g_umunze2_compare_arps_mase is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: advanced/umunze2_compare_arps_mase]';
  end if;
  select (f->>'expected')::double precision into v_g_umunze2_compare_best_mase
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'forecastml' and c.tier = 'advanced' and f->>'key' = 'umunze2_compare_best_mase';
  if v_g_umunze2_compare_best_mase is null then
    raise exception 'D4 go-live refused: the seeded rows carry no value [graded field: advanced/umunze2_compare_best_mase]';
  end if;

  -- ------------------------------------------ 1. against the engine ledger
  if v_g_agulu2_ses_alpha <> 0.5554212108254432 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 0.5554212108254432 [graded field: beginner/agulu2_ses_alpha]', v_g_agulu2_ses_alpha;
  end if;
  if v_g_agulu1_holt_fixed_mse_bopd2 <> 1557.116998731944 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 1557.116998731944 [graded field: beginner/agulu1_holt_fixed_mse_bopd2]', v_g_agulu1_holt_fixed_mse_bopd2;
  end if;
  if v_g_agulu1_holt_beta <> 0.257987117767334 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 0.257987117767334 [graded field: beginner/agulu1_holt_beta]', v_g_agulu1_holt_beta;
  end if;
  if v_g_agulu1_holt_forecast_h12_bopd <> 178.71280696811394 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 178.71280696811394 [graded field: beginner/agulu1_holt_forecast_h12_bopd]', v_g_agulu1_holt_forecast_h12_bopd;
  end if;
  if v_g_agulu1_damped_phi <> 0.9588943874835968 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 0.9588943874835968 [graded field: beginner/agulu1_damped_phi]', v_g_agulu1_damped_phi;
  end if;
  if v_g_agulu1_damped_forecast_h24_bopd <> 165.93091668046597 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 165.93091668046597 [graded field: beginner/agulu1_damped_forecast_h24_bopd]', v_g_agulu1_damped_forecast_h24_bopd;
  end if;
  if v_g_nanka1_holdout_damped_smape_pct <> 43.676026323068925 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 43.676026323068925 [graded field: intermediate/nanka1_holdout_damped_smape_pct]', v_g_nanka1_holdout_damped_smape_pct;
  end if;
  if v_g_nanka1_holdout_damped_mase <> 2.162820964083014 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 2.162820964083014 [graded field: intermediate/nanka1_holdout_damped_mase]', v_g_nanka1_holdout_damped_mase;
  end if;
  if v_g_nanka1_holdout_damped_me_bopd <> -84.76609714686862 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned -84.76609714686862 [graded field: intermediate/nanka1_holdout_damped_me_bopd]', v_g_nanka1_holdout_damped_me_bopd;
  end if;
  if v_g_nanka2_backtest_holt_rmse_bopd <> 32.871937503375555 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 32.871937503375555 [graded field: intermediate/nanka2_backtest_holt_rmse_bopd]', v_g_nanka2_backtest_holt_rmse_bopd;
  end if;
  if v_g_nanka2_backtest_holt_held_mase <> 0.6195859568435137 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 0.6195859568435137 [graded field: intermediate/nanka2_backtest_holt_held_mase]', v_g_nanka2_backtest_holt_held_mase;
  end if;
  if v_g_nanka2_backtest_holt_step6_mae_bopd <> 33.483471338670675 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 33.483471338670675 [graded field: intermediate/nanka2_backtest_holt_step6_mae_bopd]', v_g_nanka2_backtest_holt_step6_mae_bopd;
  end if;
  if v_g_umunze1_damped_p90_h12_bopd <> 77.53186379015042 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 77.53186379015042 [graded field: advanced/umunze1_damped_p90_h12_bopd]', v_g_umunze1_damped_p90_h12_bopd;
  end if;
  if v_g_umunze1_damped_p10_h12_bopd <> 255.05613380249784 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 255.05613380249784 [graded field: advanced/umunze1_damped_p10_h12_bopd]', v_g_umunze1_damped_p10_h12_bopd;
  end if;
  if v_g_umunze1_damped_p50_h6_bopd <> 185.27163894112164 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 185.27163894112164 [graded field: advanced/umunze1_damped_p50_h6_bopd]', v_g_umunze1_damped_p50_h6_bopd;
  end if;
  if v_g_umunze1_arps_di_per_month <> 0.053067976143630034 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 0.053067976143630034 [graded field: advanced/umunze1_arps_di_per_month]', v_g_umunze1_arps_di_per_month;
  end if;
  if v_g_umunze2_compare_arps_mase <> 0.4876127603859749 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 0.4876127603859749 [graded field: advanced/umunze2_compare_arps_mase]', v_g_umunze2_compare_arps_mase;
  end if;
  if v_g_umunze2_compare_best_mase <> 0.3618511672231542 then
    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned 0.3618511672231542 [graded field: advanced/umunze2_compare_best_mase]', v_g_umunze2_compare_best_mase;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  v_p := pg_temp.d4_opt(v_ag2, 'ses');
  if (v_p[5]) <> 1.0 then
    raise exception 'D4 go-live refused: a second route fit stopped at the evaluation cap before the stop rule [graded field: beginner/agulu2_ses_alpha]';
  end if;
  v_s := v_p[1];
  if v_s is null or abs(v_s - v_g_agulu2_ses_alpha) > 1e-9 * greatest(1.0, abs(v_g_agulu2_ses_alpha)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/agulu2_ses_alpha]', v_s, v_g_agulu2_ses_alpha;
  end if;
  v_r := pg_temp.d4_run(v_ag1, 'holt', 0.4, 0.15, null);
  v_s := v_r[1] / (array_length(v_ag1, 1) - 2)::double precision;
  if v_s is null or abs(v_s - v_g_agulu1_holt_fixed_mse_bopd2) > 1e-9 * greatest(1.0, abs(v_g_agulu1_holt_fixed_mse_bopd2)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/agulu1_holt_fixed_mse_bopd2]', v_s, v_g_agulu1_holt_fixed_mse_bopd2;
  end if;
  v_p := pg_temp.d4_opt(v_ag1, 'holt');
  if (v_p[5]) <> 1.0 then
    raise exception 'D4 go-live refused: a second route fit stopped at the evaluation cap before the stop rule [graded field: beginner/agulu1_holt_beta]';
  end if;
  v_s := v_p[2];
  if v_s is null or abs(v_s - v_g_agulu1_holt_beta) > 1e-9 * greatest(1.0, abs(v_g_agulu1_holt_beta)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/agulu1_holt_beta]', v_s, v_g_agulu1_holt_beta;
  end if;
  v_r := pg_temp.d4_run(v_ag1, 'holt', v_p[1], v_p[2], null);
  v_s := (pg_temp.d4_fc('holt', v_r[2], v_r[3], null, 12))[12];
  if v_s is null or abs(v_s - v_g_agulu1_holt_forecast_h12_bopd) > 1e-9 * greatest(1.0, abs(v_g_agulu1_holt_forecast_h12_bopd)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/agulu1_holt_forecast_h12_bopd]', v_s, v_g_agulu1_holt_forecast_h12_bopd;
  end if;
  v_p := pg_temp.d4_opt(v_ag1, 'damped');
  if (v_p[5]) <> 1.0 then
    raise exception 'D4 go-live refused: a second route fit stopped at the evaluation cap before the stop rule [graded field: beginner/agulu1_damped_phi]';
  end if;
  v_s := v_p[3];
  if v_s is null or abs(v_s - v_g_agulu1_damped_phi) > 1e-9 * greatest(1.0, abs(v_g_agulu1_damped_phi)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/agulu1_damped_phi]', v_s, v_g_agulu1_damped_phi;
  end if;
  v_r := pg_temp.d4_run(v_ag1, 'damped', v_p[1], v_p[2], v_p[3]);
  v_s := (pg_temp.d4_fc('damped', v_r[2], v_r[3], v_p[3], 24))[24];
  if v_s is null or abs(v_s - v_g_agulu1_damped_forecast_h24_bopd) > 1e-9 * greatest(1.0, abs(v_g_agulu1_damped_forecast_h24_bopd)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/agulu1_damped_forecast_h24_bopd]', v_s, v_g_agulu1_damped_forecast_h24_bopd;
  end if;
  v_y := v_nk1[1:36];
  v_a := v_nk1[37:48];
  v_p := pg_temp.d4_opt(v_y, 'damped');
  v_r := pg_temp.d4_run(v_y, 'damped', v_p[1], v_p[2], v_p[3]);
  v_f := pg_temp.d4_fc('damped', v_r[2], v_r[3], v_p[3], 12);
  v_q := pg_temp.d4_q(v_y, 1);
  if (v_p[5]) <> 1.0 then
    raise exception 'D4 go-live refused: a second route fit stopped at the evaluation cap before the stop rule [graded field: intermediate/nanka1_holdout_damped_smape_pct]';
  end if;
  v_s := 100 * (select avg(case when abs(v_a[i]) + abs(v_f[i]) = 0 then 0.0
                                else 2 * abs(v_a[i] - v_f[i]) / (abs(v_a[i]) + abs(v_f[i])) end)
                 from generate_subscripts(v_a, 1) i);
  if v_s is null or abs(v_s - v_g_nanka1_holdout_damped_smape_pct) > 1e-9 * greatest(1.0, abs(v_g_nanka1_holdout_damped_smape_pct)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nanka1_holdout_damped_smape_pct]', v_s, v_g_nanka1_holdout_damped_smape_pct;
  end if;
  v_s := (select avg(abs(v_a[i] - v_f[i])) from generate_subscripts(v_a, 1) i) / v_q;
  if v_s is null or abs(v_s - v_g_nanka1_holdout_damped_mase) > 1e-9 * greatest(1.0, abs(v_g_nanka1_holdout_damped_mase)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nanka1_holdout_damped_mase]', v_s, v_g_nanka1_holdout_damped_mase;
  end if;
  v_s := (select avg(v_a[i] - v_f[i]) from generate_subscripts(v_a, 1) i);
  if v_s is null or abs(v_s - v_g_nanka1_holdout_damped_me_bopd) > 1e-9 * greatest(1.0, abs(v_g_nanka1_holdout_damped_me_bopd)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nanka1_holdout_damped_me_bopd]', v_s, v_g_nanka1_holdout_damped_me_bopd;
  end if;
  v_bt := pg_temp.d4_bt(v_nk2, 'holt', 18, 6, 4, true, 1, null);
  v_bh := pg_temp.d4_bt(v_nk2, 'holt', 18, 6, 4, false, 1, null);
  if (least(v_bt[12], v_bh[12])) <> 1.0 then
    raise exception 'D4 go-live refused: a second route fit stopped at the evaluation cap before the stop rule [graded field: intermediate/nanka2_backtest_holt_rmse_bopd]';
  end if;
  v_s := v_bt[1];
  if v_s is null or abs(v_s - v_g_nanka2_backtest_holt_rmse_bopd) > 1e-9 * greatest(1.0, abs(v_g_nanka2_backtest_holt_rmse_bopd)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nanka2_backtest_holt_rmse_bopd]', v_s, v_g_nanka2_backtest_holt_rmse_bopd;
  end if;
  v_s := v_bh[3];
  if v_s is null or abs(v_s - v_g_nanka2_backtest_holt_held_mase) > 1e-9 * greatest(1.0, abs(v_g_nanka2_backtest_holt_held_mase)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nanka2_backtest_holt_held_mase]', v_s, v_g_nanka2_backtest_holt_held_mase;
  end if;
  v_s := v_bt[10];
  if v_s is null or abs(v_s - v_g_nanka2_backtest_holt_step6_mae_bopd) > 1e-9 * greatest(1.0, abs(v_g_nanka2_backtest_holt_step6_mae_bopd)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nanka2_backtest_holt_step6_mae_bopd]', v_s, v_g_nanka2_backtest_holt_step6_mae_bopd;
  end if;
  v_p := pg_temp.d4_opt(v_um1, 'damped');
  v_b := pg_temp.d4_boot(v_um1, 'damped', v_p[1], v_p[2], v_p[3], 12, 1000, 29, true);
  v_r := pg_temp.d4_run(v_um1, 'damped', v_p[1], v_p[2], v_p[3]);
  v_f := pg_temp.d4_fc('damped', v_r[2], v_r[3], v_p[3], 12);
  if (v_p[5]) <> 1.0 then
    raise exception 'D4 go-live refused: a second route fit stopped at the evaluation cap before the stop rule [graded field: advanced/umunze1_damped_p90_h12_bopd]';
  end if;
  v_s := v_b[12];
  if v_s is null or abs(v_s - v_g_umunze1_damped_p90_h12_bopd) > 1e-9 * greatest(1.0, abs(v_g_umunze1_damped_p90_h12_bopd)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/umunze1_damped_p90_h12_bopd]', v_s, v_g_umunze1_damped_p90_h12_bopd;
  end if;
  v_s := v_b[36];
  if v_s is null or abs(v_s - v_g_umunze1_damped_p10_h12_bopd) > 1e-9 * greatest(1.0, abs(v_g_umunze1_damped_p10_h12_bopd)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/umunze1_damped_p10_h12_bopd]', v_s, v_g_umunze1_damped_p10_h12_bopd;
  end if;
  v_s := v_b[18];
  if v_s is null or abs(v_s - v_g_umunze1_damped_p50_h6_bopd) > 1e-9 * greatest(1.0, abs(v_g_umunze1_damped_p50_h6_bopd)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/umunze1_damped_p50_h6_bopd]', v_s, v_g_umunze1_damped_p50_h6_bopd;
  end if;
  v_ar := pg_temp.d4_arps(v_um1, 'Auto-Select');
  if v_ar is null or v_ar[6] <= 1e-9 then
    raise exception 'D4 go-live refused: the second route Arps choice turns on a near tie (relative RMSE gap %) [graded field: advanced/umunze1_arps_di_per_month]', v_ar[6];
  end if;
  v_s := v_ar[2];
  if v_s is null or abs(v_s - v_g_umunze1_arps_di_per_month) > 1e-9 * greatest(1.0, abs(v_g_umunze1_arps_di_per_month)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/umunze1_arps_di_per_month]', v_s, v_g_umunze1_arps_di_per_month;
  end if;
  v_cm := array[]::double precision[];
  v_bt := pg_temp.d4_bt(v_um2, 'ses', 33, 6, 3, true, 1, 'Auto-Select');
  if (v_bt[12]) <> 1.0 then
    raise exception 'D4 go-live refused: a second route fit stopped at the evaluation cap before the stop rule [graded field: advanced/umunze2_compare_best_mase]';
  end if;
  v_cm := v_cm || v_bt[3];
  v_bt := pg_temp.d4_bt(v_um2, 'holt', 33, 6, 3, true, 1, 'Auto-Select');
  if (v_bt[12]) <> 1.0 then
    raise exception 'D4 go-live refused: a second route fit stopped at the evaluation cap before the stop rule [graded field: advanced/umunze2_compare_best_mase]';
  end if;
  v_cm := v_cm || v_bt[3];
  v_bt := pg_temp.d4_bt(v_um2, 'damped', 33, 6, 3, true, 1, 'Auto-Select');
  if (v_bt[12]) <> 1.0 then
    raise exception 'D4 go-live refused: a second route fit stopped at the evaluation cap before the stop rule [graded field: advanced/umunze2_compare_best_mase]';
  end if;
  v_cm := v_cm || v_bt[3];
  v_bt := pg_temp.d4_bt(v_um2, 'arps', 33, 6, 3, true, 1, 'Auto-Select');
  if v_bt[12] <= 1e-9 then
    raise exception 'D4 go-live refused: a second route Arps window choice turns on a near tie (relative RMSE gap %) [graded field: advanced/umunze2_compare_arps_mase]', v_bt[12];
  end if;
  v_cm := v_cm || v_bt[3];
  v_rk := array(select v from unnest(v_cm) v order by v);
  if v_rk[2] - v_rk[1] <= 1e-9 * v_rk[1] then
    raise exception 'D4 go-live refused: the second route ranking turns on a near tie (% and %) [graded field: advanced/umunze2_compare_best_mase]', v_rk[1], v_rk[2];
  end if;
  v_s := v_cm[4];
  if v_s is null or abs(v_s - v_g_umunze2_compare_arps_mase) > 1e-9 * greatest(1.0, abs(v_g_umunze2_compare_arps_mase)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/umunze2_compare_arps_mase]', v_s, v_g_umunze2_compare_arps_mase;
  end if;
  v_s := v_rk[1];
  if v_s is null or abs(v_s - v_g_umunze2_compare_best_mase) > 1e-9 * greatest(1.0, abs(v_g_umunze2_compare_best_mase)) then
    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/umunze2_compare_best_mase]', v_s, v_g_umunze2_compare_best_mase;
  end if;

  -- ------------------------------------------------------------ 3. the traps
  v_wrong := (pg_temp.d4_grid(v_ag2, 'ses'))[1];
  if v_wrong is null or abs(v_wrong - v_g_agulu2_ses_alpha) <= 5e-07 then
    raise exception 'D4 go-live refused: the grid start quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu2_ses_alpha]', v_wrong, v_g_agulu2_ses_alpha;
  end if;
  v_wrong := (pg_temp.d4_opt(v_ag2[1:36], 'ses'))[1];
  if v_wrong is null or abs(v_wrong - v_g_agulu2_ses_alpha) <= 5e-07 then
    raise exception 'D4 go-live refused: fitted on the first three years gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu2_ses_alpha]', v_wrong, v_g_agulu2_ses_alpha;
  end if;
  v_wrong := (pg_temp.d4_opt(v_ag1, 'ses'))[1];
  if v_wrong is null or abs(v_wrong - v_g_agulu2_ses_alpha) <= 5e-07 then
    raise exception 'D4 go-live refused: the other well gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu2_ses_alpha]', v_wrong, v_g_agulu2_ses_alpha;
  end if;
  v_r := pg_temp.d4_run(v_ag1, 'holt', 0.4, 0.15, null);
  v_wrong := v_r[1];
  if v_wrong is null or abs(v_wrong - v_g_agulu1_holt_fixed_mse_bopd2) <= 5e-07 then
    raise exception 'D4 go-live refused: the SSE quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_holt_fixed_mse_bopd2]', v_wrong, v_g_agulu1_holt_fixed_mse_bopd2;
  end if;
  v_wrong := v_r[1] / array_length(v_ag1, 1)::double precision;
  if v_wrong is null or abs(v_wrong - v_g_agulu1_holt_fixed_mse_bopd2) <= 5e-07 then
    raise exception 'D4 go-live refused: the SSE divided by every month gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_holt_fixed_mse_bopd2]', v_wrong, v_g_agulu1_holt_fixed_mse_bopd2;
  end if;
  v_wrong := sqrt(v_r[1] / (array_length(v_ag1, 1) - 2)::double precision);
  if v_wrong is null or abs(v_wrong - v_g_agulu1_holt_fixed_mse_bopd2) <= 5e-07 then
    raise exception 'D4 go-live refused: the root taken gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_holt_fixed_mse_bopd2]', v_wrong, v_g_agulu1_holt_fixed_mse_bopd2;
  end if;
  v_p := pg_temp.d4_opt(v_ag1, 'holt');
  v_wrong := v_p[1];
  if v_wrong is null or abs(v_wrong - v_g_agulu1_holt_beta) <= 5e-07 then
    raise exception 'D4 go-live refused: the alpha quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_holt_beta]', v_wrong, v_g_agulu1_holt_beta;
  end if;
  v_wrong := 0.15;
  if v_wrong is null or abs(v_wrong - v_g_agulu1_holt_beta) <= 5e-07 then
    raise exception 'D4 go-live refused: the stated beta quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_holt_beta]', v_wrong, v_g_agulu1_holt_beta;
  end if;
  v_wrong := (pg_temp.d4_grid(v_ag1, 'holt'))[2];
  if v_wrong is null or abs(v_wrong - v_g_agulu1_holt_beta) <= 5e-07 then
    raise exception 'D4 go-live refused: the grid start quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_holt_beta]', v_wrong, v_g_agulu1_holt_beta;
  end if;
  v_r := pg_temp.d4_run(v_ag1, 'holt', v_p[1], v_p[2], null);
  v_f := pg_temp.d4_fc('holt', v_r[2], v_r[3], null, 13);
  v_wrong := v_f[11];
  if v_wrong is null or abs(v_wrong - v_g_agulu1_holt_forecast_h12_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the step before gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_holt_forecast_h12_bopd]', v_wrong, v_g_agulu1_holt_forecast_h12_bopd;
  end if;
  v_wrong := v_f[13];
  if v_wrong is null or abs(v_wrong - v_g_agulu1_holt_forecast_h12_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the step after gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_holt_forecast_h12_bopd]', v_wrong, v_g_agulu1_holt_forecast_h12_bopd;
  end if;
  v_r := pg_temp.d4_run(v_ag1, 'holt', 0.4, 0.15, null);
  v_wrong := (pg_temp.d4_fc('holt', v_r[2], v_r[3], null, 12))[12];
  if v_wrong is null or abs(v_wrong - v_g_agulu1_holt_forecast_h12_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the stated parameters used gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_holt_forecast_h12_bopd]', v_wrong, v_g_agulu1_holt_forecast_h12_bopd;
  end if;
  v_p := pg_temp.d4_opt(v_ag1, 'damped');
  v_wrong := 0.98;
  if v_wrong is null or abs(v_wrong - v_g_agulu1_damped_phi) <= 5e-07 then
    raise exception 'D4 go-live refused: the upper bound quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_damped_phi]', v_wrong, v_g_agulu1_damped_phi;
  end if;
  v_wrong := v_p[1];
  if v_wrong is null or abs(v_wrong - v_g_agulu1_damped_phi) <= 5e-07 then
    raise exception 'D4 go-live refused: the alpha quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_damped_phi]', v_wrong, v_g_agulu1_damped_phi;
  end if;
  v_wrong := (pg_temp.d4_grid(v_ag1, 'damped'))[3];
  if v_wrong is null or abs(v_wrong - v_g_agulu1_damped_phi) <= 5e-07 then
    raise exception 'D4 go-live refused: the grid start quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_damped_phi]', v_wrong, v_g_agulu1_damped_phi;
  end if;
  v_r := pg_temp.d4_run(v_ag1, 'damped', v_p[1], v_p[2], v_p[3]);
  v_f := pg_temp.d4_fc('damped', v_r[2], v_r[3], v_p[3], 25);
  v_wrong := v_f[12];
  if v_wrong is null or abs(v_wrong - v_g_agulu1_damped_forecast_h24_bopd) <= 0.0001 then
    raise exception 'D4 go-live refused: the step twelve forecast gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_damped_forecast_h24_bopd]', v_wrong, v_g_agulu1_damped_forecast_h24_bopd;
  end if;
  v_wrong := v_f[25];
  if v_wrong is null or abs(v_wrong - v_g_agulu1_damped_forecast_h24_bopd) <= 0.0001 then
    raise exception 'D4 go-live refused: the step after gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_damped_forecast_h24_bopd]', v_wrong, v_g_agulu1_damped_forecast_h24_bopd;
  end if;
  v_wrong := v_r[2] + v_r[3] * v_p[3] / (1 - v_p[3]);
  if v_wrong is null or abs(v_wrong - v_g_agulu1_damped_forecast_h24_bopd) <= 0.0001 then
    raise exception 'D4 go-live refused: the limit quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/agulu1_damped_forecast_h24_bopd]', v_wrong, v_g_agulu1_damped_forecast_h24_bopd;
  end if;
  v_y := v_nk1[1:36];
  v_a := v_nk1[37:48];
  v_p := pg_temp.d4_opt(v_y, 'damped');
  v_r := pg_temp.d4_run(v_y, 'damped', v_p[1], v_p[2], v_p[3]);
  v_f := pg_temp.d4_fc('damped', v_r[2], v_r[3], v_p[3], 12);
  v_q := pg_temp.d4_q(v_y, 1);
  v_wrong := 50 * (select avg(case when abs(v_a[i]) + abs(v_f[i]) = 0 then 0.0
                                  else 2 * abs(v_a[i] - v_f[i]) / (abs(v_a[i]) + abs(v_f[i])) end)
                   from generate_subscripts(v_a, 1) i);
  if v_wrong is null or abs(v_wrong - v_g_nanka1_holdout_damped_smape_pct) <= 1e-05 then
    raise exception 'D4 go-live refused: sMAPE on 0 to 100 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka1_holdout_damped_smape_pct]', v_wrong, v_g_nanka1_holdout_damped_smape_pct;
  end if;
  v_wrong := 100 * (select avg(abs(v_a[i] - v_f[i]) / abs(v_f[i])) from generate_subscripts(v_a, 1) i);
  if v_wrong is null or abs(v_wrong - v_g_nanka1_holdout_damped_smape_pct) <= 1e-05 then
    raise exception 'D4 go-live refused: the forecast alone in the denominator gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka1_holdout_damped_smape_pct]', v_wrong, v_g_nanka1_holdout_damped_smape_pct;
  end if;
  v_wrong := 100 * (select avg(2 * abs(v_a[i] - v_f[i]) / (abs(v_a[i]) + abs(v_f[i])))
                      from generate_subscripts(v_a, 1) i where v_a[i] <> 0);
  if v_wrong is null or abs(v_wrong - v_g_nanka1_holdout_damped_smape_pct) <= 1e-05 then
    raise exception 'D4 go-live refused: the shut-in months dropped gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka1_holdout_damped_smape_pct]', v_wrong, v_g_nanka1_holdout_damped_smape_pct;
  end if;
  v_wrong := (select avg(abs(v_a[i] - v_f[i])) from generate_subscripts(v_a, 1) i) / pg_temp.d4_q(v_a, 1);
  if v_wrong is null or abs(v_wrong - v_g_nanka1_holdout_damped_mase) <= 5e-07 then
    raise exception 'D4 go-live refused: scaled by the hold-out naive error gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka1_holdout_damped_mase]', v_wrong, v_g_nanka1_holdout_damped_mase;
  end if;
  v_wrong := (select avg(abs(v_a[i] - v_f[i])) from generate_subscripts(v_a, 1) i) / pg_temp.d4_q(v_nk1, 1);
  if v_wrong is null or abs(v_wrong - v_g_nanka1_holdout_damped_mase) <= 5e-07 then
    raise exception 'D4 go-live refused: scaled by the whole series gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka1_holdout_damped_mase]', v_wrong, v_g_nanka1_holdout_damped_mase;
  end if;
  v_wrong := sqrt((select avg((v_a[i] - v_f[i]) ^ 2) from generate_subscripts(v_a, 1) i)) / v_q;
  if v_wrong is null or abs(v_wrong - v_g_nanka1_holdout_damped_mase) <= 5e-07 then
    raise exception 'D4 go-live refused: the RMSE over the scale gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka1_holdout_damped_mase]', v_wrong, v_g_nanka1_holdout_damped_mase;
  end if;
  v_wrong := (select avg(v_f[i] - v_a[i]) from generate_subscripts(v_a, 1) i);
  if v_wrong is null or abs(v_wrong - v_g_nanka1_holdout_damped_me_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: forecast minus actual gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka1_holdout_damped_me_bopd]', v_wrong, v_g_nanka1_holdout_damped_me_bopd;
  end if;
  v_wrong := (select avg(abs(v_a[i] - v_f[i])) from generate_subscripts(v_a, 1) i);
  if v_wrong is null or abs(v_wrong - v_g_nanka1_holdout_damped_me_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the MAE quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka1_holdout_damped_me_bopd]', v_wrong, v_g_nanka1_holdout_damped_me_bopd;
  end if;
  v_wrong := (select avg(v_a[i] - v_f[i]) from generate_subscripts(v_a, 1) i where v_a[i] <> 0);
  if v_wrong is null or abs(v_wrong - v_g_nanka1_holdout_damped_me_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the shut-in months dropped gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka1_holdout_damped_me_bopd]', v_wrong, v_g_nanka1_holdout_damped_me_bopd;
  end if;
  v_bt := pg_temp.d4_bt(v_nk2, 'holt', 18, 6, 4, true, 1, null);
  v_bh := pg_temp.d4_bt(v_nk2, 'holt', 18, 6, 4, false, 1, null);
  v_wrong := v_bt[2];
  if v_wrong is null or abs(v_wrong - v_g_nanka2_backtest_holt_rmse_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the MAE quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka2_backtest_holt_rmse_bopd]', v_wrong, v_g_nanka2_backtest_holt_rmse_bopd;
  end if;
  v_wrong := v_bh[1];
  if v_wrong is null or abs(v_wrong - v_g_nanka2_backtest_holt_rmse_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the parameters held gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka2_backtest_holt_rmse_bopd]', v_wrong, v_g_nanka2_backtest_holt_rmse_bopd;
  end if;
  v_wrong := (pg_temp.d4_bt(v_nk2, 'holt', 18, 6, 1, true, 1, null))[1];
  if v_wrong is null or abs(v_wrong - v_g_nanka2_backtest_holt_rmse_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: a step of 1 between origins gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka2_backtest_holt_rmse_bopd]', v_wrong, v_g_nanka2_backtest_holt_rmse_bopd;
  end if;
  v_wrong := v_bt[3];
  if v_wrong is null or abs(v_wrong - v_g_nanka2_backtest_holt_held_mase) <= 5e-07 then
    raise exception 'D4 go-live refused: the refitted run gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka2_backtest_holt_held_mase]', v_wrong, v_g_nanka2_backtest_holt_held_mase;
  end if;
  v_wrong := (pg_temp.d4_bt(v_nk2, 'holt', 18, 6, 4, false, 12, null))[3];
  if v_wrong is null or abs(v_wrong - v_g_nanka2_backtest_holt_held_mase) <= 5e-07 then
    raise exception 'D4 go-live refused: a lag of 12 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka2_backtest_holt_held_mase]', v_wrong, v_g_nanka2_backtest_holt_held_mase;
  end if;
  v_wrong := v_bt[5];
  if v_wrong is null or abs(v_wrong - v_g_nanka2_backtest_holt_step6_mae_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: step 1 read gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka2_backtest_holt_step6_mae_bopd]', v_wrong, v_g_nanka2_backtest_holt_step6_mae_bopd;
  end if;
  v_wrong := v_bt[2];
  if v_wrong is null or abs(v_wrong - v_g_nanka2_backtest_holt_step6_mae_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the overall MAE quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka2_backtest_holt_step6_mae_bopd]', v_wrong, v_g_nanka2_backtest_holt_step6_mae_bopd;
  end if;
  v_wrong := v_bt[9];
  if v_wrong is null or abs(v_wrong - v_g_nanka2_backtest_holt_step6_mae_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the step before gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka2_backtest_holt_step6_mae_bopd]', v_wrong, v_g_nanka2_backtest_holt_step6_mae_bopd;
  end if;
  v_wrong := v_bh[10];
  if v_wrong is null or abs(v_wrong - v_g_nanka2_backtest_holt_step6_mae_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the parameters held gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nanka2_backtest_holt_step6_mae_bopd]', v_wrong, v_g_nanka2_backtest_holt_step6_mae_bopd;
  end if;
  v_p := pg_temp.d4_opt(v_um1, 'damped');
  v_b := pg_temp.d4_boot(v_um1, 'damped', v_p[1], v_p[2], v_p[3], 12, 1000, 29, true);
  v_r := pg_temp.d4_run(v_um1, 'damped', v_p[1], v_p[2], v_p[3]);
  v_f := pg_temp.d4_fc('damped', v_r[2], v_r[3], v_p[3], 12);
  v_wrong := v_b[36];
  if v_wrong is null or abs(v_wrong - v_g_umunze1_damped_p90_h12_bopd) <= 0.0001 then
    raise exception 'D4 go-live refused: the 90th percentile read as P90 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_damped_p90_h12_bopd]', v_wrong, v_g_umunze1_damped_p90_h12_bopd;
  end if;
  v_wrong := v_f[12];
  if v_wrong is null or abs(v_wrong - v_g_umunze1_damped_p90_h12_bopd) <= 0.0001 then
    raise exception 'D4 go-live refused: the point forecast gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_damped_p90_h12_bopd]', v_wrong, v_g_umunze1_damped_p90_h12_bopd;
  end if;
  v_wrong := v_b[11];
  if v_wrong is null or abs(v_wrong - v_g_umunze1_damped_p90_h12_bopd) <= 0.0001 then
    raise exception 'D4 go-live refused: the step before gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_damped_p90_h12_bopd]', v_wrong, v_g_umunze1_damped_p90_h12_bopd;
  end if;
  v_wrong := v_b[12];
  if v_wrong is null or abs(v_wrong - v_g_umunze1_damped_p10_h12_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the 10th percentile read as P10 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_damped_p10_h12_bopd]', v_wrong, v_g_umunze1_damped_p10_h12_bopd;
  end if;
  v_wrong := v_b[24];
  if v_wrong is null or abs(v_wrong - v_g_umunze1_damped_p10_h12_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the P50 quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_damped_p10_h12_bopd]', v_wrong, v_g_umunze1_damped_p10_h12_bopd;
  end if;
  v_wrong := v_f[6];
  if v_wrong is null or abs(v_wrong - v_g_umunze1_damped_p50_h6_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the point forecast gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_damped_p50_h6_bopd]', v_wrong, v_g_umunze1_damped_p50_h6_bopd;
  end if;
  v_wrong := v_b[17];
  if v_wrong is null or abs(v_wrong - v_g_umunze1_damped_p50_h6_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the step before gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_damped_p50_h6_bopd]', v_wrong, v_g_umunze1_damped_p50_h6_bopd;
  end if;
  v_wrong := v_b[19];
  if v_wrong is null or abs(v_wrong - v_g_umunze1_damped_p50_h6_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the step after gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_damped_p50_h6_bopd]', v_wrong, v_g_umunze1_damped_p50_h6_bopd;
  end if;
  v_b := pg_temp.d4_boot(v_um1, 'damped', v_p[1], v_p[2], v_p[3], 12, 1000, 30, true);
  v_wrong := v_b[12];
  if v_wrong is null or abs(v_wrong - v_g_umunze1_damped_p90_h12_bopd) <= 0.0001 then
    raise exception 'D4 go-live refused: the next seed gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_damped_p90_h12_bopd]', v_wrong, v_g_umunze1_damped_p90_h12_bopd;
  end if;
  v_wrong := v_b[36];
  if v_wrong is null or abs(v_wrong - v_g_umunze1_damped_p10_h12_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the next seed gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_damped_p10_h12_bopd]', v_wrong, v_g_umunze1_damped_p10_h12_bopd;
  end if;
  v_wrong := v_b[18];
  if v_wrong is null or abs(v_wrong - v_g_umunze1_damped_p50_h6_bopd) <= 1e-05 then
    raise exception 'D4 go-live refused: the next seed gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_damped_p50_h6_bopd]', v_wrong, v_g_umunze1_damped_p50_h6_bopd;
  end if;
  v_ar := pg_temp.d4_arps(v_um1, 'Auto-Select');
  v_wrong := 12 * v_ar[2];
  if v_wrong is null or abs(v_wrong - v_g_umunze1_arps_di_per_month) <= 5e-07 then
    raise exception 'D4 go-live refused: Di quoted per year gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_arps_di_per_month]', v_wrong, v_g_umunze1_arps_di_per_month;
  end if;
  v_wrong := v_ar[2] / 30.4375;
  if v_wrong is null or abs(v_wrong - v_g_umunze1_arps_di_per_month) <= 5e-07 then
    raise exception 'D4 go-live refused: Di quoted per day gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_arps_di_per_month]', v_wrong, v_g_umunze1_arps_di_per_month;
  end if;
  v_wrong := (pg_temp.d4_arps(v_um1, 'Exponential'))[2];
  if v_wrong is null or abs(v_wrong - v_g_umunze1_arps_di_per_month) <= 5e-07 then
    raise exception 'D4 go-live refused: the exponential forced gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_arps_di_per_month]', v_wrong, v_g_umunze1_arps_di_per_month;
  end if;
  v_wrong := (pg_temp.d4_arps(v_um1, 'Harmonic'))[2];
  if v_wrong is null or abs(v_wrong - v_g_umunze1_arps_di_per_month) <= 5e-07 then
    raise exception 'D4 go-live refused: the harmonic forced gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze1_arps_di_per_month]', v_wrong, v_g_umunze1_arps_di_per_month;
  end if;
  v_cm := array[]::double precision[];
  v_cm := v_cm || (pg_temp.d4_bt(v_um2, 'ses', 33, 6, 3, true, 1, 'Auto-Select'))[3];
  v_cm := v_cm || (pg_temp.d4_bt(v_um2, 'holt', 33, 6, 3, true, 1, 'Auto-Select'))[3];
  v_cm := v_cm || (pg_temp.d4_bt(v_um2, 'damped', 33, 6, 3, true, 1, 'Auto-Select'))[3];
  v_cm := v_cm || (pg_temp.d4_bt(v_um2, 'arps', 33, 6, 3, true, 1, 'Auto-Select'))[3];
  v_rk := array(select v from unnest(v_cm) v order by v);
  v_wrong := v_rk[1];
  if v_wrong is null or abs(v_wrong - v_g_umunze2_compare_arps_mase) <= 5e-07 then
    raise exception 'D4 go-live refused: the best MASE quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze2_compare_arps_mase]', v_wrong, v_g_umunze2_compare_arps_mase;
  end if;
  v_wrong := (pg_temp.d4_bt(v_um2, 'arps', 33, 6, 3, true, 1, 'Auto-Select'))[2];
  if v_wrong is null or abs(v_wrong - v_g_umunze2_compare_arps_mase) <= 5e-07 then
    raise exception 'D4 go-live refused: the arps MAE quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze2_compare_arps_mase]', v_wrong, v_g_umunze2_compare_arps_mase;
  end if;
  v_wrong := (pg_temp.d4_bt(v_um2, 'arps', 33, 6, 3, true, 1, 'Exponential'))[3];
  if v_wrong is null or abs(v_wrong - v_g_umunze2_compare_arps_mase) <= 5e-07 then
    raise exception 'D4 go-live refused: an exponential baseline gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze2_compare_arps_mase]', v_wrong, v_g_umunze2_compare_arps_mase;
  end if;
  v_wrong := v_cm[4];
  if v_wrong is null or abs(v_wrong - v_g_umunze2_compare_best_mase) <= 5e-07 then
    raise exception 'D4 go-live refused: the arps MASE quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze2_compare_best_mase]', v_wrong, v_g_umunze2_compare_best_mase;
  end if;
  v_wrong := v_rk[2];
  if v_wrong is null or abs(v_wrong - v_g_umunze2_compare_best_mase) <= 5e-07 then
    raise exception 'D4 go-live refused: the second ranked gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze2_compare_best_mase]', v_wrong, v_g_umunze2_compare_best_mase;
  end if;
  v_wrong := v_rk[4];
  if v_wrong is null or abs(v_wrong - v_g_umunze2_compare_best_mase) <= 5e-07 then
    raise exception 'D4 go-live refused: the last ranked gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/umunze2_compare_best_mase]', v_wrong, v_g_umunze2_compare_best_mase;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'forecastml';
  if not exists (select 1 from public.academy_apps where slug = 'forecastml' and status = 'available') then
    raise exception 'D4 go-live refused: forecastml did not reach status available';
  end if;
  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon from public.academy_apps;
  raise notice 'D4 go-live: forecastml available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
