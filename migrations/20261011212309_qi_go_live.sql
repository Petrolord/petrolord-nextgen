-- ============================================================================
-- QI GO-LIVE (HELD): Quantitative Interpretation flips to 'available' in the
-- Geoscience module, at path_order 80.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/qi. The 78 lessons, the teaching lab (qiLab.js and its
-- Professional and Expert companions), the four explorer panels and the
-- capstone case files ship in the ZIP and NOT in this database. AN APP COURSE:
-- the Suite app is QI Studio, and the course's own explorer panels carry every
-- practical, so this go-live waits on the NextGen upload only.
--
-- IT ALSO REFUSES WHILE THE LADDER IS SHORT: naming the tier when a capstone is
-- missing, and when the three deep structures or the 396 questions are not all
-- seeded (the Professional and Expert deep seeds are written once their banks
-- are final, and this file is regenerated then).
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--   1. against the ENGINE LEDGER (the capstone generators' run through the
--      teaching lab and the vendored engines), to the last bit;
--   2. by a SECOND ROUTE IN SQL over the case file the learner is handed, to
--      1e-9 relative, for sixteen fields: Batzle-Wang, Wood, Voigt-Reuss-Hill,
--      Gassmann, least squares, Shuey and the total least squares wet trend;
--      Dix, Walden, NMO stretch, the binned partial stacks, the Shuey
--      regression and the one scale; the low-frequency model, both inversions
--      solved exactly by their normal equations, the Student t porosity bound,
--      the Gaussian facies posterior and the priority-flood closure. The two
--      Associate spectrum fields (a padded FFT) have none and rest on check 3;
--   3. by the ORACLE (oracle_check.py, an independent standard-library Python
--      replay, a direct DFT for the spectra), written in by value, within each
--      field's tolerance;
--   4. by the TRAPS: every wrong method discriminate.mjs swept through the
--      engines, by value, must miss the seeded value by more than its tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), gone when the session ends.
-- NO BEGIN OR COMMIT: apply_qi.sh wraps this file in one transaction.
-- THE GRADER IS NUMERIC: abs(answer - expected) <= tol. The six-decimal answer
-- the prompt asks for must pass, and one unit either side in the sixth decimal
-- must fail at the six-decimal floor. Two Expert fields are graded wider than
-- the floor because their value comes from an iterative solver: the model-based
-- impedance at 1 kg/(m2 s) (under a millionth of the value) and the
-- simultaneous Vp/Vs at 5e-6, the tolerances gradedTolerance.js derives.
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================
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

do $$
#variable_conflict use_column
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int;
  v_names text; v_prompt text; v_s double precision; v_wrong double precision;
  v_g_tamberlo_low6_hz double precision;
  v_g_tamberlo_centroid_hz double precision;
  v_g_tamberlo_shear_slope double precision;
  v_g_tamberlo_ai_brine double precision;
  v_g_tamberlo_vpvs_brine double precision;
  v_g_tamberlo_wet_distance double precision;
  v_g_quarvin_dix_vint double precision;
  v_g_quarvin_walden_deg double precision;
  v_g_quarvin_nmo_stretch double precision;
  v_g_quarvin_far_stack_amp double precision;
  v_g_quarvin_shuey_a double precision;
  v_g_quarvin_one_scale double precision;
  v_g_delsholm_lfm_lnai_b double precision;
  v_g_delsholm_mb_ai double precision;
  v_g_delsholm_sim_vpvs double precision;
  v_g_delsholm_phi_q90 double precision;
  v_g_delsholm_p_oil double precision;
  v_g_delsholm_column_ft double precision;
  v_case_b jsonb := '{"case":"TAMBERLO","tier":"beginner","synthetic":true,"description":"A held-out synthetic feasibility case written for the Associate capstone: one well, Tamberlo-1, over a shale cap, an oil-bearing sand with a water leg and the shale below it, and a patch of eighteen seismic traces. None of it is the Ekene field.","traces":{"dt_ms":2,"t0_ms":0,"count":18,"samples":400,"traces":[[0.0043085,0.0048102,0.0101875,0.0002809,-0.0097262,-0.0102912,-0.0067023,-0.0066336,-0.0159307,-0.0086317,0.006738,0.0020128,0.0081376,0.0119827,-0.0011685,0.0039368,-0.0054495,-0.0103548,-0.025066,-0.0463204,-0.0359387,-0.0179373,-0.0130978,0.0432733,0.076195,0.0956001,0.084596,0.0587445,0.0071099,-0.0408777,-0.064538,-0.0567778,-0.0680444,-0.0411071,-0.0197732,0.026318,0.0546118,0.0561175,0.0564356,0.0266815,0.0074115,-0.0054495,-0.0252401,-0.0126967,0.0037544,0.009361,0.0183714,-0.006842,-0.0162677,-0.0421118,-0.0598988,-0.0473924,-0.0290468,-0.0151454,0.0014293,0.0008428,0.0086495,0.0120124,0.0217154,0.023029,0.0202238,0.0199896,0.0093847,0.0063343,-0.0086361,-0.0057249,-0.0089427,-0.0143237,-0.002002,0.012071,0.0139751,0.0245524,0.0132478,0.0129458,-0.0026987,-0.0072219,-0.0154587,-0.0202103,-0.0021256,-0.0149504,0.00094,-0.0118465,-0.0123954,-0.030517,-0.0367949,-0.0457821,-0.0267907,-0.0113861,0.0361285,0.0876685,0.121107,0.1142038,0.0884738,0.042523,-0.0292221,-0.0620623,-0.0859595,-0.085133,-0.0563238,-0.0319834,-0.0043286,0.0032775,0.0149455,0.01913,0.0236005,0.016822,0.0190149,0.0218537,0.0143981,0.0078814,-0.0051959,-0.0340804,-0.0656033,-0.0656927,-0.0700801,-0.0457679,0.0143501,0.0573337,0.0798263,0.1126981,0.0795906,0.0591794,0.0141633,-0.029833,-0.0330489,-0.0406315,-0.0194514,-0.0143043,-0.0055501,-0.0072236,-0.0008089,-0.0115604,-0.0062837,0.0044467,-0.0016886,-0.0008831,-0.0145298,-0.0228017,-0.0482998,-0.0510188,-0.0471588,-0.0204617,0.0232262,0.0902209,0.140027,0.1508117,0.1178518,0.0408893,-0.0312028,-0.0644885,-0.0765829,-0.054697,-0.0497678,-0.0460177,-0.0610558,-0.0653795,-0.0519696,-0.0234313,0.003637,0.0346287,0.0439158,0.0381451,0.0395279,0.0120131,0.0059923,0.0004335,-0.0048697,0.0081518,0.0257565,0.0187248,0.0251091,0.0149905,-0.0007209,-0.0249931,-0.0544204,-0.0756926,-0.0709814,-0.0397747,0.0055136,0.046027,0.0832933,0.0825642,0.0646238,0.041806,0.0221898,0.0143966,0.0105946,-0.0031978,-0.0226544,-0.051909,-0.0667913,-0.0758025,-0.0611891,-0.0450081,-0.0124216,0.0034589,0.0023828,-0.0014274,-0.0073571,-0.0075479,0.0107849,0.025761,0.0526651,0.0475162,0.0282076,-0.0132837,-0.0466034,-0.0482662,-0.0235136,0.0283271,0.0710488,0.100812,0.0681369,0.0482165,0.0013818,-0.0350428,-0.064809,-0.0480528,-0.0201522,-0.0012588,0.018594,0.0116805,0.0195946,0.0095338,0.0061152,0.009889,-2.96e-05,-0.0016024,-0.0096063,-0.0213336,-0.019531,-0.0247304,-0.0291143,-0.0185112,-0.0068726,0.0063968,0.0069152,0.0079061,0.0036289,0.0092767,0.0062513,-0.0086932,-0.0027759,-0.0007691,0.0051499,0.0062148,0.0063737,-0.0038619,-0.0059951,-0.0013694,0.0057409,0.0079084,0.0242685,0.027883,0.0378346,0.0158071,-0.0071713,-0.0322563,-0.0562251,-0.0788938,-0.0505022,-0.0355282,-0.0056816,0.0213414,0.0349178,0.0263753,0.0265396,0.0185101,0.0126439,0.0110924,-0.003565,-0.0035507,-0.0065214,0.0010713,0.0026491,-0.0056457,-0.0161994,-0.0090218,-0.0086405,-0.0186323,-0.0215738,-0.0190229,-0.00208,0.0056647,0.0228688,0.0289967,0.0460126,0.0662682,0.0722951,0.0418949,0.0198143,-0.0161564,-0.0303846,-0.0540894,-0.0543656,-0.0404857,-0.0327984,-0.0136097,-0.0074655,0.0152153,0.0269236,0.0144739,0.0296655,0.0292074,0.013662,-0.0028748,-0.0319234,-0.0291496,-0.0449319,-0.0304097,-0.0215562,-0.0030653,0.0105552,0.0129768,0.0066286,-0.0048913,-0.0158788,-0.0328697,-0.0079363,0.0053156,0.022459,0.0429319,0.0637355,0.0508677,0.0229022,0.0003532,-0.0239432,-0.0393583,-0.0420316,-0.0251577,-0.0368473,-0.016405,-0.0035237,0.0069149,0.0374897,0.0547217,0.0452174,0.0254792,0.0029039,-0.0073482,-0.0165295,-0.0230867,-0.015741,-0.0177434,-0.0212287,-0.0193707,-0.0199383,-0.0322396,-0.0426707,-0.0293792,0.0048398,0.0379952,0.0659915,0.082079,0.0743315,0.0486837,0.0207694,0.0076625,0.0038443,-0.0207338,-0.0240779,-0.0443955,-0.0698544,-0.067363,-0.0568953,-0.0293151,-0.0023906,0.025362,0.0302401,0.010879,0.0067447,0.0064401,0.0036441,-0.0004186,0.0062187,-0.0074257,0.0028313,-0.0082017,-0.0118964,-0.0073821,0.0006754,0.0186518,0.0333837,0.0296384,0.0226611,0.0134215,0.0029306,0.0039359,-0.0009648,-0.0152573,-0.0066056,0.0127272,-0.0040218,-0.0100115,-0.0177292,-0.0260177,-0.0052578,-0.0178858,0.004698,0.0089517],[-0.0010043,0.0062424,0.0037746,0.0032893,0.0021835,0.0070359,-0.0010485,0.0035328,-0.0006107,-0.0065613,-0.0067856,-0.0031927,-0.0018346,0.0133961,-0.0025051,-0.004171,0.0091295,-0.007703,-0.0088807,-0.0077718,0.0025406,0.0067213,0.0169879,0.0196259,0.0259847,0.0228494,-0.0013928,0.0003999,-0.0033474,-0.0190336,-0.0111083,-0.0099531,-0.003551,0.0056034,0.0008793,-0.0023805,-0.0041522,0.000308,0.0035632,-0.0070037,-1.96e-05,-0.0091665,-0.0051055,0.0101917,0.0069656,0.0193687,0.0031631,-0.0010887,-0.0135749,-0.0128631,-0.0332904,-0.0195926,-0.0100495,0.0058442,0.0040198,0.0091625,-0.009269,-0.0116933,-0.0249131,-0.0332647,-0.0177461,0.006408,0.0049904,0.0123323,0.0099687,0.0101612,0.0062558,0.0034334,0.0043821,-0.0018211,-0.0130356,0.0087574,-5.4e-05,-0.0019261,-0.0024272,0.0041079,0.0172816,0.0024636,-2.51e-05,0.0027063,-0.006102,-0.0053885,-0.0114007,-0.0191785,-0.012347,-0.0163678,-0.0037937,-0.0168296,-0.025524,-0.022941,-0.025992,-0.0037743,0.0080093,0.0507641,0.0708328,0.0874258,0.0728663,0.0440016,0.0062086,-0.0124094,-0.0352986,-0.04655,-0.0408826,-0.0146091,0.0048762,0.0302208,0.0323173,0.0375791,0.0221557,-0.0088005,-0.032067,-0.0655534,-0.0786532,-0.0868557,-0.0847258,-0.065172,-0.0451212,-0.0249655,0.0123959,0.0817923,0.1054682,0.1346281,0.1138485,0.0602636,0.0237531,-0.0269739,-0.0738576,-0.0661333,-0.0811802,-0.068476,-0.0398449,-0.0305683,-0.0133606,0.0081964,0.0226836,0.0298177,0.0342813,0.0375653,0.0357825,0.021326,0.0115754,0.0055574,-0.0044183,0.0104995,0.0069136,0.0108621,-0.0229603,-0.0435816,-0.0923717,-0.0868956,-0.0772049,-0.032326,0.0027957,0.0367749,0.0607181,0.0540643,0.0326819,0.0171921,0.005127,-0.0272829,-0.0133607,-0.0123321,0.0017138,0.0077385,-0.0106969,-0.0007681,-0.0021341,0.0049708,-0.003401,-0.0078904,0.0082078,0.0026575,-0.0071772,0.0086067,0.0025496,-0.0058675,0.0075671,-0.0011783,-0.0061156,-0.0108554,-0.0142653,-0.000685,-0.021345,-0.0243062,-0.028339,-0.0114327,0.0175751,0.0465078,0.0516727,0.0530525,0.029763,0.0013922,0.0042079,-0.0193311,-0.0164334,-0.0142791,-0.0070535,-0.0011422,0.0028412,0.0110477,0.0182678,0.0299501,0.0414983,0.0453676,0.0110397,-0.0389795,-0.0996204,-0.149297,-0.1859343,-0.1775936,-0.1193371,-0.0070746,0.1277614,0.2312729,0.2611583,0.2440879,0.1702009,0.0817988,-0.0325354,-0.0921809,-0.1279654,-0.1269587,-0.1082553,-0.0962172,-0.0708608,-0.0433718,-0.004162,0.0373293,0.0673135,0.0907469,0.0748432,0.0593428,0.0229676,-0.016371,-0.0303816,-0.038425,-0.0183448,0.0089585,0.0256647,0.0462307,0.0261845,-0.0139525,-0.0514286,-0.1116314,-0.1203586,-0.1038299,-0.0456452,0.0287686,0.0743508,0.1182256,0.1094093,0.0804897,0.0370302,-0.0088114,-0.0264161,-0.0491514,-0.0382099,-0.0250621,-0.0459535,-0.0255743,-0.0339691,-0.036942,-0.0199708,0.0054082,0.0444708,0.054045,0.0632484,0.0538883,0.0384078,-0.0060186,-0.0145977,-0.0335632,-0.0385977,-0.0360079,-0.0292063,-0.0330472,0.0024041,0.0001376,0.0187559,0.030954,0.0480626,0.0438271,0.0147156,-0.005893,-0.0075788,-0.0041292,-0.0110901,0.0018175,0.0078345,0.0113523,-0.0065692,-0.0069401,-0.0277201,-0.0292864,-0.0083912,-0.009471,-1.58e-05,-0.0027729,0.0046819,0.0115085,-0.0027729,0.000494,0.0080956,-0.0053429,0.0127857,-0.0029338,0.00059,0.0036223,-0.0013575,-0.0053602,-0.015132,-0.0222721,-0.0174703,-0.0212427,0.004341,0.0156308,0.0498461,0.0457374,0.0382782,0.0230176,0.01511,0.0061187,-4.2e-05,-0.0050573,-0.0125401,-0.0174294,-0.0231405,-0.0465806,-0.0341166,-0.0267359,-0.0221027,0.0006013,0.0146444,0.0252504,0.0174849,0.0083092,0.0157706,0.0032027,-0.0084683,-0.0021007,-0.0088766,-0.012858,-0.0116752,-0.0162872,0.0114829,0.0213841,0.0412098,0.0272911,0.0362355,0.0176216,-0.0096289,-0.0218597,-0.0279504,-0.0173924,-0.0133151,-0.0334877,-0.0356882,-0.029857,-0.0400799,-0.0210053,0.0240835,0.047839,0.094937,0.0971154,0.0770369,0.0224445,-0.0212582,-0.0389595,-0.0385685,-0.0288499,-0.0221005,-0.0193676,0.0022786,-0.0088348,0.0066393,0.0006175,-0.0053364,0.005084,-0.0020588,-0.0079392,0.0043187,0.0050704,0.0067648,0.0081368,-0.003349,-0.0083411,-0.0103809,-0.0029246,-0.0057529,-0.0100905,0.0167554,0.0186848,0.0219171,0.0119505,0.0092711,-0.0069756,0.0061886,-0.0009916,0.0105625,0.0066481],[0.0071225,0.0213577,0.0248756,0.0162835,0.0107389,0.0018385,-0.0452903,-0.0477052,-0.0543542,-0.0429621,-0.0269414,-0.0043533,0.010473,0.0294655,0.0225626,0.0213244,0.0142458,0.0125458,0.0040983,0.0045254,0.0089373,-0.0032614,0.0014512,-0.0031325,-0.0043449,0.0014934,-0.0110659,-0.0080417,-0.0269523,-0.0293,-0.0152521,-0.0069783,-0.0025666,0.015048,0.0165547,0.0116922,0.0040958,-0.0120816,0.0097107,0.0221383,0.0424792,0.0536537,0.0645021,0.0517122,0.0246779,-0.006704,-0.0372764,-0.0478293,-0.0548977,-0.0454074,-0.0311593,-0.0124791,-0.0024609,0.0083708,0.0071416,0.0035038,0.0119376,0.0219378,0.0226685,0.0282693,0.0271604,0.0071261,0.0046425,-0.0211032,-0.0422517,-0.0645853,-0.047778,-0.0313051,-0.0102595,0.0097291,0.027243,0.0298475,0.0298071,0.0123586,0.015079,0.0020465,-0.0005181,0.0017959,-0.0075026,-0.0020729,-0.0003204,0.0049047,-0.0022411,-0.0004412,-0.0023903,0.0060552,0.0072522,0.0118494,0.0102205,0.0133745,0.0008205,-0.0036755,0.0094987,-0.004009,-0.0019354,-0.0092072,-0.0031095,-0.0135365,-0.0169391,-0.009378,0.0075007,0.0160042,0.0444522,0.054859,0.0584816,0.0563843,0.0243909,-0.0185253,-0.042238,-0.0795634,-0.0847761,-0.071937,-0.0708522,-0.0383425,-0.0398707,-0.0446551,-0.0221024,-0.0024144,0.056632,0.0970122,0.1426476,0.1594748,0.1224822,0.0732242,0.0003811,-0.0466908,-0.0760415,-0.0806826,-0.0782189,-0.0664409,-0.0494924,-0.0237566,-0.0013332,0.0095722,-0.0023247,0.0083031,0.0014225,-0.0090307,0.0093807,0.0040638,0.0208547,0.0347603,0.0262874,0.0318125,0.0370557,0.0229474,0.0155326,0.0033111,-0.0106659,-0.0387326,-0.0525645,-0.0669616,-0.059229,-0.0292214,0.0173836,0.050781,0.0626189,0.0490729,0.0179425,-0.0055321,-0.0241205,-0.0359616,-0.0357076,-0.0204198,-0.0032094,0.0037126,-0.0018585,-0.0057697,-0.0148943,-0.0109997,-0.0077611,-0.0048888,0.0249028,0.0639652,0.0625894,0.0660896,0.0491735,0.0179838,-0.0088988,-0.0542786,-0.0944764,-0.1228916,-0.1277512,-0.1059861,-0.0348677,0.0569942,0.1205841,0.1380064,0.1260381,0.0691901,0.0249668,-0.0382181,-0.0410467,-0.0441122,-0.0210879,-0.0101867,0.0145878,0.0052957,0.0049032,0.0023293,-0.0048549,-0.0091625,-0.0187976,-0.025685,-0.0409327,-0.061753,-0.0592542,-0.0518197,-0.0389155,0.0117506,0.0479202,0.0943155,0.1196745,0.09158,0.0478521,-0.0034468,-0.0403199,-0.0541095,-0.0462911,-0.0163834,0.0029171,0.013747,0.026738,0.0249151,0.0087355,0.0051147,0.0004978,0.015202,-0.0013413,-0.0066536,-0.0193261,-0.055345,-0.0583268,-0.0527217,-0.0383541,-0.0050217,0.0082645,0.0254649,0.0277357,0.0172538,0.013332,0.0128091,0.0135361,0.0018674,0.0023031,0.0050932,-0.0032658,0.0118996,0.0102631,0.0243216,0.017649,-0.0028126,-0.0216604,-0.0345731,-0.0423256,-0.0352314,-0.0209301,-0.0039725,0.0121642,0.0155965,0.0099959,0.0173971,0.0064291,0.0086812,-0.0101694,0.0078702,-0.0028602,-0.0022226,0.0025825,-0.0010055,-0.008275,-0.0044561,-0.0068512,0.0029568,-0.0046172,-0.0231935,-0.0168003,-0.0068102,0.0026347,0.0141948,0.0442898,0.0559052,0.0414698,0.0293189,0.0095202,-0.0149105,-0.0301942,-0.0300927,-0.0410764,-0.0291166,-0.0327532,-0.0510017,-0.0481478,-0.04813,-0.0310751,-0.0045946,0.020845,0.0527725,0.0624229,0.0616213,0.0588542,0.0327478,0.0068458,-0.01579,-0.0163899,-0.0151094,-0.0110467,0.0151068,0.0204334,0.0343291,0.0351699,0.009928,-0.0176277,-0.0332531,-0.0694816,-0.0797555,-0.0687659,-0.0438087,0.002817,0.0243579,0.0434533,0.053298,0.0286374,0.0252493,-0.0019345,0.0023288,-0.0060125,-0.0213444,-0.0161898,-0.0266085,-0.0236881,-0.009386,-0.0128019,0.011576,0.018591,0.0337164,0.0411494,0.023162,0.0196668,0.0028096,-0.0070832,-0.0150292,-0.0011239,-0.0077028,-0.0152198,-0.0099553,-0.0144618,-0.0128219,-0.0017746,-0.0090159,-0.0019623,0.0077016,0.0023612,0.0073049,0.0160962,0.017082,0.0072299,-0.0089334,-0.0120433,-0.0292874,-0.0296227,-0.0182484,-0.0118258,0.0005422,0.0091151,0.0135729,0.0106064,0.012419,0.001616,0.0002692,-0.0081877,-0.0092546,-0.0180521,-0.0114621,-0.0207594,-0.0101601,-0.007001,0.0192043,0.0298738,0.038403,0.0386003,0.0206445,-0.0068573,-0.0130264,-0.018232,-0.017568,-0.0159102,-0.0131841,-0.0119365,0.0020374,0.0012352,-0.0055346,0.0004815,-0.0042402,0.0015292,-0.0033241,0.0050934,0.0045492,-0.0026548,-0.0031524],[0.0034199,0.0069534,0.0043955,0.0007234,0.0002319,0.0001788,0.0062342,0.0020092,-0.0102621,-0.0060743,0.0027719,0.0157215,0.0054169,0.0005583,-0.0032724,-0.0077843,-0.0015222,-0.003996,-0.02202,-0.0181899,-0.0021733,-0.0102327,0.0188822,0.0329026,0.0294285,0.0316359,0.0102953,0.0059662,-0.0069304,-0.0259076,-0.0261252,-0.0379258,-0.046317,-0.0320692,-0.0381096,-0.0161686,0.0259049,0.0582115,0.1055172,0.0892595,0.0631169,0.0100225,-0.0287106,-0.0690718,-0.0583899,-0.034681,-0.0214062,-0.0083244,0.0043138,0.000491,-5.68e-05,0.0150232,-0.0086768,0.0149905,0.0038317,0.0076225,0.0112784,0.0107052,-0.0041062,-0.0093969,-0.0048562,-0.0179706,0.0004641,0.0036862,0.0092824,0.0070612,-0.0026994,0.0203242,0.0165493,0.0125895,0.0184637,-0.0024075,-0.0275321,-0.029914,-0.0468205,-0.0570331,-0.0513696,-0.0382035,-0.0122109,0.0175868,0.054359,0.0653314,0.0724982,0.0520067,0.0278342,0.0200321,0.0086012,0.0044223,0.0196895,0.0121803,-0.0135241,-0.0415154,-0.0632512,-0.0874138,-0.0768129,-0.0262545,0.0208332,0.0917429,0.0950421,0.0688376,0.0254538,-0.0083572,-0.0402043,-0.0563933,-0.034617,-0.013912,0.0289564,0.0507342,0.0592468,0.0316982,-0.0272306,-0.0893301,-0.1293634,-0.1511575,-0.1061885,-0.0757074,-0.0046746,0.0496601,0.1256661,0.1492972,0.1626462,0.1244003,0.0722595,0.0217347,-0.0477937,-0.0667369,-0.0588697,-0.0432753,-0.0284394,-0.0158114,-0.0018937,-0.0098082,0.0058196,0.0246224,0.0090489,0.0076494,0.0096536,-0.0086722,-0.0089046,-0.0412347,-0.0580684,-0.0663368,-0.043938,-0.0066992,0.03729,0.0778863,0.0859441,0.087415,0.0480132,-0.0072647,-0.0419135,-0.0386133,-0.0356513,-0.0333155,-0.0178816,-0.0052445,0.0077794,0.0208866,0.0088546,0.0041418,0.020427,0.0147899,0.0284264,0.0266841,0.0216999,-0.0015293,-0.038288,-0.0670121,-0.0826112,-0.0478924,-0.0325567,-0.0008358,0.0126843,0.0383866,0.0481259,0.0150743,0.0181609,-0.0028547,0.0062002,0.0022803,0.0003256,0.005226,-0.0076703,-0.0103283,0.0001354,0.0051943,-0.0102962,0.0002656,0.001646,-0.001545,0.0049121,0.0073889,0.0052237,-0.002072,0.005285,0.0060776,0.0019688,0.0014926,-0.0058636,-0.0219867,-0.0455879,-0.0554197,-0.0805403,-0.1059469,-0.0925338,-0.0624134,-0.017429,0.0567041,0.1301985,0.174386,0.1919853,0.1652831,0.1316368,0.0656863,-0.0208453,-0.0789928,-0.1122371,-0.119292,-0.0840745,-0.0335782,-0.007768,0.0537746,0.0513616,0.0411386,-0.0049154,-0.0747335,-0.1199069,-0.1201827,-0.0870347,-0.0184205,0.0408198,0.0726844,0.0991513,0.0837819,0.0452967,0.017434,-0.0215648,-0.0510222,-0.0330534,-0.0304008,-0.0146311,0.0091113,0.0203947,0.0369153,0.034253,0.0228243,0.0083083,0.0061844,0.0069752,0.0021152,0.0135668,0.0064344,-0.0399998,-0.0458574,-0.0697189,-0.0554581,-0.0388673,-0.0197473,0.0187574,0.0208107,0.0282644,0.0266245,0.0222972,0.0129423,0.0019764,0.0017131,-0.0135911,-0.0084541,-0.0103535,0.0033059,0.0014726,-0.0090198,-0.0044703,0.0070042,0.0053455,0.0003956,0.0039336,0.0204948,0.0194746,0.0131694,0.0132904,0.0186264,0.0283322,0.0237878,0.0048704,-0.00328,-0.0054593,-0.0284126,-0.0346065,-0.0432458,-0.0543717,-0.0120905,-0.0031294,0.0125217,0.0212899,0.0248941,0.0243795,0.015717,0.0114995,0.0093605,0.0079761,0.0144714,0.0308434,0.0156479,0.0386878,0.0518752,0.0442256,0.0153902,-0.0293488,-0.0816201,-0.0999496,-0.1103612,-0.0814208,-0.0287752,0.0047102,0.0345556,0.0325605,0.025189,0.021974,0.0134985,0.0301808,0.0446921,0.0403408,0.0368467,0.0177453,0.0028621,-0.0154998,-0.0212871,-0.0134645,-0.0070954,-0.0104154,-0.0149837,-0.0065854,-0.0003614,-0.0020397,0.0061671,0.0092793,-0.0050542,-0.010025,0.0012961,-0.0074145,0.0190655,8.36e-05,0.0010356,-0.0047222,0.0019742,0.0004864,0.0065821,-0.0038389,-0.0011457,0.0012419,0.0004205,-0.0001514,0.0182693,0.0188366,0.0250745,0.0661873,0.0661933,0.0571957,0.0124355,-0.0446099,-0.0979718,-0.1310537,-0.1291669,-0.0751613,-0.0206337,0.0303818,0.0691289,0.0540759,0.0487187,0.0296801,0.0329844,0.0083524,0.0060739,-0.0026866,0.0057979,-0.012661,-0.0023757,0.0032733,0.0064533,0.0002488,-0.0012142,-0.0081097,-0.0080248,-0.0096971,-0.0045702,0.0161032,0.0060428,0.014602,0.0060901,-0.01314,0.0091532,-0.0058181,-0.0146656,0.0117285,-0.0091312,-0.0007611,0.0026056,0.0063765,-0.0100775],[0.0084984,0.0017469,0.0115449,0.0021786,0.0132604,0.0045994,-0.0052366,-0.0040987,-0.0231639,-0.0320977,-0.0157191,-0.019135,-0.0112052,-0.0066181,-0.0016686,-0.0098135,-0.0146964,-0.0121059,0.0115663,0.0223432,0.0484564,0.0541329,0.0405404,0.0239404,-0.0020894,-0.0182901,-0.0172045,-0.0220294,-0.0155351,-0.0117529,-0.0019532,-0.00597,-0.0064497,-0.0058919,-0.001486,-0.0007657,0.0001957,-0.0005075,-0.0043493,-0.0025291,-0.0052599,0.0054904,0.0150533,0.0271883,0.0268681,0.0292641,0.0143033,-0.0057776,-0.0293162,-0.0497052,-0.0575255,-0.0547298,-0.0314018,-0.0061602,0.0167548,0.0360837,0.0372806,0.0286843,0.0198787,0.0102326,-0.0044272,-0.0320744,-0.0488934,-0.041424,-0.0294419,0.0015608,0.0212701,0.0464014,0.0501158,0.0290292,0.012725,7.93e-05,-0.007271,-0.0071411,-0.0121092,-0.0048851,-0.0045305,-0.0063839,0.0057323,-0.0005735,0.0018689,-0.0026724,-0.0035164,0.0025227,0.0007918,8.8e-06,-0.0017617,0.0012755,0.0106922,0.0074047,0.0073082,0.0098055,0.0063263,-0.0123122,-0.0133126,-0.0144916,-0.0116509,-0.017949,0.0022287,0.0060718,0.0075962,0.0041787,0.0086006,0.0022879,0.0047998,0.0048074,0.0018466,-0.0078846,0.0009179,0.0055624,0.0084665,0.0079675,0.0099194,-0.0060793,-0.0197173,-0.0418573,-0.0620159,-0.0688351,-0.0441529,-0.012552,0.0363838,0.0821833,0.1029092,0.0874706,0.058075,0.0085362,-0.0254546,-0.0289105,-0.0442911,-0.0301896,-0.0344472,-0.0165527,-0.0185412,-0.000799,0.0058883,0.0175029,0.0248415,0.0175433,0.0120339,0.0060399,0.0094121,0.0208357,0.0279618,0.0440948,0.0526437,0.0289846,-0.0020659,-0.0581057,-0.1087507,-0.10942,-0.0978533,-0.0529602,-0.003814,0.0286642,0.0230613,0.0138943,0.0092351,0.0089093,0.0189881,0.0297851,0.0391069,0.0327818,0.0243723,0.0160074,0.0099489,-0.0102806,-0.0040967,-0.0030485,0.000784,-0.0049439,0.0050237,-0.0068587,0.0027931,-0.0044799,0.0044009,0.0003692,0.0029906,0.0049543,-0.0013525,-0.0020449,-0.0060648,-0.0066731,-0.0177531,-0.0213951,-0.014409,-0.0097544,0.012214,0.0268034,0.0382264,0.0517475,0.0307,0.0117747,-0.0145303,-0.0324501,-0.0302632,-0.0296114,-0.0256861,-0.01366,-0.0039548,-0.0042673,0.0037456,0.0148549,0.0129876,0.0100205,0.0087252,0.0043067,-0.0104278,-0.0185665,-0.030177,-0.0467812,-0.0516967,-0.0252389,-0.0006046,0.0551932,0.0935709,0.1161006,0.0924323,0.0547006,-0.0051459,-0.0320865,-0.0520038,-0.0526227,-0.0501046,-0.0386676,-0.0206665,-0.0071126,0.0003824,0.0143112,0.0207925,0.0187616,0.008069,0.00607,0.0054825,0.0015492,-0.0013319,-0.007671,0.0010846,0.0003799,-0.0125525,-0.006706,0.0071067,0.0133835,0.0098529,0.0240243,0.0229839,0.021799,0.0134833,-0.0136916,-0.0377545,-0.055818,-0.0641373,-0.0571832,-0.0289052,-0.0028863,0.0136261,0.0293364,0.0294784,0.0266073,0.0141848,0.0130658,0.0013844,-0.0005493,-0.0123636,-0.003391,0.0007012,-0.0008741,0.0083687,0.001309,0.004707,0.0012637,0.0005261,0.0039169,-0.0045751,-0.004196,0.000749,-0.0031666,-0.0018369,0.0022889,-0.0038033,0.0082185,0.0134575,0.0179534,0.0219567,0.0278497,0.0293761,0.0166008,-0.0035547,-0.0271633,-0.045971,-0.0608192,-0.0617398,-0.0341395,-0.0130633,0.0103773,0.0310957,0.0362475,0.038416,0.0253999,0.0326291,0.0264879,0.0159667,-0.0063509,-0.0200848,-0.0393569,-0.0469839,-0.0438534,-0.0179945,0.0090914,0.0259483,0.0284374,0.0304765,0.0156527,0.0039253,-0.0041875,-0.0063933,-0.0199967,-0.0202417,-0.022221,-0.016057,0.0053399,0.0236539,0.0460321,0.0530562,0.0399345,0.0240151,-0.0075022,-0.0221149,-0.0376814,-0.0320634,-0.0259455,-0.0132146,0.0041469,0.0121991,0.0082709,-0.0020367,0.0010551,0.0151759,0.0202096,0.0237077,0.0199757,0.0102809,-0.0079285,-0.0225689,-0.0305089,-0.0266509,-0.0007257,0.0272466,0.0473361,0.0479341,0.0206222,-0.0221469,-0.0621545,-0.0902231,-0.0699162,-0.0481044,-0.0008855,0.0287606,0.0476643,0.049576,0.0411457,0.0262262,0.0137143,-0.0091383,-0.0310107,-0.0344302,-0.030369,-0.0207763,-0.0002954,0.0115832,0.0035086,-0.0002806,-0.010054,-0.021391,-0.0265287,-0.0107408,0.0062366,0.0374472,0.0570964,0.0649715,0.0624367,0.035201,-0.0033041,-0.0109278,-0.0293433,-0.0265153,-0.0150401,-0.0225814,-0.0092017,-0.0034456,-0.0036218,-0.0039222,-0.000889,0.0023266,0.0029501,0.0095586,0.0013232,0.0076606,-0.0016079,0.0056631,0.0015513],[0.0091435,0.0134366,0.0273709,0.0286167,0.0306998,0.0442215,0.0322341,-0.0020572,-0.0529025,-0.0624816,-0.0899532,-0.0768046,-0.0634859,-0.016845,0.0115559,0.0354052,0.0251281,0.0311666,0.0237708,0.013024,0.0068695,0.0051613,0.00717,0.0015405,0.004775,0.0150546,0.0164599,0.0033439,0.0032628,-0.0046745,-0.0024566,-0.0073113,0.0002423,0.003925,0.0020821,-0.0001299,0.0003642,0.0013077,-0.0026321,0.0100225,0.0012914,0.0002453,0.0116157,-0.0010925,0.0100967,-0.0019196,0.0019315,0.0024743,0.0119494,-0.0133216,0.0067351,0.0133464,0.0128723,0.0054157,-0.0070883,-0.0185549,-0.0306605,-0.0275737,-0.0261194,-0.0110157,-0.0055521,0.0116834,0.0159645,0.023792,0.0168121,0.02489,0.0225001,0.0201558,0.0212291,0.0014676,-0.0297858,-0.0507233,-0.0595927,-0.0525785,-0.0266865,0.0082458,0.027672,0.0325242,0.035595,0.0248511,0.0108964,-0.0100334,-0.007602,-0.0045492,-0.007998,0.0040345,-0.0001259,0.0081141,0.002366,-0.0009121,-0.0048281,-0.0034468,0.0013192,-0.0020106,-0.0051838,-0.0008386,0.0170898,-0.0077,-0.0026356,0.0098635,-4.6e-06,0.0071592,0.0065166,-0.0044782,0.0048179,-0.0002822,0.0039636,0.0046869,0.0023799,-0.0023099,0.0002902,0.0008466,0.006449,-0.0033176,-0.0064033,-0.0102006,-0.0255002,-0.0378444,-0.0418233,-0.034446,0.0093116,0.0371824,0.0688114,0.0910716,0.0685764,0.054563,0.0048336,-0.0203716,-0.0329417,-0.0415439,-0.0244205,-0.0122631,-0.0108106,-0.0066387,-0.0065819,0.006645,0.0104717,0.0079822,0.0155717,0.0080946,0.0065777,-0.010268,-0.0335405,-0.0351323,-0.043965,-0.0267578,0.0036639,0.037559,0.0513878,0.0492099,0.0198505,-0.0171326,-0.0421913,-0.0611479,-0.0512534,-0.0236662,0.0046386,0.0163205,0.0082246,0.0198368,0.0031386,0.0087449,0.0073407,-0.0026108,-0.0127468,-0.0206106,-0.0141935,-0.0350755,-0.0490057,-0.0231597,0.0017177,0.0350997,0.0747238,0.0820493,0.0765538,0.0467758,0.0081814,-0.0111628,-0.0302973,-0.0317382,-0.0299613,-0.0153127,-0.0100059,-0.0211254,-0.0007973,0.0018129,-0.0026106,-0.005619,0.0001922,0.0018593,0.0017198,0.0045299,-0.0052029,0.002702,-0.0021698,0.0062422,0.0049921,0.0069724,0.0176598,0.0158648,0.0264109,0.0033206,-0.0128757,-0.030312,-0.0661254,-0.0736475,-0.0694988,-0.0558491,-0.0366361,-0.0002499,0.0299253,0.0691502,0.1052505,0.1251254,0.0956366,0.0538644,0.0126084,-0.0223248,-0.0378063,-0.029177,-0.0218659,-0.0141566,-0.0166221,-0.0226446,-0.0189259,-0.024395,-0.0181388,-0.0134189,-0.0078369,0.0112584,0.0046029,0.0164132,0.0130167,0.0018615,0.0038218,-0.0034514,0.0030606,-0.0008717,-0.0001443,-0.0059699,-0.0029661,0.0102774,0.0095565,0.0099731,0.0298022,0.0239037,0.0251933,0.0010905,-0.0254164,-0.0496067,-0.0591878,-0.0455082,-0.0397228,-0.021683,-0.0140573,0.0085507,-0.0051178,-0.0090394,0.0132109,0.0222428,0.0679661,0.1152637,0.1439161,0.141114,0.0629423,-0.0209535,-0.11051,-0.166218,-0.1483813,-0.1079415,-0.0302671,0.0139651,0.0512681,0.0469996,0.0278407,0.0028224,-0.0041187,-0.0164609,-0.0226363,-0.0187378,-0.0161228,-0.0068046,0.02174,0.044072,0.0866592,0.0994951,0.104329,0.0749359,0.0315185,-0.0184292,-0.0841542,-0.1092595,-0.115492,-0.0771339,-0.0363142,-0.0077655,0.0223273,0.030469,0.0197762,0.0025595,-0.0058502,-0.0242327,-0.0294961,-0.0241647,-0.0179566,-0.0059789,0.0190998,0.0461029,0.0704225,0.0782586,0.0801764,0.0596,0.0216357,-0.0140944,-0.0319552,-0.0344574,-0.0328777,-0.0066284,0.0033508,0.0265045,0.0125096,0.0018754,-0.0338386,-0.0472558,-0.0597868,-0.03258,-0.0173756,0.0257561,0.0398071,0.0390951,0.0189538,0.0029446,-0.0357718,-0.0554511,-0.0379486,-0.0368621,-0.0117044,0.0111451,0.0188569,0.0238767,0.0290284,0.020387,0.0193911,0.0220105,0.0029109,-0.0075793,-0.0178854,-0.01938,-0.0241908,-0.0090685,0.0114002,0.0234946,0.0327982,0.044148,0.0414371,0.0363932,0.014139,0.0018035,-0.0253679,-0.0462073,-0.0628498,-0.0530733,-0.0536948,-0.0336238,0.0010983,0.019238,0.0209533,0.0198854,0.0145036,0.0101787,-0.007318,0.001337,0.0040544,-0.0015376,0.008456,-0.0037133,-0.004697,-0.0087776,-0.0190718,-0.0235941,-0.0358195,-0.0325981,-0.0102626,0.0079195,0.0323482,0.0488445,0.0541541,0.0343582,0.0023867,-0.0205151,-0.0331385,-0.0181221,0.011166,0.044172,0.0596368,0.0512077,0.0220584,-0.0145641,-0.0417003,-0.0462059],[0.050229,0.0472231,0.0203114,-0.0228029,-0.0586463,-0.0725215,-0.0584948,-0.0320144,-0.0003344,0.0163356,0.0152148,0.0187745,0.0079989,0.0018015,-0.0001352,-0.0005886,-0.0103454,-0.0040819,-0.0016688,0.0014507,0.0083513,0.007168,0.0099026,0.0015435,0.0074639,-0.0081669,0.0025511,-0.0121045,-0.000359,-0.0076565,-0.0041469,0.0093917,0.0130565,0.0098349,0.0122767,0.0272415,0.0216206,0.0268672,0.0263993,-0.0055358,-0.0380209,-0.0564063,-0.0685933,-0.0645777,-0.0338651,-0.0167742,0.0220322,0.0363622,0.044076,0.0379354,0.0306406,0.0272957,0.0265664,0.0187964,0.0081169,-0.008584,-0.0313183,-0.0393691,-0.0500247,-0.0361069,-0.0163878,0.0011228,0.0157817,0.0212775,0.0111009,0.0173545,0.0058537,0.0034558,0.0016939,-0.0037372,-0.0044523,-0.0069093,-0.0020232,0.001554,-0.0063676,-0.0048715,-0.0059521,-0.0039463,-0.0160841,0.001305,0.0072924,0.0284933,0.0539638,0.0584415,0.0394639,0.0183205,-0.030281,-0.0543626,-0.0679969,-0.0594904,-0.0456573,-0.0245959,-0.0219128,-0.0135415,-0.0016317,0.0278013,0.0529561,0.0835538,0.0746832,0.0599634,0.0408693,-0.0031923,-0.0328585,-0.0397085,-0.0583783,-0.0329314,-0.0150879,-0.0087537,0.0074483,-0.0010609,-0.0012583,-0.0180814,-0.0411708,-0.0568589,-0.0475828,-0.0315247,0.0050343,0.0567574,0.0839606,0.0896918,0.0775826,0.0459663,0.010743,-0.0127873,-0.0441472,-0.0429497,-0.0268606,-0.0174971,-0.0110297,-0.0014537,-0.0135117,-0.0104826,-0.0148962,-0.0351028,-0.0369689,-0.0372303,-0.0158817,0.0100827,0.0550615,0.0995035,0.108493,0.0959545,0.043215,0.0040475,-0.014217,-0.0415455,-0.0534298,-0.0631735,-0.0700094,-0.0681028,-0.0481906,-0.0317722,0.0010203,0.0350731,0.0277446,0.0295952,0.0180714,0.0181188,0.0007473,-0.0104785,-0.0156988,-0.0183161,-0.0247365,-0.0221637,-0.0064199,0.0259791,0.0507758,0.0636659,0.04957,0.0380962,0.013749,-0.007311,-0.0173306,-0.0196666,-0.0296202,-0.0269711,-0.0204826,-0.0083227,-0.0097479,0.0014715,0.0117985,0.0065822,0.0033137,0.0089622,0.0096716,0.0017889,-0.005976,0.0031918,0.0010265,0.0057024,-0.0028596,-0.0024716,0.0001738,0.0030665,0.0061234,0.0028466,-0.0053597,-0.0108195,-0.0034622,-0.0053468,-0.0010761,0.0002729,-0.0078397,-0.0080262,-0.0258087,-0.0350207,-0.0351762,-0.0407089,-0.0257327,0.0080645,0.045657,0.0972169,0.1043819,0.091495,0.0561346,-0.0007017,-0.0355002,-0.0453829,-0.046343,-0.0326617,-0.0360856,-0.017567,-0.009169,-0.0058283,-0.006018,0.0014378,0.0028027,0.0086588,0.0035873,0.0083656,-0.0007715,-0.0006179,0.0071652,-0.0095657,-0.0015889,-0.0042209,0.0066544,0.0002933,0.0096548,-0.0018867,-0.0065645,-0.0173637,-0.0052614,-0.0229941,-0.010955,-0.004295,0.004174,0.0243961,0.0354774,0.0476436,0.0298809,0.0295074,0.0159581,0.0081942,-0.0047769,-0.0072026,-0.0046589,-0.0098909,-0.0193459,-0.0285184,-0.0184917,-0.011076,0.015682,0.0370356,0.0587995,0.0421491,0.0026916,-0.0435731,-0.0820516,-0.1043343,-0.0923726,-0.0449817,-0.0043062,0.0342106,0.0415175,0.0434868,0.0265875,0.0171777,0.0110766,-0.0041654,-0.0017088,-0.0141644,-0.0069799,-0.0060769,0.0100765,0.0197424,0.0218141,0.029865,0.0252158,0.0076476,-0.0022974,-0.0159632,-0.0234462,-0.0157522,-0.0063931,-0.0062363,0.0013554,0.0001265,0.0024881,0.0021921,0.002077,0.0061628,-0.0037931,0.0041042,0.0101581,-0.00655,-0.0014641,0.0014973,0.005235,0.0123845,0.0162128,0.0289404,0.0375723,0.030881,-0.000559,-0.0275314,-0.0590314,-0.0883768,-0.0880817,-0.0433261,-0.0161341,0.0223135,0.0352201,0.0345563,0.0317732,0.0246183,0.0159464,0.0078718,-0.0031009,-0.0088147,0.005015,0.0016176,0.007296,0.0027165,0.0032508,0.0066269,-0.0002143,0.0064461,-0.0003744,-0.0078189,-0.0035319,-0.0153439,-0.0086947,-0.0248845,-0.0205653,-0.0328407,-0.0145401,0.0023097,0.0280865,0.0529962,0.0684384,0.0529586,0.0358635,-0.0010026,-0.0167629,-0.0259685,-0.0264559,-0.0292846,-0.0128149,-0.0134896,-0.0014967,0.0073039,0.0058624,0.0047367,0.0020556,-0.0046241,-0.0119802,-0.0102347,-0.0159773,-0.0203158,-0.0281525,-0.0353932,-0.0344504,-0.0367776,-0.0171607,0.0178762,0.0525518,0.0744873,0.0918934,0.0875314,0.0421274,0.0086196,-0.0240364,-0.042077,-0.0503784,-0.0451999,-0.0260172,-0.0288713,-0.0188695,-0.0080821,-0.0225138,-0.0139299,-0.0107213,0.007584,0.030522,0.0514952,0.0563611,0.0466242,0.0118097,-0.0156319],[0.1063127,0.1004447,0.0433269,0.0049453,-0.0270408,-0.0487442,-0.0481938,-0.0317649,-0.0141751,0.0007544,-0.0019508,0.0062596,-0.0010939,-0.0022295,-0.0091604,-0.0151656,-0.0206528,-0.0133967,-0.0149464,0.0017277,0.0053301,0.0068193,-0.0038303,0.0049872,0.0072037,0.0048623,0.0033738,0.0006978,0.0022745,-0.0049452,0.001896,0.0136439,0.0141577,0.0152054,0.0340476,0.0413321,0.0410788,0.0380264,-0.010992,-0.0506655,-0.0790318,-0.0912208,-0.0701639,-0.0443289,-0.0016944,0.034751,0.035544,0.0375416,0.0085854,-0.0027238,-0.0085205,0.0036599,-0.0071175,0.0063587,0.007497,0.0099673,0.0109954,0.0201331,0.0299824,0.0274069,0.0213145,0.0302688,0.0133242,-0.0067302,-0.027186,-0.0291258,-0.0252017,-0.0257823,-0.0215238,-0.0028172,0.011111,0.0030582,0.0035546,0.0030675,-0.0027192,-0.0107254,-0.0179968,-0.0073431,-0.0068161,0.01066,0.013127,0.0223136,0.0069008,-0.013001,-0.0446692,-0.0485207,-0.0390354,-0.0109993,0.0366586,0.0809212,0.0948014,0.0845814,0.0629464,0.0171729,-0.011082,-0.0280421,-0.0435623,-0.0479455,-0.0420292,-0.01948,-0.006643,-0.0090066,-0.0021413,-0.0012157,0.0022723,0.0127381,0.0069721,-0.0014747,-0.0100018,-0.0032182,-0.0105113,-0.0067431,-0.0152285,-0.0197729,-0.0411679,-0.031248,-0.0257787,-0.0181575,0.0071213,0.0488705,0.0722034,0.0887713,0.0779415,0.0465895,0.0181791,-0.0022313,-0.0161093,-0.0137265,-0.0158804,-0.0170263,-0.040442,-0.0513635,-0.0518594,-0.0401246,-0.0220605,-0.0033082,0.0153568,0.0164128,0.0220197,0.0110748,0.0119717,0.0187311,0.0125664,0.0199806,0.0165749,0.0308709,0.0373422,0.0164782,-0.0048337,-0.03484,-0.0739322,-0.0693778,-0.0681124,-0.0422069,-0.0130417,0.0010892,0.0002401,-0.0054169,-0.0020255,0.0147404,0.05014,0.0722206,0.0810364,0.0579424,0.0301092,0.0043309,-0.022718,-0.0349021,-0.0486979,-0.0561136,-0.0592999,-0.0493718,-0.0299245,-0.0124333,0.0194184,0.0649604,0.0687331,0.0702064,0.0479187,0.0298359,0.0190727,0.0082091,-0.0021051,-0.0095417,-0.0130381,-0.0246611,-0.0201285,-0.0201115,-0.0089504,-0.0177231,-0.0161709,-0.0111352,-0.0006504,0.0053225,0.0054019,0.0172805,0.0065889,0.0008409,0.000317,0.0017956,0.0016859,-0.0008403,0.0043104,-0.0106621,-0.023015,-0.0432892,-0.052805,-0.0457544,-0.0280038,0.0115302,0.0553496,0.0884267,0.1029913,0.0942869,0.0425717,0.0039499,-0.048449,-0.0584466,-0.0632958,-0.0477958,-0.021998,-0.0002229,0.0202837,0.0296606,0.0315511,0.0114287,-0.0022948,-0.0070474,-0.0253773,-0.0248957,-0.0144191,-0.0137224,0.0005993,0.0032951,0.0070023,0.0038838,0.002237,0.0065966,-0.0052819,0.007506,0.0074818,0.0062132,-0.0198851,-0.0376623,-0.0517361,-0.0590098,-0.0452145,-0.0090898,0.0485712,0.0934504,0.1143902,0.0994465,0.0538815,-0.0065586,-0.037653,-0.0576459,-0.0631306,-0.0477321,-0.0247609,-0.0151334,0.0118142,0.0258451,0.0381017,0.0471537,0.0346843,0.0271501,0.0118875,-0.0168766,-0.0294142,-0.0523294,-0.0424751,-0.0319449,-0.0198802,0.0107082,0.0174166,0.0090257,-0.0012143,-0.0157246,-0.0097562,0.0052139,0.0141846,0.03734,0.0445773,0.0363541,0.0065769,-0.012798,-0.0458089,-0.0545901,-0.0451601,-0.0229034,-0.0060977,0.0041476,0.0244435,0.0309241,0.0323861,0.0290615,0.0156482,0.0022253,0.0066516,-0.0027056,-0.0176755,-0.0072497,-0.0034991,-0.0014012,-0.0033519,-0.009598,-0.0062925,-0.0156716,-0.0215305,-0.0304992,-0.0264875,-0.0156355,0.0059829,0.0250323,0.0388875,0.0492721,0.0415345,0.0363127,0.0082479,0.0011907,-0.0064459,-0.0227308,-0.0345119,-0.0384098,-0.046946,-0.0458829,-0.0313222,-0.0059422,0.0419385,0.0844593,0.0982919,0.0711876,0.0271227,-0.0548482,-0.0953795,-0.1139682,-0.0758775,-0.0365048,-0.0051908,0.0336906,0.042687,0.0308548,0.0122417,0.0203412,0.0061362,0.0027748,0.0011886,-0.0035557,0.0071278,-0.0015305,-0.0090541,-0.010008,-0.0113408,-0.0182814,-0.004598,-0.0138292,-0.0132184,-0.0048032,0.0092659,0.025813,0.0523126,0.0591266,0.0553538,0.0317499,-0.013735,-0.0296397,-0.029301,-0.0303628,-0.017922,-0.0040118,-0.0013593,0.0040209,0.0036467,0.0023055,-0.0042442,0.0017906,0.0003387,0.007841,0.0012452,-0.0005579,0.0004204,-0.0011389,0.0039964,0.0099109,0.0096832,0.0073281,0.0123456,0.0107846,-0.0012858,-0.016395,-0.0207798,-0.0206818,-0.0300498,-0.0037672,-0.0012599,0.0056504,0.0130642,0.0098773,0.0097907,-0.0003711],[-0.034122,-0.0314553,-0.0270991,-0.0102157,0.0041083,0.0134439,0.01026,0.0238765,0.0231505,0.0248681,0.0146831,-0.0102894,-0.0089699,-0.0147481,-0.0110053,-0.0084451,-0.0005903,-0.0082562,-0.0124026,-0.0060386,0.0049497,0.0003437,0.0052143,0.0135435,0.0097816,0.006029,0.0066112,0.0058622,-0.0037786,-0.0009593,-0.0037681,-0.005741,-0.0076627,0.0012629,-0.0062875,-0.0011265,0.0011134,-0.0013459,-0.0020214,-0.0034544,-0.0009586,0.0013373,0.0034432,0.0021024,-0.0006741,-0.0017532,0.0010152,-0.0052612,-0.0063816,-0.0024667,-0.0106175,-0.0144767,-0.0120738,-0.0152816,-0.0215967,-0.0322079,-0.018358,0.008063,0.0420273,0.0785446,0.0952446,0.0896098,0.0480465,-0.0067528,-0.0603864,-0.0917689,-0.0922222,-0.0772332,-0.0297026,-0.0050729,0.0179899,0.0240435,0.0260831,0.0180922,0.0212778,0.0134123,0.0051925,-0.0049015,-0.000634,-0.0088479,-0.006102,-0.0113775,-0.0022349,-0.0048715,0.0069687,0.0038025,0.0085707,0.007689,-0.0045397,-3.53e-05,-0.0016559,-0.0046141,-0.0024409,0.0025843,0.0015775,0.0055291,0.0015458,-0.0015312,-0.0039299,0.0062439,0.0093102,0.0057151,0.0188971,0.0138838,0.0098045,0.0032186,-0.0200784,-0.0360984,-0.0455951,-0.0398983,-0.034351,-0.0219416,-0.0128033,-0.0213302,-0.0221758,-0.0067163,0.0089493,0.0336689,0.069283,0.0884313,0.0947611,0.0742933,0.034925,-0.0130891,-0.0345568,-0.0470223,-0.0450522,-0.0441717,-0.0397777,-0.0350656,-0.0347824,-0.0252453,-0.0015649,0.0282078,0.0550109,0.0665567,0.0600049,0.0333114,-0.0016682,-0.0254912,-0.0550324,-0.056442,-0.0351023,-0.0029294,0.0454574,0.0588276,0.0644314,0.0307431,-0.022303,-0.0530022,-0.0757316,-0.0625814,-0.0448268,-0.0103216,0.0083158,0.0258575,0.0285357,0.0192344,0.0095259,0.0171911,0.0029608,0.0099717,-0.0010088,0.0052674,-0.0077121,0.0006307,0.0024851,-0.0029119,0.0075808,-0.0025023,0.004068,-0.0024516,0.0030243,-0.0002871,0.0060416,0.0060398,0.0003132,-0.0016006,0.0020404,0.0001497,-0.0023912,-0.0094586,-0.0093511,-0.0089693,-0.0017341,-0.0049492,0.0120866,0.0185447,0.0158102,0.0204966,0.0110396,-0.002873,0.0005221,-0.0032581,-0.0068955,-0.0078427,0.0070703,0.0112705,0.0098983,0.0160661,0.0114128,-0.0093975,-0.0313537,-0.0618636,-0.0727182,-0.0947253,-0.0683059,-0.0352601,0.0119666,0.0638681,0.1124242,0.111859,0.0985827,0.0619009,0.0087868,-0.0170958,-0.0370642,-0.0264156,-0.0218453,-0.0057365,0.0167178,0.0205263,0.0160519,-0.0039895,-0.0306784,-0.0619461,-0.0890429,-0.0783941,-0.0605699,-0.0188104,0.020247,0.0461097,0.0762055,0.0708857,0.0532956,0.0383326,0.015816,-0.004674,-0.0029052,-0.0106,-0.0177239,-0.03172,-0.0383125,-0.0328095,-0.0269592,-0.0078336,0.0113303,0.0163362,0.0187629,0.0142769,0.0013448,-0.0241678,-0.0415819,-0.0417101,-0.0321228,-0.0084162,0.0169516,0.0313299,0.0511697,0.044522,0.0311958,0.0131605,0.0025429,-0.018069,-0.0159586,-0.0304666,-0.0199508,-0.0127381,-0.0126983,-0.0209101,0.0003198,0.0130597,0.025038,0.0323657,0.0351848,0.0266632,0.013495,0.002984,-0.0014619,-0.010447,0.0005013,0.0086872,-0.0012579,0.0024936,-0.0043753,-0.011998,-0.0125844,-0.0158206,-0.0140162,-0.0271578,-0.0300965,-0.0326759,-0.031821,-0.0104243,0.0069229,0.0144593,0.0078466,0.0038641,-0.0179284,-0.0278194,-0.0387001,-0.0274584,-0.0020176,0.0357136,0.067694,0.0814762,0.0595882,0.026478,-0.0032289,-0.0214532,-0.0275869,-0.0001821,0.0075029,0.021795,0.0185079,0.0226782,0.0064815,0.0073753,0.0179391,0.0093541,0.0248632,0.0179836,-0.0036756,-0.051582,-0.0870483,-0.0950265,-0.0868495,-0.0466426,-0.0010661,0.0293717,0.0420423,0.0406951,0.0243885,0.0158057,0.0174083,-0.0014571,0.0023008,0.0047987,-0.0005589,0.0068892,0.0002296,0.0024141,0.0020619,0.0003921,-0.0175074,-0.0145582,-0.0074147,-0.0043284,0.0085373,0.0124838,0.0169814,0.0154141,0.0033723,0.0036716,0.0023303,-0.009588,-0.0008563,-0.0067049,-0.0030414,0.009561,0.0059773,0.002625,0.0101562,-0.0016734,-0.0035424,0.0068434,0.0026447,0.0075484,0.0093834,0.0181834,0.0162411,0.0168592,0.02606,0.0208939,-0.0008346,-0.0268213,-0.0583767,-0.0712957,-0.075639,-0.0458494,-0.0057785,0.0145562,0.0348496,0.0438815,0.0242088,0.0137061,0.0171375,0.0020984,0.0021073,-0.004824,-0.0032524,0.0051364,-0.0042967,0.0026198,-0.004677,-0.0044254,-0.0045498,-0.0025134,0.0036693,0.0064664],[0.0141024,0.0556652,0.0881285,0.1141465,0.1156466,0.0814865,-0.0008177,-0.0893139,-0.170397,-0.1951842,-0.1411849,-0.058987,0.023872,0.0748279,0.1052866,0.0795675,0.04242,-0.0012927,-0.029007,-0.0352547,-0.0332152,-0.0277119,-0.0061537,0.0225959,0.0441687,0.0449436,0.0488154,0.0271832,0.0050375,-0.0177679,-0.0184337,-0.0277772,-0.0194331,-0.0111215,-0.009462,-0.0056041,0.0028001,-0.001987,-0.0012539,0.0027148,-0.0048539,0.0032047,0.0022635,0.0083744,0.0024498,-0.0029315,-0.0078158,-0.0031966,0.0048081,0.0132491,0.0018237,0.0158612,0.004493,0.0174878,0.0259292,0.026668,-0.0092539,-0.0254838,-0.0413084,-0.0516038,-0.0466301,-0.0293724,-0.00772,0.0210001,0.031556,0.0350694,0.0332387,0.0314585,0.0162438,0.0022649,-0.0190208,-0.0439498,-0.0419552,-0.0382507,-0.0265993,-0.0048081,0.0007657,0.0165722,0.0165825,0.0084723,0.0180894,0.0063559,0.0209267,0.0100251,0.0413788,0.0552284,0.0610874,0.0547751,0.0304123,-0.0079178,-0.0767103,-0.1137503,-0.1255539,-0.1049817,-0.0614682,0.0003458,0.0315306,0.0588915,0.0565099,0.0436673,0.0207701,0.0210989,0.0136677,-0.0014812,0.0081937,-0.0032647,0.0008384,-0.0026429,-0.0082464,0.0007661,0.0058081,-0.01276,0.0050671,-0.0004689,-0.0026883,-0.0017907,0.0072615,0.0065759,0.0218571,0.0257914,0.0393655,0.0557816,0.0383473,0.0151952,-0.0048777,-0.0390292,-0.0784814,-0.0788958,-0.0755915,-0.0443685,-0.0021018,0.0263898,0.0249895,0.0356379,0.0215517,0.0080949,0.0056821,-0.0021787,0.0039231,-0.0014213,0.0039029,0.0095007,0.0139865,0.0227211,0.0211098,0.0300852,0.0374788,0.0380244,0.021159,-0.0144363,-0.0521363,-0.0747619,-0.0821865,-0.0661179,-0.0188703,-0.0020747,0.0242152,0.0278575,8.07e-05,0.0124638,0.0013267,0.0126074,0.013893,0.0022149,-0.0062836,-0.0040525,0.0056678,0.0207904,0.0366339,0.0376346,0.0347432,0.0208807,0.004502,-0.004348,-0.0151345,-0.0200391,-0.0011475,-0.0046778,0.0212876,0.022794,0.0229392,0.0063032,-0.008094,-0.0232429,-0.044634,-0.0513722,-0.0392312,-0.0350421,-0.0215503,-0.0039427,0.0218448,0.0154383,0.0215482,0.0188952,0.0166246,-0.0006773,0.0061783,-0.0032778,-0.0057,0.0066914,-0.0041257,-0.0053986,-0.0081088,-0.0026659,-0.0244818,-0.0305767,-0.0613785,-0.0450208,-0.0330371,-0.0022826,0.0478902,0.0985976,0.1188476,0.1034269,0.0513925,0.0058866,-0.0447719,-0.0607099,-0.072102,-0.0499198,-0.0318134,-0.0086441,0.0228397,0.0513586,0.0625623,0.0506374,0.037375,-0.0116245,-0.0589898,-0.0855707,-0.0747746,-0.0538302,-0.0139155,0.0284756,0.0336446,0.0392635,0.0264863,-0.0025604,-0.0224329,-0.0333204,-0.0383293,-0.0097914,0.002253,0.0074118,0.0127342,0.0196193,0.0182618,0.0089054,-0.0017708,0.0018604,-0.0066848,-0.0012274,-0.0090335,-0.0032028,-0.0020981,-0.00476,0.0058886,0.0057028,0.0004791,0.0109079,0.0196552,0.0444864,0.0453022,0.0138588,-0.0042682,-0.0316573,-0.0748708,-0.0761487,-0.072809,-0.0514476,-0.0154913,0.0118786,0.0247697,0.0246658,0.0225324,0.0101475,0.0128229,0.0114887,0.014879,0.0096017,0.0092719,0.0111771,0.0206641,0.0183303,0.016604,0.0204981,-0.0008638,-0.0229949,-0.046443,-0.0562419,-0.0460651,-0.0243333,-0.005633,0.0187802,0.0223508,0.0226364,0.0085888,0.017923,0.0043354,0.0007401,0.0079236,0.0062181,0.0044969,-0.0098188,-0.0131378,-0.0140441,-0.0221791,-0.0046663,-0.005667,-0.0006177,0.0129692,0.005701,-0.012653,-0.0213317,-0.0360793,-0.0391783,-0.0443651,-0.0326749,0.0051721,0.0587296,0.0901814,0.1101386,0.0904897,0.0557592,0.0072099,-0.0322945,-0.0444149,-0.0378899,-0.0262347,-0.0201193,-0.0225231,-0.0053545,-0.0002338,0.009931,-0.0035663,0.0061602,0.0104985,-0.0028489,-0.0005692,0.0001881,0.0066783,0.0028729,-0.0073434,-0.0059309,-0.0077655,-0.0071867,-0.0004484,-0.0032478,0.0151366,0.0143465,0.0020714,-0.0040292,-0.0077424,-0.0116367,-0.0200868,-0.0380519,-0.009082,0.0138095,0.0421617,0.0702577,0.0713458,0.0462911,0.0305834,-0.0013317,-0.0246177,-0.0281188,-0.0254059,-0.0264132,-0.0361964,-0.0422076,-0.0418369,-0.0263554,-0.0182225,-0.0107173,-0.0114479,-0.004653,0.0034428,0.0211799,0.0341267,0.0289463,0.0196529,0.0077242,0.0024573,0.001681,-0.0104038,0.0060755,0.015674,0.0144855,0.0113964,0.0157177,0.0156821,-0.0117816,-0.0251296,-0.0366605,-0.0437282,-0.0324386,-0.0114712,0.0017367,0.0045579,0.0248562],[-0.0237968,-0.0165118,-0.0310479,-0.0090673,0.0077094,0.0110177,0.0220152,0.0104707,0.0107049,0.0042406,0.0025738,0.0027739,0.0003168,0.0066576,0.0084353,0.001544,0.0063107,0.012108,0.0007956,-0.0047561,-0.0011613,0.0003395,-0.0061124,-0.0125476,-0.0076249,-0.0173754,-0.0117899,0.0052446,-0.0012451,0.0060939,0.0073713,-0.0021607,0.0091003,0.0016958,0.0026437,0.0003172,-0.0001966,-0.0140125,0.0027695,0.0018125,0.0041473,-0.0036376,-0.0020269,0.0053382,0.0007337,0.001729,0.0001557,0.0058621,-0.0090324,-0.0077365,-0.0095765,-0.0141188,-0.012366,0.0046506,0.0189211,0.0372884,0.0443099,0.0179452,0.0003183,-0.0200411,-0.0441853,-0.0553063,-0.0626672,-0.0304534,-0.0063366,0.0414901,0.0830578,0.1020013,0.0796099,0.0468797,0.0076914,-0.0342622,-0.0513129,-0.0453052,-0.0380418,-0.0135574,-0.0169555,-0.0061566,-0.0094154,-0.0046489,-0.0043074,0.0016853,0.000915,-0.0056586,0.0026796,0.0205991,0.0130188,0.013354,0.0065708,0.0065879,-0.0398318,-0.0676115,-0.0869242,-0.0817947,-0.058212,-0.0058649,0.0599124,0.1079571,0.1317389,0.1069264,0.0662086,0.0077845,-0.0171593,-0.0442242,-0.0603486,-0.0409029,-0.0360269,-0.0049349,-0.0039539,0.0058164,0.0242203,0.0248867,0.0243225,0.0009761,-0.0360917,-0.0873708,-0.1093822,-0.1048961,-0.0886205,-0.0271055,0.0570681,0.110883,0.1378063,0.128669,0.1147064,0.0682713,0.0136225,-0.0417567,-0.0897829,-0.1073021,-0.1016318,-0.05825,-0.019168,0.012394,0.0251155,0.0270271,0.0233491,0.0168052,0.0141396,0.0231784,0.0278312,0.0227849,0.0468246,0.0444764,0.0199027,0.0079905,-0.0197749,-0.0478362,-0.0611677,-0.0852786,-0.0788124,-0.08096,-0.0496898,-0.0250859,0.0141994,0.0330007,0.0363794,0.0291358,0.026072,0.0038435,-0.0066835,0.0133557,0.0300548,0.0517138,0.0604131,0.0494105,0.0303996,-0.0081798,-0.0231709,-0.0347094,-0.0305239,-0.0256345,-0.0032336,-0.0045727,-0.0004898,0.0072324,-0.0086408,0.0033388,0.0040426,0.0023073,0.0021611,0.0032816,0.0058586,-0.0086407,-0.0019191,0.002749,0.0026958,0.0030504,0.0002465,-0.0033935,0.0051105,-0.0001208,0.0060929,-0.0004021,0.005728,0.0053472,-0.0133085,0.0072029,0.0049213,0.012018,0.0198463,0.0312336,0.0208041,-0.0041576,-0.0370699,-0.0821028,-0.0992734,-0.1181337,-0.080233,-0.0202719,0.0436515,0.1228335,0.151464,0.1484621,0.1059934,0.0501306,-0.0142767,-0.053169,-0.0530648,-0.0566316,-0.035896,-0.0217636,-0.0106854,-0.0100182,-0.0018504,0.0077147,0.0080168,0.0122803,0.0171804,0.0159361,0.0285357,0.012107,0.0019384,-0.020639,-0.040928,-0.0313409,-0.013372,0.0135496,0.0260994,0.0364323,0.0291909,0.0075564,-0.0342406,-0.0508261,-0.052238,-0.0331922,-0.012571,0.0098951,0.0374854,0.0280941,0.0347175,0.0331559,0.0268775,0.0238893,0.005106,-0.0204677,-0.0459666,-0.0560884,-0.0478143,-0.0358156,0.0032596,0.0366799,0.0458769,0.054956,0.0288466,0.0099904,-0.0004554,-0.0146457,-0.0033844,-0.0094284,-0.0110246,-0.0150886,-0.0068389,0.0069674,-0.0035752,0.0069129,0.0067481,0.0016461,0.0104502,0.0043016,0.0033375,-0.008853,0.0108675,0.0258825,0.0167271,0.0210856,0.0168487,0.0017641,-0.0266621,-0.0437297,-0.0578481,-0.0519708,-0.0190435,-0.0008683,0.0088065,0.0203346,0.0226186,0.0109382,-0.0002671,-0.0009236,-0.0028326,-0.0096849,-0.0016513,-0.0032852,0.0021379,0.008296,0.0034108,-0.0108111,-0.0157307,-0.0213209,-0.0174161,-0.0103524,0.0128331,0.0393395,0.045912,0.0314756,0.0241438,0.0123691,-7.46e-05,0.0025725,-0.0114027,-0.000934,-0.0059852,-0.016836,-0.0231293,-0.0125577,-0.0228345,-0.0123047,0.0034365,0.0104262,0.0018533,0.0147284,0.0138166,-0.0022502,-0.0092678,0.0040055,-0.0030013,-0.0105476,-0.0041099,0.0008033,0.0126835,0.0129298,0.0011854,0.0183717,0.011358,0.0406925,0.0486178,0.0524119,0.0506609,0.0145858,-0.0201699,-0.0711856,-0.0835794,-0.0747977,-0.0324263,0.0057989,0.0336265,0.0332994,0.0154174,-0.0140105,-0.0173111,-0.0292686,-0.0359821,-0.040093,-0.0411467,-0.030193,-0.0118059,0.0219158,0.0416432,0.063645,0.0576509,0.0538578,0.0438073,0.0228886,-0.0147431,-0.0454745,-0.0526626,-0.0672035,-0.0505976,-0.0293799,-0.0052971,0.002723,0.0252843,0.0096226,0.0130556,0.0215765,0.0332457,0.0344683,0.0274604,0.0171271,0.0012422,-0.0071312,-0.0271987,-0.018176,-0.0077007,-0.0139344,-0.0026834,-0.0047855,-0.0005921,-0.0052053],[0.0004767,-0.0065485,-0.0091207,0.0016961,-0.0029217,-0.005546,-0.0064786,0.0030148,0.0101647,0.0211183,0.0191583,0.0082826,0.0084689,0.0169615,0.0196453,0.0358593,0.0516191,0.0416984,0.0246396,-0.0066043,-0.0575209,-0.1033833,-0.1183014,-0.0917254,-0.0477137,-0.0075775,0.0248546,0.0485103,0.0511438,0.0372975,0.0234271,0.0200026,0.0055284,0.0069715,0.0125889,0.0050123,0.0163541,0.0147592,0.0231282,0.0339767,0.0315693,0.0163736,0.0029848,-0.0362422,-0.0537578,-0.0768402,-0.0622458,-0.0358671,-0.0063737,0.0213587,0.0295974,0.0260702,0.0250367,0.0147971,0.0210331,0.0026157,0.0031398,-0.00696,-0.0055049,-0.0014457,-0.0059063,0.0023163,-0.0039422,0.0032543,0.0075653,0.0020771,0.0003732,-0.0009155,-0.0065323,0.0147309,-0.0009708,0.0069204,0.0116988,0.0144736,0.0296743,0.0207532,0.0197931,-0.0009395,-0.0180681,-0.0200086,-0.0229588,-0.020528,-0.0332131,-0.0410863,-0.0405413,-0.0267202,8.38e-05,0.0340813,0.0513675,0.0573893,0.0409199,0.0206661,-0.0159399,-0.0395401,-0.0408878,-0.0318351,-0.0168011,-0.0001748,0.0118641,0.0251485,0.0152846,0.0029923,-0.0039495,0.0042956,0.0036312,0.0049511,-0.0006716,-0.0026376,-0.0031931,-0.0050327,-0.0141736,-0.0192105,-0.0352232,-0.050558,-0.0345426,-0.0183657,0.0257688,0.0754833,0.1079362,0.1173759,0.0754878,0.0124812,-0.0352021,-0.0616475,-0.059401,-0.0425107,-0.0110819,-0.0051028,0.0133608,0.0145186,0.0306961,0.016309,0.0194291,2.63e-05,-0.0120594,-0.0328788,-0.0526129,-0.055874,-0.0371331,-0.0165857,0.0144888,0.0192727,0.0404257,0.038443,0.063189,0.0613456,0.0667447,0.024652,-0.0077633,-0.0663396,-0.1197356,-0.1296344,-0.1222746,-0.0652617,-0.0047748,0.0418595,0.0732353,0.0684915,0.0639855,0.0381684,0.03216,0.0128117,0.0033479,-0.0169172,-0.0269905,-0.0214042,-0.028001,-0.0183498,-0.0140193,-0.0029734,0.0061765,0.0081541,0.007537,0.0135852,0.0142003,0.0036794,0.0050834,0.0081008,-0.0010597,-0.0169986,-0.0043788,-0.0041589,-0.0087534,0.0072465,0.0149138,0.0157954,0.0159249,-0.0022011,0.0007308,-0.0075437,-0.0058481,-0.0019445,-0.0097033,0.0015882,-0.0086074,0.0070803,0.0017659,-0.0084448,0.0041396,0.0028053,0.0027069,-0.0038991,-0.0049597,-0.012897,-0.0213395,-0.0333507,-0.0372771,-0.057998,-0.0308365,0.0051711,0.048894,0.0865989,0.1106165,0.0944875,0.0527091,0.0068114,-0.0262697,-0.0413037,-0.0463358,-0.0450783,-0.0271426,-0.0131633,-0.0020425,0.0073735,-0.0027436,0.000937,-0.0003514,0.0001248,-0.0123872,-0.0188876,-0.0048132,-0.0019084,0.0158322,0.0186885,0.0210054,0.0205486,0.009821,0.0055476,0.0049674,-0.0083804,-0.0121465,-0.0200125,-0.0273214,-0.0308007,-0.0252057,-0.0109392,0.0007876,0.0072643,0.0165914,-0.000698,0.0020509,6.83e-05,0.0067037,0.0125627,0.0167675,0.0242104,0.0021058,0.0076236,0.0018268,0.001267,-0.007674,-0.0053891,-0.0193921,-0.0122597,-0.0309516,-0.0168382,-0.0036024,0.0178838,0.0233373,0.0365387,0.0318992,0.0203721,0.0040015,-0.0215628,-0.0343879,-0.0428461,-0.0275194,-0.0094432,0.0026274,0.0251531,0.0216727,0.0232652,0.0172105,0.0167832,0.0065152,0.0168989,0.0125276,-0.005839,-0.0193615,-0.038019,-0.0441276,-0.0402434,-0.025174,0.0017765,0.0107105,0.0114636,0.0149179,0.0058452,-0.0172848,-0.0145719,-0.0127232,0.0015816,0.0108042,0.0378956,0.0506575,0.0397881,0.0259257,0.0061542,-0.0114223,-0.0181754,-0.0204228,-0.0233098,-0.0207014,-0.0163171,-0.0173285,-0.014724,-0.0073626,-0.007118,0.0002264,0.002514,0.0093992,0.0204941,0.0223477,0.0217073,0.0089121,0.0041826,-0.0028624,-0.0097828,-0.0102583,-0.005844,-0.0119834,-0.0037462,-0.0017716,-0.0022558,0.0045549,0.0081509,0.0104499,0.0217496,0.0182978,0.0123574,-0.0072673,-0.0304274,-0.0297217,-0.0381182,-0.0382962,-0.0114796,-0.0015076,0.0098642,0.0058699,0.0082643,-0.0142081,-0.035131,-0.0361921,-0.0197796,0.0060296,0.0446862,0.0705514,0.0741579,0.0646346,0.0346329,-0.0038031,-0.0168267,-0.020359,-0.02583,-0.0106904,0.0081638,0.0131551,0.018866,-0.0082663,-0.0362267,-0.0517813,-0.0753592,-0.0669992,-0.0524833,-0.0260639,0.010863,0.0450399,0.0654361,0.0775033,0.0680994,0.0508907,0.0080797,-0.0022463,-0.0200462,-0.0252101,-0.0241164,-0.0169772,-0.0082813,-0.0036928,-0.0002391,0.0003801,-0.0054189,0.0011251,0.004379,0.0024062,0.0044812,0.0060687,-0.0015592,0.0031225,-0.0090968],[0.0095104,0.004331,-0.0002564,-0.0052547,0.0012449,0.0080776,-0.0088956,-0.0049655,-0.006985,-0.0119158,0.000661,-0.0093581,-0.0147967,-0.0050764,-0.0066193,-0.0132519,-0.0071476,0.0184977,0.037429,0.0488,0.0556694,0.0433649,0.0269245,-0.0075829,-0.015652,-0.033004,-0.0307326,-0.0131471,-0.0146853,0.0018541,0.0276047,0.0281395,0.029763,0.0086153,-0.021029,-0.04366,-0.0584197,-0.0595723,-0.0274581,0.0028833,0.021379,0.0311053,0.0217607,0.0145321,0.0131161,-0.0032819,-0.0011396,0.0012076,0.0038799,-0.0063432,-0.0016111,0.0066404,0.0113944,-0.0014215,-0.003466,-0.0172396,-0.0229311,-0.0298614,-0.038756,-0.0398266,-0.0264421,0.0083434,0.0520591,0.097302,0.1140014,0.1125156,0.0939743,0.0647669,0.0244876,0.0011993,-0.0323115,-0.0785029,-0.1190634,-0.1375605,-0.1126645,-0.0783416,-0.0279841,0.0280914,0.038565,0.0645877,0.0623085,0.0433087,0.0290602,0.0191172,0.0287455,0.0085788,-0.0232719,-0.0407416,-0.0678802,-0.0670876,-0.0401144,-0.0016769,0.0202167,0.0409605,0.0339894,0.0270563,0.0237949,0.0105037,0.0069587,0.0105952,0.0051966,0.0020865,-0.0195716,-0.0053061,-0.0015488,0.0081372,0.0233217,0.0305977,0.039611,0.0252259,0.0144697,-0.0326369,-0.0923644,-0.1321287,-0.1314706,-0.0918336,-0.0136163,0.0557946,0.1174765,0.123783,0.0875921,0.0455529,-0.0045638,-0.0252609,-0.0220554,-0.003121,-0.0020077,0.0010381,0.0063239,-0.0018295,-0.0166322,-0.0315899,-0.0161054,-0.0183387,-0.0096201,0.0055143,0.0104262,0.0087566,0.0048292,0.0093311,0.0103741,0.022504,0.0205564,0.0355821,0.0303556,0.0284043,-0.0015263,-0.0433992,-0.0611075,-0.0769197,-0.0689833,-0.0366142,-0.00115,0.0254609,0.0452387,0.0583794,0.0552348,0.055374,0.0374659,0.0290707,-0.0048087,-0.0163977,-0.0341503,-0.038403,-0.0407901,-0.0380536,-0.0233795,0.002683,0.0174424,0.0139944,0.0169296,0.0193264,0.0139083,0.0023931,-0.0005849,-0.013501,-0.0153669,-0.0249188,-0.0137771,-0.0007819,0.0080708,0.0119134,0.0036092,0.0011007,0.0067183,0.0028909,-0.0010906,0.0017598,0.0011327,-0.013104,0.0028896,-0.004479,0.0038426,-0.0019971,-0.006561,-0.0041298,-0.0012331,0.004032,-0.0159206,-0.0073968,-0.0289358,-0.0363724,-0.0408813,-0.0522898,-0.0338898,0.0083739,0.0581857,0.0959135,0.1028697,0.0933844,0.0554903,-0.0107198,-0.0440685,-0.0598965,-0.0630104,-0.0590457,-0.0271949,-0.011469,0.0198291,0.0380849,0.0442958,0.0287943,0.0179107,-0.0057995,-0.0351753,-0.032395,-0.0254805,-0.0263505,-0.0042163,0.0227822,0.0213689,0.015443,0.0168612,-0.0053284,0.0019438,-0.0090912,-0.001975,-0.0022513,0.0116866,0.0131262,0.0257893,0.020505,0.0165874,0.0007282,-0.0214402,-0.0342742,-0.0535418,-0.0425498,-0.0140836,0.0012857,0.0184294,0.0071345,0.0053494,-0.003283,0.0021686,0.0107183,0.0070959,0.0111164,0.0047935,0.0013798,-0.0013534,-0.0030425,0.0092718,0.017934,0.01751,0.0222867,0.004452,0.0102086,0.0025533,0.00339,-0.0022082,-0.0102689,-0.0109047,-0.0120171,-0.0094422,-0.0095817,-0.0155636,-0.0126353,-0.0112447,-0.0009966,-0.0101063,-0.0041405,0.0044845,0.0013426,0.0081218,-0.0080081,-0.0064836,-0.0008557,0.0009667,0.0106908,0.0215941,0.01865,0.0198887,-0.0133107,-0.0215522,-0.0270825,-0.0248343,-0.0202444,-0.0075999,0.0162598,0.0475326,0.0484149,0.0366097,0.018839,0.0011267,-0.0127356,-0.0069957,-0.0211538,-0.0141103,0.0025812,-0.0011045,0.0082058,-0.003796,-0.0126484,-0.0028114,-0.0035403,-0.0052018,-0.0043855,0.0004822,0.0017457,-0.0012507,0.008098,0.0018946,0.0001702,-0.0149899,0.0034881,0.0061176,0.0065316,0.0052346,0.0039905,-0.0043778,-0.0047263,-0.0065743,-0.0041326,-0.001121,-0.0004777,-0.009024,0.0095079,0.0137052,-0.0050875,0.00521,4.7e-06,0.0143658,0.0430557,0.0641262,0.0741753,0.0781422,0.0525705,-0.0132618,-0.0872659,-0.1395673,-0.1682495,-0.1384538,-0.0800181,-0.0125877,0.0433693,0.06871,0.0736151,0.0538512,0.03497,0.0200877,0.0024042,0.0068267,-0.0063308,0.0020722,-0.0059244,-0.0085241,0.006658,-0.0022746,-0.0046242,0.003888,-0.0125893,-0.0078071,-0.0140854,-0.0032186,-0.0011849,0.0138004,0.0289419,0.0401644,0.0395247,0.0309068,-3.56e-05,-0.0315518,-0.0494906,-0.0430345,-0.0249964,0.0061658,0.0386237,0.0393085,0.0226568,0.0218296,0.0001118,-0.0127251,-0.0274886,-0.0214925,-0.0266313,-0.0219272,-0.0322718,-0.0229621,-0.0256253],[-0.0354574,-0.0524084,-0.0757712,-0.0576934,-0.0352516,-0.006015,0.027827,0.0380548,0.0486458,0.0356816,0.0373725,0.0211375,0.0102625,-0.014358,-0.0120199,-0.0113954,-0.0041765,-0.019032,-0.0137045,-0.0285399,-0.0201731,-0.0163226,-0.0078964,-0.0028302,0.0115293,0.0220326,0.0334782,0.0386036,0.0243292,0.0172235,0.0062911,-0.0063839,-0.0158664,-0.012253,-0.0127481,-0.006699,0.0037745,-0.0058885,-0.0016303,0.0152554,0.0168904,0.0168947,0.0133638,-0.0051015,-0.0232361,-0.0581844,-0.063264,-0.073448,-0.0345648,0.0175389,0.0529481,0.0899574,0.0798598,0.0644866,0.0322117,-0.009033,-0.021985,-0.0252655,-0.019818,-0.0172692,-0.0019792,-0.0001844,-0.0009113,0.0070367,-0.0048193,-0.0089433,-0.0026496,-0.0071039,0.001957,0.004012,-0.0035572,-0.0020438,0.0020563,0.0002014,0.0119163,-0.0100133,0.005244,0.0038826,-0.0075009,-0.0018987,-0.0039576,-0.0049303,-0.0030247,-0.0020608,-0.0045316,0.0096408,0.0101753,-0.0043412,0.0089952,-0.001419,-0.0058996,-0.00508,0.0002892,0.0050661,-0.0065572,0.0022492,-0.0027594,-0.0021916,-0.004553,-0.0107045,-0.0063968,0.0002423,0.0095717,0.0123739,0.0124594,0.0014499,-0.0201688,-0.0414832,-0.046177,-0.0403938,-0.0136231,0.0248911,0.0420751,0.0501056,0.0274362,-0.0081424,-0.0191958,-0.0258954,0.0096098,0.0362431,0.0692192,0.0560501,0.0336182,0.0018608,-0.0407841,-0.0431432,-0.0355886,-0.0345181,-0.0144527,-0.0159699,-0.0116278,-0.0189486,-0.0217867,-0.0355215,-0.0474365,-0.0479506,-0.0174255,0.0038801,0.0483162,0.0816616,0.086908,0.0846083,0.0486969,0.0139059,-0.0180948,-0.0192034,-0.0127205,-0.0025534,0.0037604,-0.017274,-0.0461012,-0.0617886,-0.0784668,-0.065043,-0.0300371,-0.0026964,0.01752,0.0291533,0.0366937,0.0283155,0.0196972,0.0146887,-0.0008952,0.0031734,0.0168201,0.0206572,0.0329317,0.0646417,0.0772813,0.0586466,0.0399338,-0.0230352,-0.070664,-0.1262721,-0.136906,-0.1249889,-0.077969,-0.0283042,0.0354373,0.0613308,0.0702742,0.0699458,0.0593406,0.0490169,0.0087131,-0.0012122,-0.0259772,-0.021827,-0.0176114,-0.024552,-0.0033441,0.0132588,0.0239142,0.0236667,0.0268633,0.0296106,0.0076291,-0.0121407,-0.0324872,-0.0401916,-0.0462715,-0.0459975,-0.0261557,-0.0170685,-0.0226601,-0.0227342,0.0187886,0.0623643,0.1018865,0.1151575,0.0948137,0.0605486,0.0252908,-0.0057595,0.0063395,-8.48e-05,-0.0006018,-0.0010367,-0.040099,-0.0692537,-0.0915647,-0.0978084,-0.0823955,-0.0539813,-0.0268695,0.0004546,0.0203407,0.0355338,0.0492171,0.0429282,0.0657856,0.0638108,0.0524974,0.0231746,-0.0078341,-0.0443988,-0.0464154,-0.0479045,-0.031216,-0.0069675,0.0058538,0.0085127,0.0054778,0.0158999,0.0113961,0.0104632,0.0192158,0.0017846,0.0144996,-0.0126843,-0.0125878,-0.0071056,0.0144386,0.0233347,0.0198937,0.0059153,-0.0020404,-0.0430747,-0.044794,-0.0541211,-0.0192785,-0.0100921,0.0238462,0.0253759,0.0382051,0.0423699,0.0136076,0.0164644,0.0085289,0.019693,0.0138673,0.0015661,0.0098415,-0.0266615,-0.0492456,-0.0498792,-0.0459795,-0.0320805,-0.0069954,0.0124338,0.0206829,0.0261886,0.0134787,0.0128395,0.0042502,0.0254224,0.0235817,0.0322169,0.0239624,0.003802,-0.0117448,-0.0447589,-0.0496213,-0.0382182,-0.0265101,0.0089623,0.0349967,0.0559154,0.0721729,0.0544079,0.0313328,-0.0216808,-0.0759015,-0.1173428,-0.1197157,-0.0775953,-0.0027838,0.0629623,0.0943489,0.0991463,0.0412251,-0.0117347,-0.0624134,-0.0970525,-0.0937504,-0.0691887,-0.0236378,0.0242465,0.085224,0.1218841,0.1302825,0.1019426,0.0544384,-0.0164488,-0.0617632,-0.0803584,-0.0772398,-0.0644009,-0.0246693,0.0007134,0.0099936,0.0202292,0.0075139,0.0201432,0.0116566,0.0184713,0.0084196,0.0130661,0.0012333,-0.0191717,-0.0385322,-0.0328971,-0.0420629,-0.0246575,-0.0099564,-0.0059999,0.021733,0.0226904,0.0145237,0.0188849,0.0085357,0.0003839,-0.0085284,0.0090087,0.0004145,0.0082425,0.0084773,0.0041198,-0.0082178,-0.0025295,0.0034841,-0.0069468,0.0084857,0.0035432,-0.0025266,-0.0017898,-0.0133773,-0.0335166,-0.0313047,-0.0297845,-0.031088,-0.0082431,0.0187265,0.0534378,0.0818991,0.0835942,0.0715496,0.0299905,-0.002555,-0.0235661,-0.0266801,-0.0358554,-0.0211683,-0.019911,0.00113,-0.0202297,0.0007694,-0.0047136,-0.0046944,-0.0159856,-0.0132939,-0.027361,-0.0348889,-0.0348395,-0.0226441,0.0005302,0.0348893,0.0656785,0.0880625,0.0677498],[0.0028414,0.0054171,-0.0024395,-0.0096803,-0.0130116,-0.0212384,-0.0271607,-0.0276448,-0.0224638,-0.0388361,-0.0462989,-0.0233728,0.0150648,0.059249,0.0920811,0.0978184,0.0952816,0.057518,0.0094047,-0.028102,-0.04319,-0.0441415,-0.0321988,-0.01718,0.0102345,0.0225481,0.0120921,0.0185258,-0.0040085,-0.0340942,-0.0501807,-0.0410633,-0.0278493,-0.0130144,0.0078836,0.0242177,0.0395095,0.0185608,0.013133,0.0146586,-0.0057082,-0.0275942,-0.0101751,-0.0125218,-0.0059285,0.008727,0.0057526,0.0089712,0.0004447,0.0104123,0.0002806,-0.0195084,-0.0010809,-0.00072,0.0054038,-0.0062438,0.0039993,-0.0090996,0.0028017,0.0033697,-0.0078174,-0.0044648,0.0042975,0.002206,0.0095613,0.0189278,0.0254889,0.038241,0.0366741,-0.0004673,-0.006153,-0.0499706,-0.0619944,-0.0838506,-0.0741798,-0.0614495,-0.0504225,-0.0279901,0.0047784,0.0416926,0.0548343,0.0916481,0.1053187,0.0923495,0.0655562,0.0212065,-0.0184175,-0.0404041,-0.057684,-0.0613244,-0.0477526,-0.0362285,-0.0148095,-0.0001635,-0.0004804,0.0142015,0.0071556,0.0105423,0.0098345,0.0102323,0.00666,0.0171377,0.0392993,0.0458955,0.0688645,0.0837409,0.0791544,0.0344503,-0.0380786,-0.1118651,-0.1720639,-0.1917316,-0.1713427,-0.0937909,-0.0221589,0.0255712,0.0601203,0.0859286,0.1033013,0.1127051,0.1057042,0.0809668,0.0560973,0.0039623,-0.0262823,-0.0468047,-0.0424741,-0.0241135,-0.0204959,-0.0094175,0.0009419,0.013193,0.0187315,0.02255,0.0224364,0.0149147,-0.003067,-0.0302089,-0.060073,-0.068349,-0.0556402,-0.0204199,0.0374923,0.0517577,0.0482223,0.0295035,-0.0091064,-0.0420182,-0.0666072,-0.0703777,-0.0678366,-0.0407715,-0.0376876,-0.0047792,0.0133045,0.0506922,0.0721321,0.0735738,0.0519114,0.0287846,-0.0180943,-0.0446176,-0.0474965,-0.0140138,0.0369902,0.0598406,0.0761192,0.0597784,0.0339484,-0.0228984,-0.0409348,-0.058826,-0.0488917,-0.0458922,-0.0180846,0.0202296,0.0450737,0.0619411,0.050933,0.0302903,0.0031329,-0.0040931,-0.018704,-0.0094905,-0.0145504,-0.0129456,-0.0032948,-0.0121219,-0.0061054,0.0002013,0.0017799,-0.0007648,-0.0122573,-0.0360889,-0.0326104,-0.024683,-0.0178237,0.0023136,0.0411626,0.0499581,0.0493994,0.0298264,0.0008559,-0.0359088,-0.0817047,-0.0898883,-0.0845725,-0.0332111,0.020213,0.0778212,0.1152489,0.1361288,0.1152851,0.0813296,0.0293601,-0.0152013,-0.0518072,-0.0683923,-0.0577297,-0.0456537,-0.0447487,-0.0327726,-0.0372359,-0.042234,-0.0348422,-0.0089495,0.0174399,0.0425989,0.0466256,0.0291044,0.0227051,0.0242162,-0.009976,-0.0030122,-0.0067219,-0.0103563,-0.0012125,-0.0020011,0.0041643,-0.0071747,-0.0097212,-0.01511,-0.0102475,-0.0037529,0.011674,0.0270945,0.0464708,0.0621755,0.0389909,0.0176561,0.0040589,-0.0153671,-0.0173011,-0.0306741,-0.0129455,-0.009592,-0.0084431,-0.0051169,-0.0037241,-0.0058435,0.000424,0.00051,-0.0064578,0.011039,0.0034375,0.0006237,-0.0067458,-0.0060868,-0.0055807,-0.0089544,-0.0116583,-0.0179554,-0.0041564,-0.0025396,0.01657,0.0314894,0.039355,0.0404522,0.020395,0.0038546,0.0006524,-0.0124353,-0.0098072,-0.0081375,-0.0090794,0.00788,0.0017558,-0.01816,-0.0291717,-0.0453985,-0.0531393,-0.046838,0.0023718,0.0204196,0.0470169,0.0579956,0.0444912,0.0426948,0.0214855,0.0117414,0.0017453,-0.0062606,-0.0294063,-0.0410893,-0.0369115,-0.0405361,-0.0299291,0.0046832,0.0132956,0.0174738,0.0034798,0.0055305,-0.0103044,-0.0121269,-0.0142723,-0.0071458,0.0128875,0.0455013,0.0726164,0.0742922,0.0497358,0.0005038,-0.0584127,-0.0779132,-0.0711261,-0.0496535,-0.0122817,0.0075094,0.0158251,0.0144809,0.0030344,0.0074503,-0.0064709,-0.009877,0.0026718,0.017393,0.0161375,0.0279952,0.0069628,0.002742,0.0049942,-0.0105716,-0.0228918,-0.0145582,-0.0048226,-0.0058528,-0.0037474,-0.0005543,0.0042403,-0.0063134,-0.001223,0.0003384,0.0012546,-0.0115447,-0.0123008,-0.0095292,-0.0102291,-0.0140453,-0.0110123,0.0067521,0.0216014,0.0326323,0.0377522,0.0266366,0.005541,-0.0019621,-0.0230386,-0.0318441,-0.0182268,-0.0177497,-0.0099961,0.0109787,0.0218458,0.0353989,0.0181853,0.0203806,0.0042023,-0.0086265,-0.0179596,-0.0176281,-0.0077828,0.0040877,0.0091169,0.0030452,0.0035008,0.0031634,-0.0055447,-0.0056048,-0.0164653,-0.0187955,-0.025752,-0.0103559,-0.0024804,0.0015102,0.0125599,0.0054304,0.0155352,0.0022598,0.0059993,-0.0040492],[-0.04162,-0.0406962,-0.0151499,-0.0024107,0.0293254,0.0333054,0.0230016,-0.0050601,-0.0186446,-0.029537,-0.0194615,0.0234006,0.0431258,0.0591956,0.0575889,0.0397738,0.0305158,0.0051629,-0.0071206,-0.0305319,-0.0587829,-0.0920968,-0.0904027,-0.0662594,-0.0039352,0.0583001,0.1188387,0.1130674,0.0769576,0.0396958,-0.014102,-0.0375594,-0.0415035,-0.0392507,-0.0281568,-0.0132713,-0.0083574,-0.0271661,-0.0255276,-0.0407721,-0.0435797,-0.0319885,0.0216646,0.0520185,0.0849454,0.1080244,0.0723522,0.0484124,7.62e-05,-0.0208757,-0.0414403,-0.030767,-0.0332536,-0.0259276,-0.0130496,-0.0016663,0.0038992,0.0026052,-0.0030336,0.0097124,0.0147899,0.0228973,0.0170095,0.0077284,-0.0073077,-0.0216306,-0.0268901,-0.0282548,-0.0346109,0.00227,0.0072645,0.0105107,0.0206188,0.02752,0.0018238,-0.0037577,-0.0273277,-0.0338536,-0.0350088,-0.0155126,0.0054178,0.0214977,0.019592,0.0285167,0.0179296,0.007896,-0.0089285,-0.0076933,-0.0027895,0.0047246,0.0162041,0.0247892,0.0207625,0.0141062,0.0013157,-0.0191092,-0.019348,-0.0246966,-0.0128955,-0.0029105,-0.0031047,-0.0169648,-0.026378,-0.039565,-0.0432573,-0.0119864,0.004878,0.0146104,0.0198919,0.0298368,0.0294935,0.0109713,0.0003055,-0.0109187,-0.0296853,-0.0313631,-0.0349529,-0.0120115,-0.015344,0.004508,-0.0029297,0.0025766,0.0204992,0.0505021,0.0626046,0.0597114,0.051245,0.0307514,-0.0050259,-0.0237636,-0.0458324,-0.0422646,-0.0289813,-0.0160395,-0.0166987,-0.0060322,-0.0082847,-0.0054315,-0.0036557,0.0030988,0.006394,0.0122455,0.0140571,0.0188874,0.0355132,0.0362352,0.0179175,-0.0170758,-0.0389025,-0.0858889,-0.0998849,-0.0898373,-0.0520657,0.0096833,0.0732608,0.1122421,0.1282513,0.1147218,0.0572824,0.0106927,-0.0436975,-0.0733506,-0.0818134,-0.0533594,-0.0247688,-0.0047369,0.022906,0.0314334,0.0204581,0.0308479,0.0199631,0.0171381,0.0247851,0.0108251,-0.0023555,-0.0304178,-0.0380316,-0.0329999,-0.0443356,-0.0118913,0.0059954,0.013285,0.0192214,0.0188451,0.0118466,-0.009505,-0.0234922,-0.051867,-0.0546644,-0.050912,-0.0221345,0.0186398,0.0555853,0.0804893,0.0929651,0.0826469,0.0479134,0.0158353,-0.0180473,-0.0491535,-0.0441145,-0.0505858,-0.0365549,-0.0479296,-0.0499608,-0.0549095,-0.0462556,-0.015829,0.0054795,0.0638645,0.0987758,0.1238008,0.1044788,0.0595161,0.0072364,-0.0221273,-0.0555663,-0.0429547,-0.0320622,-0.0285651,-0.0292455,-0.0280605,-0.0296814,-0.0155411,-0.0028666,-0.008442,0.0108984,0.0108187,0.0196477,0.0074235,0.0089541,0.0047762,0.0082271,0.0038207,-0.0024995,0.0037992,-0.0052864,0.0099693,0.001276,0.0023909,-0.0043494,0.0186825,0.0192728,0.0245264,0.0418298,0.0401697,0.0225258,-0.0229849,-0.0478511,-0.0982469,-0.0955567,-0.0746578,-0.039768,-0.001916,0.0408543,0.0361283,0.0496969,0.0195739,0.0154445,0.0108541,0.006425,0.0063964,-0.0080198,0.000694,-0.0076753,0.0035139,-0.0019926,0.0026511,-0.0011315,-0.0007068,-0.0065002,-0.008331,-0.0136678,-0.0071895,0.0023937,0.003553,0.0150794,0.0144674,0.0194416,0.0250824,0.0204822,0.0312857,0.0347536,0.0210954,0.0170148,-0.0177688,-0.0505678,-0.0813473,-0.0907954,-0.0789787,-0.0489041,-0.0044016,0.0243283,0.0364408,0.0298489,0.0312607,0.0180335,0.0041387,0.0013009,0.0056717,0.0050522,0.0032174,0.0173454,0.0253586,-0.0010272,-0.0099527,-0.0162193,-0.0365532,-0.0319444,-0.0266698,-0.014188,0.0019879,0.0129823,0.0210207,0.0206205,0.0115043,0.0108184,-0.0073855,-0.0064328,-0.0005743,0.0054599,0.0093313,0.0058179,0.0051741,-0.0017542,0.0079171,0.0107294,0.0109971,0.0140827,0.0130598,-0.0159353,-0.0244569,-0.0404893,-0.0508377,-0.0539303,-0.0511894,-0.0240558,0.0220655,0.0655409,0.0995956,0.1217405,0.1141835,0.0640572,0.0081841,-0.0630814,-0.1191317,-0.1241204,-0.0982,-0.0575266,-0.0073846,0.0231145,0.0331771,0.0410468,0.0234024,0.0192068,0.0033375,-0.0103457,0.0036056,-0.0007484,0.0008753,0.0079025,0.0192765,0.0195975,0.0224226,0.0001097,-0.0069818,-0.0198086,-0.0148904,-0.007495,-0.0118103,0.0105677,0.0265223,0.0254438,0.0179229,0.0210942,0.0092784,-0.0058546,-0.0101741,-0.0214844,-0.0248233,-0.0224161,-0.0068834,0.0018517,0.0015488,0.0076747,0.0066482,0.0027713,-0.0041715,2.47e-05,-0.013927,-0.0255554,-0.0231473,-0.0116729,-0.0031731,0.0084449,0.0343904,0.0441903,0.0364614,0.0128499,-0.0078276],[-0.0038448,-0.0021501,-0.0196766,-0.0258714,-0.0329821,-0.0339534,-0.0078448,0.0092401,0.0479806,0.0783325,0.0993654,0.0737804,0.0259385,-0.0235223,-0.0650964,-0.0858446,-0.0464911,-0.0007568,0.0372637,0.0774615,0.0538558,0.0138848,-0.0448612,-0.080157,-0.0742915,-0.0574003,-0.0183916,0.0022429,0.0187687,0.0306736,0.025003,0.0254547,0.0106198,0.0046891,-0.0013174,-0.0010163,-0.0023837,-0.0106717,-0.0037534,0.0019883,0.0175418,0.0057518,0.0160481,0.0283489,0.0374282,0.022792,0.0064451,-0.0281918,-0.05577,-0.0734521,-0.079301,-0.0333823,-0.0065251,0.0456012,0.0610459,0.0521194,0.0490909,0.0287179,0.0180142,0.0095278,0.0003091,-0.0130442,-0.0364921,-0.0485445,-0.0475779,-0.0517064,-0.0353276,-0.004786,0.0118725,0.0341932,0.0316713,0.025184,0.0124878,0.0075106,0.0068846,0.0003037,-0.0075069,-0.0043403,0.0007159,0.0087947,-0.0079546,0.0018142,-0.0151437,0.0026106,-0.0058674,-0.0027667,-0.0079167,-0.0112419,-0.0177058,-0.0241971,-0.0409375,-0.0326394,-0.0321986,-0.009659,0.0324875,0.048918,0.0621317,0.0435057,0.0358975,0.009165,-0.009179,-0.0061039,-0.0120201,-0.0015421,0.015078,0.0123315,0.0279689,0.0124978,0.0018683,-9.74e-05,-0.0330159,-0.0405291,-0.0373148,-0.0472294,-0.0366835,-0.0403812,-0.0363213,-0.0251265,0.0171735,0.0458234,0.0782779,0.082923,0.073039,0.0504801,-0.0085432,-0.032911,-0.0402072,-0.0473308,-0.0220644,-0.0166631,0.0153242,0.0120727,0.0136066,0.0161023,0.0096955,-0.0090661,-0.009479,-0.005619,-0.005211,0.0063132,-0.004935,0.0050467,0.003579,0.0008559,0.0020188,0.0021194,0.0226263,0.0326727,0.0327398,0.004691,-0.0233067,-0.0465618,-0.0828108,-0.0926087,-0.0574908,-0.0220273,0.0369551,0.0670531,0.0575175,0.0517499,0.0364917,0.0164153,0.0057447,-0.0032516,-0.0186663,-0.016644,-0.0148951,-0.015581,0.0002668,-0.0019338,0.0001891,0.0050696,0.0022636,-0.0037222,0.0030511,9.31e-05,0.0041285,0.0013145,-9.8e-06,0.0018961,-0.0063542,0.0107319,-0.0104887,0.0062751,-0.0136062,-0.0016438,-0.0220961,-0.0258865,-0.0356793,-0.0343547,-0.0153584,-0.0074303,0.0141455,0.0388613,0.0359832,0.0270842,0.0142417,0.0181555,0.0276337,0.0516669,0.0655329,0.0577384,0.03168,-0.0072219,-0.0182488,-0.0715157,-0.1003487,-0.1167395,-0.123723,-0.1049186,-0.0669748,-0.008141,0.0681924,0.1350907,0.1654435,0.1576134,0.1094679,0.0278713,-0.0361628,-0.0693311,-0.0673486,-0.0672268,-0.0407996,-0.005691,0.0010634,0.0083954,0.0020755,0.0072144,0.0025649,-0.0091833,0.0021805,-0.0028218,-0.0020384,-0.0155619,0.0073665,0.0152065,0.0104968,0.002607,0.0086222,-0.0096993,0.0011662,0.006493,0.0043539,-0.0105205,0.0022395,-0.0023909,-0.0062826,-0.0078869,-0.0121516,-0.01939,-0.0222415,-0.0077421,0.004806,0.022222,0.0404327,0.026079,0.0337694,0.0282803,0.006352,-0.0106133,-0.0226782,-0.019155,-0.0130471,0.0026859,-0.0181664,-0.0214923,-0.0052609,-0.018172,-0.0019225,0.005256,0.0290228,0.0353961,0.0424322,0.050953,0.0244176,0.0081649,-0.0269882,-0.0492571,-0.0548716,-0.055886,-0.0276863,0.011078,0.0551756,0.0805229,0.0759684,0.0562507,0.0280243,-0.0234852,-0.0711938,-0.0816594,-0.0768543,-0.0465506,-0.0180885,0.0029847,0.0279936,0.047918,0.0420892,0.0366256,0.022543,0.0203512,0.0029004,-0.0122366,-0.0282472,-0.0361217,-0.0148577,-0.0222416,0.0045238,-0.0025509,0.0035624,-0.0103224,-0.0042288,-0.0137209,-0.0045543,0.0046005,0.0194022,0.0346879,0.0341607,0.0351578,0.0073696,-0.0010131,-0.0095768,-0.0314957,-0.0375396,-0.0431304,-0.0362114,-0.0383998,-0.0206153,-0.0060668,0.0355978,0.062362,0.0792289,0.0714868,0.032631,-0.006078,-0.054787,-0.0710741,-0.0852553,-0.0561761,-0.0094731,0.0253285,0.0613814,0.0778243,0.0773266,0.0476042,0.0266992,0.0074513,0.0035976,0.0128785,0.0045506,0.0019911,-0.0362735,-0.054008,-0.0749597,-0.0974806,-0.0871871,-0.0743544,-0.0491788,-0.0040551,0.0260057,0.0671466,0.1129421,0.1180956,0.108432,0.0640117,0.0040273,-0.0387948,-0.0513297,-0.056675,-0.0390679,-0.0251919,-0.0060787,0.0035098,-0.0022049,-0.0054719,0.0159076,0.0031775,-0.0044165,-0.0068985,5.97e-05,-0.0059847,-0.0011381,-0.00628,0.0022817,-0.0013937,-0.0020409,-0.0012381,0.0011505,0.0029596,-0.002993,-0.0084589,-0.0143322,-0.031864,-0.0332019,-0.0382282,-0.0155082,-0.0065317,0.0381438,0.0850674,0.0841755,0.0712951],[0.0100885,0.0066686,0.0167751,0.0077314,0.0087279,0.000264,-0.016305,-0.0255747,-0.0428878,-0.0210215,-0.0076099,0.002687,0.0183577,0.0206209,0.0150637,0.0077987,-0.0069681,-0.0066485,0.003667,0.013404,0.0142288,0.0135152,0.0032132,-0.0048388,-0.0118403,-0.0063646,-0.0044256,-0.0098365,-0.0225397,-0.0234706,-0.0408749,-0.0212271,0.0002089,0.0123119,0.0204805,0.0278752,0.0197736,0.0124473,0.0094408,0.012746,0.007132,0.0086633,0.0251772,0.0341862,0.0242313,0.0164798,-0.0062064,-0.0360824,-0.0524382,-0.0645291,-0.0564204,-0.0257148,0.0021645,0.0187386,0.0291886,0.0245074,0.0198004,0.0193862,0.0190028,0.0058976,0.0071989,0.0037155,0.0006972,-0.0051683,-0.0004119,-0.0023528,0.0077081,-0.0031479,-0.0109766,-0.0053655,-0.0143201,-0.0102211,-0.0067996,-0.0023926,0.0163091,0.0198375,0.0084143,0.0009359,-0.0170935,-0.0111319,-0.0055961,0.016577,0.0517296,0.0523063,0.0555711,0.031037,0.0124004,0.0007904,-0.0179988,-0.0249196,-0.0420911,-0.04464,-0.0481839,-0.0133303,0.0151545,0.0154115,0.0194034,0.0085765,0.000513,-0.0245537,-0.0205985,-0.0110884,-0.0084021,-0.0129593,-0.0059994,-0.012402,-0.0074689,-0.004861,0.002707,0.0027178,0.0006861,-0.0052914,-0.023202,-0.0322013,-0.0385557,-0.025186,0.0066074,0.0391886,0.077514,0.0886366,0.0594294,0.0451688,-0.0003401,-0.0316527,-0.0461355,-0.0363892,-0.0129357,0.0132799,0.0130298,0.018511,0.0128541,-0.0100012,-0.0244209,-0.0261162,-0.0175145,0.0033273,0.0354501,0.0558476,0.0601262,0.0466196,0.0021684,-0.0401765,-0.0603657,-0.0671202,-0.0581981,-0.0524747,-0.0531939,-0.0483192,-0.0084758,0.0280022,0.073159,0.0889509,0.061186,0.0327665,-0.0155908,-0.0285742,-0.030498,0.0023465,0.0390682,0.0530731,0.0432619,0.0152729,-0.0145933,-0.0311511,-0.0321726,-0.0309578,-0.0152014,-0.0105856,0.0042849,-0.0081896,0.0014112,-0.0047944,0.0064811,0.0051124,-0.0008928,-0.0034436,-0.0125977,-0.0080644,-0.0025579,0.0070714,0.0100648,0.0299229,0.0243941,0.0186707,0.0143045,0.0027277,-0.0115483,-0.009925,-0.0160952,-0.0047186,-0.0133292,-0.0057582,-0.0016539,-0.0022102,0.002236,-0.0030719,-0.0069017,0.0013814,-0.0029534,0.0020013,-0.0003723,-0.009114,-0.0093517,-0.0182826,-0.0361428,-0.0657688,-0.0784046,-0.067762,-0.0357113,0.0129718,0.066302,0.1290411,0.1636339,0.1678538,0.1219308,0.043598,-0.0361429,-0.0874583,-0.1051992,-0.0851237,-0.0507121,-0.0088288,0.0092603,0.0152319,0.0085335,-0.0012325,-0.0057192,-0.007026,-0.0207725,-0.0116198,-0.0168053,-0.0139577,-0.0201528,0.0006351,0.0174454,0.0243694,0.0272945,0.0196207,0.0147336,-0.0067842,-0.0076839,-0.0174525,-0.0148771,-0.0131662,-0.005559,-0.0083368,-0.0077529,0.0047958,0.0037228,0.002981,0.0019463,0.004098,1.97e-05,0.0003417,-0.0012342,-0.0009332,-0.0057466,-0.0077267,-0.0087937,0.0127419,0.0042987,0.0040132,-0.005531,-0.0033213,-0.0029505,0.0089719,0.0014754,-0.0071307,-0.004812,0.0048409,-0.0032007,-0.005823,-0.0110562,-0.0167595,-0.0222138,-0.035918,-0.0321355,-0.0167899,-0.0095587,0.0306755,0.0509493,0.0772565,0.0876456,0.0609477,0.0356121,0.015463,-0.0009607,-0.0189091,-0.02773,-0.0473714,-0.0527446,-0.0549242,-0.0494549,-0.0312955,-0.0001651,0.0093147,0.0121636,0.0179631,-0.0024425,-0.0151146,-0.0132461,-0.0142502,0.0040033,0.0189897,0.0433732,0.0472009,0.0480571,0.031969,0.0160852,0.0067964,-0.0082202,-0.0202915,-0.0250525,-0.0284751,-0.0239571,-0.0311812,-0.0195932,-0.0031827,0.0043571,0.0159013,0.0070394,0.0073148,-0.0110209,-0.0124877,-0.0125598,-0.0127255,-0.0098208,-0.0032279,0.0046987,0.0039103,0.0064135,0.0032179,0.0018644,-0.0029092,2.53e-05,0.0002003,6.98e-05,0.0031829,-0.0022161,-0.0050909,-0.0016636,-0.0171556,-0.0142286,-0.0105583,-0.0057921,-0.0039622,0.0012716,0.0082464,0.004743,-0.0004411,-0.0146548,-0.022233,-0.0161576,0.0056114,0.0321378,0.0503581,0.0624044,0.0713959,0.0460227,0.0167328,-0.0158794,-0.0404242,-0.0531584,-0.0597081,-0.0387159,-0.0177108,0.0011512,0.0144497,0.0194582,0.0132267,0.0012011,0.005949,-0.0078148,0.0002934,-0.007505,0.004353,-0.0061298,0.0026531,-0.0007363,-0.0044389,-0.0030711,-0.0044222,-0.0012454,0.0044721,0.0029634,0.0025115,0.0056449,-0.0085362,0.0001982,-0.0025697,0.0058856,0.0075092,0.000932,-0.0067426,0.0010081,-0.003443,0.0053626,-0.0024495,0.0019236,0.0002953]]},"well":{"name":"Tamberlo-1","topFt":7520,"baseFt":7640,"owcFt":7590,"columns":["md_ft","vp","vs","rho","phit","vsh","sw"],"units":{"md_ft":"ft","vp":"m/s","vs":"m/s","rho":"kg/m3","phit":"fraction","vsh":"fraction","sw":"fraction"},"rows":[[7400,2735.692,1077.085,2414.12,0.1477,0.7628,1],[7400.5,2626.612,1075.624,2433.85,0.1736,0.7172,1],[7401,2744.174,1090.701,2415.38,0.1531,0.7155,1],[7401.5,2586.725,1076.164,2453.76,0.1533,0.7048,1],[7402,2639.182,1117.32,2442.55,0.1601,0.7228,1],[7402.5,2732.724,1044.554,2429.9,0.1434,0.7743,1],[7403,2767.449,1075.841,2443.25,0.1468,0.7498,1],[7403.5,2659.193,1120.089,2409.1,0.1393,0.7354,1],[7404,2792.432,1068.972,2447.34,0.1374,0.7444,1],[7404.5,2670.637,1067.733,2430.49,0.1493,0.7209,1],[7405,2659.189,1117.467,2439,0.1541,0.7464,1],[7405.5,2596.693,1072.495,2408.42,0.1477,0.8129,1],[7406,2572.528,1091.389,2399.05,0.1446,0.7545,1],[7406.5,2627.47,1083.896,2435.38,0.1615,0.83,1],[7407,2739.064,1071.854,2424.13,0.1515,0.7601,1],[7407.5,2663.233,1165.014,2443.29,0.1497,0.6995,1],[7408,2679.873,1054.491,2417.83,0.1428,0.7342,1],[7408.5,2681.639,1095.66,2434.02,0.157,0.6697,1],[7409,2588.925,1009.173,2407.88,0.1546,0.7041,1],[7409.5,2688.301,1064.293,2421,0.1294,0.7932,1],[7410,2664.79,1017.379,2426.85,0.1322,0.7038,1],[7410.5,2555.015,1067.904,2433.44,0.1489,0.7301,1],[7411,2502.462,1096.339,2426.19,0.1524,0.7281,1],[7411.5,2611.996,1109.121,2440.06,0.1402,0.7033,1],[7412,2671.144,1063.417,2444.09,0.1546,0.7452,1],[7412.5,2669.324,1067.713,2409.45,0.1582,0.805,1],[7413,2643.584,1061.123,2433.45,0.1524,0.7658,1],[7413.5,2701.429,1046.239,2415.27,0.1428,0.8263,1],[7414,2729.842,1141.813,2428.41,0.1462,0.767,1],[7414.5,2624.08,1037.937,2411,0.1534,0.6731,1],[7415,2758.061,1051.468,2421.48,0.1377,0.6632,1],[7415.5,2665.128,1070.08,2428.74,0.1591,0.6585,1],[7416,2665.75,1082.775,2429.13,0.1517,0.756,1],[7416.5,2687.768,1044.59,2433.62,0.1462,0.6951,1],[7417,2687.078,1058.91,2421.74,0.1586,0.7297,1],[7417.5,2718.99,1072.388,2423.28,0.1589,0.8369,1],[7418,2619.094,1073.687,2438.78,0.1502,0.7462,1],[7418.5,2577.676,1077.601,2421.2,0.1701,0.6962,1],[7419,2631.545,1068.462,2422.39,0.1573,0.7723,1],[7419.5,2706.429,1064.661,2426.74,0.1402,0.7682,1],[7420,2684.734,1111.107,2455.7,0.1275,0.813,1],[7420.5,2655.991,1102.524,2434.66,0.147,0.7264,1],[7421,2564.634,1077.061,2430.75,0.1556,0.7321,1],[7421.5,2674.29,1083.958,2413.01,0.1797,0.7304,1],[7422,2687.394,1064.334,2434.07,0.1534,0.7174,1],[7422.5,2634.263,1059.814,2418.16,0.1594,0.8169,1],[7423,2620.399,1088.007,2414.07,0.1518,0.7612,1],[7423.5,2665.483,1030.173,2443.68,0.1427,0.8157,1],[7424,2676.481,1060.391,2415.95,0.1645,0.6895,1],[7424.5,2678.53,1118.259,2413.28,0.1511,0.7286,1],[7425,2592.238,1130.253,2416.1,0.1463,0.6927,1],[7425.5,2596.72,1131.867,2408.23,0.1369,0.7504,1],[7426,2676.636,1100.161,2420.47,0.1596,0.7841,1],[7426.5,2622.857,1073.28,2428.18,0.1536,0.6857,1],[7427,2646.271,1109.159,2425.33,0.14,0.7177,1],[7427.5,2578.208,1056.391,2430.4,0.1629,0.7623,1],[7428,2603.219,1076.194,2419.57,0.1435,0.7868,1],[7428.5,2611.339,1071.797,2418.21,0.1419,0.7992,1],[7429,2731.47,1066.95,2428.61,0.1482,0.7701,1],[7429.5,2594.386,1127.969,2416.92,0.1205,0.7521,1],[7430,2682.486,1079.238,2407.01,0.1523,0.7816,1],[7430.5,2649.82,1056.17,2414.89,0.1689,0.7771,1],[7431,2623.788,1067.695,2427.49,0.1483,0.7701,1],[7431.5,2575.057,1069.2,2450.64,0.1434,0.7697,1],[7432,2672.947,1089.052,2424.46,0.1369,0.67,1],[7432.5,2630.922,1094.773,2435.75,0.1544,0.6265,1],[7433,2662.2,1090.317,2443.03,0.1498,0.7663,1],[7433.5,2678.387,1128.418,2406.55,0.1509,0.6844,1],[7434,2673.89,1069.603,2439.38,0.142,0.7218,1],[7434.5,2667.058,1029.255,2434.59,0.1493,0.7173,1],[7435,2613.971,1063.392,2425.83,0.154,0.7374,1],[7435.5,2722.979,1085.207,2407.47,0.1508,0.6858,1],[7436,2753.668,1082.947,2422.77,0.1664,0.7774,1],[7436.5,2745.42,1042.79,2435.74,0.1477,0.7374,1],[7437,2634.049,1071.877,2421.8,0.1496,0.803,1],[7437.5,2688.281,1131.22,2423.94,0.1366,0.7626,1],[7438,2647.816,1110.501,2416.28,0.1449,0.8038,1],[7438.5,2667.616,1113.663,2408.28,0.1339,0.7404,1],[7439,2576.404,1116.905,2440.86,0.1488,0.7785,1],[7439.5,2654.564,1104.726,2403.3,0.1294,0.7378,1],[7440,2540.084,1154.306,2443.21,0.1532,0.6653,1],[7440.5,2661.362,1077.397,2434.96,0.1501,0.7785,1],[7441,2677.676,1076.629,2426.89,0.1428,0.7453,1],[7441.5,2610.46,1050.039,2409.92,0.1621,0.6947,1],[7442,2657.793,1109.622,2426.32,0.1512,0.7033,1],[7442.5,2600.58,1110.193,2415.78,0.124,0.7706,1],[7443,2698.707,1124.828,2408.47,0.1555,0.724,1],[7443.5,2560.823,1056,2436.83,0.1555,0.7117,1],[7444,2605.684,1100.803,2418.92,0.1512,0.7769,1],[7444.5,2635.692,1112.897,2445.37,0.1673,0.7526,1],[7445,2685.603,1044.849,2435.49,0.1508,0.8352,1],[7445.5,2710.519,1110.444,2405.45,0.1548,0.8126,1],[7446,2628.798,1100.88,2440.61,0.1412,0.8188,1],[7446.5,2594.594,1097.95,2437.2,0.1427,0.6664,1],[7447,2684.094,1076.716,2392.15,0.1474,0.7332,1],[7447.5,2659.483,1071.385,2427.21,0.1554,0.8173,1],[7448,2691.366,1106.115,2445.15,0.1482,0.7735,1],[7448.5,2609.559,1110.489,2426.96,0.1462,0.7315,1],[7449,2672.396,1088.626,2433.78,0.1671,0.7871,1],[7449.5,2638.778,1123.036,2420.34,0.1543,0.7656,1],[7450,2696.918,1090.531,2442.01,0.1455,0.8015,1],[7450.5,2591.571,1128.505,2420.63,0.1643,0.7484,1],[7451,2648.189,1044.738,2434.35,0.1581,0.6839,1],[7451.5,2628.687,1109.475,2418.79,0.1541,0.7046,1],[7452,2640.731,1117.507,2421.7,0.1447,0.6612,1],[7452.5,2634.142,1116.51,2431.35,0.1401,0.7456,1],[7453,2574.157,1078.106,2435.12,0.1399,0.7064,1],[7453.5,2646.814,1104.722,2422.53,0.1661,0.75,1],[7454,2682.061,1069.585,2429.64,0.1368,0.7252,1],[7454.5,2633.757,1117.375,2424.09,0.156,0.7405,1],[7455,2627.451,1039.973,2417.98,0.1512,0.8174,1],[7455.5,2675.973,1057.395,2407.88,0.1571,0.7658,1],[7456,2638.201,1035.366,2431.06,0.1508,0.7649,1],[7456.5,2631.596,1046.127,2423.07,0.1572,0.6956,1],[7457,2689.1,1101.077,2422.55,0.1463,0.6905,1],[7457.5,2642.904,1045.317,2445.54,0.1378,0.7773,1],[7458,2562.428,1089.424,2422.67,0.1475,0.7254,1],[7458.5,2641.355,1099.586,2445.65,0.1337,0.6928,1],[7459,2666.933,1067.819,2416.61,0.148,0.72,1],[7459.5,2652.074,1147.015,2430.44,0.1484,0.8069,1],[7460,2602.539,1077.721,2410.38,0.1514,0.7152,1],[7460.5,2604.123,1088.154,2394.41,0.1443,0.7256,1],[7461,2640.077,1041.912,2416.26,0.1556,0.7854,1],[7461.5,2641.565,1055.013,2416.92,0.1528,0.6814,1],[7462,2709.407,1083.198,2436.75,0.1603,0.7169,1],[7462.5,2658.196,1089.311,2421.48,0.1476,0.6289,1],[7463,2580.127,1121.677,2440.64,0.1556,0.7463,1],[7463.5,2612.308,1075.871,2450.05,0.1618,0.7639,1],[7464,2624.274,1088.239,2420.02,0.1439,0.8044,1],[7464.5,2629.3,1045.515,2417.65,0.1605,0.7252,1],[7465,2690.257,1109.465,2407.6,0.1613,0.753,1],[7465.5,2644.305,1087.141,2403.86,0.1449,0.7413,1],[7466,2658.259,1058.277,2458.7,0.1411,0.76,1],[7466.5,2659.802,1039.648,2434.48,0.1386,0.7626,1],[7467,2618.543,1072.55,2425.61,0.1345,0.7364,1],[7467.5,2678.281,1085.979,2425.77,0.1332,0.7565,1],[7468,2629.203,1116.777,2436.32,0.142,0.6525,1],[7468.5,2663.035,1104.554,2443.46,0.152,0.7491,1],[7469,2716.953,1090.796,2428.48,0.1318,0.6782,1],[7469.5,2592.587,1092.944,2404.81,0.1445,0.6722,1],[7470,2633.026,1120.573,2446.45,0.1384,0.728,1],[7470.5,2637.596,1087.612,2429.86,0.1468,0.7609,1],[7471,2604.762,1109.559,2425.74,0.1741,0.7242,1],[7471.5,2645.43,1091.549,2433.29,0.1491,0.6992,1],[7472,2681.02,1088.003,2416.85,0.1526,0.7213,1],[7472.5,2511.91,1052.513,2434.71,0.1472,0.7026,1],[7473,2645.632,1118.326,2413.1,0.1471,0.7399,1],[7473.5,2574.555,1117.544,2427.71,0.143,0.7132,1],[7474,2608.931,1083.742,2423.24,0.1562,0.77,1],[7474.5,2681.343,1069.082,2432.57,0.14,0.6977,1],[7475,2632.414,1077.211,2406.56,0.1518,0.7475,1],[7475.5,2618.753,1074.311,2423.58,0.1474,0.7581,1],[7476,2619.462,1092.37,2449.19,0.1503,0.7869,1],[7476.5,2613.223,1043.485,2421.9,0.1601,0.6839,1],[7477,2653.736,1031.501,2424.49,0.164,0.7717,1],[7477.5,2628.182,1120.051,2422.12,0.1499,0.7622,1],[7478,2612.184,1105.932,2427.24,0.1609,0.7137,1],[7478.5,2617.243,1097.241,2442.57,0.128,0.7145,1],[7479,2663.717,1106.588,2403.29,0.1404,0.7661,1],[7479.5,2700.769,1050.934,2425.17,0.1546,0.7427,1],[7480,2728.899,1125.36,2422.06,0.1496,0.7677,1],[7480.5,2624.264,1120.179,2453.94,0.148,0.7166,1],[7481,2645.822,1049.905,2444.57,0.1425,0.7531,1],[7481.5,2672.484,1093.14,2450.06,0.1594,0.708,1],[7482,2667.034,1109.349,2409.17,0.1479,0.7686,1],[7482.5,2756.753,1097.841,2441.74,0.1349,0.6917,1],[7483,2647.989,1097.545,2401.13,0.1466,0.7263,1],[7483.5,2704.592,1078.962,2416.34,0.1535,0.7193,1],[7484,2668.04,1066.125,2437.34,0.1442,0.7481,1],[7484.5,2591.189,1035.669,2410.52,0.1427,0.6895,1],[7485,2684.198,1101.829,2422.51,0.1488,0.679,1],[7485.5,2654.453,1034.431,2455.11,0.1583,0.6877,1],[7486,2576.757,1064.732,2397.38,0.1593,0.7335,1],[7486.5,2658.352,1094.931,2427.35,0.1595,0.8271,1],[7487,2649.903,1158.389,2414.09,0.1577,0.7944,1],[7487.5,2564.295,1100.592,2385.12,0.1522,0.7253,1],[7488,2676.947,1102.914,2439.96,0.1435,0.7301,1],[7488.5,2678.692,1121.576,2425.81,0.1501,0.7113,1],[7489,2605.666,1068.364,2428.3,0.132,0.8417,1],[7489.5,2665.545,1069.039,2438.08,0.1625,0.7673,1],[7490,2655.801,1093.802,2423.93,0.1546,0.7599,1],[7490.5,2652.062,1085.3,2425.34,0.1659,0.6934,1],[7491,2664.7,1060.112,2423.44,0.167,0.7019,1],[7491.5,2678.362,1097.888,2414.22,0.148,0.744,1],[7492,2746.319,1021.667,2400.81,0.1256,0.6763,1],[7492.5,2687.263,1097.784,2405.42,0.1487,0.7474,1],[7493,2639.858,1070.349,2448.56,0.1472,0.782,1],[7493.5,2607.511,1109.783,2455.13,0.1358,0.753,1],[7494,2570.166,1088.609,2435.05,0.1439,0.7638,1],[7494.5,2666.727,1050.653,2424.8,0.1497,0.7536,1],[7495,2583.482,1050.273,2418.66,0.1443,0.6827,1],[7495.5,2646.919,1107.222,2429.36,0.1358,0.7938,1],[7496,2662.949,1077.708,2426.99,0.1681,0.8348,1],[7496.5,2582.529,1095.793,2442.37,0.1581,0.6598,1],[7497,2580.206,1032.799,2440.16,0.1585,0.7692,1],[7497.5,2744.648,1140.694,2425.14,0.1514,0.7395,1],[7498,2666.879,1056.999,2413.1,0.1613,0.7924,1],[7498.5,2664.958,1074.006,2428.29,0.1471,0.7502,1],[7499,2683.246,1101.233,2398.09,0.1664,0.7461,1],[7499.5,2617.74,1075.947,2416.56,0.153,0.8168,1],[7500,2674.176,1106.955,2439.9,0.1491,0.7448,1],[7500.5,2632.578,1100.632,2408.94,0.161,0.7737,1],[7501,2690.507,1109.908,2428.56,0.1336,0.7682,1],[7501.5,2621.107,1113.583,2433.74,0.1546,0.7139,1],[7502,2698.169,1052.121,2422.05,0.1457,0.6755,1],[7502.5,2637.224,1072.61,2437.03,0.1718,0.7625,1],[7503,2631.34,1084.13,2422.14,0.1699,0.6757,1],[7503.5,2610.114,1108.118,2420.27,0.1697,0.7472,1],[7504,2705.174,1121.711,2417.81,0.1603,0.726,1],[7504.5,2631.439,1088.006,2473.16,0.1369,0.7193,1],[7505,2597.842,1089.878,2434.43,0.168,0.6881,1],[7505.5,2647.78,1059.212,2436.87,0.1537,0.7458,1],[7506,2745.06,1042.188,2423.97,0.1615,0.6925,1],[7506.5,2625.715,1096.254,2426.57,0.1581,0.701,1],[7507,2700.239,1055.743,2442.19,0.1471,0.7768,1],[7507.5,2661.9,1078.015,2413.5,0.1703,0.6619,1],[7508,2630.567,1103.637,2437.38,0.1248,0.7081,1],[7508.5,2623.078,1080.159,2424.83,0.1464,0.6664,1],[7509,2658.131,1049.372,2413.58,0.1572,0.7124,1],[7509.5,2684.794,1163.309,2440.4,0.1434,0.7578,1],[7510,2701.458,1085.625,2416.14,0.1428,0.656,1],[7510.5,2652.391,1115.77,2431.49,0.1434,0.7586,1],[7511,2654.684,1113.247,2414.07,0.1683,0.7747,1],[7511.5,2707.231,1107.518,2422.07,0.1478,0.7891,1],[7512,2676.699,1090.491,2392.15,0.145,0.8341,1],[7512.5,2620.626,1181.325,2429.87,0.154,0.6781,1],[7513,2648.898,1076.44,2427.34,0.1489,0.696,1],[7513.5,2672.055,1090.042,2411.08,0.1511,0.68,1],[7514,2704.751,1104.462,2436.89,0.1549,0.7625,1],[7514.5,2615.92,1114.066,2428.24,0.1603,0.6789,1],[7515,2644.585,1054.805,2426.6,0.1523,0.8146,1],[7515.5,2581.402,1049.254,2420.22,0.1732,0.6803,1],[7516,2647.461,1071.711,2429.62,0.1458,0.7905,1],[7516.5,2630.297,1052.892,2434.3,0.1484,0.7236,1],[7517,2612.419,1054.809,2401.48,0.1381,0.7254,1],[7517.5,2617.345,1062.323,2434.07,0.1521,0.8029,1],[7518,2651.383,1085.493,2453,0.1524,0.7805,1],[7518.5,2666.534,1081.282,2437.2,0.1496,0.7392,1],[7519,2701.612,1110.417,2435.29,0.1457,0.7409,1],[7519.5,2710.338,1066.138,2412.94,0.1526,0.6739,1],[7520,2621.016,1566.731,2224.1,0.2283,0.1978,0.3125],[7520.5,2570.248,1489.793,2207.59,0.2378,0.1523,0.2831],[7521,2467.493,1368.625,2177.37,0.2521,0.2146,0.2703],[7521.5,2577.813,1644.33,2230.49,0.2248,0.2151,0.331],[7522,2470.322,1425.373,2165.52,0.2609,0.1866,0.3088],[7522.5,2574.416,1553.326,2235.58,0.2209,0.2538,0.3329],[7523,2738.675,1711.782,2261.46,0.2081,0.2181,0.3503],[7523.5,2534.827,1542.857,2212.07,0.2329,0.207,0.2602],[7524,2433.282,1426.407,2213.05,0.2336,0.244,0.3286],[7524.5,2602.486,1583.189,2223.71,0.2275,0.2268,0.3076],[7525,2657.453,1623.224,2239.66,0.2184,0.2231,0.2962],[7525.5,2638.597,1635.313,2267.93,0.2018,0.2665,0.3098],[7526,2633.746,1573.76,2236.19,0.2206,0.214,0.2967],[7526.5,2558.062,1553.06,2206.76,0.2372,0.2487,0.3367],[7527,2577.31,1492.77,2218.11,0.2299,0.2316,0.2918],[7527.5,2502.513,1583.813,2234.15,0.2198,0.2661,0.2876],[7528,2776.54,1679.38,2305.39,0.1796,0.3046,0.3035],[7528.5,2768.085,1699.929,2270.44,0.2004,0.3029,0.3493],[7529,2637.27,1650.513,2271.06,0.2023,0.2235,0.3395],[7529.5,2613.595,1533.886,2242.67,0.2163,0.2798,0.3384],[7530,2540.509,1538.412,2238.34,0.2179,0.273,0.3067],[7530.5,2591.215,1541.962,2223.62,0.2269,0.2539,0.3132],[7531,2585.171,1497.631,2232.43,0.2219,0.2664,0.3223],[7531.5,2661.312,1533.269,2252.77,0.2092,0.2975,0.3092],[7532,2453.382,1511.607,2255.62,0.2069,0.3232,0.3113],[7532.5,2662.002,1591.814,2259.14,0.2064,0.2754,0.3083],[7533,2641.852,1538.238,2237.89,0.2185,0.2804,0.3245],[7533.5,2584.432,1450.952,2256.85,0.2089,0.2236,0.2978],[7534,2648.627,1602.378,2249.59,0.2132,0.2619,0.3436],[7534.5,2569.622,1552.962,2247.97,0.2126,0.305,0.3393],[7535,2637.357,1662.621,2267.37,0.2029,0.2788,0.3498],[7535.5,2604.958,1503.516,2251.78,0.212,0.257,0.3413],[7536,2787.057,1736.744,2308.61,0.1798,0.2873,0.3586],[7536.5,2504.4,1475.05,2195.04,0.2438,0.2257,0.3196],[7537,2685.661,1618.134,2229.73,0.2235,0.2492,0.3093],[7537.5,2553.297,1488.167,2222.47,0.2273,0.278,0.3288],[7538,2652.559,1499.055,2254.19,0.2087,0.2939,0.313],[7538.5,2662.595,1600.101,2274.86,0.2003,0.2562,0.3793],[7539,2530.14,1413.151,2217.65,0.2335,0.2319,0.3896],[7539.5,2615.804,1537.634,2227.94,0.2256,0.2467,0.3412],[7540,2601.927,1649.832,2243.64,0.2175,0.2356,0.3497],[7540.5,2712.692,1616.312,2261.01,0.2072,0.2521,0.3485],[7541,2602.17,1515.025,2246.62,0.2171,0.2078,0.3617],[7541.5,2658.846,1518.162,2247.81,0.2145,0.2451,0.3373],[7542,2563.41,1499.503,2242.29,0.2178,0.2476,0.3471],[7542.5,2462.734,1499.055,2214.18,0.2341,0.2509,0.369],[7543,2549.407,1475.454,2213.92,0.2355,0.1917,0.3541],[7543.5,2578.683,1573.466,2187.42,0.2514,0.1481,0.349],[7544,2430.807,1452.318,2237.95,0.2215,0.2078,0.3491],[7544.5,2521.304,1457.071,2208.51,0.2389,0.2133,0.384],[7545,2532.758,1534.094,2186.97,0.25,0.2151,0.3586],[7545.5,2619.202,1545.351,2239.31,0.2216,0.1874,0.3557],[7546,2609.344,1542.813,2199.25,0.2448,0.1891,0.3836],[7546.5,2675.086,1541.913,2215.53,0.2366,0.1463,0.3721],[7547,2619.987,1531.609,2229.27,0.2283,0.1808,0.3849],[7547.5,2772.641,1569.387,2241.12,0.223,0.1358,0.3813],[7548,2689.817,1602.22,2205.82,0.244,0.1199,0.4048],[7548.5,2564.671,1537.516,2200.45,0.245,0.1655,0.3884],[7549,2600.915,1503.574,2183.17,0.2567,0.1086,0.3985],[7549.5,2560.462,1499.715,2209.75,0.2416,0.1303,0.408],[7550,2728.906,1607.529,2192.74,0.2523,0.0884,0.4061],[7550.5,2646.783,1555.655,2204.18,0.2456,0.0988,0.4079],[7551,2838.193,1675.665,2220.22,0.2365,0.112,0.4146],[7551.5,2648.988,1612.405,2205.27,0.2452,0.1136,0.4249],[7552,2526.772,1509.392,2170.36,0.2661,0.0621,0.4215],[7552.5,2662.52,1532.964,2196.69,0.2509,0.0958,0.4336],[7553,2674.346,1523.463,2200.53,0.2476,0.117,0.4209],[7553.5,2696.67,1637.858,2205.34,0.2476,0.096,0.4777],[7554,2562.681,1590.745,2148.96,0.2804,0.0418,0.4622],[7554.5,2464.748,1397.34,2174.79,0.2639,0.0758,0.4371],[7555,2647.575,1554.1,2190.55,0.2554,0.0764,0.4489],[7555.5,2484.793,1411.628,2146.43,0.2776,0.1031,0.4035],[7556,2621.886,1528.452,2187.92,0.2564,0.0727,0.4315],[7556.5,2561.349,1478.71,2151.41,0.2784,0.065,0.4626],[7557,2668.753,1542.97,2174.47,0.2663,0.0357,0.4661],[7557.5,2664.23,1591.646,2181.49,0.262,0.0538,0.4684],[7558,2704.531,1545.304,2200.98,0.2514,0.0613,0.4862],[7558.5,2770.042,1609.078,2209.34,0.2464,0.0558,0.4733],[7559,2692.351,1598.47,2203.66,0.2495,0.0689,0.4812],[7559.5,2735.584,1582.15,2200.29,0.2502,0.0737,0.4541],[7560,2650.407,1476.229,2191.37,0.2566,0.0722,0.487],[7560.5,2565.84,1488.582,2145.71,0.2827,0.03,0.467],[7561,2406.101,1407.645,2158.94,0.2736,0.0754,0.4583],[7561.5,2511.098,1460.512,2146.67,0.2833,0.03,0.494],[7562,2572.836,1486.452,2172.94,0.2677,0.0739,0.5053],[7562.5,2522.915,1463.655,2188.73,0.2576,0.1047,0.4994],[7563,2608.042,1459.088,2200.37,0.2509,0.1099,0.5015],[7563.5,2585.224,1498.193,2179.23,0.2659,0.03,0.5198],[7564,2528.514,1518.551,2184.86,0.261,0.108,0.5324],[7564.5,2710.097,1564.384,2207.97,0.2464,0.1011,0.4886],[7565,2558.282,1431.831,2177.48,0.2665,0.0967,0.5586],[7565.5,2647.57,1565.488,2213.45,0.2459,0.0856,0.5482],[7566,2697.283,1590.441,2205.05,0.2485,0.1056,0.5058],[7566.5,2672.507,1435.523,2194.75,0.2571,0.1153,0.5836],[7567,2583.326,1444.738,2183.77,0.261,0.0688,0.4893],[7567.5,2691.165,1476.003,2228.42,0.236,0.1202,0.541],[7568,2657.81,1530.469,2190.91,0.2604,0.0618,0.5708],[7568.5,2529.902,1404.365,2180.18,0.2631,0.1532,0.5518],[7569,2741.7,1563.1,2221.23,0.2414,0.1331,0.5863],[7569.5,2646.904,1502.406,2206.4,0.2508,0.1233,0.6007],[7570,2576.258,1536.035,2192.82,0.2564,0.1324,0.5515],[7570.5,2575.214,1467.842,2176.21,0.2682,0.1422,0.6144],[7571,2632.711,1540.122,2225.92,0.2376,0.1979,0.6111],[7571.5,2696.087,1572.132,2223.9,0.239,0.1662,0.5914],[7572,2579.109,1546.629,2211.62,0.247,0.178,0.6235],[7572.5,2592.294,1445.812,2218.5,0.241,0.2077,0.5945],[7573,2664.416,1519.683,2242.01,0.2282,0.1938,0.6041],[7573.5,2725.593,1650.336,2247.18,0.2269,0.169,0.6316],[7574,2908.204,1671.138,2292.03,0.2002,0.2004,0.6421],[7574.5,2797.727,1619.992,2252.42,0.224,0.1954,0.6612],[7575,2616.517,1481.281,2246.07,0.2266,0.1965,0.6284],[7575.5,2935.218,1654.114,2292.46,0.1991,0.2385,0.6552],[7576,2637.45,1495.106,2232.28,0.2359,0.222,0.6869],[7576.5,2812.317,1693.518,2277.06,0.207,0.2314,0.6153],[7577,2797.244,1602.441,2286.99,0.2029,0.2342,0.6696],[7577.5,2692.974,1542.505,2261.61,0.2167,0.2695,0.673],[7578,2775.125,1583.058,2270.35,0.212,0.2478,0.6632],[7578.5,2838.801,1720.933,2283.14,0.205,0.2164,0.6472],[7579,2536.834,1398.599,2217.92,0.2455,0.206,0.7043],[7579.5,2904.84,1600.674,2301.04,0.1937,0.2521,0.657],[7580,2825.69,1642.865,2292.36,0.2002,0.2657,0.7172],[7580.5,2701,1593.572,2266.88,0.2143,0.2602,0.6843],[7581,2673.99,1586.215,2268.81,0.2126,0.2694,0.6771],[7581.5,2769.771,1536.829,2273.73,0.2123,0.2478,0.7332],[7582,2700.354,1577.537,2249.41,0.2254,0.2648,0.7135],[7582.5,2602.921,1446.08,2257.89,0.221,0.2912,0.7548],[7583,2767.796,1533.798,2282.51,0.2049,0.3184,0.7372],[7583.5,2828.576,1544.13,2276.6,0.2106,0.2566,0.7444],[7584,2680.798,1597.886,2253.72,0.2235,0.249,0.7162],[7584.5,2815.185,1605.832,2277.85,0.2089,0.2935,0.7515],[7585,2903.224,1642.455,2316.28,0.1857,0.3378,0.7888],[7585.5,2767.671,1649.336,2268.8,0.2166,0.2517,0.7785],[7586,2881.623,1668.356,2314.59,0.1878,0.3019,0.7847],[7586.5,2850.199,1593.343,2297.74,0.2004,0.2927,0.857],[7587,2921.47,1559.366,2300.44,0.1989,0.2644,0.8289],[7587.5,2857.278,1600.542,2278.22,0.2124,0.27,0.8391],[7588,2681.293,1446.509,2260.36,0.2218,0.2733,0.803],[7588.5,2924.852,1661.144,2297.15,0.2013,0.2606,0.8377],[7589,2978.098,1622.317,2292.41,0.2065,0.2236,0.8729],[7589.5,2855.132,1613.887,2287.84,0.208,0.2575,0.8689],[7590,3142.209,1715.953,2339.69,0.1822,0.2055,1],[7590.5,3057.137,1553.599,2332.89,0.1819,0.3327,1],[7591,3049.914,1717.514,2296.78,0.2075,0.2396,1],[7591.5,2932.475,1570.976,2325.8,0.1869,0.3157,1],[7592,2922.658,1538.072,2285.79,0.2141,0.2442,1],[7592.5,2987.61,1628.153,2293.5,0.2087,0.2633,1],[7593,3029.705,1686.713,2320.41,0.1915,0.281,1],[7593.5,3159.096,1791.222,2340.66,0.1794,0.2695,1],[7594,2922.291,1522.983,2272.68,0.2236,0.2031,1],[7594.5,2820.631,1523.94,2233.22,0.2481,0.1969,1],[7595,3006.555,1653.652,2313.17,0.1979,0.2265,1],[7595.5,2977.171,1556.314,2262.34,0.2303,0.1918,1],[7596,2880.193,1525.419,2257.11,0.2325,0.2229,1],[7596.5,2917.567,1600.481,2264.04,0.2304,0.1595,1],[7597,2983.795,1574.755,2270.11,0.2257,0.1873,1],[7597.5,2885.545,1526.831,2254.68,0.2357,0.1728,1],[7598,2942.272,1540.499,2285.22,0.2169,0.1731,1],[7598.5,2864.756,1468.473,2219.55,0.2586,0.1299,1],[7599,2821.237,1393.584,2237.49,0.2463,0.1719,1],[7599.5,2864.986,1478.753,2247.03,0.2403,0.1745,1],[7600,2803.451,1450.965,2234.24,0.2488,0.1561,1],[7600.5,2834.187,1474.251,2215.83,0.2616,0.1091,1],[7601,2954.883,1535.435,2267.76,0.2292,0.1252,1],[7601.5,2951.761,1597.674,2257.42,0.234,0.1711,1],[7602,2771.514,1430.774,2230.03,0.252,0.1355,1],[7602.5,2909.385,1482.408,2252.48,0.2384,0.131,1],[7603,2894.846,1546.787,2227.59,0.2557,0.0688,1],[7603.5,2918.707,1535.321,2245.75,0.2429,0.1203,1],[7604,3060.57,1749.29,2358.75,0.164,0.3857,1],[7604.5,3013.547,1650.201,2324.32,0.1856,0.3791,1],[7605,2978.094,1626.651,2333.9,0.1796,0.3818,1],[7605.5,3038.2,1688.6,2346.88,0.1708,0.4023,1],[7606,2874.478,1476.479,2312.09,0.1941,0.3526,1],[7606.5,2976.766,1661.911,2327.41,0.1838,0.3753,1],[7607,3141.876,1719.153,2390.95,0.1436,0.3974,1],[7607.5,2974.04,1599.105,2342.46,0.1738,0.3956,1],[7608,3016.483,1664.229,2327.04,0.1844,0.3644,1],[7608.5,3052.396,1593.06,2346.39,0.1707,0.4121,1],[7609,2994.172,1572.854,2329.23,0.1841,0.3348,1],[7609.5,3063.504,1719.188,2333.89,0.1798,0.3757,1],[7610,2919.873,1587.692,2296.94,0.2051,0.3067,1],[7610.5,2963.093,1613.842,2318.08,0.1901,0.3617,1],[7611,3066.567,1619.029,2345.86,0.1724,0.3736,1],[7611.5,3119.22,1713.02,2325.25,0.1857,0.3593,1],[7612,2848.163,1518.033,2277.77,0.2164,0.3241,1],[7612.5,2981.847,1573.987,2320.95,0.1877,0.3785,1],[7613,2857.091,1511.92,2306.32,0.1978,0.3486,1],[7613.5,2819.461,1452.535,2209.33,0.2669,0.0672,1],[7614,2970.26,1654.401,2250.65,0.241,0.0861,1],[7614.5,2870.377,1494.051,2215.19,0.2623,0.0976,1],[7615,2800.041,1455.067,2194.07,0.2761,0.0703,1],[7615.5,2834.718,1541.809,2218.24,0.2608,0.0877,1],[7616,2917.182,1600.742,2236.33,0.2495,0.093,1],[7616.5,2922.843,1480.608,2233.2,0.252,0.0768,1],[7617,2958.824,1570.899,2253.89,0.2387,0.0969,1],[7617.5,2860.912,1496.017,2226.94,0.2554,0.0901,1],[7618,2750.27,1355.356,2183.72,0.2831,0.0517,1],[7618.5,2949.506,1552.243,2248.32,0.2411,0.1261,1],[7619,2958.377,1620.736,2252.37,0.2384,0.1342,1],[7619.5,2919.71,1516.419,2227.02,0.2545,0.1165,1],[7620,2748.258,1395.994,2191.79,0.2759,0.123,1],[7620.5,2987.509,1654.133,2279.62,0.2215,0.1391,1],[7621,2939.251,1625.84,2265.69,0.2298,0.1445,1],[7621.5,2952.932,1543.178,2274.55,0.224,0.1566,1],[7622,2918.818,1549.512,2230.08,0.2529,0.109,1],[7622.5,2885.009,1587.297,2243.19,0.2434,0.1519,1],[7623,2911.157,1625.219,2251.87,0.2373,0.1745,1],[7623.5,3109.831,1704.347,2311.15,0.2007,0.1797,1],[7624,3017.474,1619.692,2292.98,0.2104,0.2233,1],[7624.5,3004.394,1671.381,2300.34,0.2075,0.1763,1],[7625,2839.147,1478.693,2266.12,0.2286,0.1745,1],[7625.5,2999.597,1602.15,2283.1,0.2177,0.1879,1],[7626,2978.75,1602.944,2300.77,0.2063,0.2025,1],[7626.5,2727.687,1351.413,2225.98,0.2519,0.2174,1],[7627,2899.224,1510.18,2298.56,0.2062,0.2457,1],[7627.5,2957.149,1492.254,2301.93,0.2049,0.2236,1],[7628,2901.308,1531.856,2257.42,0.2332,0.1958,1],[7628.5,3111.207,1709.758,2304.78,0.2023,0.2479,1],[7629,2998.312,1621.893,2289.19,0.2128,0.2215,1],[7629.5,3005.479,1599.906,2286.2,0.2145,0.227,1],[7630,2967.347,1558.591,2272.8,0.2227,0.2262,1],[7630.5,2862.662,1470.757,2260.73,0.2309,0.2058,1],[7631,2808.176,1460.527,2254.76,0.2319,0.2853,1],[7631.5,2972.846,1635.521,2292.97,0.209,0.2659,1],[7632,2946.213,1589.557,2288.02,0.2118,0.2711,1],[7632.5,3038.386,1618.832,2294.85,0.2081,0.2569,1],[7633,3004.148,1570.439,2306.01,0.2011,0.2591,1],[7633.5,2901.725,1505.645,2292.97,0.2088,0.2717,1],[7634,2995.028,1558.393,2296.29,0.2077,0.2428,1],[7634.5,2954.778,1564.118,2276.59,0.219,0.2667,1],[7635,2961.451,1584.284,2266.85,0.2258,0.2439,1],[7635.5,2972.783,1480.372,2282.12,0.2166,0.2381,1],[7636,2800.269,1460.59,2275.4,0.2206,0.2433,1],[7636.5,2871.133,1575.795,2268.2,0.2246,0.2548,1],[7637,2937.484,1538.594,2286.54,0.2124,0.2806,1],[7637.5,2959.67,1566.019,2297.69,0.2068,0.2437,1],[7638,2961.636,1580.489,2309.33,0.1991,0.2591,1],[7638.5,2908.887,1496.161,2305.44,0.1985,0.3441,1],[7639,2906.478,1614.97,2280.57,0.2178,0.2307,1],[7639.5,2928.484,1552.68,2284.25,0.2155,0.2313,1],[7640,2799.521,1414.661,2230.95,0.2481,0.2404,1],[7640.5,2787.041,1116.953,2412.14,0.1512,0.759,1],[7641,2805.132,1134.712,2449.92,0.1656,0.7057,1],[7641.5,2791.263,1137.546,2419.09,0.1648,0.7868,1],[7642,2743.461,1129.178,2422.55,0.1654,0.7241,1],[7642.5,2741.211,1185.653,2435.94,0.1392,0.6536,1],[7643,2728.628,1168.287,2444.63,0.1581,0.7365,1],[7643.5,2789.337,1168.099,2423.81,0.1482,0.7236,1],[7644,2774.302,1137.237,2434.96,0.1507,0.7109,1],[7644.5,2778.167,1121.675,2418.19,0.1425,0.7127,1],[7645,2729.387,1229.021,2428.09,0.1478,0.7622,1],[7645.5,2713.894,1115.066,2441.84,0.1546,0.6768,1],[7646,2741.033,1122.484,2416.35,0.1473,0.7328,1],[7646.5,2792.001,1157.233,2438.38,0.1367,0.7171,1],[7647,2778.291,1141.03,2426.57,0.1371,0.7765,1],[7647.5,2679.548,1160.007,2432.27,0.1307,0.741,1],[7648,2786.62,1170.681,2416.34,0.1637,0.8096,1],[7648.5,2778.073,1157.814,2417.97,0.1416,0.7339,1],[7649,2743.846,1177.345,2416.89,0.137,0.6772,1],[7649.5,2798.045,1172.244,2431.12,0.1611,0.7172,1],[7650,2776.367,1167.893,2415.03,0.1537,0.7833,1],[7650.5,2734.947,1194.863,2403.85,0.1605,0.7574,1],[7651,2740.953,1174.191,2415.69,0.1489,0.7669,1],[7651.5,2772.002,1169.899,2391.09,0.1435,0.7156,1],[7652,2838.965,1160.693,2400.59,0.1505,0.6884,1],[7652.5,2718.848,1185.346,2423.61,0.1689,0.6825,1],[7653,2811.504,1106.838,2431.47,0.1524,0.7483,1],[7653.5,2761.751,1168.432,2430.62,0.1448,0.7609,1],[7654,2761.732,1178.995,2420.38,0.1416,0.7122,1],[7654.5,2898.915,1153.496,2428.68,0.1629,0.6997,1],[7655,2701.849,1235.818,2422.5,0.1421,0.7438,1],[7655.5,2812.437,1199.557,2426.23,0.1529,0.8278,1],[7656,2724.495,1115.418,2418.98,0.1491,0.7268,1],[7656.5,2791.186,1152.177,2434.79,0.155,0.8302,1],[7657,2763.198,1138.007,2432.55,0.1265,0.6661,1],[7657.5,2749.513,1117.15,2421.95,0.1613,0.6763,1],[7658,2813.223,1176.883,2435.49,0.1557,0.7635,1],[7658.5,2831.444,1125.331,2408.9,0.1471,0.7957,1],[7659,2787.602,1146.477,2417.79,0.1375,0.7347,1],[7659.5,2763.276,1220.249,2409.27,0.1465,0.737,1],[7660,2790.174,1158.621,2394,0.1434,0.7472,1],[7660.5,2773.748,1178.849,2425.92,0.1579,0.712,1],[7661,2798.736,1126.27,2425.69,0.1585,0.7487,1],[7661.5,2810.719,1171.26,2449.32,0.1358,0.7104,1],[7662,2739.219,1127.835,2447.27,0.1441,0.7055,1],[7662.5,2774.479,1186.719,2398.18,0.1369,0.7654,1],[7663,2750.294,1180.786,2421.62,0.1406,0.7187,1],[7663.5,2798.623,1152.165,2445.03,0.1406,0.7895,1],[7664,2740.737,1149.959,2429.33,0.1563,0.7205,1],[7664.5,2759.628,1132.916,2402.78,0.1386,0.7078,1],[7665,2779.757,1105.607,2423.85,0.1517,0.7457,1],[7665.5,2779.434,1176.659,2430.51,0.157,0.736,1],[7666,2763.31,1173.177,2418.63,0.1514,0.7589,1],[7666.5,2693.634,1163.267,2421.81,0.1514,0.7587,1],[7667,2773.351,1094.767,2426.24,0.1499,0.7559,1],[7667.5,2716.234,1125.276,2455.48,0.1616,0.7399,1],[7668,2803.687,1147.366,2416.58,0.1443,0.7016,1],[7668.5,2712.576,1183.734,2423.37,0.159,0.7495,1],[7669,2775.137,1167.166,2418.91,0.1651,0.753,1],[7669.5,2702.583,1144.728,2406.42,0.1605,0.7009,1],[7670,2771.221,1139.303,2428.93,0.163,0.7427,1],[7670.5,2807.788,1135.524,2396.94,0.142,0.6755,1],[7671,2740.065,1163.026,2432.85,0.1539,0.732,1],[7671.5,2871.463,1146.932,2444,0.157,0.748,1],[7672,2765.742,1145.66,2415.29,0.1638,0.7127,1],[7672.5,2739.778,1125.403,2435.5,0.1532,0.6648,1],[7673,2772.92,1170.547,2432.84,0.1629,0.7497,1],[7673.5,2771.098,1133.333,2431.74,0.1419,0.7377,1],[7674,2803.759,1146.798,2432.74,0.1332,0.6909,1],[7674.5,2766.484,1239.55,2434.05,0.1632,0.6787,1],[7675,2784.82,1156.159,2417.87,0.1517,0.7353,1],[7675.5,2774.233,1137.457,2434.15,0.1505,0.7835,1],[7676,2773.33,1169.696,2443.8,0.1576,0.7366,1],[7676.5,2718.642,1183,2422.78,0.1489,0.7448,1],[7677,2774.296,1208.187,2390.4,0.1487,0.7072,1],[7677.5,2817.933,1092.885,2400.13,0.1601,0.7687,1],[7678,2732.715,1153.092,2413.34,0.1546,0.7292,1],[7678.5,2762.732,1189.786,2429.73,0.1565,0.7877,1],[7679,2795.062,1172.794,2414.15,0.1466,0.7701,1],[7679.5,2754.053,1151.467,2459.67,0.137,0.6907,1],[7680,2766.788,1189.419,2412.66,0.1527,0.7397,1],[7680.5,2817.038,1153.086,2420.53,0.1442,0.8233,1],[7681,2865.132,1139.793,2427.81,0.1344,0.7844,1],[7681.5,2723.629,1079.809,2407.09,0.1424,0.747,1],[7682,2868.055,1107.145,2417.56,0.144,0.7311,1],[7682.5,2706.551,1036.316,2426.4,0.1553,0.712,1],[7683,2792.507,1142.635,2427.56,0.1371,0.7358,1],[7683.5,2783.699,1132.463,2440.92,0.1432,0.8061,1],[7684,2803.794,1176.035,2457.59,0.1451,0.7573,1],[7684.5,2874.89,1147.983,2421.87,0.1701,0.6549,1],[7685,2756.394,1161.259,2433.1,0.1346,0.6994,1],[7685.5,2718.55,1193.556,2437.79,0.1628,0.7438,1],[7686,2730.436,1149.778,2443.43,0.1399,0.6907,1],[7686.5,2808.96,1185.364,2465.13,0.1428,0.7592,1],[7687,2826.701,1118.527,2420.54,0.1615,0.7682,1],[7687.5,2803.357,1144.957,2427.66,0.1528,0.7782,1],[7688,2738.838,1133.899,2408.56,0.1447,0.6782,1],[7688.5,2786.066,1176.406,2402.99,0.148,0.801,1],[7689,2725.658,1114.419,2450.49,0.17,0.7887,1],[7689.5,2827.632,1082.905,2446.57,0.137,0.7607,1],[7690,2834.327,1164.395,2433.15,0.1718,0.7609,1],[7690.5,2734.095,1140.777,2433.42,0.1521,0.786,1],[7691,2820.902,1126.07,2440.35,0.1458,0.7198,1],[7691.5,2727.963,1176.384,2417.56,0.1456,0.8005,1],[7692,2748.115,1158.288,2436.94,0.1315,0.6918,1],[7692.5,2797.288,1167.419,2410.6,0.1565,0.7133,1],[7693,2817.099,1152.336,2432.65,0.1412,0.7627,1],[7693.5,2756.896,1172.495,2411.87,0.1466,0.7429,1],[7694,2756.764,1158.205,2458.67,0.1434,0.7623,1],[7694.5,2729.273,1117.194,2409.49,0.1492,0.778,1],[7695,2774.79,1122.28,2417.67,0.1615,0.834,1],[7695.5,2766.908,1170.362,2411.19,0.1457,0.7177,1],[7696,2769.541,1137.271,2436.37,0.1552,0.7174,1],[7696.5,2734.861,1135.874,2440.14,0.1537,0.7396,1],[7697,2788.005,1179.384,2439.88,0.1512,0.7495,1],[7697.5,2774.128,1182.645,2449.78,0.1519,0.6569,1],[7698,2792.937,1191.328,2422.76,0.1717,0.7281,1],[7698.5,2753.967,1157.544,2445.4,0.1459,0.8209,1],[7699,2698.37,1152.232,2402.8,0.1445,0.7238,1],[7699.5,2809.364,1136.177,2418.26,0.1584,0.7413,1],[7700,2786.752,1110.455,2416.08,0.1657,0.6743,1]]},"conditions":{"tF":195,"pPsia":3650,"salinity":0.05,"api":28,"gorScfStb":520,"gasSg":0.7},"stated":{"taper":0.1,"netSandVshCut":0.35,"shearForm":"linear","trendBlockFt":16,"shaleAboveFt":65,"substitutionSampleFt":7561.5,"minerals":"quartz and clay by Voigt-Reuss-Hill on Vsh","poreFluid":"brine and oil by Wood at the sample Sw"}}'::jsonb;
  v_case_i jsonb := '{"case":"QUARVIN","tier":"intermediate","synthetic":true,"description":"A held-out synthetic prestack case written for the Professional capstone: one NMO-corrected CDP gather with its RMS velocity table, and the modelled and seismic intercepts and gradients at four wells, Quarvin-1 to Quarvin-4. None of it is the Ekene field.","velocity":{"columns":["t_ms","vrms_m_s"],"rows":[[0,1500],[420,1820],[880,2140],[1310,2385],[1720,2590]]},"gather":{"nmoCorrected":true,"dt_ms":2,"t0_ms":1100,"samples":201,"offsets_m":[100,250,400,550,700,850,1000,1150,1300,1450,1600,1750,1900,2050,2200,2350,2500,2650,2800,2950],"muteAngle_deg":38,"traces":[[0.622677,-0.857102,-0.068742,1.505196,1.604492,1.945837,-0.257558,-0.224354,1.175412,1.477462,2.099729,2.350876,2.870702,1.601425,-0.041079,-2.871983,-2.976946,-5.333859,-2.569375,-4.468119,-2.974056,-2.048376,0.833325,1.316882,1.654027,-1.037805,-0.494203,-1.314458,-0.08416,0.778164,1.680451,3.831974,5.784041,6.514887,5.465433,4.371979,2.667034,3.031107,5.354682,6.464738,10.984272,14.612792,18.486193,15.283926,6.101903,-5.800949,-23.812765,-37.021495,-42.209652,-40.719202,-27.594204,-10.333416,2.389977,12.303925,18.480056,16.864173,14.655327,11.121578,7.870394,4.656986,3.540837,2.706324,2.983337,4.055587,2.357419,0.710168,-1.473359,-4.773456,-3.138927,-3.955198,-4.54683,-4.919596,-5.129793,-3.399753,-3.795921,-3.834324,1.017627,2.200412,-0.200769,1.791644,-0.683812,0.506001,1.657413,1.88276,4.344329,5.73859,4.729215,3.536032,1.865301,2.980356,-2.631763,-1.652705,-2.332029,-2.036516,-1.008985,1.204763,-0.888058,-0.56711,-1.782531,-2.794815,-6.699514,-11.119164,-14.402668,-21.482644,-28.787443,-35.036218,-33.497057,-26.808706,-7.410631,19.838671,50.462733,74.528399,82.274327,73.707046,47.069369,18.747797,-10.854038,-28.677483,-35.363707,-34.01455,-27.619439,-20.077805,-12.802784,-7.601458,-4.525115,-1.527773,-0.30441,-0.144842,-1.979396,-0.89058,-0.729343,0.419827,2.358791,5.030122,10.96808,15.5665,20.875956,25.885973,28.631147,22.329469,7.466929,-15.185995,-36.360192,-55.37644,-59.865394,-51.807298,-35.604708,-13.971486,6.430435,19.664927,23.837854,21.757583,19.729677,13.284395,8.262158,4.699468,2.266667,2.130931,2.0051,1.256183,2.688211,2.060887,0.757227,2.109309,0.620089,-4.837458,-8.291669,-12.972629,-19.431988,-21.682499,-22.113749,-17.780867,-5.933831,12.480316,29.942727,44.46924,49.066722,43.953693,29.641199,10.808152,-5.492731,-18.462744,-24.744334,-22.274531,-18.230353,-10.432606,-6.270473,-3.7419,-4.13598,-1.397562,-0.23713,-1.206804,1.338221,-0.083639,-0.607087,1.374911,-0.604311,1.245917,-1.384671,-0.725837,0.454585],[1.259595,2.961657,4.721607,7.682461,10.634954,9.044847,6.36789,2.694701,1.080297,-4.081018,-7.9444,-8.520943,-9.941688,-9.655118,-7.516756,-5.660552,-1.522031,-1.887517,2.307222,2.937021,5.703452,6.69778,4.674862,2.937763,0.575894,-0.474232,-1.972326,-0.925056,-0.89064,0.175378,0.447294,-0.225624,-0.175072,0.872071,0.23185,0.490968,-0.273033,2.442179,3.577131,9.535804,14.835919,18.537712,20.395856,16.126031,5.388469,-7.48529,-24.032633,-39.14677,-43.147313,-38.534512,-26.504384,-9.9695,6.710593,15.708672,18.948778,17.467228,16.253945,10.328334,9.095195,1.674159,1.882289,3.332917,2.12096,-0.059893,0.035716,-0.166144,-0.67614,-3.333141,-2.626767,-1.212981,-0.716572,0.285935,0.485496,2.081743,1.637437,0.282209,-0.221608,0.793524,0.512995,-1.503745,-1.303388,-0.655944,3.096877,0.420525,3.031915,0.192181,0.236277,0.235973,-0.438934,-0.713874,-2.274151,-1.675212,-2.15458,-2.915899,-1.292185,0.0251,-2.423527,1.419635,1.173346,2.500213,-0.524328,-3.364181,-9.563829,-19.533708,-27.61787,-35.552476,-36.591192,-30.219468,-9.967771,17.168169,48.622817,70.575141,78.907971,73.014829,47.98936,19.12189,-10.886806,-27.82505,-36.750103,-35.725901,-28.036473,-19.064156,-11.808547,-6.403695,-2.526598,-0.676507,-0.5535,2.116326,-1.426908,0.848747,0.50884,-0.220479,0.959864,5.343096,9.466546,16.113708,19.447902,24.338022,27.236828,21.055281,7.257574,-13.522735,-35.312972,-55.410267,-61.169176,-53.668363,-37.014419,-13.525846,3.966906,20.645328,27.165809,25.25902,22.532525,18.008014,11.429854,8.199375,6.561696,3.589507,1.103032,-1.416805,-1.359762,-2.707086,-4.873744,-4.816298,-7.561515,-5.264305,-8.226359,-9.368696,-11.481204,-15.910503,-17.800899,-14.392251,-3.913753,10.476731,29.358356,45.227876,51.808821,43.498518,30.882248,10.349337,-6.829313,-18.042059,-24.257728,-22.989121,-18.911236,-16.791271,-9.148719,-5.404052,-2.24461,-1.184032,3.007587,2.942296,1.713839,0.929342,0.301689,-0.715638,0.074338,0.345728,-1.624366,-0.305322,-0.365928],[4.803685,3.942627,2.566467,0.769107,-1.293229,1.273038,-2.612758,-1.240688,0.577967,-0.032724,1.172503,0.994825,0.509855,-0.051565,-4.668529,-3.215308,-4.084364,-4.481897,-3.584728,-2.305343,0.560142,1.761457,1.778877,1.00317,1.923315,3.054335,1.552758,2.635107,2.026496,0.998129,-1.639404,-1.113629,-1.255511,-2.566407,1.045188,0.925142,1.689026,3.063278,7.342475,11.3345,14.23352,17.928729,17.267654,14.752139,4.69882,-9.652655,-24.207291,-37.684329,-43.253197,-38.677378,-25.842202,-9.526456,4.248111,15.212796,18.254622,18.419278,13.579605,9.76069,7.922487,3.909677,2.887974,2.127443,1.372849,-0.798363,-0.915585,0.643997,1.731693,-1.609823,0.232343,1.348755,0.605465,-0.035415,-0.243503,-0.459658,0.322749,0.210844,0.053633,0.263273,-0.836972,1.099705,-0.266733,-1.256675,-0.006061,1.325198,-0.860545,-0.348936,0.589098,1.201704,-0.989068,0.239164,-0.429499,0.380113,-1.446897,0.482468,-0.449973,-1.154626,-0.866552,0.891325,-0.696562,-1.444391,-3.905933,-5.488779,-10.050897,-19.9999,-28.557022,-34.62141,-36.215475,-28.228748,-9.558141,18.356866,50.038362,72.904505,82.790323,74.646562,50.545206,19.186799,-9.108662,-28.122246,-36.921586,-36.223153,-27.518243,-18.240203,-11.638298,-6.552387,-3.990109,-0.791005,-1.271636,-0.535451,0.008017,0.009426,1.500114,1.621654,4.85963,7.937458,10.58692,17.100258,22.430497,27.245992,26.848621,21.253143,6.322711,-13.988491,-36.985693,-54.367985,-63.239987,-55.686147,-39.175922,-15.500341,6.899555,22.64432,27.280206,25.877546,22.768356,16.618841,9.980668,5.7723,2.994968,0.60141,-0.019104,0.584396,2.233874,0.976944,0.909705,0.576623,-1.137278,-5.324525,-8.905281,-15.678635,-18.794838,-20.296192,-22.058621,-17.448528,-3.87174,11.161603,30.406534,45.787593,51.745533,45.344429,31.202469,11.618931,-5.871844,-17.632772,-21.904313,-20.513561,-16.934436,-11.832067,-6.987677,-2.504538,-1.917692,-0.106741,-0.109588,0.243899,-0.636214,-0.26131,-0.453557,0.343977,-0.527938,-0.786255,-1.202355,-0.400529,0.599943],[0.186926,-0.656726,-1.267203,-0.097496,-0.833771,-0.675992,-0.734209,1.195084,0.797533,1.336881,0.045408,-0.370757,-0.332565,-0.061108,-1.958597,-1.215508,-1.193987,-1.876412,-2.997637,-3.818785,-5.18015,-1.366734,1.177046,0.134221,0.633377,1.472055,2.358785,1.279458,2.788715,5.628561,8.151136,9.224615,9.194446,6.766038,1.770017,-2.807476,-4.367846,-5.791292,-1.900833,3.006455,10.048705,13.680184,19.50934,15.350551,6.760602,-8.369323,-24.163451,-35.168171,-41.164366,-37.211066,-24.874407,-9.936693,4.827037,14.569102,18.860029,18.218772,13.930396,8.688608,7.360861,4.925508,1.301634,0.649779,0.530177,-0.822566,0.043365,-0.108973,-2.592483,-1.570305,-1.842846,-2.144625,-2.079566,-2.910851,-1.579378,-0.279914,3.729864,5.388763,6.541668,4.990698,2.305485,2.399445,-2.06167,-0.746178,-2.091452,-3.077287,-1.171351,-1.593914,-0.08924,1.1687,1.477507,1.303601,3.73294,3.843996,-0.93935,-0.607357,-3.410362,-5.087604,-6.407121,-6.804101,-4.537052,-3.028595,-1.596284,-0.512425,-3.722863,-8.604401,-17.020268,-27.918163,-29.418372,-24.047657,-9.172167,14.63656,40.561564,61.962591,69.213368,61.300944,39.209403,10.347915,-15.104144,-30.979476,-36.386768,-32.77216,-21.602032,-9.894204,-2.716035,2.795591,5.208218,3.274107,0.205899,-0.227043,-3.711686,-2.689455,-1.66208,-0.618302,2.012526,4.713016,9.07429,15.144063,21.209263,26.903651,29.421321,22.729744,8.215553,-14.888713,-39.493185,-57.981532,-65.704125,-57.314705,-37.869576,-16.517271,6.097072,21.98211,28.222118,26.252178,21.06903,12.586169,10.484544,6.067807,1.789106,0.928224,1.712122,-0.277111,-0.369245,0.835531,-1.467909,-1.97303,-3.798471,-7.997682,-10.561362,-13.927127,-20.123079,-22.622283,-21.01891,-11.104278,0.694504,17.429196,34.029751,45.747212,50.288493,43.570859,27.365777,8.664955,-8.259574,-20.110365,-25.464217,-20.104814,-17.155769,-11.797684,-7.918366,-4.669463,-1.177025,-0.907191,-0.171021,-0.633642,0.307347,-0.411648,-0.303146,0.998738,-0.613435,0.446791,1.274247,-0.3294,1.104162],[0.695791,0.295978,-0.710745,-1.108558,0.527218,-1.351918,-0.674473,-0.895195,0.055765,0.228622,-0.447198,-0.675871,-0.429497,0.704433,-1.61856,-2.263689,-2.524325,-2.102886,-3.037442,-1.484217,-1.106769,1.250994,4.484261,4.032518,3.994565,4.80282,2.685054,1.882089,0.53165,0.603558,-1.307419,-1.856249,-3.596926,-2.313618,-1.037889,-1.147123,0.834355,4.298228,5.359489,9.29607,12.363226,17.978886,16.996959,13.515313,4.97128,-8.976612,-25.140908,-36.689499,-42.557209,-36.653589,-27.004363,-12.658863,1.401491,12.071139,16.894209,19.93458,18.120412,16.278922,13.075666,8.20053,4.854731,3.035053,2.840885,4.819036,2.350961,1.788478,-0.122659,-2.343954,-4.597441,-6.170702,-6.059755,-3.875462,-2.378024,-0.277056,0.695345,2.437558,2.803038,1.802247,0.38458,1.011972,1.840514,-0.153372,0.831935,0.404205,-0.415013,0.69614,-1.435804,0.80409,-0.184644,-0.417643,-0.321437,-0.944737,1.112229,0.356167,-0.639241,-0.003726,-0.070483,0.772533,-0.175103,-0.946778,-1.665799,-5.543968,-9.304074,-14.895012,-22.960957,-28.49791,-28.202054,-23.178517,-8.847542,13.964445,38.904818,57.279682,63.259496,57.268467,38.615674,13.372375,-9.492334,-22.756584,-29.898182,-25.36949,-19.346391,-13.649386,-6.718355,-5.75768,-1.171937,-1.738888,-1.421627,-1.408793,-1.928563,-1.736471,-3.504632,-1.282739,1.797301,3.12971,8.565332,14.94573,22.958789,28.091469,29.51408,25.557733,7.724373,-16.933814,-38.662662,-58.662654,-67.637899,-58.030262,-40.294465,-16.275309,7.691383,24.470099,28.502629,27.519063,23.367196,14.8627,9.887758,5.366675,3.414661,1.806634,1.43374,0.795359,0.367833,1.731,-0.679423,-1.060046,-1.034503,-5.139725,-8.06492,-11.894884,-15.809184,-21.393722,-24.679808,-18.290331,-5.788998,11.274233,29.687314,45.623666,50.032925,48.251118,31.972967,13.460383,-5.556776,-17.982727,-23.799299,-24.259864,-18.759843,-13.748567,-6.870068,-3.026366,-0.098558,1.874158,2.695008,4.426277,3.968554,1.963883,2.053567,2.17581,-1.387913,-1.012466,-3.475673,-1.304301,-2.768751],[-1.230648,-0.612384,0.020168,-0.245178,0.378765,0.601819,2.643338,2.513541,0.831323,-0.242217,-0.717788,-1.638895,-4.56017,-6.064537,-4.12932,-3.065584,-0.518492,2.936243,1.620255,1.504681,3.195631,0.295843,0.624679,1.290544,1.088571,1.277025,1.630575,2.603529,0.231691,0.879747,-0.707962,-3.08132,-1.24403,-2.656731,-3.422931,-1.145138,-2.065262,0.801113,3.39988,7.111862,11.337014,14.483485,16.144531,14.447446,9.102136,-2.679685,-17.530688,-27.788589,-33.361076,-31.71818,-22.194978,-10.800591,1.235623,9.451226,13.768528,12.376835,7.752156,4.897423,1.558309,2.851841,3.638467,4.792269,4.419239,5.386183,4.579976,2.362613,1.093955,-2.475928,-4.02457,-3.423407,-3.961872,-2.631262,-1.791766,2.0018,1.521291,1.480614,1.974202,1.935682,0.502729,0.085375,0.950881,2.32645,2.288747,2.014501,3.852443,2.986565,1.255218,-1.192648,-1.965856,-3.678489,-4.190385,-3.836569,-4.733055,-1.086519,-1.079601,1.411696,0.128384,1.006707,1.479875,-0.883042,0.005759,-2.585525,-7.096798,-12.216985,-18.303865,-22.894744,-23.857436,-18.287865,-7.535516,13.241814,33.399091,47.474796,54.5499,48.489375,32.647644,12.725326,-5.57629,-18.45703,-23.170065,-23.512676,-18.681682,-13.653603,-9.780151,-4.649172,-3.057455,-0.839691,0.020172,0.805173,0.489633,1.347011,-0.209584,0.873793,3.2934,4.935876,10.787179,16.563687,22.091601,30.218217,29.930101,23.747911,7.776806,-16.899304,-43.31918,-65.465318,-71.148221,-61.773755,-40.447522,-13.390477,11.006298,30.121332,36.843183,32.240207,24.938253,15.093297,8.932098,2.566514,0.388855,-0.439573,-1.114122,-0.71552,-0.719692,-1.275922,0.094255,-0.276767,0.775093,-0.95465,-4.776295,-9.779064,-16.141746,-23.219666,-25.778358,-22.136903,-10.360217,10.560322,30.078778,46.111101,53.547283,46.879565,32.875824,12.469753,-6.51221,-20.028186,-22.386895,-21.960799,-17.829516,-13.829847,-6.703174,-4.821666,-3.518278,-1.034074,-2.047497,-1.665019,-1.62969,-0.285789,-2.271273,-0.978561,-0.630075,2.260001,2.080223,1.906204,3.502236],[-1.737708,-0.674844,-1.439516,-2.821882,-2.4843,-3.621501,-2.633177,-0.471231,1.710516,4.559142,3.932661,4.837868,4.976157,3.194515,1.432671,0.761479,-0.826719,-1.414318,-2.914197,-1.642243,-2.478692,-1.467772,-2.819719,-0.961319,-1.637664,-2.574126,-1.518242,-2.883721,-2.650026,-2.225724,-0.193004,0.661968,3.257927,5.873413,5.838639,5.566255,4.80469,4.708188,5.144562,7.922185,8.832182,12.018892,13.973852,10.696571,3.981601,-8.663827,-21.302336,-30.345568,-34.178309,-29.864169,-21.186445,-6.363062,6.909709,13.766828,14.42223,15.84189,11.053148,6.979898,1.378004,-1.108269,-1.670896,-1.185165,-0.908154,2.870228,3.231889,3.207168,3.290978,2.50719,1.256814,-0.700652,0.100354,-1.289628,-2.118943,0.919596,0.217588,-0.387386,-0.005945,1.797356,2.561925,1.878468,1.113677,2.501993,0.687678,0.718947,-0.47365,-3.633848,-4.160702,-3.167216,-4.93472,-2.812932,0.046514,0.214675,2.906944,1.980408,2.067591,1.40264,0.653196,0.116168,-0.855899,-2.741999,-2.137139,-3.984974,-8.08676,-11.171817,-15.244942,-18.841291,-20.888013,-15.825693,-4.757683,10.66107,28.130981,42.929256,49.150065,42.68287,27.584054,10.315443,-6.13912,-17.135983,-19.751114,-20.871373,-17.308283,-11.451409,-7.794887,-4.065328,-0.744658,-0.211823,0.305584,0.92736,0.668626,-0.537528,-0.371805,1.40648,3.261003,4.02696,9.68427,14.585597,23.368636,26.787628,29.688868,23.40201,8.74,-14.440317,-41.252746,-61.888132,-71.04198,-64.446769,-45.132835,-19.539189,3.441048,20.648565,29.141883,31.608222,28.556015,21.198159,17.132789,12.583211,7.00387,3.218224,-0.060954,-2.379287,-3.532322,-1.79025,-1.159938,-1.811549,-3.120924,-4.711834,-7.887064,-13.967589,-17.745723,-22.007614,-22.863803,-18.904655,-6.01014,11.665883,33.910606,47.226265,52.704911,47.698616,31.508568,11.929885,-7.000305,-18.199989,-23.706688,-23.583117,-19.974886,-14.642545,-10.695515,-9.004095,-4.779813,-1.626433,-0.434527,0.875376,2.5704,4.053502,4.457056,5.872279,3.708743,4.326596,3.649719,2.877948,1.525023],[0.430413,0.068545,0.59485,0.060239,1.344879,1.421926,1.743146,1.095466,2.577054,3.54545,2.069249,1.518863,-0.758513,-4.927135,-6.344837,-7.368493,-6.726368,-4.088734,-0.280819,-0.808703,1.770093,2.412175,2.196871,2.406436,1.829878,2.574302,3.898409,2.888349,3.509656,1.562835,-0.960485,0.11916,-0.919514,-1.483668,-0.917613,-0.030942,-0.401555,3.166171,4.734367,7.393947,11.710122,15.425663,15.535019,13.644782,4.764283,-6.109363,-18.958989,-29.245209,-33.191576,-31.207304,-23.428135,-10.534049,1.750949,9.534387,14.769584,16.299727,12.826817,10.14894,6.380472,3.330282,-3.27522,-4.984104,-6.692109,-5.202237,-2.940625,-0.706849,2.405179,4.490986,7.516397,5.348039,3.226533,-0.412112,-1.581797,-4.521914,-3.898546,-2.328935,-1.177066,1.682872,3.07118,4.928028,3.951388,2.103113,0.375426,-0.753787,-3.591699,-2.184404,-2.671393,-1.571167,-0.824787,0.427444,-0.360432,-0.751213,0.336293,0.700852,0.914583,1.540681,3.101302,1.702371,2.285128,-0.267682,-3.607247,-7.769407,-9.660965,-15.117615,-17.827353,-18.477616,-18.112312,-12.440719,-2.108059,11.066257,25.073059,35.435089,38.630667,34.521776,24.306472,9.36169,-4.72917,-11.965808,-17.150595,-15.683641,-11.454456,-7.061434,-5.657744,-1.466105,0.039739,-0.730165,0.217419,-0.009929,-0.558486,0.678132,1.90717,2.565136,3.401188,7.145692,9.961342,16.415616,22.818974,30.16913,30.267824,26.451789,9.965371,-14.733737,-45.180182,-65.969727,-75.726568,-66.615416,-44.947873,-18.810833,9.707712,26.848309,34.844515,32.312972,25.766956,16.441295,9.076343,6.498908,2.967664,2.459917,2.469755,1.222185,2.085771,1.451024,0.384991,-1.601065,-3.082605,-5.675193,-8.587543,-13.619436,-19.443426,-23.178868,-23.665232,-18.157091,-7.150398,11.204947,32.689728,49.135047,54.196995,50.832276,32.59881,13.585754,-6.772928,-20.135884,-23.619032,-22.714785,-18.827418,-13.162756,-6.080246,-5.195636,-1.96193,-0.933878,0.35971,0.16684,-1.567878,-0.329484,-0.562313,1.798618,-1.461801,0.795193,0.181757,-0.04701,-0.451011],[0.380664,0.554641,-0.018725,-0.241707,-0.966078,1.09455,-0.203797,-0.670936,-1.428963,-0.075245,-0.982275,1.486016,0.15489,2.413871,0.304603,1.432435,0.742098,-0.204618,-0.523702,-1.344636,-1.138744,-0.70265,-2.091025,-0.868464,-3.03102,-1.395288,-2.060876,1.189621,1.456355,3.279208,4.707897,5.25835,2.548682,3.257631,-0.727421,0.153587,-0.001486,2.272882,2.476298,5.771645,7.784346,12.596408,11.864671,10.186859,2.092438,-7.202252,-18.214222,-27.452801,-29.442917,-26.777221,-16.635289,-6.380317,1.901144,9.599406,12.623819,13.450587,10.009965,5.243815,4.504814,2.756199,0.417482,2.036424,2.426642,1.970155,2.070032,-0.381436,-0.110865,-0.775968,-0.967965,-1.299769,-1.081173,-3.378446,0.241473,0.378349,1.051801,-0.198733,-0.997357,1.647517,0.901996,-0.326274,-1.380098,-1.642161,-1.717043,-1.926619,-3.945038,-3.331622,-1.797124,-1.469739,2.787612,3.849515,8.3602,8.012047,5.429097,4.114508,1.013281,-1.195072,-2.751025,-3.721018,-3.050949,-2.978275,-2.807335,-2.214746,-4.717354,-5.634376,-7.699941,-7.886498,-9.374551,-8.132584,-2.642703,5.218823,13.229933,19.881518,23.551635,19.204252,11.457312,3.331843,-5.347363,-9.282565,-9.935582,-10.234276,-6.782019,-4.196287,-4.084774,-1.495736,-0.23099,-1.057935,-0.940334,0.104186,1.394194,0.035759,0.570408,2.43724,3.243737,7.193892,11.57839,19.804594,27.165468,34.962812,34.642859,27.326127,8.246466,-18.831366,-47.972693,-70.248786,-78.120217,-68.986666,-43.920004,-15.11976,11.247411,28.309088,36.114516,33.267895,25.407052,15.782987,8.086957,5.115757,1.608387,0.99839,1.824697,2.109822,2.24919,0.64164,2.406702,1.931202,-0.309136,-2.677255,-8.797055,-15.192209,-22.664341,-28.02797,-29.463165,-22.552542,-8.31712,13.177937,35.809593,52.49625,58.960686,52.083338,33.626327,14.168266,-7.038474,-20.029673,-24.973511,-24.28641,-18.326762,-15.152064,-8.573854,-4.766269,-3.050102,-2.873083,-1.637257,-0.953318,0.006815,2.416682,2.788222,2.99463,2.427962,2.200875,0.232798,-1.175746,-0.797729],[0,0,0,0,0,0,0,0,-0.115445,0.549315,0.507547,1.991325,1.302791,0.892438,1.770972,1.823554,-0.213919,-0.456131,-2.957979,-2.294304,-3.522402,-1.134076,-2.374105,0.111062,1.959845,1.022159,1.768909,-1.173538,-2.125018,-3.863889,-2.27022,-0.870903,-0.966032,-1.144684,1.004013,1.749562,1.846583,2.954879,3.990749,5.90551,8.217731,9.148438,10.201016,8.343145,2.949317,-5.205178,-12.773332,-17.822962,-19.727584,-16.242091,-11.887149,-5.561311,0.432099,3.64889,4.7719,6.834715,6.059756,6.886604,3.915969,2.696233,3.679008,1.104897,0.616647,0.836104,0.779378,1.268583,1.880957,0.407391,1.565725,1.678904,-0.072675,0.132972,0.334236,-0.142835,-1.005566,-2.265259,-1.677728,-1.537902,-1.74391,-2.294889,-0.629206,0.818481,3.383739,5.300505,5.72723,4.821072,2.960396,0.436725,-1.148705,-1.789316,-1.567903,-2.23989,-1.810857,-0.84108,1.04075,0.3853,1.535713,1.251355,1.088245,-1.57681,-2.76532,-4.072985,-5.668168,-6.637763,-7.913973,-7.902026,-7.360748,-6.883781,-1.244654,5.25745,11.763842,15.970235,18.057736,16.133961,11.523371,3.040253,-3.605707,-5.575248,-8.140753,-7.65222,-5.751852,-5.447655,-3.269778,-1.72286,-0.785511,0.044745,1.551337,1.98625,3.120665,1.816907,0.74909,2.505543,5.078096,6.119158,11.709819,19.199732,28.113156,34.689052,37.70435,29.481795,9.198634,-18.924394,-50.504872,-73.908357,-83.061134,-74.122902,-50.672627,-17.853459,11.136816,30.23185,36.530014,35.073376,28.083731,21.246579,13.645806,8.069424,3.997244,2.342017,2.194236,0.388522,-1.054752,0.412396,0.229554,-0.542991,-2.64313,-4.208069,-8.204394,-13.287455,-18.848571,-25.334319,-25.327071,-20.164154,-6.441606,13.447372,34.720769,50.259344,57.880492,49.638172,34.2827,13.140782,-5.465042,-20.940161,-25.375823,-23.986659,-20.474168,-14.369102,-9.367279,-4.763227,-4.071153,-1.435121,-1.043231,-1.384906,-2.670693,-1.716191,-0.084577,0.665966,4.362078,4.307054,5.556874,4.219871,1.601209],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7.868416,7.613477,2.55705,-4.170268,-13.245381,-17.921296,-22.584951,-20.527388,-12.800795,-4.429358,1.766486,8.17688,10.254351,9.816112,8.756361,6.878951,4.885344,3.650251,3.23821,0.913213,-1.614508,-3.51767,-4.67373,-6.905029,-6.234002,-2.628575,-4.125995,-1.621321,-0.662894,0.275829,2.900804,3.455718,4.69015,5.25899,3.503178,4.461439,2.140124,1.40964,-0.438824,-2.322862,-1.987902,-2.513671,-0.713264,-1.298724,-0.954191,0.087051,-1.670646,0.506541,-0.955812,0.43607,1.078746,0.944841,-0.130514,0.198767,0.004555,0.762069,-1.320273,0.628888,-0.936049,0.184881,-0.272392,-0.444383,-0.332159,-3.050234,-3.631968,-2.045054,-0.468593,1.971824,3.749787,4.720628,6.060824,5.2475,3.063991,2.130373,-0.21872,-0.462014,-2.612061,-3.177766,-3.404982,-2.71113,-2.638011,-3.604666,-2.902141,-1.289087,-0.205863,-0.243033,1.811993,4.427536,6.485971,7.000996,8.756451,11.761466,14.905082,19.840095,26.694699,34.590806,36.284906,27.91604,8.734288,-21.455167,-53.171819,-76.997956,-87.547817,-77.8303,-54.20137,-21.267771,7.936775,28.190389,36.530147,33.968197,28.365934,18.894144,12.527271,5.981217,3.470757,0.773876,0.913373,0.153172,-0.972824,0.211014,0.044167,1.391071,2.976481,-0.112207,-5.268634,-16.375274,-22.436356,-29.38157,-30.30183,-23.848025,-8.985773,13.516078,35.36685,51.167299,59.733673,52.384029,35.481179,15.492756,-6.248385,-20.813748,-26.212469,-25.527302,-19.007808,-14.021494,-7.965893,-5.142864,-2.194868,-2.328328,-0.758611,1.803032,-0.673339,0.1131,-0.28039,-0.311571,-1.196579,-0.674161,0.69832,-0.397067,0.961443],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1.101021,-0.836744,-1.163992,-1.881135,-1.857466,-1.057323,-1.255494,-0.42976,-1.701682,-0.709267,2.036314,1.846109,-0.080687,0.25115,1.461364,-0.776543,1.14322,1.775391,1.321898,2.137675,0.826508,-0.225636,-1.215551,0.226659,-0.72711,-1.235896,-2.032189,0.319291,0.327205,0.959482,0.369201,0.887025,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4.629413,7.522,14.211632,20.971657,32.50571,37.92215,42.241803,31.871783,11.203208,-21.673265,-56.334175,-81.84219,-92.679159,-81.927305,-56.295595,-19.83467,10.789139,32.102665,40.835423,37.702527,29.647618,21.762693,13.69921,7.790547,4.296471,1.209718,0.344722,-0.763876,-0.336337,-0.225117,-1.952624,-6.336156,-6.291344,-6.708508,-11.515119,-13.940711,-19.051867,-19.520129,-19.83676,-13.399664,-1.350713,18.839763,39.690064,53.920503,56.406146,50.936438,29.989821,6.965898,-13.113279,-24.339281,-29.250958,-27.116464,-20.367802,-11.378717,-7.493234,-1.596574,-0.699199,0.521223,1.802799,2.959546,1.497154,1.807301,-0.322598,-0.258641,-3.211553,-4.402643,-7.001294,-5.295062,-3.539952],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.289146,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-8.748279,-13.691126,-19.763293,-24.710105,-25.719299,-20.020501,-7.272796,13.442051,34.643914,51.437926,58.455794,51.734216,34.843247,12.852427,-8.030703,-21.790815,-28.366115,-26.607535,-20.734093,-13.722893,-7.598435,-2.437234,1.009345,3.225983,4.554634,3.333467,1.405201,-0.570284,-1.63456,-2.09658,-2.218675,-0.988811,-2.293212,-1.141236,-0.182304],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-0.543579,-0.275295],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]},"wells":[{"name":"Quarvin-1","modelled":{"A":0.0847,"B":-0.2213},"observed":{"A":95.1384,"B":-251.0472}},{"name":"Quarvin-2","modelled":{"A":0.1022,"B":-0.1786},"observed":{"A":118.6019,"B":-197.315}},{"name":"Quarvin-3","modelled":{"A":0.0611,"B":-0.2632},"observed":{"A":66.9047,"B":-301.8826}},{"name":"Quarvin-4","modelled":{"A":0.0938,"B":-0.1517},"observed":{"A":99.7742,"B":-180.2203}}],"stated":{"dixLayer":{"fromMs":880,"toMs":1310},"offsetM":1600,"timeMs":1324,"nmoVelocity":"the RMS velocity at the stated time","angleEdges":[5,15,25,35],"stackAngles":[10,20,30],"farBins":[2,3],"targetMs":1324,"shueyTerms":2,"oneScale":"least squares over A and B together, every well"}}'::jsonb;
  v_case_a jsonb := '{"case":"DELSHOLM","tier":"advanced","synthetic":true,"description":"A held-out synthetic case written for the Expert capstone: three wells, Delsholm-1 to Delsholm-3, with their low-passed impedance logs in time; a target trace with its full and angle stacks; calibration samples; and a depth grid over a trap. None of it is the Ekene field.","clock":{"t0_ms":1600,"dt_ms":4,"samples":120},"wells":[{"name":"Delsholm-1","x":11800,"y":10400,"horizonsMs":[1771.2,1807.2],"lnAiLowPassed":[15.6496195,15.6516174,15.6545306,15.656266,15.6562263,15.6565325,15.6566134,15.6585838,15.6583486,15.6586331,15.6612902,15.6631254,15.6659042,15.6660524,15.6652637,15.6666701,15.6678532,15.6692232,15.6703564,15.6721594,15.6736145,15.6754443,15.6764711,15.6735971,15.6739647,15.6737835,15.6766784,15.6791816,15.6792038,15.6782407,15.6788875,15.679288,15.6798396,15.6796195,15.679064,15.6809564,15.6846858,15.6809404,15.6762698,15.6701518,15.6639281,15.658006,15.6536386,15.6491245,15.6440352,15.6376605,15.6403703,15.6402135,15.6408956,15.640469,15.6468824,15.6530049,15.6601632,15.6686157,15.6756202,15.6810039,15.6879995,15.6950416,15.702336,15.7023388,15.7052916,15.7055286,15.7064837,15.7066345,15.7096815,15.7089709,15.7071768,15.7075995,15.7113406,15.7115052,15.7117692,15.7141305,15.7147273,15.7144955,15.7158217,15.7178515,15.7200472,15.7193107,15.7231462,15.726555,15.7269829,15.7258452,15.7258835,15.7274349,15.7281733,15.7285464,15.7298497,15.7308201,15.7317124,15.732348,15.7344146,15.7330638,15.7329369,15.7347539,15.736028,15.7383411,15.7384167,15.7393331,15.7397638,15.7407778,15.7420945,15.7427606,15.7423539,15.7412605,15.7424365,15.7435303,15.7451834,15.7458044,15.745996,15.7469841,15.7471529,15.7480731,15.7478073,15.7492091,15.7485695,15.7497811,15.7512902,15.7510208,15.751095,15.7488732]},{"name":"Delsholm-2","x":15400,"y":12600,"horizonsMs":[1722.08,1758.08],"lnAiLowPassed":[15.6516565,15.6509181,15.6509287,15.6523174,15.6545934,15.6552085,15.654711,15.6534789,15.6529726,15.6551962,15.6563938,15.6581166,15.6602604,15.6639555,15.6662678,15.6679072,15.6679295,15.6670077,15.667699,15.6688374,15.6714119,15.6746819,15.6729509,15.6733021,15.6740883,15.6636031,15.6508484,15.6398274,15.6284397,15.6186242,15.6071218,15.6052182,15.599326,15.5923643,15.5909105,15.5916149,15.5941682,15.5930341,15.6065552,15.6195625,15.6312573,15.6430618,15.655619,15.6688783,15.673407,15.6817061,15.6875341,15.6895431,15.6912983,15.6900045,15.6917823,15.692045,15.693236,15.6937814,15.695353,15.6951317,15.6959948,15.6967925,15.6971146,15.6992997,15.6988287,15.7012222,15.7030834,15.7033861,15.7015744,15.7031147,15.7046458,15.7075029,15.708923,15.7113308,15.7133122,15.7136275,15.7155937,15.7173641,15.7160617,15.7162587,15.7197921,15.721859,15.7220428,15.7240102,15.7219779,15.7232348,15.7232733,15.7218102,15.7232818,15.7223189,15.7232905,15.7261956,15.7280805,15.728776,15.7306088,15.7301704,15.729975,15.7315782,15.7322342,15.7318907,15.7330661,15.7356568,15.7380229,15.7384396,15.7373339,15.7387729,15.7403074,15.741175,15.7428773,15.7440699,15.745876,15.7460606,15.7474305,15.7498035,15.7506171,15.7507506,15.751618,15.7530854,15.7523635,15.751008,15.7513142,15.7520725,15.7523183,15.7521898]},{"name":"Delsholm-3","x":18200,"y":9800,"horizonsMs":[1780.32,1816.32],"lnAiLowPassed":[15.6579928,15.6573106,15.6589322,15.658972,15.658801,15.6586597,15.6586916,15.6582925,15.6603831,15.6603016,15.6589035,15.6594708,15.6594855,15.6592084,15.658886,15.6580789,15.6579769,15.658017,15.6597293,15.6615056,15.6623605,15.662724,15.6620033,15.6647672,15.6677954,15.6682743,15.6718176,15.6740512,15.6760494,15.6783525,15.6795896,15.6793454,15.678313,15.6802662,15.6832105,15.685152,15.6850611,15.684822,15.6867725,15.6869515,15.6827644,15.6775011,15.6726984,15.6677901,15.6633364,15.6594489,15.6550244,15.6484359,15.6442488,15.6460689,15.6474985,15.6469005,15.6475909,15.6555262,15.6621501,15.6668741,15.6738274,15.6807523,15.6863127,15.692842,15.6994671,15.705459,15.7077783,15.7080391,15.7106626,15.7116076,15.7098556,15.7108521,15.7122353,15.7137496,15.7150115,15.7183124,15.7189239,15.7206072,15.7227186,15.7207496,15.7216688,15.7224049,15.7234497,15.7249885,15.7260434,15.7287286,15.7293352,15.7311132,15.7297289,15.7304308,15.7294614,15.7289234,15.7298463,15.7295296,15.7297028,15.7308176,15.7315284,15.7329427,15.7337381,15.7340445,15.7342151,15.7336917,15.7353716,15.7374672,15.7395763,15.7414733,15.7435332,15.7445194,15.7442175,15.7444241,15.7443119,15.7430943,15.7433954,15.7439401,15.7495195,15.7484725,15.748827,15.7486534,15.748913,15.7489978,15.7498806,15.7499993,15.7518414,15.7522939]}],"positionB":{"x":13900,"y":9100,"horizonsMs":[1758.48,1794.48]},"traceA":{"x":16100,"y":11300,"t0_ms":1600,"dt_ms":4,"samples":120,"full":[0.00956755,0.00498906,-0.00442057,-0.00938548,-0.0145988,-0.01328855,-0.00706884,0.0093212,0.0188789,0.01894411,0.0040974,-0.0126345,-0.0274857,-0.01614471,0.00171332,0.00945898,0.01708983,0.00844686,0.01045889,0.00021942,-0.00344972,-0.00169965,-0.00829685,-0.00838637,-0.0018925,0.00969889,0.0342661,0.05704206,0.06852697,0.02056574,-0.05807592,-0.1371032,-0.15856716,-0.09477575,0.00426947,0.09771103,0.12137741,0.07689437,0.00281571,-0.01744617,0.00265854,0.03490052,0.03893014,0.00477883,-0.02454903,-0.03146593,-0.01920212,-0.00584064,-0.00195273,-0.01382489,0.00010945,0.01315235,0.01076618,0.0047324,0.00253,0.00072139,-0.0022768,-0.01128111,-0.0204668,-0.01892042,-0.00022719,0.01004398,0.01366391,0.01044379,0.00574891,-0.00275716,-0.02157019,-0.00970979,-0.00291989,0.01131583,0.0135216,0.00653844,-0.00241396,-0.00402977,-0.00742769,-0.00420219,-0.00469819,-0.00187529,0.00653096,0.01581613,0.01055154,0.00769085,-0.00526267,-0.02144349,-0.01639753,-0.01440843,0.00482626,0.01494051,0.020841,0.01192298,1.856e-05,-0.00816578,0.00320936,0.00446259,0.00404346,0.00317254,-0.00741277,-0.01283538,-0.01356718,0.00176294,0.02124992,0.01234538,-0.00366214,-0.01766711,-0.02266303,-0.00688327,0.00693712,0.01775316,0.00668014,0.00352555,0.00354234,0.00384951,-0.01101014,-0.00970358,-0.00949701,-0.00522939,0.00971077,0.00939469,0.00329706,0.00468934],"angles_deg":[8,18,28],"angleTraces":[[0.00055433,-0.0008958,-0.00230683,-0.00392069,-0.00384923,-0.00593448,-0.00368822,0.0043432,0.01032363,0.014353,0.00291299,-0.00919794,-0.01338184,-0.0086455,0.00257081,0.00886612,0.00630745,0.00586216,0.00378239,0.00324034,-0.00203841,-0.00435324,-0.00368069,-0.0058313,0.00053358,0.00247162,0.01382935,0.02868361,0.03646478,0.02410745,-0.0249385,-0.07374202,-0.08109676,-0.04790817,0.00679629,0.04557285,0.06680887,0.03816536,-0.00748053,-0.02208947,-0.00121041,0.02924749,0.02378075,-0.00187478,-0.01569185,-0.01815662,-0.00227868,0.00276379,0.00142423,-0.00668419,-0.0059049,0.00135795,0.00615788,0.00253883,0.0044606,0.00101826,0.00168019,-0.00380131,-0.00846696,-0.00696934,-0.00208132,0.00555893,0.0082626,0.00858219,0.00823314,-0.00363194,-0.00681447,-0.00690881,-0.00050363,0.00503574,0.00914107,0.00714794,-0.00045083,-0.00559748,-0.00633816,-0.00510173,-0.00560659,-0.00220217,0.00376532,0.00893493,0.01105292,0.00334256,-0.0065057,-0.01089587,-0.00627354,-0.00422758,0.00161526,0.00442446,0.00692957,0.00462594,-0.00439473,-0.0054403,-0.00242622,0.00274394,0.00264201,-0.00102963,-0.0021561,-0.00678469,-0.00771331,-0.00029479,0.01174711,0.0153826,-0.00175628,-0.00922061,-0.01420235,-0.00496246,0.00731214,0.01199627,0.0062002,-0.00058337,0.00109111,0.00491368,-0.00189164,-0.00702033,-0.01016534,-0.00042276,0.00370273,0.00541152,0.00403223,-0.00033393],[-0.00040502,0.00334429,-0.00390985,-0.00370593,-0.00787508,-0.00532396,-0.00550937,0.00312944,0.01269227,0.01276871,0.0031463,-0.00990822,-0.01902452,-0.00985535,-0.00244384,0.00870918,0.00843223,0.00809155,0.00174521,0.00045663,-0.00445887,-0.00460962,-0.00275822,-0.0008836,0.0027651,0.00613323,0.01749573,0.03581604,0.03792509,0.01715384,-0.03731526,-0.0823119,-0.09384957,-0.05229699,0.00451856,0.05225782,0.06913423,0.03841095,0.00530724,-0.00866792,0.00433129,0.02448659,0.02428807,-0.00189973,-0.02034545,-0.01653959,-0.00842569,0.00145311,-0.00500872,-0.00679683,-0.00541497,0.00040664,0.0057945,0.00366771,0.00335691,0.00366081,-0.00283469,-0.00501414,-0.01223448,-0.01063904,-0.00128938,0.00732148,0.00963488,0.01201378,0.00396687,-0.00328019,-0.00694317,-0.00900415,-0.00476072,0.00145264,0.00862843,0.0038528,0.0001228,-0.00458195,-0.00474019,-0.0041833,0.00029633,-0.00036746,0.00339507,0.00784214,0.00776233,0.00635224,-0.00520654,-0.00883563,-0.00901772,-0.00698683,-0.00062781,0.00668929,0.01265778,0.00674209,0.0002214,-0.00503029,-0.00048469,0.00218261,0.00264977,-0.00142431,-0.00205306,-0.00669189,-0.0071017,-0.00012334,0.01416579,0.01299261,0.00506408,-0.01274584,-0.01345244,-0.00739059,0.01020103,0.01045749,0.01181513,0.00399661,0.00129009,0.00128942,-0.00491249,-0.00742134,-0.00693295,-0.00080961,0.00702461,0.00825625,0.00359176,-0.00026774],[0.00044611,-0.00243158,-0.00468841,-0.01141504,-0.00259721,-0.00748624,-0.00027592,0.00573122,0.0125318,0.01449606,0.0039256,-0.01001627,-0.01446884,-0.01405252,-0.00117624,0.00942563,0.01471704,0.00853327,0.00788643,-0.00175687,-0.00393373,-0.00912281,-0.00680413,-0.00065242,0.00369917,0.01386718,0.03296805,0.04262295,0.0369504,0.0030741,-0.04698952,-0.09862535,-0.10811575,-0.07205856,0.00021934,0.05107317,0.07416278,0.0578866,0.02394198,0.01081005,0.01603535,0.02622682,0.01962041,0.00411673,-0.01791996,-0.02077975,-0.01205684,-0.00238911,-0.00464129,-0.0049428,-0.00585465,-0.00025117,0.00683523,0.0068512,0.00777495,0.00551261,-0.00442834,-0.01012422,-0.01455477,-0.00752042,-0.00664417,0.00785416,0.01256686,0.01755854,0.01175796,0.00084644,-0.00980431,-0.01002609,-0.00288746,0.00467797,0.00474507,0.00699276,0.00791502,-0.00175264,-0.00428003,-0.00524453,0.00153501,0.00166862,0.00680854,0.01226137,0.00859093,9.258e-05,-0.0037989,-0.00877157,-0.00986085,-0.0108799,0.00045791,0.00655042,0.00889625,0.00826138,0.0034045,-0.00099416,0.00059703,0.00244727,0.00600824,-0.00069923,-0.0069692,-0.00672804,-0.00628639,0.00587836,0.01344695,0.01204858,0.00271501,-0.01282319,-0.01579976,-0.00907681,0.00253062,0.01414705,0.0104176,0.00692398,-0.00032706,-0.00127432,-0.01303774,-0.00638315,-0.00772229,-0.00058298,0.00495022,0.00887638,0.0062931,0.00381799]],"fullWavelet":[-0.000198416,-0.001416864,-0.007804803,-0.032849057,-0.104002628,-0.24076353,-0.382882118,-0.342401066,0.044889856,0.617452186,0.9,0.617452186,0.044889856,-0.342401066,-0.382882118,-0.24076353,-0.104002628,-0.032849057,-0.007804803,-0.001416864,-0.000198416],"angleWavelets":[[-1.8444e-05,-0.000220463,-0.001927747,-0.012221012,-0.055374287,-0.174860492,-0.365095198,-0.433627903,-0.077581905,0.620928645,1,0.620928645,-0.077581905,-0.433627903,-0.365095198,-0.174860492,-0.055374287,-0.012221012,-0.001927747,-0.000220463,-1.8444e-05],[-0.00020944,-0.001495579,-0.008238403,-0.034674005,-0.109780551,-0.254139282,-0.404153347,-0.361423348,0.047383737,0.651755086,0.95,0.651755086,0.047383737,-0.361423348,-0.404153347,-0.254139282,-0.109780551,-0.034674005,-0.008238403,-0.001495579,-0.00020944],[-0.001734972,-0.007804803,-0.028387122,-0.082604273,-0.188955939,-0.328585678,-0.401221481,-0.252945828,0.170346558,0.672260284,0.9,0.672260284,0.170346558,-0.252945828,-0.401221481,-0.328585678,-0.188955939,-0.082604273,-0.028387122,-0.007804803,-0.001734972]],"lowFrequencyModels":{"lnAi":[15.6544,15.65484,15.65528,15.65572,15.65616,15.6566,15.65704,15.65748,15.65792,15.65836,15.6588,15.65968,15.66056,15.66144,15.66232,15.6632,15.66408,15.66496,15.66584,15.66672,15.6676,15.66848,15.661979,15.6554781,15.6489771,15.6424762,15.6359752,15.6335219,15.6310686,15.6286152,15.6261619,15.6270419,15.6279219,15.6288019,15.6296819,15.6305619,15.6314419,15.6323219,15.6332019,15.6340819,15.6349619,15.6358419,15.6367219,15.6449829,15.6532438,15.6615048,15.6697657,15.6780267,15.68224,15.6864533,15.6906667,15.69488,15.69576,15.69664,15.69752,15.6984,15.69928,15.70016,15.70104,15.70192,15.7028,15.70368,15.70456,15.70544,15.70632,15.7072,15.70808,15.70896,15.70984,15.71072,15.7116,15.71248,15.71336,15.71424,15.71512,15.716,15.71688,15.71776,15.71864,15.71952,15.7204,15.72128,15.72216,15.72304,15.72392,15.7248,15.72568,15.72656,15.72744,15.72832,15.7292,15.73008,15.73096,15.73184,15.73272,15.7336,15.73448,15.73536,15.73624,15.73712,15.738,15.73888,15.73976,15.74064,15.74152,15.7424,15.74328,15.74416,15.74504,15.74592,15.74636,15.7468,15.74724,15.74768,15.74812,15.74856,15.749,15.74944,15.74988,15.75032],"lnSi":[15.0344,15.03484,15.03528,15.03572,15.03616,15.0366,15.03704,15.03748,15.03792,15.03836,15.0388,15.03968,15.04056,15.04144,15.04232,15.0432,15.04408,15.04496,15.04584,15.04672,15.0476,15.04848,15.0507886,15.0530971,15.0554057,15.0577143,15.0600229,15.0623314,15.06464,15.0669486,15.0692571,15.0701371,15.0710171,15.0718971,15.0727771,15.0736571,15.0745371,15.0754171,15.0762971,15.0771771,15.0780571,15.0789371,15.0798171,15.0792686,15.07872,15.0781714,15.0776229,15.0770743,15.0765257,15.0759771,15.0754286,15.07488,15.07576,15.07664,15.07752,15.0784,15.07928,15.08016,15.08104,15.08192,15.0828,15.08368,15.08456,15.08544,15.08632,15.0872,15.08808,15.08896,15.08984,15.09072,15.0916,15.09248,15.09336,15.09424,15.09512,15.096,15.09688,15.09776,15.09864,15.09952,15.1004,15.10128,15.10216,15.10304,15.10392,15.1048,15.10568,15.10656,15.10744,15.10832,15.1092,15.11008,15.11096,15.11184,15.11272,15.1136,15.11448,15.11536,15.11624,15.11712,15.118,15.11888,15.11976,15.12064,15.12152,15.1224,15.12328,15.12416,15.12504,15.12592,15.12636,15.1268,15.12724,15.12768,15.12812,15.12856,15.129,15.12944,15.12988,15.13032],"lnRho":[7.7604,7.76044,7.76048,7.76052,7.76056,7.7606,7.76064,7.76068,7.76072,7.76076,7.7608,7.76088,7.76096,7.76104,7.76112,7.7612,7.76128,7.76136,7.76144,7.76152,7.7616,7.76168,7.7596171,7.7575543,7.7554914,7.7534286,7.7513657,7.7502552,7.7491448,7.7480343,7.7469238,7.7470038,7.7470838,7.7471638,7.7472438,7.7473238,7.7474038,7.7474838,7.7475638,7.7476438,7.7477238,7.7478038,7.7478838,7.7501067,7.7523295,7.7545524,7.7567752,7.7589981,7.7602686,7.761539,7.7628095,7.76408,7.76416,7.76424,7.76432,7.7644,7.76448,7.76456,7.76464,7.76472,7.7648,7.76488,7.76496,7.76504,7.76512,7.7652,7.76528,7.76536,7.76544,7.76552,7.7656,7.76568,7.76576,7.76584,7.76592,7.766,7.76608,7.76616,7.76624,7.76632,7.7664,7.76648,7.76656,7.76664,7.76672,7.7668,7.76688,7.76696,7.76704,7.76712,7.7672,7.76728,7.76736,7.76744,7.76752,7.7676,7.76768,7.76776,7.76784,7.76792,7.768,7.76808,7.76816,7.76824,7.76832,7.7684,7.76848,7.76856,7.76864,7.76872,7.76876,7.7688,7.76884,7.76888,7.76892,7.76896,7.769,7.76904,7.76908,7.76912]},"backgroundVsVp":0.47},"calibration":{"porosity":{"columns":["ai","phit"],"rows":[[6670564.4,0.20334],[7012552.8,0.19263],[7203521.5,0.19117],[6628313.3,0.2004],[6562337.6,0.20442],[6083717.7,0.22449],[6760792.4,0.19724],[6434369.3,0.21481],[5955408.2,0.22359],[6857925.1,0.18134],[7217215.2,0.17971],[6142502.1,0.19891],[6068543,0.21704],[7231764.6,0.17146],[6021010.5,0.22038],[6550203.9,0.20395],[6654446.5,0.20767],[7037007.4,0.19546],[6829717.8,0.18377],[6033044.7,0.22792],[6302416.1,0.21712],[6165752.8,0.2101],[7247980.6,0.18512],[7136011.3,0.16577],[6125572.5,0.19622],[7322073.9,0.17993],[6111054.9,0.23098],[5923220.5,0.21946],[6584744.3,0.19596],[6431810.9,0.21934],[6043452.3,0.22128],[6111834.3,0.21051],[6401690.1,0.21262],[7370370.5,0.1757],[6410517.9,0.19188],[7329057.3,0.18352],[6832068.4,0.19751],[6543127.8,0.20951],[7333976.5,0.17758],[6578865.2,0.19913],[7396921.9,0.17114],[6785113.8,0.20323],[6083644.3,0.22379],[7036367.3,0.18117],[7264756.5,0.18266],[7172354.1,0.17666],[6948629.8,0.1925],[7110125.7,0.18021]]},"facies":{"columns":["facies","ai"],"rows":[["shale",7490394.4],["shale",7453792.7],["shale",7616649.9],["shale",7330967.2],["shale",7515331.7],["shale",7228154.2],["shale",7573946.3],["shale",7491085],["shale",7156296],["shale",7098321.5],["shale",7743436.1],["shale",7714179.1],["shale",7579808.3],["shale",7407100],["shale",7753142.6],["shale",6985610.5],["shale",7141319.4],["shale",7189021.9],["shale",7349568.7],["shale",7577507.6],["shale",7357277.4],["shale",7543335.8],["shale",6869878.6],["shale",7439545.1],["shale",7469678.4],["shale",7018383],["shale",7668566],["shale",7531005.6],["shale",7144667.1],["shale",7714005.7],["shale",6999208.8],["shale",7879707.4],["shale",7377670.5],["shale",6759940.7],["shale",7014565.2],["shale",7414936.4],["shale",7299859],["shale",6670468.1],["shale",7250282.8],["shale",7792054],["brine sand",6959764.6],["brine sand",6958306.3],["brine sand",6848514.1],["brine sand",7095909.9],["brine sand",7036664.3],["brine sand",6449533.8],["brine sand",7368040.3],["brine sand",7166725.1],["brine sand",6390137.1],["brine sand",6822419.5],["brine sand",6859688.3],["brine sand",7183760.6],["brine sand",6725167.9],["brine sand",6788231.2],["brine sand",6882728.2],["brine sand",6468243.2],["brine sand",6908057.8],["brine sand",6545419.2],["brine sand",6820700.8],["brine sand",6962603.7],["brine sand",7067848.1],["brine sand",6786694.3],["brine sand",7118397.1],["brine sand",6592921],["brine sand",6705115.3],["brine sand",7017469.4],["brine sand",7515250.2],["brine sand",6658504.3],["brine sand",6661767.9],["brine sand",6528071.6],["oil sand",6204682.8],["oil sand",6027513.9],["oil sand",6312075.7],["oil sand",6101159.8],["oil sand",5859839.8],["oil sand",6440739.1],["oil sand",6114928.1],["oil sand",6358882.2],["oil sand",6411354.8],["oil sand",6430768.6],["oil sand",5795698],["oil sand",6233006.4],["oil sand",6204054.1],["oil sand",6287088.5],["oil sand",6362085.9],["oil sand",6147519.8],["oil sand",6390856.4],["oil sand",5935606.3],["oil sand",5856182.4],["oil sand",6279765],["oil sand",6429836.5],["oil sand",6574211],["oil sand",6463176.7],["oil sand",6215567.7],["oil sand",6147753.8],["oil sand",6409824.6]]}},"grid":{"units":"ft; z is elevation, negative below the datum","spec":{"nx":31,"ny":26,"x0":0,"y0":0,"dx":330,"dy":330},"z":[-8478.377,-8480.889,-8480.9,-8477.891,-8477.313,-8478.237,-8480.979,-8474.585,-8477.987,-8475.437,-8482.077,-8474.332,-8472.395,-8482.014,-8476.097,-8477.146,-8476.815,-8474.065,-8479.808,-8481.339,-8479.624,-8478.175,-8478.694,-8482.834,-8478.136,-8480.551,-8480.911,-8479.826,-8479.03,-8481.61,-8481.127,-8483.343,-8481.973,-8475.916,-8485.429,-8484.873,-8476.969,-8480.239,-8483.472,-8479.741,-8478.126,-8474.917,-8480.919,-8475.013,-8478.409,-8474.862,-8472.13,-8473.074,-8477.481,-8475.855,-8478.166,-8480.053,-8478.738,-8480.239,-8480.862,-8477.943,-8480.038,-8483.118,-8481.409,-8480.388,-8481.676,-8480.054,-8486.655,-8484.496,-8484.487,-8481.948,-8480.966,-8486.017,-8478.151,-8480.433,-8476.732,-8470.591,-8475.375,-8475.337,-8472.225,-8474.991,-8472.315,-8472.099,-8476.307,-8467.817,-8474.183,-8477.512,-8478.204,-8478.903,-8485.63,-8484.11,-8481.995,-8487.107,-8482.516,-8481.942,-8482.72,-8486.075,-8481.782,-8488.42,-8486.332,-8486.107,-8486.881,-8480.898,-8478.619,-8482.15,-8475.497,-8474.911,-8476.051,-8472.313,-8467,-8465.268,-8467.48,-8466.164,-8466.671,-8468.466,-8471.636,-8473.959,-8478.726,-8476.563,-8480.014,-8481.945,-8480.684,-8479.778,-8484.269,-8483.205,-8486.956,-8488.162,-8485.93,-8489.332,-8487.896,-8489.057,-8485.585,-8485.403,-8486.276,-8483.51,-8478.321,-8469.878,-8469.414,-8465.614,-8466.833,-8462.585,-8455.161,-8459.615,-8456.903,-8462.064,-8462.533,-8462.416,-8467.879,-8473.571,-8477.358,-8479.099,-8480.826,-8480.938,-8486.051,-8482.016,-8486.672,-8488.589,-8487.944,-8490.016,-8489.347,-8487.117,-8487.609,-8488.274,-8485.545,-8483.863,-8478.073,-8473.846,-8468.004,-8464.054,-8462.94,-8449.861,-8452.022,-8446.371,-8448.292,-8447.882,-8448.662,-8452.435,-8457.415,-8464.42,-8469.92,-8468.712,-8471.94,-8478.341,-8480.979,-8482.859,-8482.646,-8486.219,-8483.547,-8489.919,-8489.494,-8490.752,-8486.55,-8485.983,-8489.23,-8485.264,-8482.822,-8480.138,-8472.813,-8467.006,-8460.101,-8450.514,-8442.978,-8438.634,-8430.137,-8429.595,-8435.314,-8437.364,-8440.933,-8448.595,-8449.387,-8454.79,-8461.237,-8467.103,-8470.517,-8471.874,-8477.413,-8480.202,-8481.688,-8481.335,-8486.116,-8488.425,-8489.322,-8490.481,-8490.194,-8486.939,-8489.836,-8483.492,-8475.141,-8466.797,-8462.399,-8452.785,-8439.775,-8428.171,-8420.484,-8415.112,-8409.903,-8413.626,-8417.953,-8426.274,-8435.367,-8437.33,-8449.06,-8448.468,-8446.774,-8459.364,-8462.414,-8472.25,-8471.883,-8480.431,-8485.4,-8485.456,-8491.432,-8492.581,-8489.965,-8492.076,-8494.703,-8484.422,-8485.712,-8470.105,-8463.664,-8454.656,-8444.776,-8428.319,-8416.71,-8400.405,-8397.296,-8393.258,-8392.618,-8400.885,-8408.184,-8415.709,-8422.103,-8430.326,-8435.358,-8441.461,-8438.568,-8453.37,-8453.798,-8465.133,-8473.695,-8478.401,-8487.139,-8490.883,-8489.852,-8497.679,-8494.433,-8488.796,-8488.359,-8482.175,-8471.806,-8461.586,-8449.554,-8431.812,-8416.171,-8396.879,-8381.789,-8373.567,-8371.521,-8373.528,-8377.322,-8388.394,-8400.893,-8402.64,-8412.248,-8412.951,-8419.537,-8425.174,-8428.046,-8439.446,-8451.671,-8459.655,-8472.238,-8481.895,-8491.71,-8494.557,-8497.623,-8494.675,-8490.308,-8483.625,-8482.38,-8469.342,-8457.773,-8441.751,-8422.754,-8401.54,-8382.638,-8365.658,-8359.816,-8352.065,-8354.781,-8362.147,-8369.098,-8382.305,-8388.979,-8394.184,-8395.375,-8397.997,-8399.399,-8410.339,-8423.496,-8443.077,-8456.482,-8468.352,-8477.738,-8488.45,-8491.764,-8499.617,-8496.822,-8492.261,-8485.283,-8481.217,-8467.611,-8455.599,-8434.146,-8416.779,-8396.824,-8374.903,-8359.549,-8351.576,-8339.409,-8346.467,-8351.308,-8358.413,-8368.168,-8371.721,-8372.457,-8376.56,-8374.547,-8377.575,-8392.044,-8403.05,-8423.25,-8444.427,-8458.546,-8474.819,-8483.606,-8493.567,-8502.758,-8498.445,-8498.146,-8488.733,-8480.664,-8469.813,-8452.999,-8433.124,-8410.5,-8394.525,-8369.996,-8354.741,-8340.83,-8341.084,-8335.365,-8345.073,-8355.125,-8361.694,-8361.23,-8367.721,-8368.111,-8368.748,-8363.918,-8375.26,-8392.122,-8416.25,-8433.233,-8456.669,-8472.293,-8489.605,-8495.334,-8501.605,-8498.234,-8499.615,-8491.388,-8483.581,-8470.057,-8456.521,-8440.158,-8416.95,-8396.297,-8374.914,-8355.187,-8346.263,-8337.38,-8342.814,-8345.813,-8355.714,-8363.945,-8366.188,-8362.861,-8362.773,-8359.004,-8361.246,-8370.427,-8388.987,-8409.139,-8428.287,-8456.253,-8474.571,-8484.827,-8495.778,-8502.005,-8502.323,-8498.633,-8490.386,-8483.033,-8475.119,-8458.862,-8445.695,-8421.297,-8405.172,-8383.903,-8368.759,-8356.9,-8352.587,-8350.877,-8355.24,-8364.038,-8369.338,-8374.196,-8375.458,-8371.282,-8367.154,-8374.038,-8376.71,-8398.358,-8416.307,-8436.896,-8462.251,-8480.312,-8493.853,-8496.797,-8501.333,-8503.911,-8498.543,-8497.443,-8486.708,-8481.673,-8467.913,-8448.878,-8433.183,-8415.38,-8395.543,-8377.416,-8370.1,-8368.056,-8366.214,-8373.971,-8380.611,-8387.367,-8391.505,-8394.307,-8384.748,-8393.725,-8393.935,-8396.84,-8405.542,-8431.745,-8453.94,-8473.55,-8483.652,-8494.401,-8502.557,-8508.231,-8507.479,-8504.218,-8496.61,-8494.736,-8486.403,-8470.707,-8465.084,-8448.252,-8429.543,-8417.132,-8400.839,-8387.663,-8390.856,-8387.561,-8403.234,-8404.329,-8406.252,-8411.355,-8411.981,-8414.999,-8411.692,-8415.874,-8421.631,-8432.694,-8444.974,-8464.455,-8477.828,-8489.521,-8495.599,-8507.319,-8512.669,-8510.45,-8509.124,-8504.032,-8499.881,-8491.504,-8485.286,-8473.53,-8459.882,-8448.626,-8433.588,-8427.03,-8414.68,-8414.584,-8413.649,-8421.263,-8426.432,-8433.182,-8433.351,-8439.638,-8442.286,-8436.875,-8441.912,-8448.758,-8454.939,-8470.314,-8473.391,-8492.114,-8496.262,-8505.004,-8514.173,-8513.492,-8513.228,-8511.922,-8510.916,-8505.923,-8501.456,-8490.379,-8492.524,-8472.239,-8463.569,-8454.451,-8448.024,-8440.741,-8438.999,-8436.975,-8442.791,-8444.414,-8455.157,-8459.369,-8461.012,-8463.935,-8459.292,-8465.217,-8465.309,-8477.296,-8483.277,-8491.898,-8502.614,-8508.179,-8511.55,-8513.995,-8520.608,-8517.848,-8517.771,-8513.024,-8506.425,-8506.139,-8501.6,-8491.236,-8488.51,-8481.231,-8475.655,-8466.531,-8461.34,-8458.763,-8458.799,-8459.48,-8468.463,-8472.727,-8473.808,-8477.585,-8478.543,-8487.217,-8482.358,-8490.355,-8491.068,-8499.251,-8502.779,-8504.914,-8510.588,-8517.705,-8516.816,-8516.667,-8522.288,-8516.549,-8517.403,-8517.666,-8509.166,-8508.423,-8502.817,-8498.828,-8493.268,-8482.982,-8484.117,-8482.122,-8478.167,-8481.917,-8479.867,-8483.21,-8485.704,-8497.188,-8492.497,-8497.359,-8498.787,-8501.522,-8500.629,-8504.428,-8503.378,-8511.666,-8513.441,-8514.872,-8523.119,-8517.525,-8519.956,-8520.941,-8519.968,-8523.909,-8516.764,-8511.373,-8510.2,-8511.322,-8508.965,-8503.9,-8498.041,-8493.766,-8493.515,-8491.139,-8497.466,-8493.316,-8496.768,-8498.419,-8504.647,-8505.798,-8510.061,-8511.206,-8513.236,-8513.46,-8509.064,-8517.815,-8515.289,-8516.842,-8522.636,-8521.963,-8522.864,-8523.166,-8521.638,-8524.938,-8521.116,-8521.747,-8520.783,-8516.455,-8516.644,-8515.284,-8507.999,-8511.54,-8505.779,-8506.877,-8507.404,-8510.413,-8502.307,-8511.17,-8512.347,-8509.117,-8515.014,-8516.155,-8511.354,-8517.453,-8518.823,-8515.91,-8518.563,-8519.887,-8523.16,-8521.623,-8523.123,-8520.818,-8522.763,-8529.31,-8526.478,-8521.015,-8520.687,-8525.888,-8519.826,-8521.298,-8519.041,-8519.953,-8513.33,-8511.721,-8516.131,-8518.63,-8513.36,-8519.32,-8516.032,-8518.31,-8517.62,-8519.665,-8517.398,-8521.639,-8524.459,-8521.779,-8523.251,-8525.063,-8526.058,-8522.615,-8526.652,-8523.116,-8525.417,-8529.122,-8527.81,-8530.354,-8522.185,-8528.509,-8525.17,-8523.131,-8523.703,-8526.624,-8519.083,-8522.742,-8520.902,-8517.736,-8516.978,-8520.055,-8520.541,-8522.449,-8518.147,-8523.821,-8520.953,-8523.858,-8531.348,-8526.3,-8528.992,-8528.865,-8525.404,-8525.974,-8524.403,-8528.559,-8524.758,-8529.338,-8527.817,-8532.406,-8530.101,-8531.892,-8525.478,-8527.071,-8529.653,-8527.167,-8526.001,-8529.653,-8524.098,-8527.903,-8527.2,-8533.371,-8522.71,-8520.803,-8526.431,-8520.727,-8524.689,-8531.259,-8526.858,-8522.505,-8526.247,-8527.41,-8529.566,-8530.775,-8527.922,-8531.225,-8529.931,-8533.506,-8530.216]},"stated":{"lfm":{"power":2,"sampleB":42},"modelBased":{"eps":0.3,"iters":400,"sampleA":32},"simultaneous":{"eps":[0.3,0.3,0.3],"iters":400,"sampleA":30},"porosity":{"level":0.8,"atAi":6550000},"facies":{"kind":"gaussian","priors":"the calibration proportions","atAi":6380000,"class":"oil sand"},"closure":{"crest":"the highest mapped node","contact":"the spill"}}}'::jsonb;
begin

  -- ------------------------------------------------------- 0. completeness
  select string_agg(t, ', ' order by o) into v_names from (values ('beginner', 1), ('intermediate', 2), ('advanced', 3)) x(t, o)
   where not exists (select 1 from public.academy_capstones c where c.app_slug = 'qi' and c.tier = x.t);
  if v_names is not null then
    raise exception 'QI go-live refused: no capstone for the tier(s) % (a tier''s capstone is written only once the engines behind its fields pass the extraction gate)', v_names;
  end if;
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'qi' and active;
  if v_structures <> 3 then
    raise exception 'QI go-live refused: qi has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'qi';
  if v_questions <> 396 then
    raise exception 'QI go-live refused: qi has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'qi';
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'qi';
  if v_capstones <> 3 or v_graded <> 18 then
    raise exception 'QI go-live refused: qi has % capstones and % graded fields, expected 3 and 18', v_capstones, v_graded;
  end if;
  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'qi' and s.active;
  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'qi' and s.active;
  if v_lessons <> 78 or v_modules <> 18 then
    raise exception 'QI go-live refused: qi carries % lesson keys in % modules, expected 78 in 18', v_lessons, v_modules;
  end if;

  -- ---------------------------------------------------------------- shape
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'qi' group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'QI go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;
  select count(*) into v_n from (select tier, module_key from public.academy_quiz_questions where app_slug = 'qi' and scope = 'module' group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'QI go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'qi' and scope = 'final' group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'QI go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;
  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'qi' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'QI go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = 'qi'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'QI go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;
  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'qi' and qq.scope = 'module' and not exists (
       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'QI go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'qi' and module = 'geoscience' and path_order = 80
                  and prereq_slug = 'welldata' and course_type = 'app') then
    raise exception 'QI go-live refused: the qi catalogue row is not geoscience at path_order 80 with the prerequisite welldata and course_type app';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 80 and slug <> 'qi') then
    raise exception 'QI go-live refused: another course already holds path_order 80';
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'welldata') then
    raise exception 'QI go-live refused: the prerequisite course welldata is not in the catalogue';
  end if;

  -- ------------------------------------------------- the grader is numeric
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or abs((f->>'expected')::numeric) <= 0.001
          or ((f->>'tol')::numeric < 0.5 and abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= (f->>'tol')::numeric)
          or ((f->>'tol')::numeric >= 0.5 and abs((f->>'expected')::numeric) < 1000000 * (f->>'tol')::numeric)
          or (f->>'tol')::numeric is distinct from (select t.tol from (values ('beginner', 'tamberlo_low6_hz', 5e-07::numeric), ('beginner', 'tamberlo_centroid_hz', 5e-07::numeric), ('beginner', 'tamberlo_shear_slope', 5e-07::numeric), ('beginner', 'tamberlo_ai_brine', 5e-07::numeric), ('beginner', 'tamberlo_vpvs_brine', 5e-07::numeric), ('beginner', 'tamberlo_wet_distance', 5e-07::numeric), ('intermediate', 'quarvin_dix_vint', 5e-07::numeric), ('intermediate', 'quarvin_walden_deg', 5e-07::numeric), ('intermediate', 'quarvin_nmo_stretch', 5e-07::numeric), ('intermediate', 'quarvin_far_stack_amp', 5e-07::numeric), ('intermediate', 'quarvin_shuey_a', 5e-07::numeric), ('intermediate', 'quarvin_one_scale', 5e-07::numeric), ('advanced', 'delsholm_lfm_lnai_b', 5e-07::numeric), ('advanced', 'delsholm_mb_ai', 1::numeric), ('advanced', 'delsholm_sim_vpvs', 5e-06::numeric), ('advanced', 'delsholm_phi_q90', 5e-07::numeric), ('advanced', 'delsholm_p_oil', 5e-07::numeric), ('advanced', 'delsholm_column_ft', 5e-07::numeric)) t(tier, k, tol) where t.tier = c.tier and t.k = f->>'key')
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'QI go-live refused: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;
  end if;
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or ((f->>'tol')::numeric = 0.0000005
              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));
  if v_n <> 0 then
    raise exception 'QI go-live refused: % graded field(s) either fail the six-decimal answer or pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;

  -- ---------------------------------------- the prompts the learner reads
  select prompt into v_prompt from public.academy_capstones where app_slug = 'qi' and tier = 'beginner';
  if v_prompt is null or md5(v_prompt) <> '2efb0a29bf8ca546279f669f0dd5163a' then
    raise exception 'QI go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the case file (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'qi' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'TAMBERLO, a held-out synthetic case (synthetic)' and title = 'Feasibility: can this seismic see this fluid') then
    raise exception 'QI go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['18', '400', '2', '7520', '7640', '7590', '0.1', '0.35', '195', '3650', '0.05', '28', '520', '0.7', '7561.5', '65', '16', 'tamberlo_case.json', 'Every input a value needs is in the case file or stated here, and no value is a random draw; the engines hold no default for any choice named above.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'QI go-live refused: % stated setting(s) or case file(s) are not named in the shipped beginner prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'qi' and tier = 'intermediate';
  if v_prompt is null or md5(v_prompt) <> 'efc6c3faecba70f38c0303d39cb7091e' then
    raise exception 'QI go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the case file (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'qi' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'QUARVIN, a held-out synthetic case (synthetic)' and title = 'From the tie to AVO on the seismic') then
    raise exception 'QI go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['880', '1310', '1600', '1324', '5', '15', '25', '35', '2', '3', '2', '10', '20', '30', '1324', 'quarvin_case.json', 'Every input a value needs is in the case file or stated here, and no value is a random draw; the engines hold no default for any choice named above.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'QI go-live refused: % stated setting(s) or case file(s) are not named in the shipped intermediate prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'qi' and tier = 'advanced';
  if v_prompt is null or md5(v_prompt) <> 'f2c9936aff91ca49487c8b1828f5c39d' then
    raise exception 'QI go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the case file (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'qi' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'DELSHOLM, a held-out synthetic case (synthetic)' and title = 'Inversion, properties and the decision') then
    raise exception 'QI go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['2', '42', '0.3', '400', '32', '0.3', '0.3', '0.3', '400', '0.8', '6550000', '6380000', 'delsholm_case.json', 'Every input a value needs is in the case file or stated here, and no value is a random draw; the engines hold no default for any choice named above.']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'QI go-live refused: % stated setting(s) or case file(s) are not named in the shipped advanced prompt: %', v_n, v_names;
  end if;
  -- No number handed in any capstone text may sit within its tolerance of any graded value of any tier.
  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names
    from (select c.tier as ctier, m[1]::double precision as x
            from public.academy_capstones c,
                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||
                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),
                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m
           where c.app_slug = 'qi') h,
         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'qi') g
   where abs(abs(h.x) - abs(g.v)) <= g.t;
  if v_n <> 0 then
    raise exception 'QI go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;
  end if;

  -- ------------------------------------------------------- the graded values
  select (f->>'expected')::double precision into v_g_tamberlo_low6_hz
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'beginner' and f->>'key' = 'tamberlo_low6_hz';
  if v_g_tamberlo_low6_hz is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: beginner/tamberlo_low6_hz]';
  end if;
  select (f->>'expected')::double precision into v_g_tamberlo_centroid_hz
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'beginner' and f->>'key' = 'tamberlo_centroid_hz';
  if v_g_tamberlo_centroid_hz is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: beginner/tamberlo_centroid_hz]';
  end if;
  select (f->>'expected')::double precision into v_g_tamberlo_shear_slope
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'beginner' and f->>'key' = 'tamberlo_shear_slope';
  if v_g_tamberlo_shear_slope is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: beginner/tamberlo_shear_slope]';
  end if;
  select (f->>'expected')::double precision into v_g_tamberlo_ai_brine
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'beginner' and f->>'key' = 'tamberlo_ai_brine';
  if v_g_tamberlo_ai_brine is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: beginner/tamberlo_ai_brine]';
  end if;
  select (f->>'expected')::double precision into v_g_tamberlo_vpvs_brine
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'beginner' and f->>'key' = 'tamberlo_vpvs_brine';
  if v_g_tamberlo_vpvs_brine is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: beginner/tamberlo_vpvs_brine]';
  end if;
  select (f->>'expected')::double precision into v_g_tamberlo_wet_distance
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'beginner' and f->>'key' = 'tamberlo_wet_distance';
  if v_g_tamberlo_wet_distance is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: beginner/tamberlo_wet_distance]';
  end if;
  select (f->>'expected')::double precision into v_g_quarvin_dix_vint
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'intermediate' and f->>'key' = 'quarvin_dix_vint';
  if v_g_quarvin_dix_vint is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: intermediate/quarvin_dix_vint]';
  end if;
  select (f->>'expected')::double precision into v_g_quarvin_walden_deg
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'intermediate' and f->>'key' = 'quarvin_walden_deg';
  if v_g_quarvin_walden_deg is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: intermediate/quarvin_walden_deg]';
  end if;
  select (f->>'expected')::double precision into v_g_quarvin_nmo_stretch
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'intermediate' and f->>'key' = 'quarvin_nmo_stretch';
  if v_g_quarvin_nmo_stretch is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: intermediate/quarvin_nmo_stretch]';
  end if;
  select (f->>'expected')::double precision into v_g_quarvin_far_stack_amp
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'intermediate' and f->>'key' = 'quarvin_far_stack_amp';
  if v_g_quarvin_far_stack_amp is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: intermediate/quarvin_far_stack_amp]';
  end if;
  select (f->>'expected')::double precision into v_g_quarvin_shuey_a
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'intermediate' and f->>'key' = 'quarvin_shuey_a';
  if v_g_quarvin_shuey_a is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: intermediate/quarvin_shuey_a]';
  end if;
  select (f->>'expected')::double precision into v_g_quarvin_one_scale
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'intermediate' and f->>'key' = 'quarvin_one_scale';
  if v_g_quarvin_one_scale is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: intermediate/quarvin_one_scale]';
  end if;
  select (f->>'expected')::double precision into v_g_delsholm_lfm_lnai_b
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'advanced' and f->>'key' = 'delsholm_lfm_lnai_b';
  if v_g_delsholm_lfm_lnai_b is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: advanced/delsholm_lfm_lnai_b]';
  end if;
  select (f->>'expected')::double precision into v_g_delsholm_mb_ai
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'advanced' and f->>'key' = 'delsholm_mb_ai';
  if v_g_delsholm_mb_ai is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: advanced/delsholm_mb_ai]';
  end if;
  select (f->>'expected')::double precision into v_g_delsholm_sim_vpvs
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'advanced' and f->>'key' = 'delsholm_sim_vpvs';
  if v_g_delsholm_sim_vpvs is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: advanced/delsholm_sim_vpvs]';
  end if;
  select (f->>'expected')::double precision into v_g_delsholm_phi_q90
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'advanced' and f->>'key' = 'delsholm_phi_q90';
  if v_g_delsholm_phi_q90 is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: advanced/delsholm_phi_q90]';
  end if;
  select (f->>'expected')::double precision into v_g_delsholm_p_oil
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'advanced' and f->>'key' = 'delsholm_p_oil';
  if v_g_delsholm_p_oil is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: advanced/delsholm_p_oil]';
  end if;
  select (f->>'expected')::double precision into v_g_delsholm_column_ft
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'qi' and c.tier = 'advanced' and f->>'key' = 'delsholm_column_ft';
  if v_g_delsholm_column_ft is null then
    raise exception 'QI go-live refused: the seeded rows carry no value [graded field: advanced/delsholm_column_ft]';
  end if;

  -- ------------------------------------------ 1. against the engine ledger
  if v_g_tamberlo_low6_hz <> 20.740177079246084::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 20.740177079246084 [graded field: beginner/tamberlo_low6_hz]', v_g_tamberlo_low6_hz;
  end if;
  if v_g_tamberlo_centroid_hz <> 39.79551860667146::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 39.79551860667146 [graded field: beginner/tamberlo_centroid_hz]', v_g_tamberlo_centroid_hz;
  end if;
  if v_g_tamberlo_shear_slope <> 835.402042501606::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 835.402042501606 [graded field: beginner/tamberlo_shear_slope]', v_g_tamberlo_shear_slope;
  end if;
  if v_g_tamberlo_ai_brine <> 6066964.699156452::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 6066964.699156452 [graded field: beginner/tamberlo_ai_brine]', v_g_tamberlo_ai_brine;
  end if;
  if v_g_tamberlo_vpvs_brine <> 1.91832635055991::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 1.91832635055991 [graded field: beginner/tamberlo_vpvs_brine]', v_g_tamberlo_vpvs_brine;
  end if;
  if v_g_tamberlo_wet_distance <> -0.059578965835977195::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned -0.059578965835977195 [graded field: beginner/tamberlo_wet_distance]', v_g_tamberlo_wet_distance;
  end if;
  if v_g_quarvin_dix_vint <> 2820.8223895680444::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 2820.8223895680444 [graded field: intermediate/quarvin_dix_vint]', v_g_quarvin_dix_vint;
  end if;
  if v_g_quarvin_walden_deg <> 36.52301164233891::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 36.52301164233891 [graded field: intermediate/quarvin_walden_deg]', v_g_quarvin_walden_deg;
  end if;
  if v_g_quarvin_nmo_stretch <> 0.12037307727748914::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 0.12037307727748914 [graded field: intermediate/quarvin_nmo_stretch]', v_g_quarvin_nmo_stretch;
  end if;
  if v_g_quarvin_far_stack_amp <> 26.746679333333333::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 26.746679333333333 [graded field: intermediate/quarvin_far_stack_amp]', v_g_quarvin_far_stack_amp;
  end if;
  if v_g_quarvin_shuey_a <> 83.24177796156101::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 83.24177796156101 [graded field: intermediate/quarvin_shuey_a]', v_g_quarvin_shuey_a;
  end if;
  if v_g_quarvin_one_scale <> 1137.2725681690208::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 1137.2725681690208 [graded field: intermediate/quarvin_one_scale]', v_g_quarvin_one_scale;
  end if;
  if v_g_delsholm_lfm_lnai_b <> 15.628802751655897::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 15.628802751655897 [graded field: advanced/delsholm_lfm_lnai_b]', v_g_delsholm_lfm_lnai_b;
  end if;
  if v_g_delsholm_mb_ai <> 5925842.253250878::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 5925842.253250878 [graded field: advanced/delsholm_mb_ai]', v_g_delsholm_mb_ai;
  end if;
  if v_g_delsholm_sim_vpvs <> 1.8909602173995903::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 1.8909602173995903 [graded field: advanced/delsholm_sim_vpvs]', v_g_delsholm_sim_vpvs;
  end if;
  if v_g_delsholm_phi_q90 <> 0.21335715041962583::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 0.21335715041962583 [graded field: advanced/delsholm_phi_q90]', v_g_delsholm_phi_q90;
  end if;
  if v_g_delsholm_p_oil <> 0.8099435384728407::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 0.8099435384728407 [graded field: advanced/delsholm_p_oil]', v_g_delsholm_p_oil;
  end if;
  if v_g_delsholm_column_ft <> 139.64800000000105::double precision then
    raise exception 'QI go-live refused: the seeded value is %, and the engine returned 139.64800000000105 [graded field: advanced/delsholm_column_ft]', v_g_delsholm_column_ft;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  -- tamberlo_low6_hz: no second route in SQL (a padded FFT; checked by the oracle's direct DFT)
  -- tamberlo_centroid_hz: no second route in SQL (a padded FFT; checked by the oracle's direct DFT)
  v_s := pg_temp.qi_assoc(v_case_b, 'slope');
  if v_s is null or abs(v_s - v_g_tamberlo_shear_slope) > 1e-9 * abs(v_g_tamberlo_shear_slope) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/tamberlo_shear_slope]', v_s, v_g_tamberlo_shear_slope;
  end if;
  v_s := pg_temp.qi_assoc(v_case_b, 'ai');
  if v_s is null or abs(v_s - v_g_tamberlo_ai_brine) > 1e-9 * abs(v_g_tamberlo_ai_brine) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/tamberlo_ai_brine]', v_s, v_g_tamberlo_ai_brine;
  end if;
  v_s := pg_temp.qi_assoc(v_case_b, 'vpvs');
  if v_s is null or abs(v_s - v_g_tamberlo_vpvs_brine) > 1e-9 * abs(v_g_tamberlo_vpvs_brine) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/tamberlo_vpvs_brine]', v_s, v_g_tamberlo_vpvs_brine;
  end if;
  v_s := pg_temp.qi_assoc(v_case_b, 'distance');
  if v_s is null or abs(v_s - v_g_tamberlo_wet_distance) > 1e-9 * abs(v_g_tamberlo_wet_distance) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/tamberlo_wet_distance]', v_s, v_g_tamberlo_wet_distance;
  end if;
  v_s := pg_temp.qi_prof(v_case_i, 'dix');
  if v_s is null or abs(v_s - v_g_quarvin_dix_vint) > 1e-9 * abs(v_g_quarvin_dix_vint) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/quarvin_dix_vint]', v_s, v_g_quarvin_dix_vint;
  end if;
  v_s := pg_temp.qi_prof(v_case_i, 'walden');
  if v_s is null or abs(v_s - v_g_quarvin_walden_deg) > 1e-9 * abs(v_g_quarvin_walden_deg) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/quarvin_walden_deg]', v_s, v_g_quarvin_walden_deg;
  end if;
  v_s := pg_temp.qi_prof(v_case_i, 'stretch');
  if v_s is null or abs(v_s - v_g_quarvin_nmo_stretch) > 1e-9 * abs(v_g_quarvin_nmo_stretch) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/quarvin_nmo_stretch]', v_s, v_g_quarvin_nmo_stretch;
  end if;
  v_s := pg_temp.qi_prof(v_case_i, 'far');
  if v_s is null or abs(v_s - v_g_quarvin_far_stack_amp) > 1e-9 * abs(v_g_quarvin_far_stack_amp) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/quarvin_far_stack_amp]', v_s, v_g_quarvin_far_stack_amp;
  end if;
  v_s := pg_temp.qi_prof(v_case_i, 'shuey_a');
  if v_s is null or abs(v_s - v_g_quarvin_shuey_a) > 1e-9 * abs(v_g_quarvin_shuey_a) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/quarvin_shuey_a]', v_s, v_g_quarvin_shuey_a;
  end if;
  v_s := pg_temp.qi_prof(v_case_i, 'scale');
  if v_s is null or abs(v_s - v_g_quarvin_one_scale) > 1e-9 * abs(v_g_quarvin_one_scale) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/quarvin_one_scale]', v_s, v_g_quarvin_one_scale;
  end if;
  v_s := pg_temp.qi_exp(v_case_a, 'lfm');
  if v_s is null or abs(v_s - v_g_delsholm_lfm_lnai_b) > 1e-9 * abs(v_g_delsholm_lfm_lnai_b) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/delsholm_lfm_lnai_b]', v_s, v_g_delsholm_lfm_lnai_b;
  end if;
  v_s := pg_temp.qi_exp(v_case_a, 'mb');
  if v_s is null or abs(v_s - v_g_delsholm_mb_ai) > 1e-9 * abs(v_g_delsholm_mb_ai) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/delsholm_mb_ai]', v_s, v_g_delsholm_mb_ai;
  end if;
  v_s := pg_temp.qi_exp(v_case_a, 'sim');
  if v_s is null or abs(v_s - v_g_delsholm_sim_vpvs) > 1e-9 * abs(v_g_delsholm_sim_vpvs) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/delsholm_sim_vpvs]', v_s, v_g_delsholm_sim_vpvs;
  end if;
  v_s := pg_temp.qi_exp(v_case_a, 'phi');
  if v_s is null or abs(v_s - v_g_delsholm_phi_q90) > 1e-9 * abs(v_g_delsholm_phi_q90) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/delsholm_phi_q90]', v_s, v_g_delsholm_phi_q90;
  end if;
  v_s := pg_temp.qi_exp(v_case_a, 'poil');
  if v_s is null or abs(v_s - v_g_delsholm_p_oil) > 1e-9 * abs(v_g_delsholm_p_oil) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/delsholm_p_oil]', v_s, v_g_delsholm_p_oil;
  end if;
  v_s := pg_temp.qi_exp(v_case_a, 'column');
  if v_s is null or abs(v_s - v_g_delsholm_column_ft) > 1e-9 * abs(v_g_delsholm_column_ft) then
    raise exception 'QI go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/delsholm_column_ft]', v_s, v_g_delsholm_column_ft;
  end if;

  -- ---------------------------------------------------- 3. against the oracle
  -- tamberlo_low6_hz: oracle_check.py: standard-library Python replay (direct DFT, Batzle-Wang, Wood, VRH, Gassmann, OLS, Shuey, eigenvector line)
  if abs(v_g_tamberlo_low6_hz - 20.74017707924609::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 20.74017707924609, not within 5e-07 of the seeded % [graded field: beginner/tamberlo_low6_hz]', v_g_tamberlo_low6_hz;
  end if;
  -- tamberlo_centroid_hz: oracle_check.py: standard-library Python replay (direct DFT, Batzle-Wang, Wood, VRH, Gassmann, OLS, Shuey, eigenvector line)
  if abs(v_g_tamberlo_centroid_hz - 39.795518606671486::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 39.795518606671486, not within 5e-07 of the seeded % [graded field: beginner/tamberlo_centroid_hz]', v_g_tamberlo_centroid_hz;
  end if;
  -- tamberlo_shear_slope: oracle_check.py: standard-library Python replay (direct DFT, Batzle-Wang, Wood, VRH, Gassmann, OLS, Shuey, eigenvector line)
  if abs(v_g_tamberlo_shear_slope - 835.4020425022768::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 835.4020425022768, not within 5e-07 of the seeded % [graded field: beginner/tamberlo_shear_slope]', v_g_tamberlo_shear_slope;
  end if;
  -- tamberlo_ai_brine: oracle_check.py: standard-library Python replay (direct DFT, Batzle-Wang, Wood, VRH, Gassmann, OLS, Shuey, eigenvector line)
  if abs(v_g_tamberlo_ai_brine - 6066964.699156452::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 6066964.699156452, not within 5e-07 of the seeded % [graded field: beginner/tamberlo_ai_brine]', v_g_tamberlo_ai_brine;
  end if;
  -- tamberlo_vpvs_brine: oracle_check.py: standard-library Python replay (direct DFT, Batzle-Wang, Wood, VRH, Gassmann, OLS, Shuey, eigenvector line)
  if abs(v_g_tamberlo_vpvs_brine - 1.91832635055991::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 1.91832635055991, not within 5e-07 of the seeded % [graded field: beginner/tamberlo_vpvs_brine]', v_g_tamberlo_vpvs_brine;
  end if;
  -- tamberlo_wet_distance: oracle_check.py: standard-library Python replay (direct DFT, Batzle-Wang, Wood, VRH, Gassmann, OLS, Shuey, eigenvector line)
  if abs(v_g_tamberlo_wet_distance - -0.05957896583597672::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives -0.05957896583597672, not within 5e-07 of the seeded % [graded field: beginner/tamberlo_wet_distance]', v_g_tamberlo_wet_distance;
  end if;
  -- quarvin_dix_vint: oracle_check.py: standard-library Python replay (Dix, Walden, NMO stretch, Walden-binned partial stacks, two-term Shuey regression, least squares one scale)
  if abs(v_g_quarvin_dix_vint - 2820.8223895680444::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 2820.8223895680444, not within 5e-07 of the seeded % [graded field: intermediate/quarvin_dix_vint]', v_g_quarvin_dix_vint;
  end if;
  -- quarvin_walden_deg: oracle_check.py: standard-library Python replay (Dix, Walden, NMO stretch, Walden-binned partial stacks, two-term Shuey regression, least squares one scale)
  if abs(v_g_quarvin_walden_deg - 36.52301164233891::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 36.52301164233891, not within 5e-07 of the seeded % [graded field: intermediate/quarvin_walden_deg]', v_g_quarvin_walden_deg;
  end if;
  -- quarvin_nmo_stretch: oracle_check.py: standard-library Python replay (Dix, Walden, NMO stretch, Walden-binned partial stacks, two-term Shuey regression, least squares one scale)
  if abs(v_g_quarvin_nmo_stretch - 0.12037307727748914::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 0.12037307727748914, not within 5e-07 of the seeded % [graded field: intermediate/quarvin_nmo_stretch]', v_g_quarvin_nmo_stretch;
  end if;
  -- quarvin_far_stack_amp: oracle_check.py: standard-library Python replay (Dix, Walden, NMO stretch, Walden-binned partial stacks, two-term Shuey regression, least squares one scale)
  if abs(v_g_quarvin_far_stack_amp - 26.746679333333333::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 26.746679333333333, not within 5e-07 of the seeded % [graded field: intermediate/quarvin_far_stack_amp]', v_g_quarvin_far_stack_amp;
  end if;
  -- quarvin_shuey_a: oracle_check.py: standard-library Python replay (Dix, Walden, NMO stretch, Walden-binned partial stacks, two-term Shuey regression, least squares one scale)
  if abs(v_g_quarvin_shuey_a - 83.24177796156101::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 83.24177796156101, not within 5e-07 of the seeded % [graded field: intermediate/quarvin_shuey_a]', v_g_quarvin_shuey_a;
  end if;
  -- quarvin_one_scale: oracle_check.py: standard-library Python replay (Dix, Walden, NMO stretch, Walden-binned partial stacks, two-term Shuey regression, least squares one scale)
  if abs(v_g_quarvin_one_scale - 1137.2725681690208::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 1137.2725681690208, not within 5e-07 of the seeded % [graded field: intermediate/quarvin_one_scale]', v_g_quarvin_one_scale;
  end if;
  -- delsholm_lfm_lnai_b: oracle_check.py: standard-library Python replay (IDW low-frequency model, exact normal equations for both inversions, OLS with the Student t interval, Gaussian Bayes, priority-flood closure)
  if abs(v_g_delsholm_lfm_lnai_b - 15.628802751655897::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 15.628802751655897, not within 5e-07 of the seeded % [graded field: advanced/delsholm_lfm_lnai_b]', v_g_delsholm_lfm_lnai_b;
  end if;
  -- delsholm_mb_ai: oracle_check.py: standard-library Python replay (IDW low-frequency model, exact normal equations for both inversions, OLS with the Student t interval, Gaussian Bayes, priority-flood closure)
  if abs(v_g_delsholm_mb_ai - 5925842.253249383::double precision) > 1.0::double precision then
    raise exception 'QI go-live refused: the oracle gives 5925842.253249383, not within 1.0 of the seeded % [graded field: advanced/delsholm_mb_ai]', v_g_delsholm_mb_ai;
  end if;
  -- delsholm_sim_vpvs: oracle_check.py: standard-library Python replay (IDW low-frequency model, exact normal equations for both inversions, OLS with the Student t interval, Gaussian Bayes, priority-flood closure)
  if abs(v_g_delsholm_sim_vpvs - 1.890960217399456::double precision) > 5e-06::double precision then
    raise exception 'QI go-live refused: the oracle gives 1.890960217399456, not within 5e-06 of the seeded % [graded field: advanced/delsholm_sim_vpvs]', v_g_delsholm_sim_vpvs;
  end if;
  -- delsholm_phi_q90: oracle_check.py: standard-library Python replay (IDW low-frequency model, exact normal equations for both inversions, OLS with the Student t interval, Gaussian Bayes, priority-flood closure)
  if abs(v_g_delsholm_phi_q90 - 0.21335715041962558::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 0.21335715041962558, not within 5e-07 of the seeded % [graded field: advanced/delsholm_phi_q90]', v_g_delsholm_phi_q90;
  end if;
  -- delsholm_p_oil: oracle_check.py: standard-library Python replay (IDW low-frequency model, exact normal equations for both inversions, OLS with the Student t interval, Gaussian Bayes, priority-flood closure)
  if abs(v_g_delsholm_p_oil - 0.8099435384728412::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 0.8099435384728412, not within 5e-07 of the seeded % [graded field: advanced/delsholm_p_oil]', v_g_delsholm_p_oil;
  end if;
  -- delsholm_column_ft: oracle_check.py: standard-library Python replay (IDW low-frequency model, exact normal equations for both inversions, OLS with the Student t interval, Gaussian Bayes, priority-flood closure)
  if abs(v_g_delsholm_column_ft - 139.64800000000105::double precision) > 5e-07::double precision then
    raise exception 'QI go-live refused: the oracle gives 139.64800000000105, not within 5e-07 of the seeded % [graded field: advanced/delsholm_column_ft]', v_g_delsholm_column_ft;
  end if;

  -- ------------------------------------------------------------- 4. the traps
  v_wrong := 20.769047921970323::double precision;
  if abs(v_wrong - v_g_tamberlo_low6_hz) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (no taper) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_low6_hz]', v_wrong, v_g_tamberlo_low6_hz;
  end if;
  v_wrong := 20.77489459605534::double precision;
  if abs(v_wrong - v_g_tamberlo_low6_hz) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (taper 0.25) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_low6_hz]', v_wrong, v_g_tamberlo_low6_hz;
  end if;
  v_wrong := 36.01334292683473::double precision;
  if abs(v_wrong - v_g_tamberlo_low6_hz) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the first trace alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_low6_hz]', v_wrong, v_g_tamberlo_low6_hz;
  end if;
  v_wrong := 8.99380756636787::double precision;
  if abs(v_wrong - v_g_tamberlo_low6_hz) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the -20 dB low edge) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_low6_hz]', v_wrong, v_g_tamberlo_low6_hz;
  end if;
  v_wrong := 38.01780316327493::double precision;
  if abs(v_wrong - v_g_tamberlo_low6_hz) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the peak frequency) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_low6_hz]', v_wrong, v_g_tamberlo_low6_hz;
  end if;
  v_wrong := 49.07789378468019::double precision;
  if abs(v_wrong - v_g_tamberlo_low6_hz) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the -6 dB high edge) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_low6_hz]', v_wrong, v_g_tamberlo_low6_hz;
  end if;
  v_wrong := 60.6699016281057::double precision;
  if abs(v_wrong - v_g_tamberlo_centroid_hz) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (amplitude-weighted centroid) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_centroid_hz]', v_wrong, v_g_tamberlo_centroid_hz;
  end if;
  v_wrong := 40.050787025280044::double precision;
  if abs(v_wrong - v_g_tamberlo_centroid_hz) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (no taper) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_centroid_hz]', v_wrong, v_g_tamberlo_centroid_hz;
  end if;
  v_wrong := 39.87844505931668::double precision;
  if abs(v_wrong - v_g_tamberlo_centroid_hz) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the first trace alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_centroid_hz]', v_wrong, v_g_tamberlo_centroid_hz;
  end if;
  v_wrong := 38.01780316327493::double precision;
  if abs(v_wrong - v_g_tamberlo_centroid_hz) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the peak frequency) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_centroid_hz]', v_wrong, v_g_tamberlo_centroid_hz;
  end if;
  v_wrong := 34.90903543196314::double precision;
  if abs(v_wrong - v_g_tamberlo_centroid_hz) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the middle of the -6 dB band) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_centroid_hz]', v_wrong, v_g_tamberlo_centroid_hz;
  end if;
  v_wrong := 455.9213251141482::double precision;
  if abs(v_wrong - v_g_tamberlo_shear_slope) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (fitted on the oil leg) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_shear_slope]', v_wrong, v_g_tamberlo_shear_slope;
  end if;
  v_wrong := 219.7043696049077::double precision;
  if abs(v_wrong - v_g_tamberlo_shear_slope) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (fitted on all net sand) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_shear_slope]', v_wrong, v_g_tamberlo_shear_slope;
  end if;
  v_wrong := 1665.9639880657196::double precision;
  if abs(v_wrong - v_g_tamberlo_shear_slope) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the quadratic form) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_shear_slope]', v_wrong, v_g_tamberlo_shear_slope;
  end if;
  v_wrong := 804.16::double precision;
  if abs(v_wrong - v_g_tamberlo_shear_slope) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the Greenberg-Castagna sandstone slope) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_shear_slope]', v_wrong, v_g_tamberlo_shear_slope;
  end if;
  v_wrong := 854.9338316100184::double precision;
  if abs(v_wrong - v_g_tamberlo_shear_slope) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (no net sand cut) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_shear_slope]', v_wrong, v_g_tamberlo_shear_slope;
  end if;
  v_wrong := 858.5989682574291::double precision;
  if abs(v_wrong - v_g_tamberlo_shear_slope) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (a net sand cut of 0.25) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_shear_slope]', v_wrong, v_g_tamberlo_shear_slope;
  end if;
  v_wrong := 5390498.74366::double precision;
  if abs(v_wrong - v_g_tamberlo_ai_brine) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the in situ AI) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_ai_brine]', v_wrong, v_g_tamberlo_ai_brine;
  end if;
  v_wrong := 6072215.793039133::double precision;
  if abs(v_wrong - v_g_tamberlo_ai_brine) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the zone-mean Sw) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_ai_brine]', v_wrong, v_g_tamberlo_ai_brine;
  end if;
  v_wrong := 5877450.221462238::double precision;
  if abs(v_wrong - v_g_tamberlo_ai_brine) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (a Voigt fluid mix) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_ai_brine]', v_wrong, v_g_tamberlo_ai_brine;
  end if;
  v_wrong := 6072215.538034469::double precision;
  if abs(v_wrong - v_g_tamberlo_ai_brine) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (a pure quartz mineral) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_ai_brine]', v_wrong, v_g_tamberlo_ai_brine;
  end if;
  v_wrong := 6245291.744946529::double precision;
  if abs(v_wrong - v_g_tamberlo_ai_brine) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the next sample down) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_ai_brine]', v_wrong, v_g_tamberlo_ai_brine;
  end if;
  v_wrong := 1.7193271948467388::double precision;
  if abs(v_wrong - v_g_tamberlo_vpvs_brine) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the in situ Vp/Vs) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_vpvs_brine]', v_wrong, v_g_tamberlo_vpvs_brine;
  end if;
  v_wrong := 1.9196718944658462::double precision;
  if abs(v_wrong - v_g_tamberlo_vpvs_brine) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the zone-mean Sw) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_vpvs_brine]', v_wrong, v_g_tamberlo_vpvs_brine;
  end if;
  v_wrong := 1.858403368574543::double precision;
  if abs(v_wrong - v_g_tamberlo_vpvs_brine) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (a Voigt fluid mix) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_vpvs_brine]', v_wrong, v_g_tamberlo_vpvs_brine;
  end if;
  v_wrong := 1.9199866243676091::double precision;
  if abs(v_wrong - v_g_tamberlo_vpvs_brine) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (a pure quartz mineral) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_vpvs_brine]', v_wrong, v_g_tamberlo_vpvs_brine;
  end if;
  v_wrong := 1.9182400114929141::double precision;
  if abs(v_wrong - v_g_tamberlo_vpvs_brine) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the next sample down) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_vpvs_brine]', v_wrong, v_g_tamberlo_vpvs_brine;
  end if;
  v_wrong := -0.27213971570245216::double precision;
  if abs(v_wrong - v_g_tamberlo_wet_distance) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (from the published Castagna line) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_wet_distance]', v_wrong, v_g_tamberlo_wet_distance;
  end if;
  v_wrong := -0.002304391440211141::double precision;
  if abs(v_wrong - v_g_tamberlo_wet_distance) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the brine interface) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_wet_distance]', v_wrong, v_g_tamberlo_wet_distance;
  end if;
  v_wrong := -0.058338036196879856::double precision;
  if abs(v_wrong - v_g_tamberlo_wet_distance) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (blocks of 8 ft) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_wet_distance]', v_wrong, v_g_tamberlo_wet_distance;
  end if;
  v_wrong := -0.052905574591383335::double precision;
  if abs(v_wrong - v_g_tamberlo_wet_distance) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (blocks of 24 ft) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_wet_distance]', v_wrong, v_g_tamberlo_wet_distance;
  end if;
  v_wrong := -0.06076653436690274::double precision;
  if abs(v_wrong - v_g_tamberlo_wet_distance) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (a cap rock of 30 ft) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_wet_distance]', v_wrong, v_g_tamberlo_wet_distance;
  end if;
  v_wrong := -0.05934048785375771::double precision;
  if abs(v_wrong - v_g_tamberlo_wet_distance) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (a cap rock of 100 ft) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_wet_distance]', v_wrong, v_g_tamberlo_wet_distance;
  end if;
  v_wrong := -0.03538021013374697::double precision;
  if abs(v_wrong - v_g_tamberlo_wet_distance) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (all net sand below the cap) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/tamberlo_wet_distance]', v_wrong, v_g_tamberlo_wet_distance;
  end if;
  v_wrong := 2385.0::double precision;
  if abs(v_wrong - v_g_quarvin_dix_vint) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the RMS velocity at the layer base) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_dix_vint]', v_wrong, v_g_quarvin_dix_vint;
  end if;
  v_wrong := 2262.5::double precision;
  if abs(v_wrong - v_g_quarvin_dix_vint) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the mean of the two RMS velocities) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_dix_vint]', v_wrong, v_g_quarvin_dix_vint;
  end if;
  v_wrong := 3157.0120367207983::double precision;
  if abs(v_wrong - v_g_quarvin_dix_vint) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the layer below) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_dix_vint]', v_wrong, v_g_quarvin_dix_vint;
  end if;
  v_wrong := 2395.1218540300147::double precision;
  if abs(v_wrong - v_g_quarvin_dix_vint) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the layer above) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_dix_vint]', v_wrong, v_g_quarvin_dix_vint;
  end if;
  v_wrong := 3157.0120367207983::double precision;
  if abs(v_wrong - v_g_quarvin_dix_vint) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the interval velocity at the stated time) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_dix_vint]', v_wrong, v_g_quarvin_dix_vint;
  end if;
  v_wrong := 26.803302708516693::double precision;
  if abs(v_wrong - v_g_quarvin_walden_deg) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (Vint taken equal to Vrms) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_walden_deg]', v_wrong, v_g_quarvin_walden_deg;
  end if;
  v_wrong := 26.803302708516696::double precision;
  if abs(v_wrong - v_g_quarvin_walden_deg) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the geometric angle atan(x / (Vrms t0))) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_walden_deg]', v_wrong, v_g_quarvin_walden_deg;
  end if;
  v_wrong := 18.858933524045405::double precision;
  if abs(v_wrong - v_g_quarvin_walden_deg) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (half the offset) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_walden_deg]', v_wrong, v_g_quarvin_walden_deg;
  end if;
  v_wrong := 69.73119744226818::double precision;
  if abs(v_wrong - v_g_quarvin_walden_deg) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (one-way time) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_walden_deg]', v_wrong, v_g_quarvin_walden_deg;
  end if;
  v_wrong := 31.023687490743967::double precision;
  if abs(v_wrong - v_g_quarvin_walden_deg) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the velocities of the next table row) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_walden_deg]', v_wrong, v_g_quarvin_walden_deg;
  end if;
  v_wrong := 0.07075904339522165::double precision;
  if abs(v_wrong - v_g_quarvin_nmo_stretch) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the interval velocity as the NMO velocity) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_nmo_stretch]', v_wrong, v_g_quarvin_nmo_stretch;
  end if;
  v_wrong := 0.4215988636577208::double precision;
  if abs(v_wrong - v_g_quarvin_nmo_stretch) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (one-way time) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_nmo_stretch]', v_wrong, v_g_quarvin_nmo_stretch;
  end if;
  v_wrong := 0.031411148898467856::double precision;
  if abs(v_wrong - v_g_quarvin_nmo_stretch) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (half the offset) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_nmo_stretch]', v_wrong, v_g_quarvin_nmo_stretch;
  end if;
  v_wrong := 0.10744017302700293::double precision;
  if abs(v_wrong - v_g_quarvin_nmo_stretch) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (stretch read as 1 - t0 / t) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_nmo_stretch]', v_wrong, v_g_quarvin_nmo_stretch;
  end if;
  v_wrong := 0.12104249279374368::double precision;
  if abs(v_wrong - v_g_quarvin_nmo_stretch) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the RMS velocity at the layer base) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_nmo_stretch]', v_wrong, v_g_quarvin_nmo_stretch;
  end if;
  v_wrong := 53.123462333333336::double precision;
  if abs(v_wrong - v_g_quarvin_far_stack_amp) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (every bin stacked) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_far_stack_amp]', v_wrong, v_g_quarvin_far_stack_amp;
  end if;
  v_wrong := 55.65315366666666::double precision;
  if abs(v_wrong - v_g_quarvin_far_stack_amp) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the mid bin) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_far_stack_amp]', v_wrong, v_g_quarvin_far_stack_amp;
  end if;
  v_wrong := 1.2121648::double precision;
  if abs(v_wrong - v_g_quarvin_far_stack_amp) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (Vint taken equal to Vrms) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_far_stack_amp]', v_wrong, v_g_quarvin_far_stack_amp;
  end if;
  v_wrong := 47.443543999999996::double precision;
  if abs(v_wrong - v_g_quarvin_far_stack_amp) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (edges moved down five degrees) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_far_stack_amp]', v_wrong, v_g_quarvin_far_stack_amp;
  end if;
  v_wrong := 23.286663::double precision;
  if abs(v_wrong - v_g_quarvin_far_stack_amp) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the next sample down) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_far_stack_amp]', v_wrong, v_g_quarvin_far_stack_amp;
  end if;
  v_wrong := 84.71357114683485::double precision;
  if abs(v_wrong - v_g_quarvin_shuey_a) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (three Shuey terms) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_shuey_a]', v_wrong, v_g_quarvin_shuey_a;
  end if;
  v_wrong := 77.53223275924339::double precision;
  if abs(v_wrong - v_g_quarvin_shuey_a) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (angles at the bins near edges) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_shuey_a]', v_wrong, v_g_quarvin_shuey_a;
  end if;
  v_wrong := 76.970554::double precision;
  if abs(v_wrong - v_g_quarvin_shuey_a) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the near bin amplitude) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_shuey_a]', v_wrong, v_g_quarvin_shuey_a;
  end if;
  v_wrong := 78.4699810170116::double precision;
  if abs(v_wrong - v_g_quarvin_shuey_a) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (Vint taken equal to Vrms) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_shuey_a]', v_wrong, v_g_quarvin_shuey_a;
  end if;
  v_wrong := 75.23834949609724::double precision;
  if abs(v_wrong - v_g_quarvin_shuey_a) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the next sample down) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_shuey_a]', v_wrong, v_g_quarvin_shuey_a;
  end if;
  v_wrong := 1115.2698817070848::double precision;
  if abs(v_wrong - v_g_quarvin_one_scale) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (intercepts alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_one_scale]', v_wrong, v_g_quarvin_one_scale;
  end if;
  v_wrong := 1141.1036979470516::double precision;
  if abs(v_wrong - v_g_quarvin_one_scale) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (gradients alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_one_scale]', v_wrong, v_g_quarvin_one_scale;
  end if;
  v_wrong := 1137.3633967461546::double precision;
  if abs(v_wrong - v_g_quarvin_one_scale) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the mean of the wells own ratios) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_one_scale]', v_wrong, v_g_quarvin_one_scale;
  end if;
  v_wrong := 0.0008792966857628281::double precision;
  if abs(v_wrong - v_g_quarvin_one_scale) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the inverse, modelled over observed) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_one_scale]', v_wrong, v_g_quarvin_one_scale;
  end if;
  v_wrong := 1134.2399589662923::double precision;
  if abs(v_wrong - v_g_quarvin_one_scale) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the first three wells) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/quarvin_one_scale]', v_wrong, v_g_quarvin_one_scale;
  end if;
  v_wrong := 15.627088138316035::double precision;
  if abs(v_wrong - v_g_delsholm_lfm_lnai_b) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (inverse distance power 1) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_lfm_lnai_b]', v_wrong, v_g_delsholm_lfm_lnai_b;
  end if;
  v_wrong := 15.625906189333334::double precision;
  if abs(v_wrong - v_g_delsholm_lfm_lnai_b) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (power 0, a plain mean of the wells) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_lfm_lnai_b]', v_wrong, v_g_delsholm_lfm_lnai_b;
  end if;
  v_wrong := 15.657633122881371::double precision;
  if abs(v_wrong - v_g_delsholm_lfm_lnai_b) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (at constant time, the horizons ignored) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_lfm_lnai_b]', v_wrong, v_g_delsholm_lfm_lnai_b;
  end if;
  v_wrong := 15.629315304959764::double precision;
  if abs(v_wrong - v_g_delsholm_lfm_lnai_b) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (one sample late) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_lfm_lnai_b]', v_wrong, v_g_delsholm_lfm_lnai_b;
  end if;
  v_wrong := 15.608743701555545::double precision;
  if abs(v_wrong - v_g_delsholm_lfm_lnai_b) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the target position in place of the second) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_lfm_lnai_b]', v_wrong, v_g_delsholm_lfm_lnai_b;
  end if;
  v_wrong := 6325606.364290068::double precision;
  if abs(v_wrong - v_g_delsholm_mb_ai) <= 1.0::double precision then
    raise exception 'QI go-live refused: the trap (a flat LFM, the mean of the supplied one) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_mb_ai]', v_wrong, v_g_delsholm_mb_ai;
  end if;
  v_wrong := 6125199.590082096::double precision;
  if abs(v_wrong - v_g_delsholm_mb_ai) <= 1.0::double precision then
    raise exception 'QI go-live refused: the trap (the LFM alone, no inversion) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_mb_ai]', v_wrong, v_g_delsholm_mb_ai;
  end if;
  v_wrong := 6096066.7406962365::double precision;
  if abs(v_wrong - v_g_delsholm_mb_ai) <= 1.0::double precision then
    raise exception 'QI go-live refused: the trap (eps ten times the stated) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_mb_ai]', v_wrong, v_g_delsholm_mb_ai;
  end if;
  v_wrong := 5973788.152748022::double precision;
  if abs(v_wrong - v_g_delsholm_mb_ai) <= 1.0::double precision then
    raise exception 'QI go-live refused: the trap (the far-angle trace in place of the full stack) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_mb_ai]', v_wrong, v_g_delsholm_mb_ai;
  end if;
  v_wrong := 5907821.133390615::double precision;
  if abs(v_wrong - v_g_delsholm_mb_ai) <= 1.0::double precision then
    raise exception 'QI go-live refused: the trap (the near-angle wavelet) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_mb_ai]', v_wrong, v_g_delsholm_mb_ai;
  end if;
  v_wrong := 5639912.396575031::double precision;
  if abs(v_wrong - v_g_delsholm_mb_ai) <= 1.0::double precision then
    raise exception 'QI go-live refused: the trap (one sample late) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_mb_ai]', v_wrong, v_g_delsholm_mb_ai;
  end if;
  v_wrong := 1.8720849724892101::double precision;
  if abs(v_wrong - v_g_delsholm_sim_vpvs) <= 5e-06::double precision then
    raise exception 'QI go-live refused: the trap (the near trace alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_sim_vpvs]', v_wrong, v_g_delsholm_sim_vpvs;
  end if;
  v_wrong := 1.8871067951050575::double precision;
  if abs(v_wrong - v_g_delsholm_sim_vpvs) <= 5e-06::double precision then
    raise exception 'QI go-live refused: the trap (the full-stack wavelet for every angle) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_sim_vpvs]', v_wrong, v_g_delsholm_sim_vpvs;
  end if;
  v_wrong := 1.8916337787723212::double precision;
  if abs(v_wrong - v_g_delsholm_sim_vpvs) <= 5e-06::double precision then
    raise exception 'QI go-live refused: the trap (a background Vs/Vp of 0.5) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_sim_vpvs]', v_wrong, v_g_delsholm_sim_vpvs;
  end if;
  v_wrong := 1.7452621960793344::double precision;
  if abs(v_wrong - v_g_delsholm_sim_vpvs) <= 5e-06::double precision then
    raise exception 'QI go-live refused: the trap (the LFMs alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_sim_vpvs]', v_wrong, v_g_delsholm_sim_vpvs;
  end if;
  v_wrong := 0.5288318552651412::double precision;
  if abs(v_wrong - v_g_delsholm_sim_vpvs) <= 5e-06::double precision then
    raise exception 'QI go-live refused: the trap (Vs/Vp read in place of Vp/Vs) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_sim_vpvs]', v_wrong, v_g_delsholm_sim_vpvs;
  end if;
  v_wrong := 1.7999980815275871::double precision;
  if abs(v_wrong - v_g_delsholm_sim_vpvs) <= 5e-06::double precision then
    raise exception 'QI go-live refused: the trap (one sample late) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_sim_vpvs]', v_wrong, v_g_delsholm_sim_vpvs;
  end if;
  v_wrong := 0.2164184423872845::double precision;
  if abs(v_wrong - v_g_delsholm_phi_q90) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the 90 percent interval) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_phi_q90]', v_wrong, v_g_delsholm_phi_q90;
  end if;
  v_wrong := 0.20283908157096872::double precision;
  if abs(v_wrong - v_g_delsholm_phi_q90) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the predicted porosity) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_phi_q90]', v_wrong, v_g_delsholm_phi_q90;
  end if;
  v_wrong := 0.1923210127223116::double precision;
  if abs(v_wrong - v_g_delsholm_phi_q90) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the low end of the interval) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_phi_q90]', v_wrong, v_g_delsholm_phi_q90;
  end if;
  v_wrong := 0.20971107090950888::double precision;
  if abs(v_wrong - v_g_delsholm_phi_q90) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the 80 percent interval read as the 60 percent) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_phi_q90]', v_wrong, v_g_delsholm_phi_q90;
  end if;
  v_wrong := 0.21309301528311025::double precision;
  if abs(v_wrong - v_g_delsholm_phi_q90) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (y + 1.2816 s, a normal quantile and no leverage) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_phi_q90]', v_wrong, v_g_delsholm_phi_q90;
  end if;
  v_wrong := 0.8317038761817739::double precision;
  if abs(v_wrong - v_g_delsholm_p_oil) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (equal priors) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_p_oil]', v_wrong, v_g_delsholm_p_oil;
  end if;
  v_wrong := 0.7720700327657926::double precision;
  if abs(v_wrong - v_g_delsholm_p_oil) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (a kernel density) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_p_oil]', v_wrong, v_g_delsholm_p_oil;
  end if;
  v_wrong := 0.1862593725957734::double precision;
  if abs(v_wrong - v_g_delsholm_p_oil) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the brine-sand posterior) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_p_oil]', v_wrong, v_g_delsholm_p_oil;
  end if;
  v_wrong := 0.2708333333333333::double precision;
  if abs(v_wrong - v_g_delsholm_p_oil) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the oil-sand prior alone) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_p_oil]', v_wrong, v_g_delsholm_p_oil;
  end if;
  v_wrong := 0.39154426811587595::double precision;
  if abs(v_wrong - v_g_delsholm_p_oil) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (at the porosity transforms AI) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_p_oil]', v_wrong, v_g_delsholm_p_oil;
  end if;
  v_wrong := 42.56471040000032::double precision;
  if abs(v_wrong - v_g_delsholm_column_ft) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the column in metres) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_column_ft]', v_wrong, v_g_delsholm_column_ft;
  end if;
  v_wrong := 116.00900000000001::double precision;
  if abs(v_wrong - v_g_delsholm_column_ft) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (the second culminations trap) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_column_ft]', v_wrong, v_g_delsholm_column_ft;
  end if;
  v_wrong := 132.52047890820177::double precision;
  if abs(v_wrong - v_g_delsholm_column_ft) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (crest less the mean of the mapped nodes) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_column_ft]', v_wrong, v_g_delsholm_column_ft;
  end if;
  v_wrong := 198.14099999999962::double precision;
  if abs(v_wrong - v_g_delsholm_column_ft) <= 5e-07::double precision then
    raise exception 'QI go-live refused: the trap (crest less the lowest mapped node) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/delsholm_column_ft]', v_wrong, v_g_delsholm_column_ft;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'qi';
  if not exists (select 1 from public.academy_apps where slug = 'qi' and status = 'available') then
    raise exception 'QI go-live refused: qi did not reach status available';
  end if;
  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon from public.academy_apps;
  raise notice 'QI go-live: qi available, 3 tiers, % lessons, % questions, % capstones, % graded, catalogue % available and % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
