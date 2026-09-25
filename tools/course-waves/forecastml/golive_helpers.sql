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
