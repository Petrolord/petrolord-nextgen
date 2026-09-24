-- ============================================================================
-- D2 GO-LIVE (HELD): Machine Learning on Well Data flips to 'available', the
-- SECOND course of the Data & AI module, at path_order 67.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/mlcore. The 78 lessons, the teaching lab
-- (mlcoreLab.js), its three explorer panels and the three capstone case files
-- ship in the ZIP and NOT in this database, so a flip before the upload puts a
-- live catalogue tile in front of a route that does not exist. This file is
-- written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values d2_capstone.mjs returned through
--      the vendored engines/dataai/ml.js when this file was generated, to the
--      last bit, so a capstone row an earlier seed left behind, or a move of
--      one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the data in the case files: the seeded
--      shuffles rebuilt in 64-bit integer arithmetic, least squares by the
--      centred normal equations, ridge by the standardised normal equations,
--      logistic regression by Newton steps with Gaussian elimination, and the
--      scaled condition number by a one-sided Jacobi SVD, each to 1e-9
--      relative;
--   3. by the TRAPS the course is built on, each of which must bite on these
--      inputs: the reading a learner who missed the lesson would give is
--      computed and refused if it lands within the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. Every field must
-- carry a positive, non-whole expected value at the six-decimal floor 5e-7
-- with a label and a unit, the six-decimal answer the prompt asks for must
-- pass, and one unit either side of it in the sixth decimal must fail.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and the generator refuses a bare integer denominator.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================

-- ------------------------------------------------ the second route's helpers
-- a x b modulo 2^32 for a, b in [0, 2^32), with b split into 16-bit halves so
-- no product leaves bigint.
create or replace function pg_temp.d2_imul(a bigint, b bigint) returns bigint
language sql immutable as $f$
  select ((a * (b & 65535)) + (((a * (b >> 16)) & 65535) << 16)) & 4294967295
$f$;

-- n draws of mulberry32(seed), each in [0, 1).
create or replace function pg_temp.d2_u(p_seed bigint, p_n int) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  a bigint := p_seed & 4294967295; t bigint; u double precision[] := '{}'; i int;
begin
  for i in 1 .. p_n loop
    a := (a + 1831565813) & 4294967295;
    t := pg_temp.d2_imul(a # (a >> 15), a | 1);
    t := t # ((t + pg_temp.d2_imul(t # (t >> 7), t | 61)) & 4294967295);
    u := u || ((t # (t >> 14))::double precision / 4294967296.0);
  end loop;
  return u;
end $f$;

-- Fisher-Yates from the end over 0 .. n - 1, j = floor(u x (i + 1)), reading
-- the draws u[off + 1], u[off + 2], ...
create or replace function pg_temp.d2_perm(p_n int, u double precision[], p_off int) returns int[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  a int[] := array(select g from generate_series(0, p_n - 1) g order by g); i int; j int; t int; o int := p_off;
begin
  for i in reverse p_n - 1 .. 1 loop
    o := o + 1;
    j := floor(u[o] * (i + 1)::double precision)::int;
    t := a[i + 1]; a[i + 1] := a[j + 1]; a[j + 1] := t;
  end loop;
  return a;
end $f$;

-- ceil(f x m), a product within 1e-9 of a whole number taken as it.
create or replace function pg_temp.d2_ceil(f double precision, m int) returns int
language sql immutable as $f$
  select case when abs(f * m::double precision - round(f * m::double precision)) <= 1e-9
              then round(f * m::double precision)::int else ceil(f * m::double precision)::int end
$f$;

-- the distinct well names sorted by code unit, then shuffled with the seed.
create or replace function pg_temp.d2_order(wells text[], p_seed bigint) returns text[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  ids text[] := array(select x from (select distinct x collate "C" as x from unnest(wells) x) d order by x);
  g int := array_length(ids, 1); pm int[];
begin
  pm := pg_temp.d2_perm(g, pg_temp.d2_u(p_seed, g - 1), 0);
  return array(select ids[pm[q] + 1] from generate_series(1, g) q order by q);
end $f$;

-- the test wells of a whole-well split at a fraction and a seed.
create or replace function pg_temp.d2_gtest(wells text[], f double precision, p_seed bigint) returns text[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare o text[] := pg_temp.d2_order(wells, p_seed);
begin
  return o[1 : pg_temp.d2_ceil(f, array_length(o, 1))];
end $f$;

-- 1-based row numbers whose well is (or is not) in a list, in row order.
create or replace function pg_temp.d2_rows(wells text[], sel text[], p_in boolean) returns int[]
language sql immutable as $f$
  select array(select i from generate_subscripts(wells, 1) i where (wells[i] = any(sel)) = p_in order by i)
$f$;

-- columns (k arrays of n) to an n x k matrix.
create or replace function pg_temp.d2_t(cols double precision[]) returns double precision[]
language sql immutable as $f$
  select array_agg(r order by i) from (
    select i, array(select cols[j][i] from generate_series(1, array_length(cols, 1)) j order by j) r
      from generate_series(1, array_length(cols, 2)) i) s
$f$;

-- the rows idx of a matrix, and the entries idx of a vector.
create or replace function pg_temp.d2_sub(x double precision[], idx int[]) returns double precision[]
language sql immutable as $f$
  select array_agg(r order by o) from (
    select o, array(select x[i][j] from generate_series(1, array_length(x, 2)) j order by j) r
      from unnest(idx) with ordinality u(i, o)) s
$f$;
create or replace function pg_temp.d2_vsub(y double precision[], idx int[]) returns double precision[]
language sql immutable as $f$
  select array(select y[i] from unnest(idx) with ordinality u(i, o) order by o)
$f$;

-- the columns cols of a matrix.
create or replace function pg_temp.d2_cols(x double precision[], cols int[]) returns double precision[]
language sql immutable as $f$
  select array_agg(r order by i) from (
    select i, array(select x[i][c] from unnest(cols) with ordinality u(c, o) order by o) r
      from generate_series(1, array_length(x, 1)) i) s
$f$;

-- A x = b for a symmetric positive definite A, scaled to a unit diagonal and
-- solved by Gaussian elimination with partial pivoting.
create or replace function pg_temp.d2_solve(a0 double precision[], b0 double precision[]) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  p int := array_length(a0, 1); a double precision[] := a0; b double precision[] := b0;
  d double precision[] := '{}'; i int; j int; k int; r int; m double precision; t double precision;
  x double precision[];
begin
  for i in 1 .. p loop d := d || (1.0 / sqrt(a[i][i])); end loop;
  for i in 1 .. p loop
    b[i] := b[i] * d[i];
    for j in 1 .. p loop a[i][j] := a[i][j] * d[i] * d[j]; end loop;
  end loop;
  for k in 1 .. p loop
    r := k;
    for i in k + 1 .. p loop if abs(a[i][k]) > abs(a[r][k]) then r := i; end if; end loop;
    if r <> k then
      for j in 1 .. p loop t := a[k][j]; a[k][j] := a[r][j]; a[r][j] := t; end loop;
      t := b[k]; b[k] := b[r]; b[r] := t;
    end if;
    for i in k + 1 .. p loop
      m := a[i][k] / a[k][k];
      for j in k .. p loop a[i][j] := a[i][j] - m * a[k][j]; end loop;
      b[i] := b[i] - m * b[k];
    end loop;
  end loop;
  x := array_fill(0.0::double precision, array[p]);
  for i in reverse p .. 1 loop
    t := b[i];
    for j in i + 1 .. p loop t := t - a[i][j] * x[j]; end loop;
    x[i] := t / a[i][i];
  end loop;
  return array(select x[i] * d[i] from generate_series(1, p) i order by i);
end $f$;

-- least squares with an intercept, by the centred normal equations:
-- returns b0, b1, ..., bk.
create or replace function pg_temp.d2_ols(x double precision[], y double precision[]) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(x, 1); k int := array_length(x, 2); mx double precision[] := '{}';
  my double precision; a double precision[]; b double precision[]; s double precision; i int; j int; l int;
begin
  for j in 1 .. k loop
    s := 0.0; for i in 1 .. n loop s := s + x[i][j]; end loop; mx := mx || (s / n::double precision);
  end loop;
  s := 0.0; for i in 1 .. n loop s := s + y[i]; end loop; my := s / n::double precision;
  a := array_fill(0.0::double precision, array[k, k]); b := array_fill(0.0::double precision, array[k]);
  for i in 1 .. n loop
    for j in 1 .. k loop
      b[j] := b[j] + (x[i][j] - mx[j]) * (y[i] - my);
      for l in 1 .. k loop a[j][l] := a[j][l] + (x[i][j] - mx[j]) * (x[i][l] - mx[l]); end loop;
    end loop;
  end loop;
  b := pg_temp.d2_solve(a, b);
  s := my; for j in 1 .. k loop s := s - b[j] * mx[j]; end loop;
  return s || b;
end $f$;

-- least squares with no intercept, by the normal equations.
create or replace function pg_temp.d2_ols0(x double precision[], y double precision[]) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(x, 1); k int := array_length(x, 2); a double precision[]; b double precision[]; i int; j int; l int;
begin
  a := array_fill(0.0::double precision, array[k, k]); b := array_fill(0.0::double precision, array[k]);
  for i in 1 .. n loop
    for j in 1 .. k loop
      b[j] := b[j] + x[i][j] * y[i];
      for l in 1 .. k loop a[j][l] := a[j][l] + x[i][j] * x[i][l]; end loop;
    end loop;
  end loop;
  return 0.0::double precision || pg_temp.d2_solve(a, b);
end $f$;

-- ridge on features standardised with the population SD of the rows passed,
-- intercept unpenalised: (Z'Z + lambda I) bs = Z'(y - ybar). Returns the
-- coefficients in the features' own units (b0 first), then, when p_std, the
-- standardised ones instead.
create or replace function pg_temp.d2_ridge(x double precision[], y double precision[], lam double precision, p_std boolean default false) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(x, 1); k int := array_length(x, 2); mx double precision[] := '{}'; sx double precision[] := '{}';
  my double precision; a double precision[]; b double precision[]; s double precision; i int; j int; l int;
begin
  for j in 1 .. k loop
    s := 0.0; for i in 1 .. n loop s := s + x[i][j]; end loop; mx := mx || (s / n::double precision);
    s := 0.0; for i in 1 .. n loop s := s + (x[i][j] - mx[j]) * (x[i][j] - mx[j]); end loop; sx := sx || sqrt(s / n::double precision);
  end loop;
  s := 0.0; for i in 1 .. n loop s := s + y[i]; end loop; my := s / n::double precision;
  a := array_fill(0.0::double precision, array[k, k]); b := array_fill(0.0::double precision, array[k]);
  for i in 1 .. n loop
    for j in 1 .. k loop
      b[j] := b[j] + ((x[i][j] - mx[j]) / sx[j]) * (y[i] - my);
      for l in 1 .. k loop a[j][l] := a[j][l] + ((x[i][j] - mx[j]) / sx[j]) * ((x[i][l] - mx[l]) / sx[l]); end loop;
    end loop;
  end loop;
  for j in 1 .. k loop a[j][j] := a[j][j] + lam; end loop;
  b := pg_temp.d2_solve(a, b);
  if p_std then return my || b; end if;
  s := my; for j in 1 .. k loop b[j] := b[j] / sx[j]; s := s - b[j] * mx[j]; end loop;
  return s || b;
end $f$;

-- the predictions of a linear model b0, b1, ... on the rows of x.
create or replace function pg_temp.d2_pred(b double precision[], x double precision[]) returns double precision[]
language sql immutable as $f$
  select array(select b[1] + (select sum(b[j + 1] * x[i][j]) from generate_series(1, array_length(x, 2)) j)
                 from generate_series(1, array_length(x, 1)) i order by i)
$f$;

create or replace function pg_temp.d2_rmse(y double precision[], yh double precision[]) returns double precision
language sql immutable as $f$
  select sqrt(sum((a - b) * (a - b)) / count(*)::double precision) from unnest(y, yh) as t(a, b)
$f$;
create or replace function pg_temp.d2_mae(y double precision[], yh double precision[]) returns double precision
language sql immutable as $f$
  select sum(abs(a - b)) / count(*)::double precision from unnest(y, yh) as t(a, b)
$f$;
-- R-squared about a reference mean (the mean of y when p_ref is null).
create or replace function pg_temp.d2_r2(y double precision[], yh double precision[], p_ref double precision default null) returns double precision
language sql immutable as $f$
  select 1.0 - sum((a - b) * (a - b)) / sum((a - coalesce(p_ref, (select avg(z) from unnest(y) z))) * (a - coalesce(p_ref, (select avg(z) from unnest(y) z))))
    from unnest(y, yh) as t(a, b)
$f$;

-- the probability 1 / (1 + exp(-eta)), in the form that never overflows.
create or replace function pg_temp.d2_sig(t double precision) returns double precision
language sql immutable as $f$
  select case when t >= 0.0 then 1.0 / (1.0 + exp(-t)) else exp(t) / (1.0 + exp(t)) end
$f$;

-- the penalised log likelihood, penalty (l2 / 2) x sum of the squared
-- non-intercept coefficients.
create or replace function pg_temp.d2_pll(x double precision[], y double precision[], b double precision[], l2 double precision) returns double precision
language plpgsql immutable as $f$
#variable_conflict use_column
declare n int := array_length(x, 1); k int := array_length(x, 2); ll double precision := 0.0; e double precision; q double precision := 0.0; i int; j int;
begin
  for i in 1 .. n loop
    e := b[1]; for j in 1 .. k loop e := e + b[j + 1] * x[i][j]; end loop;
    ll := ll + y[i] * e - (case when e > 0.0 then e + ln(1.0 + exp(-e)) else ln(1.0 + exp(e)) end);
  end loop;
  for j in 2 .. k + 1 loop q := q + b[j] * b[j]; end loop;
  return ll - 0.5 * l2 * q;
end $f$;

-- logistic regression with an intercept: Newton steps from zero, a step
-- halved while it lowers the penalised log likelihood by more than
-- 1e-12 x (1 + |l|) (at most 30 halvings), stopped when the largest component
-- of the full step is at most tol or after maxit updates.
create or replace function pg_temp.d2_logit(x double precision[], y double precision[], l2 double precision, maxit int, tol double precision) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(x, 1); k int := array_length(x, 2); p int := k + 1;
  b double precision[] := array_fill(0.0::double precision, array[k + 1]); nb double precision[];
  g double precision[]; h double precision[]; dl double precision[]; rw double precision[];
  cur double precision; nv double precision; fl double precision; st double precision; ch double precision;
  e double precision; mu double precision; wt double precision; it int := 0; hv int; i int; j int; l int;
begin
  cur := pg_temp.d2_pll(x, y, b, l2);
  while it < maxit loop
    g := array_fill(0.0::double precision, array[p]); h := array_fill(0.0::double precision, array[p, p]);
    for i in 1 .. n loop
      rw := 1.0::double precision || array(select x[i][j2] from generate_series(1, k) j2 order by j2);
      e := 0.0; for j in 1 .. p loop e := e + rw[j] * b[j]; end loop;
      mu := pg_temp.d2_sig(e); wt := mu * (1.0 - mu);
      for j in 1 .. p loop
        g[j] := g[j] + rw[j] * (y[i] - mu);
        for l in 1 .. p loop h[j][l] := h[j][l] + wt * rw[j] * rw[l]; end loop;
      end loop;
    end loop;
    for j in 2 .. p loop g[j] := g[j] - l2 * b[j]; h[j][j] := h[j][j] + l2; end loop;
    dl := pg_temp.d2_solve(h, g);
    st := 1.0;
    nb := array(select b[j] + dl[j] from generate_series(1, p) j order by j);
    nv := pg_temp.d2_pll(x, y, nb, l2);
    fl := cur - 1e-12 * (1.0 + abs(cur));
    hv := 0;
    while nv < fl and hv < 30 loop
      st := st / 2.0; hv := hv + 1;
      nb := array(select b[j] + st * dl[j] from generate_series(1, p) j order by j);
      nv := pg_temp.d2_pll(x, y, nb, l2);
    end loop;
    ch := (select max(abs(z)) from unnest(dl) z);
    b := nb; cur := nv; it := it + 1;
    exit when ch <= tol;
  end loop;
  return b;
end $f$;

-- the probabilities of a logistic model on the rows of x.
create or replace function pg_temp.d2_prob(b double precision[], x double precision[]) returns double precision[]
language sql immutable as $f$
  select array(select pg_temp.d2_sig(v) from unnest(pg_temp.d2_pred(b, x)) with ordinality u(v, o) order by o)
$f$;

-- the mean log loss, the probabilities clipped to [1e-15, 1 - 1e-15].
create or replace function pg_temp.d2_logloss(y double precision[], pr double precision[]) returns double precision
language sql immutable as $f$
  select sum(-(a * ln(greatest(1e-15, least(1.0 - 1e-15, q))) + (1.0 - a) * ln(1.0 - greatest(1e-15, least(1.0 - 1e-15, q)))))
         / count(*)::double precision
    from unnest(y, pr) as t(a, q)
$f$;

-- F1 of a label at the class threshold (class 1 above one half).
create or replace function pg_temp.d2_f1(y double precision[], pr double precision[], lab double precision) returns double precision
language sql immutable as $f$
  select 2.0 * count(*) filter (where c = lab and a = lab)::double precision
         / (2.0 * count(*) filter (where c = lab and a = lab)::double precision
            + count(*) filter (where c = lab and a <> lab)::double precision
            + count(*) filter (where c <> lab and a = lab)::double precision)
    from (select a, case when q > 0.5 then 1.0 else 0.0 end c from unnest(y, pr) as t(a, q)) s
$f$;

-- the condition number of [1, x], every column scaled to unit length when
-- p_scaled, from a one-sided (Hestenes) Jacobi SVD.
create or replace function pg_temp.d2_cond(x double precision[], p_scaled boolean) returns double precision
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(x, 1); q int := array_length(x, 2) + 1; a double precision[];
  i int; j int; k int; sw int; rot boolean; al double precision; be double precision; ga double precision;
  ze double precision; t double precision; c double precision; s double precision; v1 double precision; v2 double precision;
  nr double precision; sv double precision[] := '{}';
begin
  a := array_fill(1.0::double precision, array[n, q]);
  for i in 1 .. n loop for j in 2 .. q loop a[i][j] := x[i][j - 1]; end loop; end loop;
  if p_scaled then
    for j in 1 .. q loop
      nr := 0.0; for i in 1 .. n loop nr := nr + a[i][j] * a[i][j]; end loop; nr := sqrt(nr);
      for i in 1 .. n loop a[i][j] := a[i][j] / nr; end loop;
    end loop;
  end if;
  for sw in 1 .. 40 loop
    rot := false;
    for j in 1 .. q - 1 loop
      for k in j + 1 .. q loop
        al := 0.0; be := 0.0; ga := 0.0;
        for i in 1 .. n loop al := al + a[i][j] * a[i][j]; be := be + a[i][k] * a[i][k]; ga := ga + a[i][j] * a[i][k]; end loop;
        if abs(ga) > 1e-15 * sqrt(al * be) then
          rot := true;
          ze := (be - al) / (2.0 * ga);
          t := (case when ze >= 0.0 then 1.0 else -1.0 end) / (abs(ze) + sqrt(1.0 + ze * ze));
          c := 1.0 / sqrt(1.0 + t * t); s := c * t;
          for i in 1 .. n loop
            v1 := a[i][j]; v2 := a[i][k];
            a[i][j] := c * v1 - s * v2; a[i][k] := s * v1 + c * v2;
          end loop;
        end if;
      end loop;
    end loop;
    exit when not rot;
  end loop;
  for j in 1 .. q loop
    nr := 0.0; for i in 1 .. n loop nr := nr + a[i][j] * a[i][j]; end loop; sv := sv || sqrt(nr);
  end loop;
  return (select max(z) from unnest(sv) z) / (select min(z) from unnest(sv) z);
end $f$;

-- the mean permutation drop in RMSE of feature column jf (1-based) of a
-- linear model on the rows x, y: one mulberry32 stream for the call, the
-- features in column order and the repeats inner, row i taking the value of
-- row perm[i].
create or replace function pg_temp.d2_permdrop(b double precision[], x double precision[], y double precision[], jf int, reps int, p_seed bigint) returns double precision
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(x, 1); k int := array_length(x, 2); u double precision[]; base double precision;
  xp double precision[]; pm int[]; r int; i int; tot double precision := 0.0;
begin
  u := pg_temp.d2_u(p_seed, k * reps * (n - 1));
  base := pg_temp.d2_rmse(y, pg_temp.d2_pred(b, x));
  for r in 0 .. reps - 1 loop
    pm := pg_temp.d2_perm(n, u, ((jf - 1) * reps + r) * (n - 1));
    xp := x;
    for i in 1 .. n loop xp[i][jf] := x[pm[i] + 1][jf]; end loop;
    tot := tot + (pg_temp.d2_rmse(y, pg_temp.d2_pred(b, xp)) - base);
  end loop;
  return tot / reps::double precision;
end $f$;

do $$
#variable_conflict use_column
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int; i int; j int;
  v_names text; v_prompt text; v_s double precision; v_wrong double precision; v_x1 double precision;
  v_te text[]; v_ord text[]; v_wl text[]; v_itr int[]; v_ite int[]; v_ix int[]; v_irr int[]; v_pm int[];
  v_x double precision[]; v_xtr double precision[]; v_xte double precision[]; v_ytr double precision[];
  v_yte double precision[]; v_b double precision[]; v_b2 double precision[]; v_ph double precision[];
  v_y double precision[]; v_rss double precision; v_ntr int; v_nte int; v_rg double precision; v_rr double precision;
  v_g_akpara_rhob_train_centre_g_cm3 double precision;
  v_g_akpara_gr_train_scale_gapi double precision;
  v_g_akpara_ols_nphi_coef_us_ft_per_vv double precision;
  v_g_akpara_ols_residual_se_us_ft double precision;
  v_g_akpara_test_rmse_us_ft double precision;
  v_g_akpara_test_r2 double precision;
  v_g_oboria_ridge_gr_coef_us_ft_per_gapi double precision;
  v_g_oboria_fold2_test_rmse_us_ft double precision;
  v_g_oboria_leak_optimism_rmse_us_ft double precision;
  v_g_oboria_logistic_rt_coef_per_ohmm double precision;
  v_g_oboria_pay_f1 double precision;
  v_g_oboria_test_log_loss double precision;
  v_g_isuama_scaled_condition_attrs double precision;
  v_g_isuama_l2_phic_coef_per_vv double precision;
  v_g_isuama_nphi_coef_after_three_updates_per_vv double precision;
  v_g_isuama_perm_nphi_mean_drop_us_ft double precision;
  v_g_isuama_lc_test_rmse_three_wells_us_ft double precision;
  v_g_isuama_pred_dt_first_row_us_ft double precision;
  v_ak_well text[] := array['AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-1', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-2', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-3', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-4', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-5', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-6', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7', 'AKPARA-7']::text[];
  v_ak_depth double precision[] := array[6139.0, 6140.0, 6141.0, 6142.0, 6143.0, 6144.0, 6145.0, 6146.0, 6147.0, 6148.0, 6149.0, 6150.0, 6151.0, 6152.0, 6153.0, 6154.0, 6155.0, 6156.0, 6157.0, 6158.0, 6159.0, 6160.0, 6161.0, 6162.0, 6187.0, 6188.0, 6189.0, 6190.0, 6191.0, 6192.0, 6193.0, 6194.0, 6195.0, 6196.0, 6197.0, 6198.0, 6199.0, 6200.0, 6201.0, 6202.0, 6203.0, 6204.0, 6205.0, 6206.0, 6207.0, 6208.0, 6209.0, 6210.0, 6216.0, 6217.0, 6218.0, 6219.0, 6220.0, 6221.0, 6222.0, 6223.0, 6224.0, 6225.0, 6226.0, 6227.0, 6228.0, 6229.0, 6230.0, 6231.0, 6232.0, 6233.0, 6234.0, 6235.0, 6236.0, 6237.0, 6238.0, 6239.0, 6277.0, 6278.0, 6279.0, 6280.0, 6281.0, 6282.0, 6283.0, 6284.0, 6285.0, 6286.0, 6287.0, 6288.0, 6289.0, 6290.0, 6291.0, 6292.0, 6293.0, 6294.0, 6295.0, 6296.0, 6297.0, 6298.0, 6299.0, 6300.0, 6311.0, 6312.0, 6313.0, 6314.0, 6315.0, 6316.0, 6317.0, 6318.0, 6319.0, 6320.0, 6321.0, 6322.0, 6323.0, 6324.0, 6325.0, 6326.0, 6327.0, 6328.0, 6329.0, 6330.0, 6331.0, 6332.0, 6333.0, 6334.0, 6363.0, 6364.0, 6365.0, 6366.0, 6367.0, 6368.0, 6369.0, 6370.0, 6371.0, 6372.0, 6373.0, 6374.0, 6375.0, 6376.0, 6377.0, 6378.0, 6379.0, 6380.0, 6381.0, 6382.0, 6383.0, 6384.0, 6385.0, 6386.0, 6423.0, 6424.0, 6425.0, 6426.0, 6427.0, 6428.0, 6429.0, 6430.0, 6431.0, 6432.0, 6433.0, 6434.0, 6435.0, 6436.0, 6437.0, 6438.0, 6439.0, 6440.0, 6441.0, 6442.0, 6443.0, 6444.0, 6445.0, 6446.0]::double precision[];
  v_ak_gr double precision[] := array[81.03, 73.97, 72.09, 33.35, 67.12, 22.27, 73.75, 76.22, 53.36, 45.38, 26.93, 72.24, 33.95, 31.06, 39.96, 37.91, 24.0, 44.36, 65.41, 30.93, 57.62, 56.21, 34.68, 45.14, 54.96, 24.47, 56.94, 35.91, 52.9, 64.53, 69.42, 67.25, 77.09, 64.07, 57.49, 67.77, 67.04, 55.79, 30.92, 56.06, 99.09, 53.75, 44.25, 64.91, 30.75, 61.95, 18.5, 62.92, 42.34, 72.18, 96.02, 20.52, 59.13, 50.9, 33.05, 29.64, 41.02, 54.08, 59.09, 51.62, 54.98, 57.85, 26.36, 53.85, 56.29, 75.1, 75.56, 49.1, 31.52, 54.95, 49.04, 21.64, 33.99, 46.51, 87.83, 52.08, 82.95, 79.1, 68.65, 76.23, 61.16, 34.8, 53.95, 29.54, 77.31, 56.37, 65.34, 42.07, 46.25, 92.89, 26.94, 77.42, 78.7, 61.39, 51.56, 38.34, 48.96, 68.23, 23.45, 85.77, 29.43, 39.63, 39.41, 71.29, 56.44, 70.5, 72.76, 49.48, 81.91, 52.42, 70.57, 49.71, 80.28, 50.53, 29.33, 46.08, 31.96, 46.23, 84.81, 51.19, 70.38, 65.5, 86.44, 43.1, 41.83, 51.19, 51.29, 75.15, 53.14, 36.5, 47.59, 45.47, 28.32, 36.78, 30.54, 48.41, 60.99, 83.08, 70.64, 48.77, 61.51, 62.24, 21.91, 36.1, 68.98, 25.98, 22.32, 24.99, 56.1, 35.45, 40.5, 61.75, 26.1, 51.45, 62.53, 70.17, 65.11, 41.61, 63.96, 64.0, 34.83, 24.96, 34.48, 28.4, 64.82, 65.46, 73.15, 81.28]::double precision[];
  v_ak_rhob double precision[] := array[2.549, 2.524, 2.524, 2.248, 2.549, 2.231, 2.494, 2.558, 2.422, 2.332, 2.184, 2.483, 2.248, 2.26, 2.229, 2.22, 2.142, 2.305, 2.47, 2.235, 2.374, 2.402, 2.21, 2.326, 2.34, 2.143, 2.422, 2.301, 2.306, 2.391, 2.476, 2.391, 2.483, 2.363, 2.34, 2.498, 2.431, 2.498, 2.218, 2.486, 2.628, 2.34, 2.327, 2.456, 2.29, 2.392, 2.171, 2.478, 2.398, 2.535, 2.673, 2.217, 2.41, 2.349, 2.204, 2.246, 2.223, 2.316, 2.413, 2.377, 2.294, 2.407, 2.111, 2.33, 2.286, 2.521, 2.514, 2.276, 2.273, 2.361, 2.269, 2.137, 2.292, 2.455, 2.647, 2.375, 2.566, 2.645, 2.546, 2.563, 2.415, 2.338, 2.416, 2.26, 2.446, 2.351, 2.576, 2.285, 2.325, 2.624, 2.177, 2.575, 2.514, 2.354, 2.334, 2.215, 2.306, 2.428, 2.254, 2.495, 2.094, 2.258, 2.299, 2.432, 2.314, 2.465, 2.49, 2.342, 2.545, 2.315, 2.501, 2.351, 2.515, 2.354, 2.241, 2.326, 2.299, 2.408, 2.675, 2.324, 2.379, 2.488, 2.639, 2.277, 2.313, 2.378, 2.341, 2.534, 2.298, 2.43, 2.325, 2.302, 2.354, 2.28, 2.27, 2.321, 2.364, 2.452, 2.424, 2.282, 2.376, 2.435, 2.196, 2.25, 2.498, 2.218, 2.219, 2.245, 2.283, 2.292, 2.331, 2.421, 2.176, 2.362, 2.407, 2.467, 2.457, 2.259, 2.39, 2.389, 2.302, 2.171, 2.238, 2.143, 2.426, 2.51, 2.52, 2.59]::double precision[];
  v_ak_nphi double precision[] := array[0.25, 0.27, 0.248, 0.24, 0.217, 0.278, 0.232, 0.233, 0.24, 0.271, 0.297, 0.268, 0.267, 0.243, 0.29, 0.315, 0.314, 0.301, 0.247, 0.267, 0.246, 0.265, 0.324, 0.25, 0.343, 0.305, 0.266, 0.267, 0.268, 0.32, 0.268, 0.307, 0.278, 0.287, 0.318, 0.228, 0.248, 0.245, 0.307, 0.243, 0.29, 0.286, 0.257, 0.25, 0.266, 0.306, 0.311, 0.245, 0.205, 0.279, 0.233, 0.302, 0.272, 0.299, 0.313, 0.272, 0.296, 0.321, 0.255, 0.261, 0.293, 0.257, 0.342, 0.309, 0.311, 0.288, 0.254, 0.29, 0.253, 0.286, 0.316, 0.306, 0.284, 0.216, 0.241, 0.26, 0.26, 0.203, 0.226, 0.234, 0.261, 0.252, 0.276, 0.259, 0.293, 0.299, 0.211, 0.31, 0.267, 0.206, 0.301, 0.249, 0.268, 0.299, 0.298, 0.296, 0.293, 0.274, 0.251, 0.291, 0.357, 0.317, 0.29, 0.295, 0.273, 0.298, 0.261, 0.299, 0.284, 0.286, 0.245, 0.236, 0.238, 0.267, 0.28, 0.266, 0.275, 0.218, 0.219, 0.298, 0.327, 0.24, 0.237, 0.301, 0.293, 0.284, 0.254, 0.261, 0.295, 0.203, 0.216, 0.287, 0.247, 0.256, 0.295, 0.274, 0.281, 0.311, 0.289, 0.274, 0.289, 0.265, 0.262, 0.232, 0.24, 0.273, 0.263, 0.277, 0.338, 0.257, 0.238, 0.245, 0.285, 0.282, 0.273, 0.266, 0.242, 0.306, 0.298, 0.282, 0.263, 0.288, 0.306, 0.312, 0.249, 0.243, 0.243, 0.244]::double precision[];
  v_ak_rt double precision[] := array[2.83, 2.52, 2.35, 44.73, 2.18, 33.88, 2.14, 2.55, 1.83, 1.95, 44.05, 2.84, 39.62, 1.29, 57.71, 27.06, 1.18, 33.44, 2.15, 1.19, 38.72, 2.14, 1.49, 40.74, 1.82, 40.12, 2.06, 36.48, 43.31, 27.53, 2.29, 27.67, 25.73, 43.24, 2.32, 2.33, 1.83, 2.61, 1.23, 2.23, 4.42, 1.95, 26.71, 2.26, 32.18, 30.08, 32.79, 2.31, 1.73, 2.63, 4.0, 38.15, 27.82, 1.76, 39.69, 50.18, 1.49, 32.93, 26.05, 39.02, 29.64, 31.88, 50.64, 1.96, 38.39, 3.07, 2.63, 27.7, 43.72, 1.86, 44.15, 37.23, 34.92, 29.05, 3.23, 2.18, 3.12, 2.93, 2.78, 3.38, 22.18, 33.38, 34.99, 31.09, 2.79, 29.37, 2.81, 1.96, 1.46, 2.55, 1.19, 3.44, 3.08, 2.29, 2.14, 1.36, 1.9, 2.1, 1.21, 23.97, 43.45, 1.75, 40.74, 29.18, 1.88, 2.75, 3.4, 2.45, 3.8, 1.79, 2.62, 24.34, 2.68, 1.56, 47.04, 28.11, 38.03, 30.34, 2.97, 34.03, 2.71, 2.21, 2.61, 1.66, 1.82, 28.84, 1.74, 2.59, 38.35, 1.71, 28.08, 1.76, 1.44, 1.47, 25.92, 1.91, 2.02, 40.5, 26.67, 1.52, 25.24, 27.07, 27.72, 1.28, 2.66, 32.59, 1.21, 31.37, 32.85, 1.42, 1.56, 2.11, 46.26, 32.2, 30.4, 3.58, 2.54, 43.05, 1.95, 2.16, 28.89, 59.87, 36.77, 52.06, 33.38, 2.48, 2.83, 2.64]::double precision[];
  v_ak_cali double precision[] := array[9.25, 8.78, 9.28, 8.99, 8.77, 8.86, 8.79, 8.78, 8.93, 8.99, 9.07, 9.05, 8.87, 9.22, 9.09, 9.1, 8.81, 9.0, 9.15, 9.49, 9.07, 9.11, 9.04, 9.08, 8.96, 9.0, 8.99, 9.13, 9.11, 9.0, 9.16, 9.16, 9.27, 9.02, 9.0, 9.03, 9.13, 9.45, 8.79, 8.89, 8.77, 9.12, 8.8, 8.77, 8.92, 9.47, 8.81, 8.87, 8.99, 9.04, 9.0, 9.2, 9.21, 9.16, 8.98, 8.82, 8.92, 9.09, 8.83, 9.07, 9.13, 9.08, 8.79, 8.89, 8.78, 8.92, 8.79, 9.1, 8.86, 8.8, 8.88, 9.06, 8.86, 8.85, 8.78, 8.77, 8.75, 9.03, 9.36, 9.07, 8.79, 9.21, 8.83, 9.34, 8.99, 8.95, 8.76, 8.83, 8.85, 9.0, 9.07, 9.21, 8.98, 9.09, 8.93, 8.98, 9.34, 9.28, 8.95, 9.22, 9.03, 9.04, 8.85, 8.76, 8.97, 8.86, 8.76, 8.96, 8.8, 8.98, 8.81, 9.25, 8.9, 8.8, 8.78, 8.88, 9.36, 8.84, 9.24, 9.11, 8.85, 8.85, 8.91, 9.25, 9.04, 8.95, 9.17, 8.77, 8.77, 9.13, 8.92, 9.17, 8.97, 9.13, 8.81, 8.88, 8.76, 8.79, 8.77, 9.18, 9.37, 8.95, 9.09, 8.9, 8.87, 8.76, 8.82, 8.75, 9.08, 9.15, 8.98, 8.84, 9.21, 9.27, 8.82, 8.79, 9.02, 9.13, 8.82, 9.49, 8.85, 9.11, 9.03, 9.0, 9.05, 8.76, 8.85, 8.95]::double precision[];
  v_ak_dt double precision[] := array[101.0, 102.3, 98.2, 81.7, 87.8, 82.5, 92.5, 101.7, 89.8, 93.4, 85.6, 95.5, 85.7, 82.6, 88.7, 91.3, 91.4, 95.3, 96.4, 85.2, 89.5, 92.0, 93.3, 88.6, 114.3, 101.2, 102.8, 95.7, 103.0, 116.6, 105.5, 113.5, 116.9, 105.7, 110.0, 101.8, 104.5, 105.4, 96.0, 106.2, 128.7, 103.6, 100.5, 102.8, 96.3, 109.5, 98.2, 108.6, 94.2, 103.7, 108.8, 91.7, 95.5, 98.2, 96.7, 86.7, 96.9, 106.9, 95.6, 94.0, 101.3, 95.6, 98.7, 107.5, 100.3, 112.6, 103.3, 99.6, 91.9, 95.9, 107.6, 95.3, 103.1, 104.2, 112.8, 100.7, 114.3, 106.8, 111.4, 111.0, 109.0, 101.9, 108.6, 97.7, 117.1, 113.9, 101.6, 114.9, 98.4, 111.2, 101.0, 110.6, 117.6, 111.8, 108.5, 99.5, 108.6, 104.5, 96.8, 118.0, 105.8, 100.9, 103.4, 111.5, 111.1, 112.3, 109.8, 108.6, 118.1, 106.0, 105.6, 100.2, 104.7, 98.0, 95.0, 101.3, 100.5, 97.4, 114.6, 100.1, 113.1, 99.7, 105.6, 103.5, 101.8, 101.4, 99.2, 108.5, 101.8, 86.1, 93.5, 100.8, 91.8, 92.5, 95.3, 98.6, 105.2, 118.5, 110.8, 99.0, 109.9, 102.3, 93.9, 89.4, 107.5, 97.9, 94.5, 100.1, 115.2, 95.8, 93.0, 105.9, 98.9, 107.3, 112.0, 113.2, 106.7, 103.5, 113.1, 114.1, 95.1, 97.5, 98.0, 98.0, 108.9, 103.9, 108.1, 107.6]::double precision[];
  v_ak_phic double precision[] := array[0.126, 0.157, 0.133, 0.263, 0.124, 0.297, 0.133, 0.059, 0.154, 0.202, 0.258, 0.2, 0.256, 0.254, 0.259, 0.25, 0.315, 0.265, 0.126, 0.261, 0.217, 0.214, 0.259, 0.228, 0.235, 0.315, 0.147, 0.224, 0.225, 0.193, 0.145, 0.127, 0.119, 0.199, 0.212, 0.152, 0.172, 0.118, 0.261, 0.108, 0.051, 0.194, 0.217, 0.152, 0.262, 0.16, 0.273, 0.138, 0.162, 0.108, 0.025, 0.239, 0.171, 0.206, 0.265, 0.227, 0.259, 0.267, 0.147, 0.187, 0.263, 0.127, 0.319, 0.247, 0.237, 0.146, 0.121, 0.224, 0.253, 0.212, 0.278, 0.297, 0.262, 0.146, 0.083, 0.169, 0.097, 0.085, 0.121, 0.066, 0.153, 0.224, 0.175, 0.256, 0.153, 0.209, 0.092, 0.237, 0.228, 0.054, 0.289, 0.143, 0.128, 0.239, 0.205, 0.254, 0.249, 0.162, 0.249, 0.135, 0.352, 0.248, 0.239, 0.177, 0.218, 0.146, 0.124, 0.22, 0.119, 0.215, 0.095, 0.233, 0.1, 0.173, 0.229, 0.189, 0.228, 0.147, 0.042, 0.25, 0.224, 0.109, 0.048, 0.243, 0.253, 0.204, 0.197, 0.095, 0.244, 0.128, 0.181, 0.248, 0.22, 0.233, 0.281, 0.229, 0.187, 0.183, 0.18, 0.245, 0.171, 0.182, 0.266, 0.224, 0.101, 0.25, 0.227, 0.239, 0.213, 0.226, 0.209, 0.177, 0.27, 0.246, 0.181, 0.149, 0.132, 0.261, 0.139, 0.213, 0.255, 0.276, 0.268, 0.31, 0.128, 0.108, 0.134, 0.075]::double precision[];
  v_ak_pay double precision[] := array[0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0]::double precision[];
  v_ak_easting double precision[] := array[509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 509.11, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 510.33, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 509.59, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 506.09, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 507.37, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 510.27, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25, 506.25]::double precision[];
  v_ak_northing double precision[] := array[134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 134.64, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 133.01, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 131.55, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 134.22, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 131.46, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 132.69, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34, 133.34]::double precision[];
  v_ak_kb double precision[] := array[26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 26.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 14.2, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 16.5, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 17.6, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 12.4, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 18.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8, 25.8]::double precision[];
  v_ak_mudweight double precision[] := array[10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5]::double precision[];
  v_ob_well text[] := array['OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-1', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-2', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-3', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-4', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-5', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-6', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-7', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8', 'OBORIA-8']::text[];
  v_ob_depth double precision[] := array[9326.0, 9327.0, 9328.0, 9329.0, 9330.0, 9331.0, 9332.0, 9333.0, 9334.0, 9335.0, 9336.0, 9337.0, 9338.0, 9339.0, 9340.0, 9341.0, 9342.0, 9343.0, 9344.0, 9345.0, 9346.0, 9347.0, 9348.0, 9349.0, 9350.0, 9365.0, 9366.0, 9367.0, 9368.0, 9369.0, 9370.0, 9371.0, 9372.0, 9373.0, 9374.0, 9375.0, 9376.0, 9377.0, 9378.0, 9379.0, 9380.0, 9381.0, 9382.0, 9383.0, 9384.0, 9385.0, 9386.0, 9387.0, 9388.0, 9389.0, 9411.0, 9412.0, 9413.0, 9414.0, 9415.0, 9416.0, 9417.0, 9418.0, 9419.0, 9420.0, 9421.0, 9422.0, 9423.0, 9424.0, 9425.0, 9426.0, 9427.0, 9428.0, 9429.0, 9430.0, 9431.0, 9432.0, 9433.0, 9434.0, 9435.0, 9475.0, 9476.0, 9477.0, 9478.0, 9479.0, 9480.0, 9481.0, 9482.0, 9483.0, 9484.0, 9485.0, 9486.0, 9487.0, 9488.0, 9489.0, 9490.0, 9491.0, 9492.0, 9493.0, 9494.0, 9495.0, 9496.0, 9497.0, 9498.0, 9499.0, 9519.0, 9520.0, 9521.0, 9522.0, 9523.0, 9524.0, 9525.0, 9526.0, 9527.0, 9528.0, 9529.0, 9530.0, 9531.0, 9532.0, 9533.0, 9534.0, 9535.0, 9536.0, 9537.0, 9538.0, 9539.0, 9540.0, 9541.0, 9542.0, 9543.0, 9548.0, 9549.0, 9550.0, 9551.0, 9552.0, 9553.0, 9554.0, 9555.0, 9556.0, 9557.0, 9558.0, 9559.0, 9560.0, 9561.0, 9562.0, 9563.0, 9564.0, 9565.0, 9566.0, 9567.0, 9568.0, 9569.0, 9570.0, 9571.0, 9572.0, 9616.0, 9617.0, 9618.0, 9619.0, 9620.0, 9621.0, 9622.0, 9623.0, 9624.0, 9625.0, 9626.0, 9627.0, 9628.0, 9629.0, 9630.0, 9631.0, 9632.0, 9633.0, 9634.0, 9635.0, 9636.0, 9637.0, 9638.0, 9639.0, 9640.0, 9648.0, 9649.0, 9650.0, 9651.0, 9652.0, 9653.0, 9654.0, 9655.0, 9656.0, 9657.0, 9658.0, 9659.0, 9660.0, 9661.0, 9662.0, 9663.0, 9664.0, 9665.0, 9666.0, 9667.0, 9668.0, 9669.0, 9670.0, 9671.0, 9672.0]::double precision[];
  v_ob_gr double precision[] := array[30.21, 67.56, 75.96, 58.05, 67.21, 41.93, 31.71, 79.68, 29.24, 41.62, 38.48, 50.65, 34.88, 31.69, 37.49, 51.35, 69.99, 42.35, 31.78, 44.35, 68.1, 29.17, 73.72, 64.86, 58.21, 44.02, 88.34, 32.79, 68.55, 78.17, 32.16, 68.95, 34.1, 71.12, 79.14, 28.86, 57.54, 39.87, 70.57, 75.69, 59.35, 65.13, 48.09, 42.93, 70.5, 68.5, 55.89, 31.24, 58.36, 52.07, 76.06, 48.54, 66.25, 25.19, 89.52, 31.87, 30.46, 29.0, 39.18, 52.08, 83.31, 76.1, 55.26, 23.88, 22.08, 47.69, 54.07, 57.2, 54.26, 56.86, 28.98, 64.48, 25.93, 35.59, 80.46, 25.47, 22.88, 78.76, 68.39, 43.31, 60.18, 84.84, 72.77, 22.46, 55.07, 27.23, 42.89, 57.37, 72.06, 30.31, 102.96, 45.89, 47.45, 100.27, 72.98, 34.87, 69.5, 64.98, 45.03, 74.21, 39.62, 73.04, 82.23, 18.75, 36.8, 31.99, 27.47, 59.63, 71.41, 62.62, 34.23, 35.76, 57.56, 50.04, 24.01, 74.55, 18.19, 20.12, 74.55, 48.26, 22.98, 77.23, 23.53, 64.28, 86.82, 46.96, 53.95, 101.66, 76.86, 55.42, 54.92, 57.44, 67.38, 42.5, 30.88, 38.15, 73.43, 55.41, 75.08, 45.77, 31.6, 50.25, 48.55, 33.54, 58.46, 48.77, 46.74, 69.8, 87.0, 61.91, 46.67, 38.85, 24.75, 67.22, 46.5, 89.01, 53.28, 55.66, 23.58, 30.3, 79.48, 35.17, 44.76, 64.63, 35.16, 53.95, 45.67, 41.06, 40.89, 73.63, 54.16, 38.96, 67.78, 42.27, 68.44, 66.2, 75.04, 54.4, 88.0, 41.43, 71.33, 83.23, 65.66, 84.61, 37.11, 64.4, 62.38, 96.26, 38.8, 41.97, 69.98, 37.98, 61.27, 63.84, 50.0, 40.1, 56.88, 34.24, 65.55, 68.6]::double precision[];
  v_ob_rhob double precision[] := array[2.204, 2.513, 2.543, 2.446, 2.467, 2.269, 2.24, 2.462, 2.187, 2.254, 2.312, 2.366, 2.197, 2.232, 2.33, 2.281, 2.399, 2.233, 2.223, 2.375, 2.446, 2.268, 2.428, 2.45, 2.373, 2.367, 2.675, 2.336, 2.385, 2.581, 2.271, 2.343, 2.213, 2.505, 2.637, 2.15, 2.455, 2.306, 2.429, 2.69, 2.43, 2.451, 2.27, 2.271, 2.46, 2.491, 2.385, 2.21, 2.382, 2.422, 2.493, 2.375, 2.39, 2.156, 2.592, 2.296, 2.155, 2.323, 2.329, 2.328, 2.597, 2.48, 2.386, 2.178, 2.266, 2.38, 2.334, 2.383, 2.401, 2.383, 2.216, 2.533, 2.294, 2.204, 2.621, 2.269, 2.124, 2.515, 2.434, 2.287, 2.33, 2.603, 2.551, 2.262, 2.401, 2.05, 2.324, 2.391, 2.43, 2.245, 2.693, 2.38, 2.35, 2.65, 2.485, 2.211, 2.519, 2.571, 2.349, 2.448, 2.35, 2.548, 2.609, 2.189, 2.22, 2.276, 2.155, 2.402, 2.573, 2.383, 2.109, 2.41, 2.455, 2.363, 2.132, 2.561, 2.223, 2.093, 2.608, 2.414, 2.146, 2.598, 2.227, 2.484, 2.608, 2.344, 2.469, 2.674, 2.568, 2.469, 2.388, 2.338, 2.384, 2.224, 2.287, 2.287, 2.516, 2.382, 2.43, 2.229, 2.345, 2.25, 2.222, 2.244, 2.399, 2.338, 2.407, 2.469, 2.573, 2.499, 2.298, 2.279, 2.211, 2.463, 2.377, 2.619, 2.38, 2.441, 2.157, 2.133, 2.538, 2.296, 2.259, 2.525, 2.327, 2.317, 2.289, 2.207, 2.343, 2.463, 2.394, 2.3, 2.499, 2.231, 2.528, 2.424, 2.482, 2.379, 2.51, 2.288, 2.424, 2.522, 2.427, 2.55, 2.408, 2.461, 2.401, 2.65, 2.236, 2.336, 2.439, 2.331, 2.451, 2.431, 2.263, 2.187, 2.39, 2.272, 2.496, 2.461]::double precision[];
  v_ob_nphi double precision[] := array[0.304, 0.221, 0.271, 0.248, 0.278, 0.265, 0.265, 0.293, 0.301, 0.28, 0.253, 0.224, 0.294, 0.294, 0.279, 0.295, 0.319, 0.299, 0.307, 0.242, 0.266, 0.226, 0.297, 0.279, 0.276, 0.249, 0.225, 0.25, 0.287, 0.237, 0.253, 0.323, 0.29, 0.253, 0.208, 0.303, 0.251, 0.249, 0.287, 0.208, 0.265, 0.25, 0.323, 0.333, 0.248, 0.242, 0.267, 0.293, 0.291, 0.288, 0.266, 0.273, 0.287, 0.302, 0.253, 0.228, 0.356, 0.234, 0.262, 0.304, 0.259, 0.277, 0.251, 0.303, 0.25, 0.239, 0.253, 0.27, 0.237, 0.243, 0.295, 0.261, 0.232, 0.284, 0.226, 0.277, 0.339, 0.283, 0.283, 0.272, 0.367, 0.224, 0.219, 0.258, 0.249, 0.376, 0.295, 0.262, 0.268, 0.289, 0.281, 0.238, 0.294, 0.245, 0.291, 0.318, 0.269, 0.181, 0.248, 0.283, 0.235, 0.275, 0.224, 0.303, 0.316, 0.243, 0.332, 0.248, 0.254, 0.294, 0.334, 0.205, 0.22, 0.269, 0.324, 0.224, 0.269, 0.329, 0.224, 0.281, 0.335, 0.252, 0.256, 0.249, 0.237, 0.274, 0.239, 0.26, 0.245, 0.251, 0.281, 0.297, 0.306, 0.289, 0.239, 0.285, 0.268, 0.26, 0.286, 0.294, 0.24, 0.335, 0.325, 0.298, 0.244, 0.292, 0.27, 0.251, 0.243, 0.232, 0.29, 0.288, 0.328, 0.276, 0.253, 0.259, 0.231, 0.231, 0.323, 0.31, 0.268, 0.27, 0.262, 0.216, 0.27, 0.283, 0.263, 0.314, 0.261, 0.278, 0.254, 0.289, 0.262, 0.285, 0.274, 0.248, 0.264, 0.297, 0.317, 0.304, 0.266, 0.281, 0.268, 0.265, 0.224, 0.274, 0.265, 0.202, 0.318, 0.269, 0.256, 0.276, 0.268, 0.262, 0.321, 0.317, 0.282, 0.283, 0.237, 0.274]::double precision[];
  v_ob_rt double precision[] := array[34.74, 2.75, 3.43, 28.0, 3.05, 27.02, 1.2, 25.57, 1.36, 1.57, 40.21, 1.87, 1.24, 53.78, 32.25, 1.85, 2.05, 1.75, 43.03, 30.18, 2.44, 35.59, 24.75, 19.68, 25.4, 2.05, 3.18, 1.54, 1.82, 3.14, 26.73, 2.35, 1.21, 2.54, 2.48, 46.31, 2.32, 39.74, 2.85, 2.54, 2.44, 2.38, 45.11, 31.88, 2.83, 2.59, 32.45, 1.32, 35.69, 33.05, 2.25, 1.63, 39.04, 1.21, 2.43, 29.11, 28.87, 1.45, 1.46, 34.21, 3.21, 2.06, 2.04, 36.38, 1.18, 45.32, 24.47, 31.75, 26.57, 1.99, 1.16, 2.31, 36.08, 53.12, 2.53, 1.25, 1.17, 3.63, 23.83, 47.96, 2.93, 2.66, 2.79, 30.2, 2.41, 1.19, 38.68, 1.95, 40.59, 33.26, 3.26, 1.85, 1.91, 3.32, 2.5, 1.51, 2.62, 2.85, 30.46, 27.56, 35.2, 3.25, 4.13, 1.17, 1.41, 27.29, 46.94, 31.63, 4.05, 46.25, 1.24, 1.48, 1.88, 1.83, 1.21, 2.96, 39.88, 1.17, 2.92, 29.6, 1.19, 2.96, 1.15, 2.17, 2.77, 2.05, 24.5, 3.34, 2.61, 21.98, 40.0, 31.86, 25.52, 39.38, 43.5, 33.86, 3.08, 28.49, 26.56, 1.61, 29.59, 51.01, 54.32, 1.42, 24.53, 33.62, 27.19, 26.93, 2.83, 2.16, 38.66, 53.37, 1.45, 2.14, 2.29, 3.15, 33.44, 1.86, 33.69, 1.22, 3.11, 1.65, 1.74, 2.26, 40.54, 48.4, 37.58, 34.49, 37.75, 23.18, 1.81, 31.97, 2.45, 1.68, 3.04, 29.24, 2.71, 29.92, 3.44, 1.65, 2.14, 3.32, 29.93, 3.93, 32.7, 2.23, 47.19, 3.15, 1.81, 29.71, 2.35, 30.48, 2.16, 25.93, 2.01, 1.47, 30.95, 32.6, 2.75, 21.07]::double precision[];
  v_ob_cali double precision[] := array[9.19, 8.77, 8.87, 9.0, 8.81, 8.93, 8.84, 8.88, 8.86, 8.9, 8.93, 8.84, 8.79, 8.77, 8.76, 8.96, 8.86, 8.79, 8.98, 8.81, 8.83, 9.0, 8.89, 9.32, 9.45, 8.83, 8.92, 9.26, 8.77, 9.05, 8.99, 9.11, 9.01, 9.25, 9.04, 9.22, 8.77, 8.84, 8.96, 8.77, 9.15, 8.99, 8.93, 8.87, 9.04, 8.8, 9.16, 9.0, 8.76, 9.09, 8.78, 8.86, 9.39, 9.17, 8.99, 8.77, 8.82, 8.77, 8.89, 9.39, 9.05, 8.79, 8.95, 9.18, 8.79, 8.77, 8.8, 8.99, 9.66, 8.95, 8.98, 9.16, 9.11, 9.13, 8.84, 9.37, 8.78, 8.89, 8.91, 8.81, 8.78, 8.92, 9.06, 8.81, 8.78, 8.87, 8.91, 9.12, 9.25, 8.85, 8.91, 9.02, 8.89, 9.39, 8.89, 8.78, 8.77, 8.95, 8.75, 9.08, 8.81, 8.92, 8.79, 9.11, 8.85, 8.87, 8.89, 8.91, 9.54, 8.95, 8.79, 8.86, 8.92, 9.23, 9.29, 9.24, 8.89, 9.54, 8.85, 9.18, 8.83, 8.88, 8.85, 9.04, 8.8, 9.16, 8.91, 8.77, 9.47, 9.02, 9.04, 8.87, 9.09, 9.22, 8.78, 9.14, 9.14, 8.92, 8.85, 8.76, 9.04, 9.06, 8.96, 9.4, 9.09, 9.48, 8.96, 8.84, 8.83, 8.79, 9.02, 8.92, 9.12, 9.26, 9.42, 8.92, 9.07, 8.75, 8.76, 9.1, 8.86, 9.04, 8.81, 9.04, 8.8, 8.83, 8.81, 8.9, 8.8, 9.3, 8.93, 9.07, 8.98, 8.91, 8.88, 8.88, 8.91, 8.82, 8.82, 8.88, 8.94, 8.92, 9.69, 9.34, 9.07, 9.14, 8.98, 9.0, 8.88, 9.11, 9.24, 9.02, 8.99, 9.04, 8.87, 9.32, 8.77, 9.01, 8.98, 8.96]::double precision[];
  v_ob_dt double precision[] := array[91.3, 96.7, 103.2, 95.3, 102.0, 92.5, 83.4, 106.0, 93.4, 93.7, 89.3, 88.8, 93.0, 89.3, 89.2, 98.2, 106.4, 96.6, 86.5, 92.3, 104.5, 83.0, 103.2, 102.8, 100.1, 102.0, 111.9, 96.2, 114.5, 110.4, 91.5, 117.4, 98.4, 106.3, 107.4, 98.1, 99.5, 95.1, 120.0, 112.1, 110.9, 107.5, 109.8, 106.5, 107.8, 106.9, 105.3, 100.4, 110.6, 111.5, 114.5, 104.8, 104.1, 97.2, 113.6, 88.1, 109.1, 93.2, 99.5, 109.3, 111.4, 118.0, 102.5, 101.9, 88.8, 99.6, 99.6, 115.2, 99.7, 104.3, 98.4, 110.1, 91.8, 105.2, 111.4, 88.2, 98.8, 116.0, 114.6, 98.6, 119.9, 110.3, 104.4, 93.5, 100.1, 103.7, 101.8, 101.5, 106.8, 97.8, 119.3, 95.2, 98.4, 115.8, 112.7, 98.3, 110.1, 105.2, 95.2, 116.0, 93.1, 111.6, 111.7, 99.1, 101.4, 90.9, 103.9, 104.5, 104.9, 109.4, 107.5, 82.9, 100.3, 103.3, 104.6, 105.7, 90.4, 101.0, 105.7, 105.5, 98.5, 113.3, 93.3, 112.2, 115.1, 105.1, 102.5, 122.0, 108.0, 101.1, 104.5, 106.8, 107.2, 97.8, 91.8, 101.2, 106.1, 105.5, 111.1, 106.1, 93.5, 109.6, 101.4, 101.8, 103.5, 110.3, 108.2, 107.4, 108.0, 100.6, 99.9, 97.4, 92.4, 106.9, 91.8, 106.8, 86.4, 92.5, 88.2, 95.9, 103.8, 91.6, 97.6, 96.7, 93.3, 95.3, 93.0, 95.2, 92.0, 99.7, 95.8, 99.6, 101.7, 95.0, 99.9, 104.8, 106.1, 105.5, 119.3, 97.6, 106.7, 111.8, 105.4, 111.0, 86.0, 106.0, 98.3, 101.8, 101.9, 94.4, 97.4, 99.7, 101.3, 106.8, 102.1, 100.1, 101.7, 95.7, 103.3, 108.4]::double precision[];
  v_ob_phic double precision[] := array[0.292, 0.126, 0.114, 0.161, 0.155, 0.223, 0.234, 0.174, 0.334, 0.251, 0.242, 0.19, 0.33, 0.263, 0.212, 0.237, 0.222, 0.254, 0.297, 0.144, 0.162, 0.241, 0.16, 0.156, 0.22, 0.168, 0.015, 0.179, 0.202, 0.084, 0.252, 0.218, 0.277, 0.159, 0.052, 0.287, 0.158, 0.185, 0.151, 0.096, 0.183, 0.146, 0.239, 0.263, 0.149, 0.107, 0.187, 0.308, 0.194, 0.186, 0.117, 0.194, 0.193, 0.325, 0.089, 0.229, 0.297, 0.186, 0.227, 0.241, 0.101, 0.124, 0.177, 0.271, 0.254, 0.191, 0.186, 0.194, 0.173, 0.194, 0.288, 0.118, 0.205, 0.304, 0.064, 0.231, 0.305, 0.134, 0.205, 0.217, 0.252, 0.051, 0.119, 0.259, 0.199, 0.361, 0.227, 0.138, 0.165, 0.233, 0.033, 0.207, 0.219, 0.048, 0.165, 0.247, 0.122, 0.09, 0.21, 0.161, 0.186, 0.101, 0.082, 0.3, 0.275, 0.237, 0.316, 0.187, 0.096, 0.186, 0.336, 0.171, 0.145, 0.183, 0.319, 0.11, 0.25, 0.353, 0.066, 0.164, 0.325, 0.053, 0.236, 0.149, 0.082, 0.184, 0.135, 0.038, 0.087, 0.148, 0.17, 0.238, 0.165, 0.268, 0.239, 0.246, 0.11, 0.191, 0.182, 0.262, 0.223, 0.291, 0.283, 0.246, 0.168, 0.236, 0.155, 0.179, 0.07, 0.138, 0.213, 0.232, 0.256, 0.136, 0.175, 0.079, 0.196, 0.141, 0.299, 0.324, 0.118, 0.25, 0.213, 0.153, 0.21, 0.221, 0.216, 0.282, 0.218, 0.138, 0.186, 0.244, 0.159, 0.242, 0.134, 0.165, 0.126, 0.173, 0.127, 0.247, 0.17, 0.102, 0.165, 0.078, 0.176, 0.158, 0.201, 0.049, 0.268, 0.179, 0.127, 0.214, 0.175, 0.15, 0.241, 0.292, 0.192, 0.232, 0.128, 0.177]::double precision[];
  v_ob_pay double precision[] := array[1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0]::double precision[];
  v_ob_easting double precision[] := array[506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 506.17, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 510.25, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 509.86, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 510.44, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.15, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 507.74, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 508.38, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64, 506.64]::double precision[];
  v_ob_northing double precision[] := array[131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.57, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 131.89, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 133.99, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.29, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 132.23, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 131.69, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 134.66, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4, 133.4]::double precision[];
  v_ob_kb double precision[] := array[26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 26.1, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 23.3, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 25.0, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 20.5, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 24.2, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 18.1, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7, 17.7]::double precision[];
  v_ob_mudweight double precision[] := array[10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.9, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.4, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2, 10.2]::double precision[];
  v_is_well text[] := array['ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-1', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-2', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-3', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-4', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-5', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-6', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-7', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-8', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9', 'ISUAMA-9']::text[];
  v_is_depth double precision[] := array[11253.0, 11254.0, 11255.0, 11256.0, 11257.0, 11258.0, 11259.0, 11260.0, 11261.0, 11262.0, 11263.0, 11264.0, 11265.0, 11266.0, 11267.0, 11268.0, 11269.0, 11270.0, 11271.0, 11272.0, 11273.0, 11274.0, 11275.0, 11276.0, 11277.0, 11290.0, 11291.0, 11292.0, 11293.0, 11294.0, 11295.0, 11296.0, 11297.0, 11298.0, 11299.0, 11300.0, 11301.0, 11302.0, 11303.0, 11304.0, 11305.0, 11306.0, 11307.0, 11308.0, 11309.0, 11310.0, 11311.0, 11312.0, 11313.0, 11314.0, 11348.0, 11349.0, 11350.0, 11351.0, 11352.0, 11353.0, 11354.0, 11355.0, 11356.0, 11357.0, 11358.0, 11359.0, 11360.0, 11361.0, 11362.0, 11363.0, 11364.0, 11365.0, 11366.0, 11367.0, 11368.0, 11369.0, 11370.0, 11371.0, 11372.0, 11387.0, 11388.0, 11389.0, 11390.0, 11391.0, 11392.0, 11393.0, 11394.0, 11395.0, 11396.0, 11397.0, 11398.0, 11399.0, 11400.0, 11401.0, 11402.0, 11403.0, 11404.0, 11405.0, 11406.0, 11407.0, 11408.0, 11409.0, 11410.0, 11411.0, 11446.0, 11447.0, 11448.0, 11449.0, 11450.0, 11451.0, 11452.0, 11453.0, 11454.0, 11455.0, 11456.0, 11457.0, 11458.0, 11459.0, 11460.0, 11461.0, 11462.0, 11463.0, 11464.0, 11465.0, 11466.0, 11467.0, 11468.0, 11469.0, 11470.0, 11483.0, 11484.0, 11485.0, 11486.0, 11487.0, 11488.0, 11489.0, 11490.0, 11491.0, 11492.0, 11493.0, 11494.0, 11495.0, 11496.0, 11497.0, 11498.0, 11499.0, 11500.0, 11501.0, 11502.0, 11503.0, 11504.0, 11505.0, 11506.0, 11507.0, 11545.0, 11546.0, 11547.0, 11548.0, 11549.0, 11550.0, 11551.0, 11552.0, 11553.0, 11554.0, 11555.0, 11556.0, 11557.0, 11558.0, 11559.0, 11560.0, 11561.0, 11562.0, 11563.0, 11564.0, 11565.0, 11566.0, 11567.0, 11568.0, 11569.0, 11584.0, 11585.0, 11586.0, 11587.0, 11588.0, 11589.0, 11590.0, 11591.0, 11592.0, 11593.0, 11594.0, 11595.0, 11596.0, 11597.0, 11598.0, 11599.0, 11600.0, 11601.0, 11602.0, 11603.0, 11604.0, 11605.0, 11606.0, 11607.0, 11608.0, 11640.0, 11641.0, 11642.0, 11643.0, 11644.0, 11645.0, 11646.0, 11647.0, 11648.0, 11649.0, 11650.0, 11651.0, 11652.0, 11653.0, 11654.0, 11655.0, 11656.0, 11657.0, 11658.0, 11659.0, 11660.0, 11661.0, 11662.0, 11663.0, 11664.0]::double precision[];
  v_is_gr double precision[] := array[33.94, 68.76, 59.92, 47.66, 58.39, 38.26, 60.36, 26.08, 39.22, 51.93, 59.37, 26.44, 60.08, 79.25, 35.72, 29.25, 60.74, 41.75, 61.47, 36.17, 60.35, 51.51, 23.67, 68.82, 62.88, 24.39, 62.69, 48.42, 52.81, 52.76, 94.74, 82.44, 72.86, 37.92, 59.53, 27.48, 58.74, 28.54, 52.94, 50.28, 44.66, 82.36, 56.56, 43.65, 62.54, 40.02, 33.12, 91.7, 73.0, 68.65, 29.89, 29.29, 90.64, 29.75, 33.02, 60.77, 38.77, 80.71, 60.92, 90.66, 81.31, 49.86, 48.5, 78.13, 63.86, 33.89, 72.72, 30.99, 29.68, 69.09, 27.44, 98.67, 33.83, 56.19, 54.18, 44.98, 70.32, 73.42, 58.52, 92.11, 57.35, 66.54, 109.3, 77.56, 55.69, 57.39, 21.6, 60.74, 80.58, 70.38, 30.78, 47.42, 47.74, 59.12, 65.67, 48.96, 44.76, 25.46, 56.69, 50.56, 33.27, 29.32, 29.37, 35.78, 56.52, 28.89, 39.49, 53.98, 100.77, 60.85, 41.92, 50.32, 61.19, 48.46, 58.41, 77.31, 30.81, 66.08, 42.34, 52.0, 42.21, 69.91, 37.22, 38.18, 46.08, 57.78, 65.59, 75.97, 37.12, 61.95, 23.26, 56.64, 50.32, 31.07, 30.56, 42.51, 30.83, 54.99, 70.39, 63.25, 87.33, 78.03, 26.62, 57.82, 40.82, 56.22, 32.0, 62.22, 38.3, 63.74, 46.6, 32.38, 57.01, 59.97, 73.87, 78.18, 22.04, 77.91, 55.78, 73.13, 44.02, 27.0, 78.24, 37.3, 42.64, 50.54, 59.42, 50.71, 53.05, 62.22, 52.34, 67.35, 63.75, 27.18, 85.69, 58.75, 27.19, 50.16, 61.33, 30.89, 91.2, 35.43, 68.2, 25.94, 37.93, 49.99, 62.82, 58.58, 80.79, 39.27, 57.84, 30.19, 34.86, 24.57, 98.69, 32.81, 27.64, 56.98, 47.77, 106.41, 91.74, 100.18, 109.77, 80.51, 55.34, 93.54, 90.7, 65.65, 51.74, 81.48, 78.93, 77.36, 47.24, 69.22, 75.36, 46.96, 72.44, 109.32, 94.23, 57.53, 62.12, 86.06, 97.88, 97.68, 72.09]::double precision[];
  v_is_rhob double precision[] := array[2.239, 2.468, 2.371, 2.466, 2.39, 2.296, 2.477, 2.18, 2.238, 2.399, 2.466, 2.143, 2.347, 2.465, 2.182, 2.239, 2.43, 2.329, 2.346, 2.242, 2.474, 2.385, 2.214, 2.5, 2.357, 2.137, 2.489, 2.271, 2.348, 2.434, 2.538, 2.608, 2.534, 2.359, 2.353, 2.129, 2.36, 2.228, 2.402, 2.322, 2.203, 2.545, 2.296, 2.288, 2.425, 2.253, 2.249, 2.547, 2.52, 2.421, 2.201, 2.19, 2.59, 2.256, 2.29, 2.484, 2.274, 2.562, 2.429, 2.592, 2.554, 2.343, 2.375, 2.465, 2.443, 2.177, 2.465, 2.3, 2.126, 2.46, 2.29, 2.695, 2.211, 2.359, 2.375, 2.271, 2.573, 2.5, 2.364, 2.504, 2.386, 2.407, 2.68, 2.555, 2.364, 2.324, 2.271, 2.429, 2.523, 2.454, 2.248, 2.33, 2.268, 2.385, 2.489, 2.287, 2.272, 2.155, 2.344, 2.327, 2.242, 2.232, 2.288, 2.163, 2.45, 2.299, 2.258, 2.362, 2.68, 2.435, 2.371, 2.376, 2.462, 2.307, 2.405, 2.552, 2.153, 2.425, 2.306, 2.338, 2.23, 2.518, 2.251, 2.163, 2.194, 2.335, 2.483, 2.522, 2.219, 2.463, 2.254, 2.441, 2.289, 2.155, 2.155, 2.25, 2.296, 2.31, 2.547, 2.346, 2.668, 2.571, 2.231, 2.417, 2.385, 2.338, 2.211, 2.52, 2.252, 2.317, 2.262, 2.205, 2.37, 2.335, 2.55, 2.549, 2.223, 2.537, 2.475, 2.46, 2.373, 2.238, 2.425, 2.348, 2.232, 2.356, 2.403, 2.431, 2.294, 2.396, 2.321, 2.48, 2.419, 2.132, 2.52, 2.482, 2.237, 2.41, 2.421, 2.284, 2.648, 2.216, 2.477, 2.145, 2.428, 2.257, 2.331, 2.416, 2.562, 2.255, 2.533, 2.312, 2.243, 2.215, 2.682, 2.201, 2.129, 2.489, 2.263, 2.592, 2.469, 2.461, 2.609, 2.383, 2.245, 2.572, 2.398, 2.33, 2.253, 2.396, 2.306, 2.394, 2.176, 2.365, 2.346, 2.231, 2.357, 2.579, 2.46, 2.177, 2.196, 2.414, 2.433, 2.516, 2.237]::double precision[];
  v_is_nphi double precision[] := array[0.277, 0.284, 0.294, 0.234, 0.259, 0.262, 0.278, 0.305, 0.284, 0.269, 0.234, 0.303, 0.288, 0.265, 0.33, 0.272, 0.282, 0.237, 0.308, 0.305, 0.263, 0.296, 0.27, 0.271, 0.297, 0.343, 0.25, 0.291, 0.262, 0.25, 0.272, 0.261, 0.245, 0.274, 0.307, 0.337, 0.29, 0.272, 0.272, 0.283, 0.355, 0.269, 0.321, 0.31, 0.302, 0.289, 0.286, 0.276, 0.255, 0.274, 0.27, 0.307, 0.254, 0.26, 0.254, 0.257, 0.306, 0.271, 0.253, 0.265, 0.24, 0.276, 0.268, 0.264, 0.25, 0.263, 0.29, 0.229, 0.352, 0.274, 0.243, 0.226, 0.299, 0.285, 0.305, 0.311, 0.219, 0.248, 0.31, 0.283, 0.28, 0.319, 0.254, 0.239, 0.286, 0.302, 0.228, 0.221, 0.26, 0.283, 0.259, 0.235, 0.304, 0.291, 0.241, 0.307, 0.273, 0.317, 0.268, 0.259, 0.296, 0.253, 0.254, 0.303, 0.246, 0.229, 0.284, 0.279, 0.256, 0.278, 0.223, 0.289, 0.263, 0.308, 0.289, 0.255, 0.336, 0.28, 0.311, 0.281, 0.305, 0.238, 0.306, 0.323, 0.323, 0.272, 0.291, 0.244, 0.321, 0.248, 0.252, 0.264, 0.278, 0.3, 0.304, 0.302, 0.246, 0.318, 0.223, 0.312, 0.241, 0.242, 0.283, 0.262, 0.207, 0.294, 0.283, 0.212, 0.312, 0.315, 0.302, 0.3, 0.284, 0.306, 0.23, 0.245, 0.302, 0.239, 0.235, 0.266, 0.289, 0.259, 0.325, 0.273, 0.308, 0.27, 0.266, 0.196, 0.295, 0.285, 0.324, 0.218, 0.263, 0.327, 0.313, 0.252, 0.258, 0.235, 0.279, 0.29, 0.233, 0.314, 0.285, 0.33, 0.24, 0.324, 0.331, 0.256, 0.258, 0.295, 0.228, 0.244, 0.288, 0.303, 0.213, 0.292, 0.312, 0.187, 0.296, 0.308, 0.243, 0.302, 0.243, 0.291, 0.275, 0.238, 0.295, 0.297, 0.238, 0.276, 0.275, 0.238, 0.306, 0.242, 0.261, 0.271, 0.267, 0.267, 0.302, 0.32, 0.306, 0.28, 0.286, 0.257, 0.315]::double precision[];
  v_is_rt double precision[] := array[43.36, 22.41, 2.39, 1.95, 21.87, 1.6, 31.31, 46.87, 38.12, 27.11, 2.18, 49.49, 47.93, 2.76, 67.37, 34.97, 25.7, 38.81, 23.75, 34.18, 31.08, 2.0, 1.19, 3.07, 21.56, 1.19, 2.34, 1.67, 1.92, 26.6, 2.63, 3.93, 2.95, 2.03, 34.61, 1.35, 2.47, 1.2, 2.04, 1.75, 68.28, 2.88, 52.31, 52.44, 34.25, 40.32, 1.5, 3.37, 2.68, 2.3, 30.45, 36.46, 3.11, 1.21, 34.57, 2.11, 1.73, 2.86, 29.92, 3.29, 2.85, 2.1, 1.92, 2.83, 2.46, 38.96, 2.63, 31.07, 1.16, 29.03, 1.25, 3.81, 35.01, 2.45, 2.12, 46.51, 2.73, 2.12, 47.1, 3.23, 28.25, 1.89, 3.36, 2.75, 37.77, 2.19, 40.21, 2.47, 3.1, 28.88, 37.67, 36.9, 44.43, 24.52, 2.84, 2.05, 34.65, 1.35, 1.93, 1.65, 39.92, 36.39, 1.55, 32.65, 28.17, 32.48, 1.72, 30.98, 3.03, 2.53, 1.58, 2.01, 27.94, 2.31, 2.22, 3.47, 57.51, 45.83, 24.7, 1.73, 34.46, 2.61, 1.41, 50.15, 1.46, 2.05, 3.3, 2.51, 1.38, 2.04, 40.19, 24.12, 1.67, 57.8, 46.71, 1.78, 1.32, 35.55, 2.73, 27.01, 3.67, 2.36, 37.2, 2.88, 1.49, 29.07, 40.41, 1.96, 1.49, 35.3, 1.74, 34.66, 1.8, 30.95, 2.64, 3.27, 1.19, 2.3, 24.32, 3.7, 33.48, 1.18, 28.03, 31.53, 40.48, 28.08, 2.35, 1.74, 1.79, 28.12, 2.07, 2.41, 2.36, 1.2, 3.54, 2.16, 32.08, 30.74, 37.7, 1.39, 3.26, 38.0, 22.11, 1.2, 35.2, 1.97, 39.99, 28.77, 2.4, 34.41, 2.1, 1.35, 42.02, 33.74, 4.16, 1.37, 1.21, 1.94, 1.6, 3.7, 31.41, 28.41, 3.61, 30.82, 1.55, 2.58, 27.95, 35.0, 48.04, 31.26, 1.89, 1.97, 1.2, 1.69, 26.15, 1.28, 30.55, 2.38, 2.47, 1.4, 1.21, 24.48, 2.91, 3.2, 25.72]::double precision[];
  v_is_cali double precision[] := array[8.78, 9.24, 8.89, 8.79, 8.91, 9.33, 9.06, 9.33, 8.82, 8.95, 8.82, 9.15, 9.08, 9.77, 9.14, 9.0, 9.17, 8.86, 8.93, 8.94, 8.8, 9.14, 9.19, 9.01, 8.84, 8.85, 9.33, 8.98, 8.99, 8.99, 9.48, 8.87, 9.59, 8.8, 8.91, 8.99, 9.06, 8.78, 9.15, 9.39, 9.08, 8.93, 8.83, 9.11, 9.2, 8.81, 8.99, 8.86, 8.99, 8.78, 8.94, 8.88, 8.93, 8.9, 8.81, 9.0, 9.11, 9.14, 8.81, 9.13, 9.2, 8.82, 8.87, 8.87, 8.87, 8.98, 8.8, 9.3, 8.78, 8.77, 8.89, 9.02, 8.89, 9.1, 9.11, 8.95, 8.86, 9.29, 8.85, 9.19, 9.17, 8.93, 8.79, 8.86, 8.76, 8.97, 9.08, 8.88, 8.76, 8.97, 9.13, 9.06, 9.24, 9.45, 9.35, 9.25, 8.95, 9.2, 8.87, 9.1, 8.98, 8.88, 9.16, 8.75, 8.9, 9.41, 9.36, 9.21, 8.9, 9.27, 8.9, 8.96, 8.77, 8.95, 8.75, 9.14, 8.99, 8.84, 9.14, 8.94, 9.16, 8.82, 8.93, 9.17, 8.79, 9.26, 8.89, 9.05, 8.88, 8.93, 9.13, 8.93, 8.85, 8.94, 8.88, 8.99, 8.76, 9.08, 8.78, 8.95, 9.0, 9.19, 8.93, 8.84, 8.94, 9.46, 8.92, 8.88, 9.1, 8.94, 9.17, 9.44, 8.98, 9.13, 9.22, 9.58, 9.06, 9.03, 8.93, 9.27, 9.27, 8.89, 9.05, 8.78, 8.75, 9.12, 8.75, 8.79, 8.81, 9.13, 8.96, 9.08, 8.85, 8.91, 8.88, 9.21, 9.16, 8.97, 9.37, 8.79, 9.01, 8.87, 9.17, 8.83, 8.84, 8.95, 8.91, 9.12, 8.82, 8.82, 8.89, 9.19, 8.77, 9.33, 8.81, 8.82, 9.29, 9.29, 9.26, 8.8, 9.47, 8.79, 8.89, 9.05, 8.96, 9.43, 9.06, 9.12, 8.78, 9.13, 8.95, 8.93, 9.27, 8.81, 9.23, 9.11, 9.03, 8.91, 8.86, 9.56, 8.86, 9.01, 8.98, 9.12, 8.93]::double precision[];
  v_is_dt double precision[] := array[90.2, 102.9, 112.8, 93.7, 102.2, 95.9, 108.7, 94.8, 99.0, 102.7, 96.7, 99.9, 103.3, 110.6, 105.4, 92.1, 104.2, 94.5, 109.0, 106.1, 100.9, 102.6, 94.3, 103.8, 104.4, 102.7, 103.8, 103.8, 96.4, 98.6, 111.6, 109.3, 102.0, 103.7, 109.1, 103.4, 106.7, 92.9, 101.4, 100.2, 107.9, 107.2, 108.2, 100.2, 106.4, 94.6, 99.0, 108.0, 102.3, 102.2, 92.0, 97.9, 107.5, 87.0, 86.5, 98.9, 97.0, 101.2, 98.7, 109.8, 102.8, 100.7, 97.5, 101.2, 95.1, 92.2, 104.4, 82.1, 95.5, 100.6, 86.2, 108.6, 96.4, 101.6, 102.0, 106.4, 103.5, 102.1, 106.9, 115.7, 103.0, 111.1, 115.4, 103.6, 102.2, 99.4, 82.9, 103.4, 101.5, 108.4, 89.2, 95.2, 97.4, 104.7, 102.3, 101.9, 104.3, 98.8, 100.6, 94.4, 98.7, 92.9, 96.0, 98.6, 94.6, 89.6, 98.7, 99.2, 110.8, 101.8, 90.7, 102.3, 99.5, 108.0, 101.4, 109.8, 101.4, 103.4, 103.3, 100.5, 102.1, 96.3, 96.8, 100.4, 100.5, 98.2, 103.3, 98.9, 95.7, 96.3, 84.6, 96.2, 95.2, 93.3, 92.7, 97.8, 78.6, 101.1, 95.0, 103.8, 107.9, 96.8, 90.4, 100.8, 83.3, 102.2, 96.3, 88.4, 93.5, 96.9, 103.0, 101.3, 103.4, 109.6, 103.2, 108.7, 94.9, 102.1, 99.8, 102.9, 102.5, 93.0, 116.6, 107.1, 102.2, 101.6, 102.7, 97.6, 100.9, 104.7, 106.1, 96.8, 104.6, 98.6, 120.5, 100.5, 85.2, 93.3, 99.7, 95.6, 107.1, 103.0, 102.7, 94.3, 92.7, 101.7, 102.4, 98.0, 94.9, 96.0, 96.5, 85.5, 92.5, 89.9, 109.3, 95.5, 95.6, 85.5, 94.1, 114.7, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]::double precision[];
  v_is_phic double precision[] := array[0.244, 0.158, 0.206, 0.15, 0.2, 0.235, 0.165, 0.312, 0.271, 0.178, 0.139, 0.314, 0.203, 0.151, 0.344, 0.259, 0.186, 0.166, 0.202, 0.269, 0.163, 0.205, 0.25, 0.116, 0.178, 0.322, 0.138, 0.245, 0.199, 0.169, 0.1, 0.057, 0.117, 0.214, 0.15, 0.306, 0.193, 0.237, 0.188, 0.21, 0.32, 0.097, 0.241, 0.267, 0.171, 0.252, 0.279, 0.07, 0.124, 0.188, 0.246, 0.295, 0.094, 0.251, 0.242, 0.125, 0.227, 0.105, 0.165, 0.099, 0.104, 0.248, 0.19, 0.13, 0.168, 0.25, 0.201, 0.223, 0.296, 0.144, 0.231, 0.046, 0.268, 0.196, 0.22, 0.242, 0.091, 0.121, 0.251, 0.123, 0.201, 0.188, 0.049, 0.106, 0.184, 0.247, 0.199, 0.156, 0.11, 0.144, 0.233, 0.206, 0.232, 0.179, 0.153, 0.257, 0.269, 0.285, 0.21, 0.211, 0.209, 0.313, 0.207, 0.3, 0.166, 0.207, 0.22, 0.231, 0.055, 0.156, 0.166, 0.203, 0.133, 0.26, 0.196, 0.111, 0.297, 0.2, 0.235, 0.216, 0.28, 0.076, 0.245, 0.328, 0.294, 0.18, 0.162, 0.157, 0.248, 0.149, 0.236, 0.145, 0.264, 0.305, 0.26, 0.267, 0.212, 0.218, 0.067, 0.206, 0.081, 0.092, 0.272, 0.161, 0.154, 0.194, 0.285, 0.124, 0.276, 0.217, 0.232, 0.249, 0.228, 0.215, 0.078, 0.113, 0.279, 0.069, 0.138, 0.167, 0.196, 0.249, 0.192, 0.209, 0.273, 0.231, 0.178, 0.16, 0.204, 0.182, 0.226, 0.132, 0.153, 0.298, 0.106, 0.144, 0.284, 0.167, 0.19, 0.259, 0.098, 0.278, 0.155, 0.309, 0.15, 0.254, 0.189, 0.168, 0.083, 0.239, 0.15, 0.212, 0.276, 0.269, 0.046, 0.264, 0.32, 0.122, 0.257, 0.107, 0.14, 0.147, 0.089, 0.194, 0.224, 0.123, 0.189, 0.252, 0.234, 0.193, 0.243, 0.173, 0.276, 0.205, 0.189, 0.243, 0.183, 0.099, 0.168, 0.316, 0.266, 0.158, 0.159, 0.101, 0.254]::double precision[];
  v_is_pay double precision[] := array[1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0]::double precision[];
  v_is_easting double precision[] := array[510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 510.51, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.07, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 507.86, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 509.56, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.94, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 510.46, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 508.59, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 506.22, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04, 508.04]::double precision[];
  v_is_northing double precision[] := array[132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 132.42, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.11, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.33, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 133.02, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.2, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 134.61, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 133.12, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 132.63, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56, 133.56]::double precision[];
  v_is_kb double precision[] := array[20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 20.1, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 16.2, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 18.9, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 17.4, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 22.0, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 24.9, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 16.3, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 27.5, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0, 15.0]::double precision[];
  v_is_mudweight double precision[] := array[9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 9.8, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.5, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.6, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 10.1, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 9.6, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.4, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.3, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0]::double precision[];
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'mlcore' and active;
  if v_structures <> 3 then
    raise exception 'D2 go-live refused: mlcore has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'mlcore';
  if v_questions <> 396 then
    raise exception 'D2 go-live refused: mlcore has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'mlcore' group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'D2 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;
  select count(*) into v_n from (select tier, module_key from public.academy_quiz_questions where app_slug = 'mlcore' and scope = 'module' group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'D2 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'mlcore' and scope = 'final' group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'D2 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = 'mlcore'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'D2 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;
  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'mlcore' and s.active;
  if v_lessons <> 78 then
    raise exception 'D2 go-live refused: mlcore carries % lesson keys, expected 78', v_lessons;
  end if;
  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'mlcore' and s.active;
  if v_modules <> 18 then
    raise exception 'D2 go-live refused: mlcore carries % modules, expected 18 (six per tier)', v_modules;
  end if;
  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'mlcore' and qq.scope = 'module' and not exists (
       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'D2 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'mlcore';
  if v_capstones <> 3 then
    raise exception 'D2 go-live refused: mlcore has % capstones, expected 3', v_capstones;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'mlcore';
  if v_graded <> 18 then
    raise exception 'D2 go-live refused: mlcore has % graded capstone fields, expected 18', v_graded;
  end if;
  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'mlcore' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'D2 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'mlcore' and module = 'data_ai' and path_order = 67 and prereq_slug is null) then
    raise exception 'D2 go-live refused: the mlcore catalogue row is not data_ai at path_order 67 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 67 and slug <> 'mlcore') then
    raise exception 'D2 go-live refused: another course already holds path_order 67';
  end if;

  -- ------------------------------------------------- the grader is numeric
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or (f->>'expected')::numeric <= 0
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric <> 0.0000005
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'D2 go-live refused: % graded field(s) are not a positive non-whole number at tolerance 0.0000005 with a label and a unit: %', v_n, v_names;
  end if;
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
          or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception 'D2 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;

  -- ---------------------------------------- the prompts the learner reads
  select prompt into v_prompt from public.academy_capstones where app_slug = 'mlcore' and tier = 'beginner';
  if v_prompt is null or md5(v_prompt) <> '8993f08612f3c5f47b2d9ad9731e64ce' then
    raise exception 'D2 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'mlcore' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'AKPARA, 7 wells with a sonic, and a whole-well split' and title = 'A model and its test') then
    raise exception 'D2 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['groupSplit at test fraction 0.3 and seed 11', 'target DT, features GR, RHOB and NPHI', 'the population standard deviation', 'about the mean of the test targets', 'akpara_wells.csv']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D2 go-live refused: % stated setting(s) or case file(s) are not named in the shipped beginner prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'mlcore' and tier = 'intermediate';
  if v_prompt is null or md5(v_prompt) <> 'a873b1a33e34e805f2d85633c3cee11b' then
    raise exception 'D2 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'mlcore' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'OBORIA, 8 wells with a sonic, well-level attributes and a stated pay rule' and title = 'Validating a model') then
    raise exception 'D2 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['ridge at lambda 20', 'groupKFold with k 4 and seed 3', 'folds counted from 0', 'test fraction 0.25 and seed 9', 'the F1 of pay, label 1', 'oboria_wells.csv']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D2 go-live refused: % stated setting(s) or case file(s) are not named in the shipped intermediate prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'mlcore' and tier = 'advanced';
  if v_prompt is null or md5(v_prompt) <> '9dd2d24245fb6515b2098846e35737d2' then
    raise exception 'D2 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'mlcore' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'ISUAMA, 9 wells, one of them without a sonic' and title = 'When the engine refuses, stops or extrapolates') then
    raise exception 'D2 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['l2 0.5', 'RT at or above 12 ohm.m', 'maxIter 3', '5 repeats and seed 9', 'ridge at lambda 5', 'trainGroupCounts 1, 2, 3, 4, 5, 6', 'isuama_wells.csv']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D2 go-live refused: % stated setting(s) or case file(s) are not named in the shipped advanced prompt: %', v_n, v_names;
  end if;
  -- No number handed in any capstone text of this course may sit within its
  -- tolerance of any graded value of any tier.
  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names
    from (select c.tier as ctier, m[1]::double precision as x
            from public.academy_capstones c,
                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||
                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),
                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m
           where c.app_slug = 'mlcore') h,
         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'mlcore') g
   where abs(abs(h.x) - abs(g.v)) <= g.t;
  if v_n <> 0 then
    raise exception 'D2 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_akpara_rhob_train_centre_g_cm3
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'beginner' and f->>'key' = 'akpara_rhob_train_centre_g_cm3';
  if v_g_akpara_rhob_train_centre_g_cm3 is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: beginner/akpara_rhob_train_centre_g_cm3]';
  end if;
  select (f->>'expected')::double precision into v_g_akpara_gr_train_scale_gapi
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'beginner' and f->>'key' = 'akpara_gr_train_scale_gapi';
  if v_g_akpara_gr_train_scale_gapi is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: beginner/akpara_gr_train_scale_gapi]';
  end if;
  select (f->>'expected')::double precision into v_g_akpara_ols_nphi_coef_us_ft_per_vv
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'beginner' and f->>'key' = 'akpara_ols_nphi_coef_us_ft_per_vv';
  if v_g_akpara_ols_nphi_coef_us_ft_per_vv is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: beginner/akpara_ols_nphi_coef_us_ft_per_vv]';
  end if;
  select (f->>'expected')::double precision into v_g_akpara_ols_residual_se_us_ft
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'beginner' and f->>'key' = 'akpara_ols_residual_se_us_ft';
  if v_g_akpara_ols_residual_se_us_ft is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: beginner/akpara_ols_residual_se_us_ft]';
  end if;
  select (f->>'expected')::double precision into v_g_akpara_test_rmse_us_ft
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'beginner' and f->>'key' = 'akpara_test_rmse_us_ft';
  if v_g_akpara_test_rmse_us_ft is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: beginner/akpara_test_rmse_us_ft]';
  end if;
  select (f->>'expected')::double precision into v_g_akpara_test_r2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'beginner' and f->>'key' = 'akpara_test_r2';
  if v_g_akpara_test_r2 is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: beginner/akpara_test_r2]';
  end if;
  select (f->>'expected')::double precision into v_g_oboria_ridge_gr_coef_us_ft_per_gapi
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'intermediate' and f->>'key' = 'oboria_ridge_gr_coef_us_ft_per_gapi';
  if v_g_oboria_ridge_gr_coef_us_ft_per_gapi is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: intermediate/oboria_ridge_gr_coef_us_ft_per_gapi]';
  end if;
  select (f->>'expected')::double precision into v_g_oboria_fold2_test_rmse_us_ft
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'intermediate' and f->>'key' = 'oboria_fold2_test_rmse_us_ft';
  if v_g_oboria_fold2_test_rmse_us_ft is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: intermediate/oboria_fold2_test_rmse_us_ft]';
  end if;
  select (f->>'expected')::double precision into v_g_oboria_leak_optimism_rmse_us_ft
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'intermediate' and f->>'key' = 'oboria_leak_optimism_rmse_us_ft';
  if v_g_oboria_leak_optimism_rmse_us_ft is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: intermediate/oboria_leak_optimism_rmse_us_ft]';
  end if;
  select (f->>'expected')::double precision into v_g_oboria_logistic_rt_coef_per_ohmm
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'intermediate' and f->>'key' = 'oboria_logistic_rt_coef_per_ohmm';
  if v_g_oboria_logistic_rt_coef_per_ohmm is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: intermediate/oboria_logistic_rt_coef_per_ohmm]';
  end if;
  select (f->>'expected')::double precision into v_g_oboria_pay_f1
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'intermediate' and f->>'key' = 'oboria_pay_f1';
  if v_g_oboria_pay_f1 is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: intermediate/oboria_pay_f1]';
  end if;
  select (f->>'expected')::double precision into v_g_oboria_test_log_loss
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'intermediate' and f->>'key' = 'oboria_test_log_loss';
  if v_g_oboria_test_log_loss is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: intermediate/oboria_test_log_loss]';
  end if;
  select (f->>'expected')::double precision into v_g_isuama_scaled_condition_attrs
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'advanced' and f->>'key' = 'isuama_scaled_condition_attrs';
  if v_g_isuama_scaled_condition_attrs is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: advanced/isuama_scaled_condition_attrs]';
  end if;
  select (f->>'expected')::double precision into v_g_isuama_l2_phic_coef_per_vv
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'advanced' and f->>'key' = 'isuama_l2_phic_coef_per_vv';
  if v_g_isuama_l2_phic_coef_per_vv is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: advanced/isuama_l2_phic_coef_per_vv]';
  end if;
  select (f->>'expected')::double precision into v_g_isuama_nphi_coef_after_three_updates_per_vv
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'advanced' and f->>'key' = 'isuama_nphi_coef_after_three_updates_per_vv';
  if v_g_isuama_nphi_coef_after_three_updates_per_vv is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: advanced/isuama_nphi_coef_after_three_updates_per_vv]';
  end if;
  select (f->>'expected')::double precision into v_g_isuama_perm_nphi_mean_drop_us_ft
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'advanced' and f->>'key' = 'isuama_perm_nphi_mean_drop_us_ft';
  if v_g_isuama_perm_nphi_mean_drop_us_ft is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: advanced/isuama_perm_nphi_mean_drop_us_ft]';
  end if;
  select (f->>'expected')::double precision into v_g_isuama_lc_test_rmse_three_wells_us_ft
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'advanced' and f->>'key' = 'isuama_lc_test_rmse_three_wells_us_ft';
  if v_g_isuama_lc_test_rmse_three_wells_us_ft is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: advanced/isuama_lc_test_rmse_three_wells_us_ft]';
  end if;
  select (f->>'expected')::double precision into v_g_isuama_pred_dt_first_row_us_ft
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'mlcore' and c.tier = 'advanced' and f->>'key' = 'isuama_pred_dt_first_row_us_ft';
  if v_g_isuama_pred_dt_first_row_us_ft is null then
    raise exception 'D2 go-live refused: the seeded rows carry no value [graded field: advanced/isuama_pred_dt_first_row_us_ft]';
  end if;

  -- ------------------------------------------ 1. against the engine ledger
  if v_g_akpara_rhob_train_centre_g_cm3 <> 2.369333333333333 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 2.369333333333333 [graded field: beginner/akpara_rhob_train_centre_g_cm3]', v_g_akpara_rhob_train_centre_g_cm3;
  end if;
  if v_g_akpara_gr_train_scale_gapi <> 18.445087772173302 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 18.445087772173302 [graded field: beginner/akpara_gr_train_scale_gapi]', v_g_akpara_gr_train_scale_gapi;
  end if;
  if v_g_akpara_ols_nphi_coef_us_ft_per_vv <> 121.54669798581409 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 121.54669798581409 [graded field: beginner/akpara_ols_nphi_coef_us_ft_per_vv]', v_g_akpara_ols_nphi_coef_us_ft_per_vv;
  end if;
  if v_g_akpara_ols_residual_se_us_ft <> 4.3428711783541365 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 4.3428711783541365 [graded field: beginner/akpara_ols_residual_se_us_ft]', v_g_akpara_ols_residual_se_us_ft;
  end if;
  if v_g_akpara_test_rmse_us_ft <> 6.463037388177031 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 6.463037388177031 [graded field: beginner/akpara_test_rmse_us_ft]', v_g_akpara_test_rmse_us_ft;
  end if;
  if v_g_akpara_test_r2 <> 0.5407700663135229 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 0.5407700663135229 [graded field: beginner/akpara_test_r2]', v_g_akpara_test_r2;
  end if;
  if v_g_oboria_ridge_gr_coef_us_ft_per_gapi <> 0.227314496133488 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 0.227314496133488 [graded field: intermediate/oboria_ridge_gr_coef_us_ft_per_gapi]', v_g_oboria_ridge_gr_coef_us_ft_per_gapi;
  end if;
  if v_g_oboria_fold2_test_rmse_us_ft <> 5.561248670428681 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 5.561248670428681 [graded field: intermediate/oboria_fold2_test_rmse_us_ft]', v_g_oboria_fold2_test_rmse_us_ft;
  end if;
  if v_g_oboria_leak_optimism_rmse_us_ft <> 0.5236372597314727 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 0.5236372597314727 [graded field: intermediate/oboria_leak_optimism_rmse_us_ft]', v_g_oboria_leak_optimism_rmse_us_ft;
  end if;
  if v_g_oboria_logistic_rt_coef_per_ohmm <> 0.27888702512322944 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 0.27888702512322944 [graded field: intermediate/oboria_logistic_rt_coef_per_ohmm]', v_g_oboria_logistic_rt_coef_per_ohmm;
  end if;
  if v_g_oboria_pay_f1 <> 0.9032258064516129 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 0.9032258064516129 [graded field: intermediate/oboria_pay_f1]', v_g_oboria_pay_f1;
  end if;
  if v_g_oboria_test_log_loss <> 0.13201570623027237 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 0.13201570623027237 [graded field: intermediate/oboria_test_log_loss]', v_g_oboria_test_log_loss;
  end if;
  if v_g_isuama_scaled_condition_attrs <> 1870.7743756649013 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 1870.7743756649013 [graded field: advanced/isuama_scaled_condition_attrs]', v_g_isuama_scaled_condition_attrs;
  end if;
  if v_g_isuama_l2_phic_coef_per_vv <> 2.441453174361039 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 2.441453174361039 [graded field: advanced/isuama_l2_phic_coef_per_vv]', v_g_isuama_l2_phic_coef_per_vv;
  end if;
  if v_g_isuama_nphi_coef_after_three_updates_per_vv <> 15.814859233201421 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 15.814859233201421 [graded field: advanced/isuama_nphi_coef_after_three_updates_per_vv]', v_g_isuama_nphi_coef_after_three_updates_per_vv;
  end if;
  if v_g_isuama_perm_nphi_mean_drop_us_ft <> 3.4745572800936713 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 3.4745572800936713 [graded field: advanced/isuama_perm_nphi_mean_drop_us_ft]', v_g_isuama_perm_nphi_mean_drop_us_ft;
  end if;
  if v_g_isuama_lc_test_rmse_three_wells_us_ft <> 4.092026715190326 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 4.092026715190326 [graded field: advanced/isuama_lc_test_rmse_three_wells_us_ft]', v_g_isuama_lc_test_rmse_three_wells_us_ft;
  end if;
  if v_g_isuama_pred_dt_first_row_us_ft <> 104.97106546670008 then
    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned 104.97106546670008 [graded field: advanced/isuama_pred_dt_first_row_us_ft]', v_g_isuama_pred_dt_first_row_us_ft;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  v_te := pg_temp.d2_gtest(v_ak_well, 0.3, 11);
  v_itr := pg_temp.d2_rows(v_ak_well, v_te, false); v_ite := pg_temp.d2_rows(v_ak_well, v_te, true);
  v_x := pg_temp.d2_t(array[v_ak_gr, v_ak_rhob, v_ak_nphi]);
  v_xtr := pg_temp.d2_sub(v_x, v_itr); v_xte := pg_temp.d2_sub(v_x, v_ite);
  v_ytr := pg_temp.d2_vsub(v_ak_dt, v_itr); v_yte := pg_temp.d2_vsub(v_ak_dt, v_ite);
  v_ntr := array_length(v_itr, 1);
  v_b := pg_temp.d2_ols(v_xtr, v_ytr);
  v_rss := (select sum((a - b) * (a - b)) from unnest(v_ytr, pg_temp.d2_pred(v_b, v_xtr)) as t(a, b));
  v_s := (select avg(x) from unnest(pg_temp.d2_vsub(v_ak_rhob, v_itr)) x);
  if v_s is null or abs(v_s - v_g_akpara_rhob_train_centre_g_cm3) > 1e-9 * greatest(1.0, abs(v_g_akpara_rhob_train_centre_g_cm3)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/akpara_rhob_train_centre_g_cm3]', v_s, v_g_akpara_rhob_train_centre_g_cm3;
  end if;
  v_s := (select stddev_pop(x) from unnest(pg_temp.d2_vsub(v_ak_gr, v_itr)) x);
  if v_s is null or abs(v_s - v_g_akpara_gr_train_scale_gapi) > 1e-9 * greatest(1.0, abs(v_g_akpara_gr_train_scale_gapi)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/akpara_gr_train_scale_gapi]', v_s, v_g_akpara_gr_train_scale_gapi;
  end if;
  v_s := v_b[4];
  if v_s is null or abs(v_s - v_g_akpara_ols_nphi_coef_us_ft_per_vv) > 1e-9 * greatest(1.0, abs(v_g_akpara_ols_nphi_coef_us_ft_per_vv)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/akpara_ols_nphi_coef_us_ft_per_vv]', v_s, v_g_akpara_ols_nphi_coef_us_ft_per_vv;
  end if;
  v_s := sqrt(v_rss / (v_ntr::double precision - 4.0));
  if v_s is null or abs(v_s - v_g_akpara_ols_residual_se_us_ft) > 1e-9 * greatest(1.0, abs(v_g_akpara_ols_residual_se_us_ft)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/akpara_ols_residual_se_us_ft]', v_s, v_g_akpara_ols_residual_se_us_ft;
  end if;
  v_s := pg_temp.d2_rmse(v_yte, pg_temp.d2_pred(v_b, v_xte));
  if v_s is null or abs(v_s - v_g_akpara_test_rmse_us_ft) > 1e-9 * greatest(1.0, abs(v_g_akpara_test_rmse_us_ft)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/akpara_test_rmse_us_ft]', v_s, v_g_akpara_test_rmse_us_ft;
  end if;
  v_s := pg_temp.d2_r2(v_yte, pg_temp.d2_pred(v_b, v_xte));
  if v_s is null or abs(v_s - v_g_akpara_test_r2) > 1e-9 * greatest(1.0, abs(v_g_akpara_test_r2)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/akpara_test_r2]', v_s, v_g_akpara_test_r2;
  end if;
  v_te := pg_temp.d2_gtest(v_ob_well, 0.25, 3);
  v_itr := pg_temp.d2_rows(v_ob_well, v_te, false); v_ite := pg_temp.d2_rows(v_ob_well, v_te, true);
  v_x := pg_temp.d2_t(array[v_ob_gr, v_ob_rhob, v_ob_nphi, v_ob_easting, v_ob_northing, v_ob_kb, v_ob_mudweight]);
  v_ytr := pg_temp.d2_vsub(v_ob_dt, v_itr);
  v_s := (pg_temp.d2_ridge(pg_temp.d2_sub(v_x, v_itr), v_ytr, 20.0))[2];
  if v_s is null or abs(v_s - v_g_oboria_ridge_gr_coef_us_ft_per_gapi) > 1e-9 * greatest(1.0, abs(v_g_oboria_ridge_gr_coef_us_ft_per_gapi)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/oboria_ridge_gr_coef_us_ft_per_gapi]', v_s, v_g_oboria_ridge_gr_coef_us_ft_per_gapi;
  end if;
  v_ord := pg_temp.d2_order(v_ob_well, 3);
  v_wl := array(select v_ord[q] from generate_series(1, array_length(v_ord, 1)) q where (q - 1) % 4 = 2 order by q);
  v_itr := pg_temp.d2_rows(v_ob_well, v_wl, false); v_ite := pg_temp.d2_rows(v_ob_well, v_wl, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));
  v_s := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_ite)));
  if v_s is null or abs(v_s - v_g_oboria_fold2_test_rmse_us_ft) > 1e-9 * greatest(1.0, abs(v_g_oboria_fold2_test_rmse_us_ft)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/oboria_fold2_test_rmse_us_ft]', v_s, v_g_oboria_fold2_test_rmse_us_ft;
  end if;
  v_n := array_length(v_ob_well, 1);
  v_pm := pg_temp.d2_perm(v_n, pg_temp.d2_u(3, v_n - 1), 0);
  v_irr := array(select v_pm[q] + 1 from generate_series(1, pg_temp.d2_ceil(0.25, v_n)) q);
  v_ite := array(select i from generate_series(1, v_n) i where i = any(v_irr) order by i);
  v_itr := array(select i from generate_series(1, v_n) i where not (i = any(v_irr)) order by i);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4, 5, 6, 7]), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));
  v_rr := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4, 5, 6, 7]), v_ite)));
  v_te := pg_temp.d2_gtest(v_ob_well, 0.25, 3);
  v_itr := pg_temp.d2_rows(v_ob_well, v_te, false); v_ite := pg_temp.d2_rows(v_ob_well, v_te, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4, 5, 6, 7]), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));
  v_rg := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4, 5, 6, 7]), v_ite)));
  v_s := v_rg - v_rr;
  if v_s is null or abs(v_s - v_g_oboria_leak_optimism_rmse_us_ft) > 1e-9 * greatest(1.0, abs(v_g_oboria_leak_optimism_rmse_us_ft)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/oboria_leak_optimism_rmse_us_ft]', v_s, v_g_oboria_leak_optimism_rmse_us_ft;
  end if;
  v_te := pg_temp.d2_gtest(v_ob_well, 0.25, 9);
  v_itr := pg_temp.d2_rows(v_ob_well, v_te, false); v_ite := pg_temp.d2_rows(v_ob_well, v_te, true);
  v_b := pg_temp.d2_logit(pg_temp.d2_sub(pg_temp.d2_t(array[v_ob_rhob, v_ob_nphi, v_ob_rt]), v_itr), pg_temp.d2_vsub(v_ob_pay, v_itr), 0.0, 100, 1e-10);
  v_ph := pg_temp.d2_prob(v_b, pg_temp.d2_sub(pg_temp.d2_t(array[v_ob_rhob, v_ob_nphi, v_ob_rt]), v_ite));
  v_yte := pg_temp.d2_vsub(v_ob_pay, v_ite);
  v_s := v_b[4];
  if v_s is null or abs(v_s - v_g_oboria_logistic_rt_coef_per_ohmm) > 1e-9 * greatest(1.0, abs(v_g_oboria_logistic_rt_coef_per_ohmm)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/oboria_logistic_rt_coef_per_ohmm]', v_s, v_g_oboria_logistic_rt_coef_per_ohmm;
  end if;
  v_s := pg_temp.d2_f1(v_yte, v_ph, 1.0);
  if v_s is null or abs(v_s - v_g_oboria_pay_f1) > 1e-9 * greatest(1.0, abs(v_g_oboria_pay_f1)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/oboria_pay_f1]', v_s, v_g_oboria_pay_f1;
  end if;
  v_s := pg_temp.d2_logloss(v_yte, v_ph);
  if v_s is null or abs(v_s - v_g_oboria_test_log_loss) > 1e-9 * greatest(1.0, abs(v_g_oboria_test_log_loss)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/oboria_test_log_loss]', v_s, v_g_oboria_test_log_loss;
  end if;
  v_ix := array(select i from generate_subscripts(v_is_dt, 1) i where v_is_dt[i] is not null order by i);
  v_wl := array(select v_is_well[i] from unnest(v_ix) with ordinality u(i, o) order by o);
  v_y := pg_temp.d2_vsub(v_is_dt, v_ix);
  v_x := pg_temp.d2_sub(pg_temp.d2_t(array[v_is_gr, v_is_rhob, v_is_nphi, v_is_cali, v_is_easting, v_is_northing, v_is_kb, v_is_mudweight]), v_ix);
  if exists (select 1 from unnest(v_wl) x where x = 'ISUAMA-9') or (select count(*) from unnest(v_is_dt) x where x is null) <> 25 then
    raise exception 'D2 go-live refused: the rows without a sonic are not exactly the 25 rows of ISUAMA-9 [graded field: advanced/isuama_pred_dt_first_row_us_ft]';
  end if;
  v_s := pg_temp.d2_cond(pg_temp.d2_cols(v_x, array[1, 2, 3, 5, 6, 7, 8]), true);
  if v_s is null or abs(v_s - v_g_isuama_scaled_condition_attrs) > 1e-9 * greatest(1.0, abs(v_g_isuama_scaled_condition_attrs)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/isuama_scaled_condition_attrs]', v_s, v_g_isuama_scaled_condition_attrs;
  end if;
  v_s := (pg_temp.d2_logit(pg_temp.d2_t(array[pg_temp.d2_vsub(v_is_phic, array(select i from generate_subscripts(v_is_rt, 1) i where v_is_rt[i] >= 12.0 order by i))]), pg_temp.d2_vsub(v_is_pay, array(select i from generate_subscripts(v_is_rt, 1) i where v_is_rt[i] >= 12.0 order by i)), 0.5, 100, 1e-10))[2];
  if v_s is null or abs(v_s - v_g_isuama_l2_phic_coef_per_vv) > 1e-9 * greatest(1.0, abs(v_g_isuama_l2_phic_coef_per_vv)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/isuama_l2_phic_coef_per_vv]', v_s, v_g_isuama_l2_phic_coef_per_vv;
  end if;
  v_s := (pg_temp.d2_logit(pg_temp.d2_t(array[v_is_rhob, v_is_nphi, v_is_rt]), v_is_pay, 0.0, 3, 1e-10))[3];
  if v_s is null or abs(v_s - v_g_isuama_nphi_coef_after_three_updates_per_vv) > 1e-9 * greatest(1.0, abs(v_g_isuama_nphi_coef_after_three_updates_per_vv)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/isuama_nphi_coef_after_three_updates_per_vv]', v_s, v_g_isuama_nphi_coef_after_three_updates_per_vv;
  end if;
  v_te := pg_temp.d2_gtest(v_wl, 0.25, 9);
  v_itr := pg_temp.d2_rows(v_wl, v_te, false); v_ite := pg_temp.d2_rows(v_wl, v_te, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4]), v_itr), pg_temp.d2_vsub(v_y, v_itr));
  v_s := pg_temp.d2_permdrop(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4]), v_ite), pg_temp.d2_vsub(v_y, v_ite), 3, 5, 9);
  if v_s is null or abs(v_s - v_g_isuama_perm_nphi_mean_drop_us_ft) > 1e-9 * greatest(1.0, abs(v_g_isuama_perm_nphi_mean_drop_us_ft)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/isuama_perm_nphi_mean_drop_us_ft]', v_s, v_g_isuama_perm_nphi_mean_drop_us_ft;
  end if;
  v_ord := pg_temp.d2_order(v_wl, 9);
  v_n := pg_temp.d2_ceil(0.25, array_length(v_ord, 1));
  v_te := v_ord[1 : v_n];
  v_itr := pg_temp.d2_rows(v_wl, v_ord[v_n + 1 : v_n + 3], true); v_ite := pg_temp.d2_rows(v_wl, v_te, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_itr), pg_temp.d2_vsub(v_y, v_itr));
  v_s := pg_temp.d2_rmse(pg_temp.d2_vsub(v_y, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_ite)));
  if v_s is null or abs(v_s - v_g_isuama_lc_test_rmse_three_wells_us_ft) > 1e-9 * greatest(1.0, abs(v_g_isuama_lc_test_rmse_three_wells_us_ft)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/isuama_lc_test_rmse_three_wells_us_ft]', v_s, v_g_isuama_lc_test_rmse_three_wells_us_ft;
  end if;
  v_b := pg_temp.d2_ridge(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_y, 5.0);
  v_s := (pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_t(array[v_is_gr, v_is_rhob, v_is_nphi]), array(select i from generate_subscripts(v_is_well, 1) i where v_is_well[i] = 'ISUAMA-9' order by i))))[1];
  if v_s is null or abs(v_s - v_g_isuama_pred_dt_first_row_us_ft) > 1e-9 * greatest(1.0, abs(v_g_isuama_pred_dt_first_row_us_ft)) then
    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/isuama_pred_dt_first_row_us_ft]', v_s, v_g_isuama_pred_dt_first_row_us_ft;
  end if;

  -- ------------------------------------------------------------ 3. the traps
  v_te := pg_temp.d2_gtest(v_ak_well, 0.3, 11);
  v_itr := pg_temp.d2_rows(v_ak_well, v_te, false); v_ite := pg_temp.d2_rows(v_ak_well, v_te, true);
  v_x := pg_temp.d2_t(array[v_ak_gr, v_ak_rhob, v_ak_nphi]);
  v_xtr := pg_temp.d2_sub(v_x, v_itr); v_xte := pg_temp.d2_sub(v_x, v_ite);
  v_ytr := pg_temp.d2_vsub(v_ak_dt, v_itr); v_yte := pg_temp.d2_vsub(v_ak_dt, v_ite);
  v_ntr := array_length(v_itr, 1);
  v_b := pg_temp.d2_ols(v_xtr, v_ytr);
  v_rss := (select sum((a - b) * (a - b)) from unnest(v_ytr, pg_temp.d2_pred(v_b, v_xtr)) as t(a, b));
  v_wrong := (select avg(x) from unnest(v_ak_rhob) x);
  if v_wrong is null or abs(v_wrong - v_g_akpara_rhob_train_centre_g_cm3) <= 5e-07 then
    raise exception 'D2 go-live refused: the centre fitted on every row gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpara_rhob_train_centre_g_cm3]', v_wrong, v_g_akpara_rhob_train_centre_g_cm3;
  end if;
  v_wrong := (select avg(x) from unnest(pg_temp.d2_vsub(v_ak_rhob, v_ite)) x);
  if v_wrong is null or abs(v_wrong - v_g_akpara_rhob_train_centre_g_cm3) <= 5e-07 then
    raise exception 'D2 go-live refused: the centre fitted on the test wells gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpara_rhob_train_centre_g_cm3]', v_wrong, v_g_akpara_rhob_train_centre_g_cm3;
  end if;
  v_wrong := (select stddev_samp(x) from unnest(pg_temp.d2_vsub(v_ak_gr, v_itr)) x);
  if v_wrong is null or abs(v_wrong - v_g_akpara_gr_train_scale_gapi) <= 5e-07 then
    raise exception 'D2 go-live refused: the sample standard deviation gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpara_gr_train_scale_gapi]', v_wrong, v_g_akpara_gr_train_scale_gapi;
  end if;
  v_wrong := (select stddev_pop(x) from unnest(v_ak_gr) x);
  if v_wrong is null or abs(v_wrong - v_g_akpara_gr_train_scale_gapi) <= 5e-07 then
    raise exception 'D2 go-live refused: the scale fitted on every row gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpara_gr_train_scale_gapi]', v_wrong, v_g_akpara_gr_train_scale_gapi;
  end if;
  v_wrong := (pg_temp.d2_ols(pg_temp.d2_cols(v_xtr, array[3]), v_ytr))[2];
  if v_wrong is null or abs(v_wrong - v_g_akpara_ols_nphi_coef_us_ft_per_vv) <= 5e-07 then
    raise exception 'D2 go-live refused: NPHI alone gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpara_ols_nphi_coef_us_ft_per_vv]', v_wrong, v_g_akpara_ols_nphi_coef_us_ft_per_vv;
  end if;
  v_wrong := (pg_temp.d2_ols0(v_xtr, v_ytr))[4];
  if v_wrong is null or abs(v_wrong - v_g_akpara_ols_nphi_coef_us_ft_per_vv) <= 5e-07 then
    raise exception 'D2 go-live refused: the fit without an intercept gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpara_ols_nphi_coef_us_ft_per_vv]', v_wrong, v_g_akpara_ols_nphi_coef_us_ft_per_vv;
  end if;
  v_wrong := v_b[4] / 100.0;
  if v_wrong is null or abs(v_wrong - v_g_akpara_ols_nphi_coef_us_ft_per_vv) <= 5e-07 then
    raise exception 'D2 go-live refused: the rate per hundredth of v/v gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpara_ols_nphi_coef_us_ft_per_vv]', v_wrong, v_g_akpara_ols_nphi_coef_us_ft_per_vv;
  end if;
  v_wrong := sqrt(v_rss / v_ntr::double precision);
  if v_wrong is null or abs(v_wrong - v_g_akpara_ols_residual_se_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: RSS over n gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpara_ols_residual_se_us_ft]', v_wrong, v_g_akpara_ols_residual_se_us_ft;
  end if;
  v_wrong := sqrt(v_rss / (v_ntr::double precision - 1.0));
  if v_wrong is null or abs(v_wrong - v_g_akpara_ols_residual_se_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: RSS over n - 1 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpara_ols_residual_se_us_ft]', v_wrong, v_g_akpara_ols_residual_se_us_ft;
  end if;
  v_wrong := pg_temp.d2_rmse(v_ytr, pg_temp.d2_pred(v_b, v_xtr));
  if v_wrong is null or abs(v_wrong - v_g_akpara_test_rmse_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: the training RMSE gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpara_test_rmse_us_ft]', v_wrong, v_g_akpara_test_rmse_us_ft;
  end if;
  v_wrong := pg_temp.d2_mae(v_yte, pg_temp.d2_pred(v_b, v_xte));
  if v_wrong is null or abs(v_wrong - v_g_akpara_test_rmse_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: the test MAE gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpara_test_rmse_us_ft]', v_wrong, v_g_akpara_test_rmse_us_ft;
  end if;
  v_wrong := pg_temp.d2_r2(v_yte, pg_temp.d2_pred(v_b, v_xte), (select avg(x) from unnest(v_ytr) x));
  if v_wrong is null or abs(v_wrong - v_g_akpara_test_r2) <= 5e-07 then
    raise exception 'D2 go-live refused: R-squared about the training mean gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpara_test_r2]', v_wrong, v_g_akpara_test_r2;
  end if;
  v_wrong := pg_temp.d2_r2(v_ytr, pg_temp.d2_pred(v_b, v_xtr));
  if v_wrong is null or abs(v_wrong - v_g_akpara_test_r2) <= 5e-07 then
    raise exception 'D2 go-live refused: the training R-squared gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/akpara_test_r2]', v_wrong, v_g_akpara_test_r2;
  end if;
  v_te := pg_temp.d2_gtest(v_ob_well, 0.25, 3);
  v_itr := pg_temp.d2_rows(v_ob_well, v_te, false);
  v_x := pg_temp.d2_t(array[v_ob_gr, v_ob_rhob, v_ob_nphi, v_ob_easting, v_ob_northing, v_ob_kb, v_ob_mudweight]);
  v_xtr := pg_temp.d2_sub(v_x, v_itr); v_ytr := pg_temp.d2_vsub(v_ob_dt, v_itr);
  v_wrong := (pg_temp.d2_ridge(v_xtr, v_ytr, 20.0 * array_length(v_itr, 1)::double precision))[2];
  if v_wrong is null or abs(v_wrong - v_g_oboria_ridge_gr_coef_us_ft_per_gapi) <= 5e-07 then
    raise exception 'D2 go-live refused: lambda times n gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_ridge_gr_coef_us_ft_per_gapi]', v_wrong, v_g_oboria_ridge_gr_coef_us_ft_per_gapi;
  end if;
  v_wrong := (pg_temp.d2_ols(v_xtr, v_ytr))[2];
  if v_wrong is null or abs(v_wrong - v_g_oboria_ridge_gr_coef_us_ft_per_gapi) <= 5e-07 then
    raise exception 'D2 go-live refused: least squares in place of ridge gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_ridge_gr_coef_us_ft_per_gapi]', v_wrong, v_g_oboria_ridge_gr_coef_us_ft_per_gapi;
  end if;
  v_wrong := (pg_temp.d2_ridge(v_xtr, v_ytr, 20.0, true))[2];
  if v_wrong is null or abs(v_wrong - v_g_oboria_ridge_gr_coef_us_ft_per_gapi) <= 5e-07 then
    raise exception 'D2 go-live refused: the standardised coefficient gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_ridge_gr_coef_us_ft_per_gapi]', v_wrong, v_g_oboria_ridge_gr_coef_us_ft_per_gapi;
  end if;
  v_ord := pg_temp.d2_order(v_ob_well, 3);
  v_wl := array(select v_ord[q] from generate_series(1, array_length(v_ord, 1)) q where (q - 1) % 4 = 0 order by q);
  v_itr := pg_temp.d2_rows(v_ob_well, v_wl, false); v_ite := pg_temp.d2_rows(v_ob_well, v_wl, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));
  v_wrong := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_ite)));
  if v_wrong is null or abs(v_wrong - v_g_oboria_fold2_test_rmse_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: fold 0 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_fold2_test_rmse_us_ft]', v_wrong, v_g_oboria_fold2_test_rmse_us_ft;
  end if;
  v_ord := pg_temp.d2_order(v_ob_well, 3);
  v_wl := array(select v_ord[q] from generate_series(1, array_length(v_ord, 1)) q where (q - 1) % 4 = 1 order by q);
  v_itr := pg_temp.d2_rows(v_ob_well, v_wl, false); v_ite := pg_temp.d2_rows(v_ob_well, v_wl, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));
  v_wrong := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_ite)));
  if v_wrong is null or abs(v_wrong - v_g_oboria_fold2_test_rmse_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: the fold numbered from one gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_fold2_test_rmse_us_ft]', v_wrong, v_g_oboria_fold2_test_rmse_us_ft;
  end if;
  v_ord := pg_temp.d2_order(v_ob_well, 4);
  v_wl := array(select v_ord[q] from generate_series(1, array_length(v_ord, 1)) q where (q - 1) % 4 = 2 order by q);
  v_itr := pg_temp.d2_rows(v_ob_well, v_wl, false); v_ite := pg_temp.d2_rows(v_ob_well, v_wl, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));
  v_wrong := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_ite)));
  if v_wrong is null or abs(v_wrong - v_g_oboria_fold2_test_rmse_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: the next seed gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_fold2_test_rmse_us_ft]', v_wrong, v_g_oboria_fold2_test_rmse_us_ft;
  end if;
  v_n := array_length(v_ob_well, 1);
  v_pm := pg_temp.d2_perm(v_n, pg_temp.d2_u(3, v_n - 1), 0);
  v_irr := array(select v_pm[q] + 1 from generate_series(1, pg_temp.d2_ceil(0.25, v_n)) q);
  v_ite := array(select i from generate_series(1, v_n) i where i = any(v_irr) order by i);
  v_itr := array(select i from generate_series(1, v_n) i where not (i = any(v_irr)) order by i);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4, 5, 6, 7]), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));
  v_rr := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4, 5, 6, 7]), v_ite)));
  v_te := pg_temp.d2_gtest(v_ob_well, 0.25, 3);
  v_itr := pg_temp.d2_rows(v_ob_well, v_te, false); v_ite := pg_temp.d2_rows(v_ob_well, v_te, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4, 5, 6, 7]), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));
  v_rg := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4, 5, 6, 7]), v_ite)));
  v_wrong := v_rg - v_rr;
  v_wrong := -v_wrong;
  if v_wrong is null or abs(v_wrong - v_g_oboria_leak_optimism_rmse_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: the sign reversed gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_leak_optimism_rmse_us_ft]', v_wrong, v_g_oboria_leak_optimism_rmse_us_ft;
  end if;
  v_n := array_length(v_ob_well, 1);
  v_pm := pg_temp.d2_perm(v_n, pg_temp.d2_u(3, v_n - 1), 0);
  v_irr := array(select v_pm[q] + 1 from generate_series(1, pg_temp.d2_ceil(0.25, v_n)) q);
  v_ite := array(select i from generate_series(1, v_n) i where i = any(v_irr) order by i);
  v_itr := array(select i from generate_series(1, v_n) i where not (i = any(v_irr)) order by i);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));
  v_rr := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_ite)));
  v_te := pg_temp.d2_gtest(v_ob_well, 0.25, 3);
  v_itr := pg_temp.d2_rows(v_ob_well, v_te, false); v_ite := pg_temp.d2_rows(v_ob_well, v_te, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));
  v_rg := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_ite)));
  v_wrong := v_rg - v_rr;
  if v_wrong is null or abs(v_wrong - v_g_oboria_leak_optimism_rmse_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: the logs alone gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_leak_optimism_rmse_us_ft]', v_wrong, v_g_oboria_leak_optimism_rmse_us_ft;
  end if;
  v_n := array_length(v_ob_well, 1);
  v_pm := pg_temp.d2_perm(v_n, pg_temp.d2_u(4, v_n - 1), 0);
  v_irr := array(select v_pm[q] + 1 from generate_series(1, pg_temp.d2_ceil(0.25, v_n)) q);
  v_ite := array(select i from generate_series(1, v_n) i where i = any(v_irr) order by i);
  v_itr := array(select i from generate_series(1, v_n) i where not (i = any(v_irr)) order by i);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4, 5, 6, 7]), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));
  v_rr := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4, 5, 6, 7]), v_ite)));
  v_te := pg_temp.d2_gtest(v_ob_well, 0.25, 4);
  v_itr := pg_temp.d2_rows(v_ob_well, v_te, false); v_ite := pg_temp.d2_rows(v_ob_well, v_te, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4, 5, 6, 7]), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));
  v_rg := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4, 5, 6, 7]), v_ite)));
  v_wrong := v_rg - v_rr;
  if v_wrong is null or abs(v_wrong - v_g_oboria_leak_optimism_rmse_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: the next seed gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_leak_optimism_rmse_us_ft]', v_wrong, v_g_oboria_leak_optimism_rmse_us_ft;
  end if;
  v_te := pg_temp.d2_gtest(v_ob_well, 0.25, 9);
  v_itr := pg_temp.d2_rows(v_ob_well, v_te, false); v_ite := pg_temp.d2_rows(v_ob_well, v_te, true);
  v_b := pg_temp.d2_logit(pg_temp.d2_sub(pg_temp.d2_t(array[v_ob_rhob, v_ob_nphi, v_ob_rt]), v_itr), pg_temp.d2_vsub(v_ob_pay, v_itr), 0.0, 100, 1e-10);
  v_ph := pg_temp.d2_prob(v_b, pg_temp.d2_sub(pg_temp.d2_t(array[v_ob_rhob, v_ob_nphi, v_ob_rt]), v_ite));
  v_yte := pg_temp.d2_vsub(v_ob_pay, v_ite);
  v_wrong := exp(v_b[4]);
  if v_wrong is null or abs(v_wrong - v_g_oboria_logistic_rt_coef_per_ohmm) <= 5e-07 then
    raise exception 'D2 go-live refused: the odds ratio quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_logistic_rt_coef_per_ohmm]', v_wrong, v_g_oboria_logistic_rt_coef_per_ohmm;
  end if;
  v_te := pg_temp.d2_gtest(v_ob_well, 0.25, 9);
  v_itr := pg_temp.d2_rows(v_ob_well, v_te, false); v_ite := pg_temp.d2_rows(v_ob_well, v_te, true);
  v_b := pg_temp.d2_logit(pg_temp.d2_sub(pg_temp.d2_t(array[v_ob_rhob, v_ob_nphi, v_ob_rt]), v_itr), pg_temp.d2_vsub(v_ob_pay, v_itr), 1.0, 100, 1e-10);
  v_ph := pg_temp.d2_prob(v_b, pg_temp.d2_sub(pg_temp.d2_t(array[v_ob_rhob, v_ob_nphi, v_ob_rt]), v_ite));
  v_yte := pg_temp.d2_vsub(v_ob_pay, v_ite);
  v_wrong := v_b[4];
  if v_wrong is null or abs(v_wrong - v_g_oboria_logistic_rt_coef_per_ohmm) <= 5e-07 then
    raise exception 'D2 go-live refused: a penalty of l2 1 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_logistic_rt_coef_per_ohmm]', v_wrong, v_g_oboria_logistic_rt_coef_per_ohmm;
  end if;
  v_te := pg_temp.d2_gtest(v_ob_well, 0.25, 3);
  v_itr := pg_temp.d2_rows(v_ob_well, v_te, false); v_ite := pg_temp.d2_rows(v_ob_well, v_te, true);
  v_b := pg_temp.d2_logit(pg_temp.d2_sub(pg_temp.d2_t(array[v_ob_rhob, v_ob_nphi, v_ob_rt]), v_itr), pg_temp.d2_vsub(v_ob_pay, v_itr), 0.0, 100, 1e-10);
  v_ph := pg_temp.d2_prob(v_b, pg_temp.d2_sub(pg_temp.d2_t(array[v_ob_rhob, v_ob_nphi, v_ob_rt]), v_ite));
  v_yte := pg_temp.d2_vsub(v_ob_pay, v_ite);
  v_wrong := v_b[4];
  if v_wrong is null or abs(v_wrong - v_g_oboria_logistic_rt_coef_per_ohmm) <= 5e-07 then
    raise exception 'D2 go-live refused: the sonic split seed used for pay gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_logistic_rt_coef_per_ohmm]', v_wrong, v_g_oboria_logistic_rt_coef_per_ohmm;
  end if;

  -- the pay split of the brief, for the F1 and log loss traps
  v_te := pg_temp.d2_gtest(v_ob_well, 0.25, 9);
  v_itr := pg_temp.d2_rows(v_ob_well, v_te, false); v_ite := pg_temp.d2_rows(v_ob_well, v_te, true);
  v_b := pg_temp.d2_logit(pg_temp.d2_sub(pg_temp.d2_t(array[v_ob_rhob, v_ob_nphi, v_ob_rt]), v_itr), pg_temp.d2_vsub(v_ob_pay, v_itr), 0.0, 100, 1e-10);
  v_ph := pg_temp.d2_prob(v_b, pg_temp.d2_sub(pg_temp.d2_t(array[v_ob_rhob, v_ob_nphi, v_ob_rt]), v_ite));
  v_yte := pg_temp.d2_vsub(v_ob_pay, v_ite);
  v_wrong := 0.5 * (pg_temp.d2_f1(v_yte, v_ph, 1.0) + pg_temp.d2_f1(v_yte, v_ph, 0.0));
  if v_wrong is null or abs(v_wrong - v_g_oboria_pay_f1) <= 5e-07 then
    raise exception 'D2 go-live refused: the macro F1 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_pay_f1]', v_wrong, v_g_oboria_pay_f1;
  end if;
  v_wrong := pg_temp.d2_f1(v_yte, v_ph, 0.0);
  if v_wrong is null or abs(v_wrong - v_g_oboria_pay_f1) <= 5e-07 then
    raise exception 'D2 go-live refused: the F1 of label 0 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_pay_f1]', v_wrong, v_g_oboria_pay_f1;
  end if;
  v_wrong := (select count(*) filter (where (q > 0.5) = (a = 1.0))::double precision / count(*)::double precision from unnest(v_yte, v_ph) as t(a, q));
  if v_wrong is null or abs(v_wrong - v_g_oboria_pay_f1) <= 5e-07 then
    raise exception 'D2 go-live refused: the accuracy gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_pay_f1]', v_wrong, v_g_oboria_pay_f1;
  end if;
  v_wrong := pg_temp.d2_logloss(v_yte, v_ph) / ln(10.0);
  if v_wrong is null or abs(v_wrong - v_g_oboria_test_log_loss) <= 5e-07 then
    raise exception 'D2 go-live refused: the base ten log gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_test_log_loss]', v_wrong, v_g_oboria_test_log_loss;
  end if;
  v_wrong := pg_temp.d2_logloss(v_yte, v_ph) * array_length(v_yte, 1)::double precision;
  if v_wrong is null or abs(v_wrong - v_g_oboria_test_log_loss) <= 5e-07 then
    raise exception 'D2 go-live refused: the summed loss gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/oboria_test_log_loss]', v_wrong, v_g_oboria_test_log_loss;
  end if;
  v_ix := array(select i from generate_subscripts(v_is_dt, 1) i where v_is_dt[i] is not null order by i);
  v_wl := array(select v_is_well[i] from unnest(v_ix) with ordinality u(i, o) order by o);
  v_y := pg_temp.d2_vsub(v_is_dt, v_ix);
  v_x := pg_temp.d2_sub(pg_temp.d2_t(array[v_is_gr, v_is_rhob, v_is_nphi, v_is_cali, v_is_easting, v_is_northing, v_is_kb, v_is_mudweight]), v_ix);
  v_wrong := pg_temp.d2_cond(pg_temp.d2_cols(v_x, array[1, 2, 3, 5, 6, 7, 8]), false);
  if v_wrong is null or abs(v_wrong - v_g_isuama_scaled_condition_attrs) <= 5e-07 then
    raise exception 'D2 go-live refused: the raw condition number gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_scaled_condition_attrs]', v_wrong, v_g_isuama_scaled_condition_attrs;
  end if;
  v_wrong := pg_temp.d2_cond(pg_temp.d2_cols(v_x, array[1, 2, 3]), true);
  if v_wrong is null or abs(v_wrong - v_g_isuama_scaled_condition_attrs) <= 5e-07 then
    raise exception 'D2 go-live refused: the logs alone gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_scaled_condition_attrs]', v_wrong, v_g_isuama_scaled_condition_attrs;
  end if;
  v_wrong := (pg_temp.d2_logit(pg_temp.d2_t(array[pg_temp.d2_vsub(v_is_phic, array(select i from generate_subscripts(v_is_rt, 1) i where v_is_rt[i] >= 12.0 order by i))]), pg_temp.d2_vsub(v_is_pay, array(select i from generate_subscripts(v_is_rt, 1) i where v_is_rt[i] >= 12.0 order by i)), 2.0 * 0.5, 100, 1e-10))[2];
  if v_wrong is null or abs(v_wrong - v_g_isuama_l2_phic_coef_per_vv) <= 5e-07 then
    raise exception 'D2 go-live refused: the penalty not halved gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_l2_phic_coef_per_vv]', v_wrong, v_g_isuama_l2_phic_coef_per_vv;
  end if;
  v_wrong := (pg_temp.d2_logit(pg_temp.d2_t(array[pg_temp.d2_vsub(v_is_phic, array(select i from generate_subscripts(v_is_rt, 1) i where v_is_rt[i] >= 12.0 order by i))]), pg_temp.d2_vsub(v_is_pay, array(select i from generate_subscripts(v_is_rt, 1) i where v_is_rt[i] >= 12.0 order by i)), 0.5 * array_length(array(select i from generate_subscripts(v_is_rt, 1) i where v_is_rt[i] >= 12.0 order by i), 1)::double precision, 100, 1e-10))[2];
  if v_wrong is null or abs(v_wrong - v_g_isuama_l2_phic_coef_per_vv) <= 5e-07 then
    raise exception 'D2 go-live refused: the penalty times n gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_l2_phic_coef_per_vv]', v_wrong, v_g_isuama_l2_phic_coef_per_vv;
  end if;
  v_wrong := (pg_temp.d2_logit(pg_temp.d2_t(array[v_is_phic]), v_is_pay, 0.5, 100, 1e-10))[2];
  if v_wrong is null or abs(v_wrong - v_g_isuama_l2_phic_coef_per_vv) <= 5e-07 then
    raise exception 'D2 go-live refused: every row in place of the high RT rows gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_l2_phic_coef_per_vv]', v_wrong, v_g_isuama_l2_phic_coef_per_vv;
  end if;
  v_wrong := (pg_temp.d2_logit(pg_temp.d2_t(array[v_is_rhob, v_is_nphi, v_is_rt]), v_is_pay, 0.0, 100, 1e-10))[3];
  if v_wrong is null or abs(v_wrong - v_g_isuama_nphi_coef_after_three_updates_per_vv) <= 5e-07 then
    raise exception 'D2 go-live refused: the converged value gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_nphi_coef_after_three_updates_per_vv]', v_wrong, v_g_isuama_nphi_coef_after_three_updates_per_vv;
  end if;
  v_wrong := (pg_temp.d2_logit(pg_temp.d2_t(array[v_is_rhob, v_is_nphi, v_is_rt]), v_is_pay, 0.0, 2, 1e-10))[3];
  if v_wrong is null or abs(v_wrong - v_g_isuama_nphi_coef_after_three_updates_per_vv) <= 5e-07 then
    raise exception 'D2 go-live refused: two updates gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_nphi_coef_after_three_updates_per_vv]', v_wrong, v_g_isuama_nphi_coef_after_three_updates_per_vv;
  end if;
  v_wrong := (pg_temp.d2_logit(pg_temp.d2_t(array[v_is_rhob, v_is_nphi, v_is_rt]), v_is_pay, 0.0, 4, 1e-10))[3];
  if v_wrong is null or abs(v_wrong - v_g_isuama_nphi_coef_after_three_updates_per_vv) <= 5e-07 then
    raise exception 'D2 go-live refused: four updates gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_nphi_coef_after_three_updates_per_vv]', v_wrong, v_g_isuama_nphi_coef_after_three_updates_per_vv;
  end if;
  v_te := pg_temp.d2_gtest(v_wl, 0.25, 9);
  v_itr := pg_temp.d2_rows(v_wl, v_te, false); v_ite := pg_temp.d2_rows(v_wl, v_te, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4]), v_itr), pg_temp.d2_vsub(v_y, v_itr));
  v_wrong := pg_temp.d2_permdrop(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4]), v_ite), pg_temp.d2_vsub(v_y, v_ite), 3, 5, 10);
  if v_wrong is null or abs(v_wrong - v_g_isuama_perm_nphi_mean_drop_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: the next permutation seed gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_perm_nphi_mean_drop_us_ft]', v_wrong, v_g_isuama_perm_nphi_mean_drop_us_ft;
  end if;
  v_te := pg_temp.d2_gtest(v_wl, 0.25, 9);
  v_itr := pg_temp.d2_rows(v_wl, v_te, false); v_ite := pg_temp.d2_rows(v_wl, v_te, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4]), v_itr), pg_temp.d2_vsub(v_y, v_itr));
  v_wrong := pg_temp.d2_permdrop(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4]), v_ite), pg_temp.d2_vsub(v_y, v_ite), 3, 1, 9);
  if v_wrong is null or abs(v_wrong - v_g_isuama_perm_nphi_mean_drop_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: one repeat gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_perm_nphi_mean_drop_us_ft]', v_wrong, v_g_isuama_perm_nphi_mean_drop_us_ft;
  end if;
  v_ord := pg_temp.d2_order(v_wl, 9);
  v_n := pg_temp.d2_ceil(0.25, array_length(v_ord, 1));
  v_te := v_ord[1 : v_n];
  v_itr := pg_temp.d2_rows(v_wl, v_ord[v_n + 1 : v_n + 3], true); v_ite := pg_temp.d2_rows(v_wl, v_te, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_itr), pg_temp.d2_vsub(v_y, v_itr));
  v_wrong := pg_temp.d2_rmse(pg_temp.d2_vsub(v_y, v_itr), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_itr)));
  if v_wrong is null or abs(v_wrong - v_g_isuama_lc_test_rmse_three_wells_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: the training score quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_lc_test_rmse_three_wells_us_ft]', v_wrong, v_g_isuama_lc_test_rmse_three_wells_us_ft;
  end if;
  v_ord := pg_temp.d2_order(v_wl, 9);
  v_n := pg_temp.d2_ceil(0.25, array_length(v_ord, 1));
  v_te := v_ord[1 : v_n];
  v_itr := pg_temp.d2_rows(v_wl, v_ord[v_n + 1 : v_n + 4], true); v_ite := pg_temp.d2_rows(v_wl, v_te, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_itr), pg_temp.d2_vsub(v_y, v_itr));
  v_wrong := pg_temp.d2_rmse(pg_temp.d2_vsub(v_y, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_ite)));
  if v_wrong is null or abs(v_wrong - v_g_isuama_lc_test_rmse_three_wells_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: the fourth point gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_lc_test_rmse_three_wells_us_ft]', v_wrong, v_g_isuama_lc_test_rmse_three_wells_us_ft;
  end if;
  v_ord := pg_temp.d2_order(v_wl, 10);
  v_n := pg_temp.d2_ceil(0.25, array_length(v_ord, 1));
  v_te := v_ord[1 : v_n];
  v_itr := pg_temp.d2_rows(v_wl, v_ord[v_n + 1 : v_n + 3], true); v_ite := pg_temp.d2_rows(v_wl, v_te, true);
  v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_itr), pg_temp.d2_vsub(v_y, v_itr));
  v_wrong := pg_temp.d2_rmse(pg_temp.d2_vsub(v_y, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_ite)));
  if v_wrong is null or abs(v_wrong - v_g_isuama_lc_test_rmse_three_wells_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: the next seed gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_lc_test_rmse_three_wells_us_ft]', v_wrong, v_g_isuama_lc_test_rmse_three_wells_us_ft;
  end if;
  v_b := pg_temp.d2_ols(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_y);
  v_wrong := (pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_t(array[v_is_gr, v_is_rhob, v_is_nphi]), array(select i from generate_subscripts(v_is_well, 1) i where v_is_well[i] = 'ISUAMA-9' order by i))))[1];
  if v_wrong is null or abs(v_wrong - v_g_isuama_pred_dt_first_row_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: least squares in place of ridge gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_pred_dt_first_row_us_ft]', v_wrong, v_g_isuama_pred_dt_first_row_us_ft;
  end if;
  v_b := pg_temp.d2_ridge(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_y, 5.0 * array_length(v_y, 1)::double precision);
  v_wrong := (pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_t(array[v_is_gr, v_is_rhob, v_is_nphi]), array(select i from generate_subscripts(v_is_well, 1) i where v_is_well[i] = 'ISUAMA-9' order by i))))[1];
  if v_wrong is null or abs(v_wrong - v_g_isuama_pred_dt_first_row_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: lambda times n gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_pred_dt_first_row_us_ft]', v_wrong, v_g_isuama_pred_dt_first_row_us_ft;
  end if;
  v_b := pg_temp.d2_ridge(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_y, 5.0);
  v_wrong := (pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_t(array[v_is_gr, v_is_rhob, v_is_nphi]), array(select i from generate_subscripts(v_is_well, 1) i where v_is_well[i] = 'ISUAMA-9' order by i))))[25];
  if v_wrong is null or abs(v_wrong - v_g_isuama_pred_dt_first_row_us_ft) <= 5e-07 then
    raise exception 'D2 go-live refused: the last row of the well gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/isuama_pred_dt_first_row_us_ft]', v_wrong, v_g_isuama_pred_dt_first_row_us_ft;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'mlcore';
  if not exists (select 1 from public.academy_apps where slug = 'mlcore' and status = 'available') then
    raise exception 'D2 go-live refused: mlcore did not reach status available';
  end if;
  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon from public.academy_apps;
  raise notice 'D2 go-live: mlcore available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
