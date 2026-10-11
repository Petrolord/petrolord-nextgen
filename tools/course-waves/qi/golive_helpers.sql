-- ----------------------------------------------------------------------------
-- QI go-live helpers: the SECOND ROUTE IN SQL. Temporary functions (pg_temp),
-- gone when the session ends; nothing is created in any schema. They rebuild
-- the capstone arithmetic from the case files the learner is handed, in
-- plpgsql, from the published equations, with no engine code. First the
-- Associate (TAMBERLO):
--   Batzle and Wang (1992) brine and live oil, Wood's fluid mix, the Voigt,
--   Reuss and Hill mineral mix of quartz and clay, Gassmann through the dry
--   rock, the least squares slope of Vs on Vp in km/s, Shuey's intercept and
--   gradient, the blocked log of the wet trend, the total least squares line
--   through the origin and the signed distance from it.
-- The two spectrum fields (a padded FFT) have no second route here; they are
-- checked against the oracle's direct DFT, written in by value below.
-- Every unit conversion is the one the teaching lab states (qiLab.js):
--   degC = (degF - 32) / 1.8; MPa = psia / 145.03773773020923;
--   L/L = scf/stb x 0.028316846592 / 0.158987294928; rho0 = 141.5 / (API + 131.5).
-- ----------------------------------------------------------------------------
create or replace function pg_temp.qi_brine(t double precision, p double precision, s double precision)
returns double precision[] language plpgsql immutable as $f$
declare
  w double precision[] := array[
    1402.85, 1.524, 3.437e-3, -1.197e-5,
    4.871, -1.11e-2, 1.739e-4, -1.628e-6,
    -4.783e-2, 2.747e-4, -2.135e-6, 1.237e-8,
    1.487e-4, -6.503e-7, -1.455e-8, 1.327e-10,
    -2.197e-7, 7.987e-10, 5.23e-11, -4.614e-13];
  wv double precision := 0; wd double precision; xr double precision; rho double precision;
  s1 double precision; s15 double precision; vp double precision;
begin
  for i in 0..4 loop
    for j in 0..3 loop
      wv := wv + w[i * 4 + j + 1] * t ^ i * p ^ j;
    end loop;
  end loop;
  wd := 1 + 1e-6 * (-80 * t - 3.3 * t * t + 0.00175 * t ^ 3 + 489 * p - 2 * t * p
        + 0.016 * t * t * p - 1.3e-5 * t ^ 3 * p - 0.333 * p * p - 0.002 * t * p * p);
  xr := 300 * p - 2400 * p * s + t * (80 + 3 * t - 3300 * s - 13 * p + 47 * p * s);
  rho := (wd + s * (0.668 + 0.44 * s + 1e-6 * xr)) * 1000;
  s1 := 1170 - 9.6 * t + 0.055 * t * t - 8.5e-5 * t ^ 3 + 2.6 * p - 0.0029 * t * p - 0.0476 * p * p;
  s15 := 780 - 10 * p + 0.16 * p * p;
  vp := wv + s * s1 + s ^ 1.5 * s15 - 820 * s * s;
  return array[rho, rho * vp * vp];
end $f$;

create or replace function pg_temp.qi_oil(t double precision, p double precision, rho0 double precision,
                                           g double precision, gs double precision)
returns double precision[] language plpgsql immutable as $f$
declare b0 double precision; rho double precision; rp double precision; vp double precision;
begin
  b0 := 0.972 + 0.00038 * (2.4 * g * sqrt(gs / rho0) + t + 17.8) ^ 1.175;
  rho := ((rho0 + 0.0012 * gs * g) / b0) * 1000;
  rp := rho0 / b0 / (1 + 0.001 * g);
  vp := 2096 * sqrt(rp / (2.6 - rp)) - 3.7 * t + 4.64 * p + 0.0115 * (4.12 * sqrt(1.08 / rp - 1) - 1) * t * p;
  return array[rho, rho * vp * vp];
end $f$;

-- brine and oil at the case conditions: array[brine rho, brine k, oil rho, oil k]
create or replace function pg_temp.qi_fluids(c jsonb)
returns double precision[] language plpgsql immutable as $f$
declare t double precision; p double precision; g double precision; r0 double precision;
        b double precision[]; o double precision[];
begin
  t := ((c->'conditions'->>'tF')::double precision - 32) / 1.8;
  p := (c->'conditions'->>'pPsia')::double precision / 145.03773773020923;
  g := (c->'conditions'->>'gorScfStb')::double precision * 0.028316846592 / 0.158987294928;
  r0 := 141.5 / ((c->'conditions'->>'api')::double precision + 131.5);
  b := pg_temp.qi_brine(t, p, (c->'conditions'->>'salinity')::double precision);
  o := pg_temp.qi_oil(t, p, r0, g, (c->'conditions'->>'gasSg')::double precision);
  return array[b[1], b[2], o[1], o[2]];
end $f$;

-- one sample from its Sw to a stated Sw: array[vp, vs, rho]
create or replace function pg_temp.qi_sub(vp double precision, vs double precision, rho double precision,
    phi double precision, vsh double precision, sw double precision, tosw double precision, f double precision[])
returns double precision[] language plpgsql immutable as $f$
declare kq double precision := 36.6e9; kc double precision := 20.9e9;
        voigt double precision; inv double precision := 0; kmin double precision;
        ka double precision; ra double precision; kb double precision; rb double precision;
        mu double precision; ksa double precision; kd double precision; ksb double precision; rhob double precision;
begin
  voigt := (1 - vsh) * kq + vsh * kc;
  if 1 - vsh > 0 then inv := inv + (1 - vsh) / kq; end if;
  if vsh > 0 then inv := inv + vsh / kc; end if;
  kmin := 0.5 * (voigt + 1 / inv);
  inv := 0;
  if sw > 0 then inv := inv + sw / f[2]; end if;
  if 1 - sw > 0 then inv := inv + (1 - sw) / f[4]; end if;
  ka := 1 / inv; ra := sw * f[1] + (1 - sw) * f[3];
  inv := 0;
  if tosw > 0 then inv := inv + tosw / f[2]; end if;
  if 1 - tosw > 0 then inv := inv + (1 - tosw) / f[4]; end if;
  kb := 1 / inv; rb := tosw * f[1] + (1 - tosw) * f[3];
  mu := rho * vs * vs;
  ksa := rho * vp * vp - 4 * mu / 3;
  kd := (ksa * (phi * kmin / ka + 1 - phi) - kmin) / (phi * kmin / ka + ksa / kmin - 1 - phi);
  ksb := kd + (1 - kd / kmin) ^ 2 / (phi / kb + (1 - phi) / kmin - kd / (kmin * kmin));
  rhob := rho + phi * (rb - ra);
  return array[sqrt((ksb + 4 * mu / 3) / rhob), sqrt(mu / rhob), rhob];
end $f$;

-- Shuey intercept and gradient of upper over lower: array[A, B]
create or replace function pg_temp.qi_shuey(u double precision[], l double precision[])
returns double precision[] language plpgsql immutable as $f$
declare vp double precision; vs double precision; rho double precision;
begin
  vp := 0.5 * (u[1] + l[1]); vs := 0.5 * (u[2] + l[2]); rho := 0.5 * (u[3] + l[3]);
  return array[0.5 * ((l[1] - u[1]) / vp + (l[3] - u[3]) / rho),
               0.5 * (l[1] - u[1]) / vp - 2 * (vs / vp) ^ 2 * ((l[3] - u[3]) / rho + 2 * (l[2] - u[2]) / vs)];
end $f$;

-- The Associate figures with a second route: 'slope', 'ai', 'vpvs', 'distance'.
create or replace function pg_temp.qi_assoc(c jsonb, what text)
returns double precision language plpgsql stable as $f$
declare
  cols jsonb := c->'well'->'columns';
  top double precision := (c->'well'->>'topFt')::double precision;
  bas double precision := (c->'well'->>'baseFt')::double precision;
  owc double precision := (c->'well'->>'owcFt')::double precision;
  cut double precision := (c->'stated'->>'netSandVshCut')::double precision;
  cap double precision := (c->'stated'->>'shaleAboveFt')::double precision;
  blk double precision := (c->'stated'->>'trendBlockFt')::double precision;
  at double precision := (c->'stated'->>'substitutionSampleFt')::double precision;
  f double precision[] := pg_temp.qi_fluids(c);
  imd int; ivp int; ivs int; irh int; iph int; ish int; isw int;
  md double precision[] := '{}'; vp double precision[] := '{}'; vs double precision[] := '{}'; rh double precision[] := '{}';
  ph double precision[] := '{}'; sh double precision[] := '{}'; sw double precision[] := '{}';
  e jsonb; n int := 0; k int; v double precision[];
  wvp double precision[] := '{}'; wvs double precision[] := '{}'; wrh double precision[] := '{}';
  steps double precision[] := '{}'; step double precision; bs int;
  bvp double precision[] := '{}'; bvs double precision[] := '{}'; brh double precision[] := '{}';
  avp double precision := 0; avs double precision := 0; arh double precision := 0; an int := 0;
  ab double precision[]; saa double precision := 0; sbb double precision := 0; sab double precision := 0;
  th double precision; m double precision;
  su double precision[] := array[0, 0, 0]::double precision[]; nu int := 0;
  so double precision[] := array[0, 0, 0]::double precision[]; no int := 0;
  sx double precision := 0; sy double precision := 0; sxx double precision := 0; sxy double precision := 0; nw int := 0; x double precision;
begin
  select ordinality - 1 into imd from jsonb_array_elements_text(cols) with ordinality t(colname) where colname = 'md_ft';
  select ordinality - 1 into ivp from jsonb_array_elements_text(cols) with ordinality t(colname) where colname = 'vp';
  select ordinality - 1 into ivs from jsonb_array_elements_text(cols) with ordinality t(colname) where colname = 'vs';
  select ordinality - 1 into irh from jsonb_array_elements_text(cols) with ordinality t(colname) where colname = 'rho';
  select ordinality - 1 into iph from jsonb_array_elements_text(cols) with ordinality t(colname) where colname = 'phit';
  select ordinality - 1 into ish from jsonb_array_elements_text(cols) with ordinality t(colname) where colname = 'vsh';
  select ordinality - 1 into isw from jsonb_array_elements_text(cols) with ordinality t(colname) where colname = 'sw';
  for e in select x0 from jsonb_array_elements(c->'well'->'rows') x0 loop
    -- a row with a missing or non-positive Vp, Vs or density is never selected
    if (e->>ivp)::double precision > 0 and (e->>ivs)::double precision > 0 and (e->>irh)::double precision > 0 then
      n := n + 1;
      md := md || (e->>imd)::double precision; vp := vp || (e->>ivp)::double precision; vs := vs || (e->>ivs)::double precision;
      rh := rh || (e->>irh)::double precision; ph := ph || (e->>iph)::double precision;
      sh := sh || (e->>ish)::double precision; sw := sw || (e->>isw)::double precision;
    end if;
  end loop;

  if what = 'slope' then
    for k in 1..n loop
      if md[k] >= top and md[k] <= bas and sh[k] <= cut and md[k] >= owc and vs[k] < vp[k] then
        x := vp[k] / 1000; sx := sx + x; sy := sy + vs[k]; sxx := sxx + x * x; sxy := sxy + x * vs[k]; nw := nw + 1;
      end if;
    end loop;
    return (nw * sxy - sx * sy) / (nw * sxx - sx * sx);
  end if;

  if what in ('ai', 'vpvs') then
    for k in 1..n loop
      if abs(md[k] - at) < 0.25 then
        v := pg_temp.qi_sub(vp[k], vs[k], rh[k], ph[k], sh[k], sw[k], 1::double precision, f);
        if what = 'ai' then return v[1] * v[3]; end if;
        return v[1] / v[2];
      end if;
    end loop;
    return null;
  end if;

  if what = 'distance' then
    -- the wet logs: every sample with Sw below 1 taken to brine
    for k in 1..n loop
      if sw[k] < 1 then
        v := pg_temp.qi_sub(vp[k], vs[k], rh[k], ph[k], sh[k], sw[k], 1::double precision, f);
        wvp := wvp || v[1]; wvs := wvs || v[2]; wrh := wrh || v[3];
      else
        wvp := wvp || vp[k]; wvs := wvs || vs[k]; wrh := wrh || rh[k];
      end if;
      if k > 1 then steps := steps || (md[k] - md[k - 1]); end if;
    end loop;
    select x1 into step from unnest(steps) x1 order by x1 offset (floor((array_length(steps, 1) - 1) / 2.0))::int limit 1;
    bs := greatest(1, round(blk / step)::int);
    -- blocks of bs usable samples; the last short block kept at half a block or more
    for k in 1..n loop
      if wvp[k] > 0 and wvs[k] > 0 and wrh[k] > 0 and wvs[k] < wvp[k] then
        avp := avp + wvp[k]; avs := avs + wvs[k]; arh := arh + wrh[k]; an := an + 1;
        if an >= bs then
          bvp := bvp || (avp / an); bvs := bvs || (avs / an); brh := brh || (arh / an);
          avp := 0; avs := 0; arh := 0; an := 0;
        end if;
      end if;
    end loop;
    if an >= ceil(bs / 2.0) then bvp := bvp || (avp / an); bvs := bvs || (avs / an); brh := brh || (arh / an); end if;
    for k in 2..array_length(bvp, 1) loop
      if not (bvp[k - 1] = bvp[k] and bvs[k - 1] = bvs[k] and brh[k - 1] = brh[k]) then
        ab := pg_temp.qi_shuey(array[bvp[k - 1], bvs[k - 1], brh[k - 1]], array[bvp[k], bvs[k], brh[k]]);
        saa := saa + ab[1] * ab[1]; sbb := sbb + ab[2] * ab[2]; sab := sab + ab[1] * ab[2];
      end if;
    end loop;
    th := 0.5 * atan2(2 * sab, saa - sbb);
    m := sin(th) / cos(th);
    -- the top interface: the cap rock over the mean oil-leg net sand, in situ
    for k in 1..n loop
      if md[k] >= top - cap and md[k] < top then su := array[su[1] + vp[k], su[2] + vs[k], su[3] + rh[k]]; nu := nu + 1; end if;
      if md[k] >= top and md[k] <= bas and sh[k] <= cut and md[k] < owc then so := array[so[1] + vp[k], so[2] + vs[k], so[3] + rh[k]]; no := no + 1; end if;
    end loop;
    ab := pg_temp.qi_shuey(array[su[1] / nu, su[2] / nu, su[3] / nu], array[so[1] / no, so[2] / no, so[3] / no]);
    return (ab[2] - m * ab[1]) / sqrt(1 + m * m);
  end if;
  return null;
end $f$;

-- ----------------------------------------------------------------------------
-- PROFESSIONAL (QUARVIN): Dix, Walden, NMO stretch, the Walden-binned partial
-- stacks, the two-term Shuey regression and the one scale, from the published
-- equations (Dix 1955; Walden 1991; Shuey 1985), on the case file.
--   Vint^2 = (V2^2 t2 - V1^2 t1) / (t2 - t1), t in seconds; Vrms linear in
--   time between rows and flat outside, Vint the Dix velocity of the segment;
--   sin(theta) = (Vint / Vrms) x / sqrt(x^2 + (Vrms t0)^2);
--   stretch = sqrt(t0^2 + x^2 / Vrms^2) / t0 - 1;
--   bin k holds [edge k, edge k + 1); a partial stack is the mean of every
--   sample in its bins; the intercept is the least squares line of the bin
--   means on sin^2 of the stated angles; the one scale is
--   sum(observed x modelled) / sum(modelled^2) over A and B.
-- ----------------------------------------------------------------------------
create or replace function pg_temp.qi_prof(c jsonb, what text)
returns double precision language plpgsql stable as $f$
declare
  st jsonb := c->'stated'; g jsonb := c->'gather';
  tms double precision[] := '{}'; vr double precision[] := '{}'; ts double precision[] := '{}';
  seg double precision[]; n int; k int; j int; li int;
  t double precision; f double precision; vrms double precision; vint double precision;
  x double precision; sn double precision; wal double precision; t0 double precision;
  i int; ti double precision; vri double precision; vii double precision;
  edges double precision[] := '{}'; sums double precision[]; fold int[]; nb int;
  tr jsonb; v double precision; a double precision; lo int; hi int;
  xs double precision[] := '{}'; ys double precision[] := '{}'; xb double precision; yb double precision;
  sxy double precision := 0; sxx double precision := 0; so double precision := 0; sm double precision := 0; w jsonb;
begin
  for tr in select e from jsonb_array_elements(c->'velocity'->'rows') e loop
    tms := tms || (tr->>0)::double precision; vr := vr || (tr->>1)::double precision;
    ts := ts || greatest((tr->>0)::double precision, 1e-6) / 1000;
  end loop;
  n := array_length(tms, 1);
  seg := array[vr[1]];
  for k in 2..n loop
    seg := seg || sqrt((vr[k] ^ 2 * ts[k] - vr[k - 1] ^ 2 * ts[k - 1]) / (ts[k] - ts[k - 1]));
  end loop;
  if what = 'dix' then
    for k in 1..n loop
      if tms[k] = (st->'dixLayer'->>'toMs')::double precision then return seg[k]; end if;
    end loop;
    return null;
  end if;
  if what = 'scale' then
    for w in select e from jsonb_array_elements(c->'wells') e loop
      so := so + (w->'observed'->>'A')::double precision * (w->'modelled'->>'A')::double precision
                + (w->'observed'->>'B')::double precision * (w->'modelled'->>'B')::double precision;
      sm := sm + (w->'modelled'->>'A')::double precision ^ 2 + (w->'modelled'->>'B')::double precision ^ 2;
    end loop;
    return so / sm;
  end if;
  -- the velocities at a time (the stated time, or the target sample's time)
  if what in ('walden', 'stretch') then
    t := (st->>'timeMs')::double precision;
  else
    i := round(((st->>'targetMs')::double precision - (g->>'t0_ms')::double precision) / (g->>'dt_ms')::double precision)::int;
    t := (g->>'t0_ms')::double precision + i * (g->>'dt_ms')::double precision;
  end if;
  if t <= tms[1] then vrms := vr[1]; vint := seg[1];
  elsif t >= tms[n] then vrms := vr[n]; vint := seg[n];
  else
    j := 1;
    for k in 1..n - 1 loop if tms[k] < t then j := k; end if; end loop;
    f := (t - tms[j]) / (tms[j + 1] - tms[j]);
    vrms := vr[j] + f * (vr[j + 1] - vr[j]); vint := seg[j + 1];
  end if;
  if what = 'walden' then
    x := (st->>'offsetM')::double precision;
    sn := (vint / vrms) * x / sqrt(x * x + (vrms * t / 1000) ^ 2);
    if sn >= 1 then return 90; end if;
    return degrees(asin(sn));
  end if;
  if what = 'stretch' then
    t0 := t / 1000; x := (st->>'offsetM')::double precision;
    return sqrt(t0 * t0 + x * x / (vrms * vrms)) / t0 - 1;
  end if;
  select array_agg(e::double precision order by o) into edges from jsonb_array_elements_text(st->'angleEdges') with ordinality q(e, o);
  nb := array_length(edges, 1) - 1;
  sums := array_fill(0::double precision, array[nb]); fold := array_fill(0, array[nb]);
  k := 0;
  for tr in select e from jsonb_array_elements(g->'traces') e loop
    x := (g->'offsets_m'->>k)::double precision; k := k + 1;
    v := (tr->>i)::double precision;
    if v is null or abs(v) >= 1e29 then continue; end if;
    sn := (vint / vrms) * x / sqrt(x * x + (vrms * t / 1000) ^ 2);
    a := case when sn >= 1 then 90 else degrees(asin(sn)) end;
    for j in 1..nb loop
      if edges[j] <= a and a < edges[j + 1] then sums[j] := sums[j] + v; fold[j] := fold[j] + 1; exit; end if;
    end loop;
  end loop;
  if what = 'far' then
    lo := (st->'farBins'->>0)::int; hi := (st->'farBins'->>1)::int;
    v := 0; j := 0;
    for k in lo + 1..hi loop v := v + sums[k]; j := j + fold[k]; end loop;
    return v / j;
  end if;
  if what = 'shuey_a' then
    for k in 1..nb loop
      xs := xs || sin(radians((st->'stackAngles'->>(k - 1))::double precision)) ^ 2;
      ys := ys || sums[k] / fold[k];
    end loop;
    xb := 0; yb := 0;
    for k in 1..nb loop xb := xb + xs[k]; yb := yb + ys[k]; end loop;
    xb := xb / nb; yb := yb / nb;
    for k in 1..nb loop sxy := sxy + (xs[k] - xb) * (ys[k] - yb); sxx := sxx + (xs[k] - xb) ^ 2; end loop;
    return yb - sxy / sxx * xb;
  end if;
  return null;
end $f$;

-- ----------------------------------------------------------------------------
-- EXPERT (DELSHOLM).
--   The low-frequency model at position B: each sample's time mapped
--   proportionally between B's horizons onto each well's, the well's supplied
--   low-passed ln(AI) sampled linearly, weighted by inverse distance to the
--   stated power; samples no well covers hold the nearest covered value.
--   The model-based and simultaneous inversions: the regularised least squares
--   problem min ||A m - d||^2 + sum eps_p^2 ||m_p - m0_p||^2 SOLVED EXACTLY by
--   its normal equations (banded Gaussian elimination; the matrix is symmetric
--   positive definite), A = C D (centred difference, centred convolution with
--   the stated wavelet), and for the simultaneous inversion the Fatti weights
--   0.5 (1 + tan^2), -4 K^2 sin^2 and 0.5 (4 K^2 sin^2 - tan^2), K the stated
--   background Vs/Vp. The engines iterate CGLS from the low-frequency model
--   at the stated count and converge (oracle_check.py: 2.5e-13 relative).
--   The porosity bound: ordinary least squares and the Student t interval of a
--   new observation at the stated level, t by bisection on the regularised
--   incomplete beta function (log gamma by Stirling after shifting).
--   The facies posterior: one Gaussian per facies (variance on n - 1), priors
--   the sample proportions, Bayes' rule.
--   The column: a priority flood from the highest mapped node over its four
--   neighbours; the running minimum when the flood first takes a node on the
--   edge of the mapped area; the column is the crest less that spill.
-- ----------------------------------------------------------------------------
create or replace function pg_temp.qi_lgamma(x double precision)
returns double precision language plpgsql immutable as $f$
declare s double precision := 0; y double precision := x; z double precision;
begin
  while y < 30 loop s := s + ln(y); y := y + 1; end loop;
  z := 1 / (y * y);
  return (y - 0.5) * ln(y) - y + 0.5 * ln(2 * pi())
         + (1.0 / 12 - z * (1.0 / 360 - z * (1.0 / 1260 - z * (1.0 / 1680 - z / 1188)))) / y - s;
end $f$;

create or replace function pg_temp.qi_betacf(a double precision, b double precision, x double precision)
returns double precision language plpgsql immutable as $f$
declare qab double precision := a + b; qap double precision := a + 1; qam double precision := a - 1;
        c double precision := 1; d double precision; h double precision; aa double precision; de double precision; m2 int;
begin
  d := 1 / (1 - qab * x / qap); h := d;
  for m in 1..299 loop
    m2 := 2 * m;
    aa := m * (b - m) * x / ((qam + m2) * (a + m2));
    d := 1 / (1 + aa * d); c := 1 + aa / c; h := h * d * c;
    aa := -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d := 1 / (1 + aa * d); c := 1 + aa / c; de := d * c; h := h * de;
    exit when abs(de - 1) < 1e-15;
  end loop;
  return h;
end $f$;

create or replace function pg_temp.qi_betainc(a double precision, b double precision, x double precision)
returns double precision language plpgsql immutable as $f$
declare lbt double precision;
begin
  if x <= 0 then return 0; end if;
  if x >= 1 then return 1; end if;
  lbt := pg_temp.qi_lgamma(a + b) - pg_temp.qi_lgamma(a) - pg_temp.qi_lgamma(b) + a * ln(x) + b * ln(1 - x);
  if x < (a + 1) / (a + b + 2) then return exp(lbt) * pg_temp.qi_betacf(a, b, x) / a; end if;
  return 1 - exp(lbt) * pg_temp.qi_betacf(b, a, 1 - x) / b;
end $f$;

-- the regularised least squares solve; rows of A come as (row, col, value)
-- over N = np * n unknowns ordered sample-major (index = i * np + p)
create or replace function pg_temp.qi_lsq(wavelets jsonb, traces jsonb, weights double precision[], np int, n int,
                                          eps double precision[], m0 double precision[])
returns double precision[] language plpgsql stable as $f$
declare
  nn int := np * n; nw int := jsonb_array_length(wavelets);
  h double precision[]; lh int; hc int; d double precision[];
  big double precision[]; v double precision[]; r double precision[];
  cols int[]; vals double precision[]; nz int;
  bw int := 0; i int; j int; k int; p int; a int; q int; t int; e double precision; fac double precision;
  x double precision[];
begin
  big := array_fill(0::double precision, array[nn * nn]);
  v := array_fill(0::double precision, array[nn]);
  for a in 0..nw - 1 loop
    select array_agg(e0::double precision order by o) into h from jsonb_array_elements_text(wavelets->a) with ordinality z(e0, o);
    select array_agg(e0::double precision order by o) into d from jsonb_array_elements_text(traces->a) with ordinality z(e0, o);
    lh := array_length(h, 1); hc := lh / 2;
    for i in 0..n - 1 loop
      -- row i of C D: CD[i][j] = 0.5 C[i][j - 1] - 0.5 C[i][j + 1], over D's interior rows
      r := array_fill(0::double precision, array[n]);
      for t in 1..n - 2 loop
        k := i - t + hc;
        if k >= 0 and k < lh then
          r[t + 2] := r[t + 2] + h[k + 1] * 0.5;
          r[t] := r[t] - h[k + 1] * 0.5;
        end if;
      end loop;
      cols := '{}'; vals := '{}';
      for j in 0..n - 1 loop
        if r[j + 1] <> 0 then
          for p in 0..np - 1 loop
            if weights[a * np + p + 1] <> 0 then
              cols := cols || (j * np + p); vals := vals || (weights[a * np + p + 1] * r[j + 1]);
            end if;
          end loop;
        end if;
      end loop;
      nz := coalesce(array_length(cols, 1), 0);
      for k in 1..nz loop
        v[cols[k] + 1] := v[cols[k] + 1] + vals[k] * d[i + 1];
        for q in 1..nz loop
          big[cols[k] * nn + cols[q] + 1] := big[cols[k] * nn + cols[q] + 1] + vals[k] * vals[q];
          if abs(cols[k] - cols[q]) > bw then bw := abs(cols[k] - cols[q]); end if;
        end loop;
      end loop;
    end loop;
  end loop;
  for i in 0..n - 1 loop
    for p in 0..np - 1 loop
      big[(i * np + p) * nn + i * np + p + 1] := big[(i * np + p) * nn + i * np + p + 1] + eps[p + 1] ^ 2;
      v[i * np + p + 1] := v[i * np + p + 1] + eps[p + 1] ^ 2 * m0[p * n + i + 1];
    end loop;
  end loop;
  -- banded elimination without pivoting (symmetric positive definite)
  for k in 0..nn - 1 loop
    for i in k + 1..least(nn - 1, k + bw) loop
      e := big[i * nn + k + 1];
      if e <> 0 then
        fac := e / big[k * nn + k + 1];
        for j in k..least(nn - 1, k + bw) loop
          big[i * nn + j + 1] := big[i * nn + j + 1] - fac * big[k * nn + j + 1];
        end loop;
        v[i + 1] := v[i + 1] - fac * v[k + 1];
      end if;
    end loop;
  end loop;
  x := array_fill(0::double precision, array[nn]);
  for k in reverse nn - 1..0 loop
    e := v[k + 1];
    for j in k + 1..least(nn - 1, k + bw) loop e := e - big[k * nn + j + 1] * x[j + 1]; end loop;
    x[k + 1] := e / big[k * nn + k + 1];
  end loop;
  return x;
end $f$;

create or replace function pg_temp.qi_exp(c jsonb, what text)
returns double precision language plpgsql stable as $f$
declare
  st jsonb := c->'stated'; t0 double precision := (c->'clock'->>'t0_ms')::double precision;
  dt double precision := (c->'clock'->>'dt_ms')::double precision; ns int := (c->'clock'->>'samples')::int;
  b jsonb := c->'positionB'; ta jsonb := c->'traceA'; w jsonb;
  lfm double precision[] := '{}'; k int; i int; t double precision; s double precision; ws double precision;
  hb double precision[]; hw double precision[]; tw double precision; xx double precision; fi int; ff double precision;
  vals double precision[]; dd double precision; val double precision; first int;
  m0 double precision[]; x double precision[]; k2 double precision; th double precision; s2 double precision; tn2 double precision;
  wts double precision[] := '{}'; eps double precision[];
  n int; xb double precision; yb double precision; sxx double precision := 0; sxy double precision := 0; se double precision := 0;
  aa double precision; bb double precision; x0 double precision; lvl double precision; pp double precision;
  lo double precision; hi double precision; mid double precision; dof double precision; e jsonb;
  names text[] := '{}'; cnt int[] := '{}'; sm double precision[] := '{}'; sq double precision[] := '{}';
  tot int := 0; mu double precision; var double precision; lp double precision[] := '{}'; mx double precision; den double precision; idx int;
  nx int; ny int; z double precision[]; live boolean[]; seen boolean[]; front boolean[]; crest int; best int; run double precision;
  r int; cc int; nbr int[]; bnd boolean;
begin
  if what = 'lfm' then
    select array_agg(e0::double precision order by o) into hb from jsonb_array_elements_text(b->'horizonsMs') with ordinality q(e0, o);
    for k in 0..ns - 1 loop
      t := t0 + k * dt; s := 0; ws := 0;
      for w in select e1 from jsonb_array_elements(c->'wells') e1 loop
        select array_agg(e0::double precision order by o) into hw from jsonb_array_elements_text(w->'horizonsMs') with ordinality q(e0, o);
        if t <= hb[1] then tw := hw[1] + (t - hb[1]);
        elsif t >= hb[array_length(hb, 1)] then tw := hw[array_length(hw, 1)] + (t - hb[array_length(hb, 1)]);
        else
          tw := t;
          for i in 1..array_length(hb, 1) - 1 loop
            if t <= hb[i + 1] then
              tw := hw[i] + (case when hb[i + 1] - hb[i] > 0 then (t - hb[i]) / (hb[i + 1] - hb[i]) else 0 end) * (hw[i + 1] - hw[i]);
              exit;
            end if;
          end loop;
        end if;
        select array_agg(e0::double precision order by o) into vals from jsonb_array_elements_text(w->'lnAiLowPassed') with ordinality q(e0, o);
        xx := (tw - t0) / dt;
        if xx >= 0 and xx <= array_length(vals, 1) - 1 then
          fi := floor(xx)::int; ff := xx - fi;
          val := case when ff < 1e-12 then vals[fi + 1] else vals[fi + 1] + ff * (vals[fi + 2] - vals[fi + 1]) end;
          dd := sqrt(((w->>'x')::double precision - (b->>'x')::double precision) ^ 2 + ((w->>'y')::double precision - (b->>'y')::double precision) ^ 2);
          s := s + val / dd ^ (st->'lfm'->>'power')::double precision;
          ws := ws + 1 / dd ^ (st->'lfm'->>'power')::double precision;
        end if;
      end loop;
      lfm := lfm || case when ws > 0 then s / ws else null end;
    end loop;
    first := null;
    for k in 1..ns loop if lfm[k] is not null then first := k; exit; end if; end loop;
    for k in 1..first - 1 loop lfm[k] := lfm[first]; end loop;
    for k in first + 1..ns loop if lfm[k] is null then lfm[k] := lfm[k - 1]; end if; end loop;
    return lfm[(st->'lfm'->>'sampleB')::int + 1];
  end if;

  if what = 'mb' then
    select array_agg(e0::double precision order by o) into m0 from jsonb_array_elements_text(ta->'lowFrequencyModels'->'lnAi') with ordinality q(e0, o);
    x := pg_temp.qi_lsq(jsonb_build_array(ta->'fullWavelet'), jsonb_build_array(ta->'full'), array[1::double precision], 1, ns,
                        array[(st->'modelBased'->>'eps')::double precision], m0);
    return exp(x[(st->'modelBased'->>'sampleA')::int + 1]);
  end if;

  if what = 'sim' then
    select array_agg(e0::double precision order by g0, o) into m0 from
      (select 1 g0, e0, o from jsonb_array_elements_text(ta->'lowFrequencyModels'->'lnAi') with ordinality q(e0, o)
       union all select 2, e0, o from jsonb_array_elements_text(ta->'lowFrequencyModels'->'lnSi') with ordinality q(e0, o)
       union all select 3, e0, o from jsonb_array_elements_text(ta->'lowFrequencyModels'->'lnRho') with ordinality q(e0, o)) u;
    k2 := (ta->>'backgroundVsVp')::double precision ^ 2;
    for k in 0..jsonb_array_length(ta->'angles_deg') - 1 loop
      th := radians((ta->'angles_deg'->>k)::double precision); s2 := sin(th) ^ 2; tn2 := tan(th) ^ 2;
      wts := wts || 0.5 * (1 + tn2) || -4 * k2 * s2 || 0.5 * (4 * k2 * s2 - tn2);
    end loop;
    select array_agg(e0::double precision order by o) into eps from jsonb_array_elements_text(st->'simultaneous'->'eps') with ordinality q(e0, o);
    x := pg_temp.qi_lsq(ta->'angleWavelets', ta->'angleTraces', wts, 3, ns, eps, m0);
    k := (st->'simultaneous'->>'sampleA')::int;
    return exp(x[k * 3 + 1] - x[k * 3 + 2]);
  end if;

  if what = 'phi' then
    n := jsonb_array_length(c->'calibration'->'porosity'->'rows'); xb := 0; yb := 0;
    for e in select e1 from jsonb_array_elements(c->'calibration'->'porosity'->'rows') e1 loop
      xb := xb + (e->>0)::double precision; yb := yb + (e->>1)::double precision;
    end loop;
    xb := xb / n; yb := yb / n;
    for e in select e1 from jsonb_array_elements(c->'calibration'->'porosity'->'rows') e1 loop
      sxx := sxx + ((e->>0)::double precision - xb) ^ 2;
      sxy := sxy + ((e->>0)::double precision - xb) * ((e->>1)::double precision - yb);
    end loop;
    bb := sxy / sxx; aa := yb - bb * xb;
    for e in select e1 from jsonb_array_elements(c->'calibration'->'porosity'->'rows') e1 loop
      se := se + ((e->>1)::double precision - aa - bb * (e->>0)::double precision) ^ 2;
    end loop;
    se := sqrt(se / (n - 2));
    x0 := (st->'porosity'->>'atAi')::double precision; lvl := (st->'porosity'->>'level')::double precision;
    pp := (1 - lvl) / 2; dof := n - 2; lo := 0; hi := 100;
    for k in 1..200 loop
      mid := (lo + hi) / 2;
      if 0.5 * pg_temp.qi_betainc(dof / 2, 0.5, dof / (dof + mid * mid)) > pp then lo := mid; else hi := mid; end if;
    end loop;
    return aa + bb * x0 + (lo + hi) / 2 * se * sqrt(1 + 1.0 / n + (x0 - xb) ^ 2 / sxx);
  end if;

  if what = 'poil' then
    for e in select e1 from jsonb_array_elements(c->'calibration'->'facies'->'rows') e1 loop
      idx := array_position(names, e->>0);
      if idx is null then names := names || (e->>0); cnt := cnt || 0; sm := sm || 0::double precision; idx := array_length(names, 1); end if;
      cnt[idx] := cnt[idx] + 1; sm[idx] := sm[idx] + (e->>1)::double precision; tot := tot + 1;
    end loop;
    sq := array_fill(0::double precision, array[array_length(names, 1)]);
    for e in select e1 from jsonb_array_elements(c->'calibration'->'facies'->'rows') e1 loop
      idx := array_position(names, e->>0);
      sq[idx] := sq[idx] + ((e->>1)::double precision - sm[idx] / cnt[idx]) ^ 2;
    end loop;
    x0 := (st->'facies'->>'atAi')::double precision;
    for k in 1..array_length(names, 1) loop
      mu := sm[k] / cnt[k]; var := sq[k] / (cnt[k] - 1);
      lp := lp || (ln(cnt[k]::double precision / tot) - 0.5 * (x0 - mu) ^ 2 / var - 0.5 * ln(2 * pi() * var));
    end loop;
    mx := lp[1]; for k in 2..array_length(lp, 1) loop mx := greatest(mx, lp[k]); end loop;
    den := 0; for k in 1..array_length(lp, 1) loop den := den + exp(lp[k] - mx); end loop;
    return exp(lp[array_position(names, st->'facies'->>'class')] - mx) / den;
  end if;

  if what = 'column' then
    nx := (c->'grid'->'spec'->>'nx')::int; ny := (c->'grid'->'spec'->>'ny')::int;
    select array_agg(coalesce(e0::double precision, 1e30) order by o) into z from jsonb_array_elements_text(c->'grid'->'z') with ordinality q(e0, o);
    live := array_fill(false, array[nx * ny]); seen := array_fill(false, array[nx * ny]); front := array_fill(false, array[nx * ny]);
    crest := null;
    for k in 1..nx * ny loop
      live[k] := abs(z[k]) < 1e29;
      if live[k] and (crest is null or z[k] > z[crest]) then crest := k; end if;
    end loop;
    front[crest] := true; seen[crest] := true; run := 'Infinity';
    loop
      best := null;
      for k in 1..nx * ny loop
        if front[k] and (best is null or z[k] > z[best]) then best := k; end if;
      end loop;
      exit when best is null;
      front[best] := false;
      run := least(run, z[best]);
      r := (best - 1) / nx; cc := (best - 1) % nx;
      nbr := '{}';
      if cc > 0 then nbr := nbr || (best - 1); end if;
      if cc < nx - 1 then nbr := nbr || (best + 1); end if;
      if r > 0 then nbr := nbr || (best - nx); end if;
      if r < ny - 1 then nbr := nbr || (best + nx); end if;
      bnd := r in (0, ny - 1) or cc in (0, nx - 1);
      foreach k in array nbr loop if not live[k] then bnd := true; end if; end loop;
      exit when bnd;
      foreach k in array nbr loop
        if not seen[k] and live[k] then seen[k] := true; front[k] := true; end if;
      end loop;
    end loop;
    return z[crest] - run;
  end if;
  return null;
end $f$;
