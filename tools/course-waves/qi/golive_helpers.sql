-- ----------------------------------------------------------------------------
-- QI go-live helpers: the SECOND ROUTE IN SQL. Temporary functions (pg_temp),
-- gone when the session ends; nothing is created in any schema. They rebuild
-- the Associate (TAMBERLO) arithmetic from the case file the learner is handed,
-- in plpgsql, from the published equations, with no engine code:
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
