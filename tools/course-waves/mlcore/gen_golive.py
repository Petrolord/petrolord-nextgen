#!/usr/bin/env python3
"""Generate the D2 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction,
and checked three ways, none of which restates the generator that wrote them:

1. AGAINST THE ENGINE LEDGER. gen_course.py runs `node d2_capstone.mjs --json`
   through the vendored engines/dataai/ml.js when this file is generated, and
   refuses unless fields.json carries exactly what that run returned. The
   go-live compares the seeded rows to THAT RUN'S values, to the last bit, so a
   capstone row an earlier seed left behind (the course migration inserts with
   `on conflict do nothing`) is refused by name, and so is a move of one part in
   1e7.

2. BY A SECOND ROUTE IN SQL over the data the learner is handed in the case
   files. Every graded value is recomputed by Postgres with no engine code, on
   roads the engine does not take: the mulberry32 stream in 64-bit integer
   arithmetic with a 16-bit split multiply, the Fisher-Yates shuffles, the
   whole-well splits, the folds and the random-row split rebuilt from it; least
   squares by the CENTRED, column-scaled normal equations (the engine uses a QR
   factorisation of the raw design); ridge by the normal equations of the
   standardised features plus lambda I (the engine uses QR of the stacked
   system); logistic regression by Newton steps solved by Gaussian elimination
   with partial pivoting on the unit-diagonal Hessian (the engine uses a
   Cholesky factorisation); the scaled condition number by a one-sided
   (Hestenes) Jacobi SVD of the column-scaled design (the engine takes the
   singular values of its R factor). Each must agree with the seeded value to
   1e-9 relative. The columns the second route reads are rendered from the same
   engine inputs as the case files, and every row selection (the rows with a
   sonic, the rows with RT at or above the cut, the well with no sonic) is made
   in SQL.

3. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE: for every field, two
   or three wrong methods a learner who missed the lesson would use (each one
   already swept with the ENGINE by discriminate.mjs) are computed in SQL, and
   the go-live refuses unless each misses the graded value by more than the
   field's tolerance.

And, before any of it: the shape of the ladder (3 structures, 78 lesson keys,
18 modules, 396 questions, 132 a tier, 15 a module bank, 42 an exam, four
options with a key inside them, 3 capstones, 18 fields, 6 a tier), the numeric
grader simulated on every field, each prompt byte for byte (md5) as
gen_course.py rendered it with every stated setting and case file named, and a
prompt sweep: no number handed in any capstone text sits within its tolerance
of any graded value.

THE HELPERS ARE TEMPORARY FUNCTIONS. The second route needs a solver, a
shuffle and a logistic fit several times over, so they are created in pg_temp
at the head of this file (create or replace, so a second run in one session
changes nothing) and vanish with the session. They create nothing in any
schema a learner or another migration can see.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a graded field without a ledger check, a second route and two traps; a
division by a bare integer; an unclosed literal; an em or en dash.

Usage: python3 gen_golive.py
   D2_WAVE, D2_REPO, D2_ENGINES, D2_TOLERANCE as gen_course.py
   D2_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   D2_GOLIVE_OUT  where to write
"""
import hashlib
import os
import re
import sys

W = os.environ.get('D2_WAVE', '/root/dai-wip-mlcore')
REPO = os.environ.get('D2_REPO', '/root/wt-dai-d2-nextgen')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['D2_WAVE'] = W
import gen_course as GC  # noqa: E402  (runs the engine; writes nothing on import)

DATE = GC.DATE
COURSE = os.environ.get('D2_COURSE_SQL', f'{REPO}/migrations/{DATE}_d2_mlcore_course.sql')
OUT = os.environ.get('D2_GOLIVE_OUT', f'{REPO}/migrations/{DATE}_d2_mlcore_go_live.sql')
SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
fields = GC.fields
KEYS, TIER_OF, F, TOL = GC.KEYS, GC.TIER_OF, GC.F, GC.TOL
ENGINE = {k: GC.ENGINE[(TIER_OF[k], k)] for k in KEYS}
AK, OB, IS = GC.AK, GC.OB, GC.IS
AKS, OBS, ISS = GC.AKS, GC.OBS, GC.ISS
refused = list(GC.bad)

course_sql = open(COURSE, encoding='utf-8').read()
if course_sql != GC.SQL:
    refused.append(f'the course migration at {COURSE} is not the one gen_course.py renders now')
TOL6 = 5e-7
for k in KEYS:
    if TOL[k] != TOL6:
        refused.append(f'{k} is graded at {TOL[k]}; every D2 field is graded at the six-decimal floor {TOL6}')


def fl(x):
    """A float literal SQL reads back as this exact double."""
    return repr(float(x))


def arr(xs):
    return 'array[' + ', '.join('null' if x is None else fl(x) for x in xs) + ']::double precision[]'


def tarr(xs):
    return 'array[' + ', '.join(lit(x) for x in xs) + ']::text[]'


def lit(s):
    return "'" + s.replace("'", "''") + "'"


def name(*keys):
    for k in keys:
        assert k in KEYS, k
    return ' [graded field: ' + ', '.join(f'{TIER_OF[k]}/{k}' for k in keys) + ']'


V = {k: f'v_g_{k}' for k in KEYS}
P = []  # the body
w = P.append
COUNT = {'ledger': set(), 'route': set(), 'trap': {}}


def route(key, expr_lines):
    """expr_lines compute v_s; then compare with the seeded value."""
    COUNT['route'].add(key)
    for l in expr_lines:
        w('  ' + l)
    w(f'  if v_s is null or abs(v_s - {V[key]}) > 1e-9 * greatest(1.0, abs({V[key]})) then')
    w(f"    raise exception 'D2 go-live refused: the second route in SQL gives %, and the seeded value is %{name(key)}', v_s, {V[key]};")
    w('  end if;')


def trap(key, label, expr_lines):
    COUNT['trap'][key] = COUNT['trap'].get(key, 0) + 1
    for l in expr_lines:
        w('  ' + l)
    w(f'  if v_wrong is null or abs(v_wrong - {V[key]}) <= {fl(TOL[key])} then')
    w(f"    raise exception 'D2 go-live refused: {label} gives %, within the tolerance of the seeded %, so the field does not discriminate the trap{name(key)}', v_wrong, {V[key]};")
    w('  end if;')


# ------------------------------------------------------------------- header
HEADER = f"""-- ============================================================================
-- D2 GO-LIVE (HELD): Machine Learning on Well Data flips to 'available', the
-- SECOND course of the Data & AI module, at path_order {PATH_ORDER}.
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
"""

# ------------------------------------------------------------------ helpers
HELPERS = r"""
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
"""

# -------------------------------------------------------------- declarations
decl = ['do $$', '#variable_conflict use_column', 'declare',
        '  v_structures int; v_questions int; v_capstones int; v_lessons int;',
        '  v_modules int; v_graded int; v_available int; v_soon int; v_n int; i int; j int;',
        '  v_names text; v_prompt text; v_s double precision; v_wrong double precision; v_x1 double precision;',
        '  v_te text[]; v_ord text[]; v_wl text[]; v_itr int[]; v_ite int[]; v_ix int[]; v_irr int[]; v_pm int[];',
        '  v_x double precision[]; v_xtr double precision[]; v_xte double precision[]; v_ytr double precision[];',
        '  v_yte double precision[]; v_b double precision[]; v_b2 double precision[]; v_ph double precision[];',
        '  v_y double precision[]; v_rss double precision; v_ntr int; v_nte int; v_rg double precision; v_rr double precision;']
for k in KEYS:
    decl.append(f'  {V[k]} double precision;')
COLS = ['depth', 'GR', 'RHOB', 'NPHI', 'RT', 'CALI', 'DT', 'PHIC', 'PAY']
ATTRS = ['easting', 'northing', 'kb', 'mudWeight']
for pre, fld in (('ak', AK['field']), ('ob', OB['field']), ('is', IS['field'])):
    wells = {x['id']: x for x in fld['wells']}
    decl.append(f"  v_{pre}_well text[] := {tarr([r['well'] for r in fld['rows']])};")
    for c in COLS:
        decl.append(f"  v_{pre}_{c.lower()} double precision[] := {arr([r[c] for r in fld['rows']])};")
    for a in ATTRS:
        decl.append(f"  v_{pre}_{a.lower()} double precision[] := {arr([wells[r['well']][a] for r in fld['rows']])};")
decl += ['begin', '']

# ------------------------------------------------------------------- shape
S = SLUG
w('  -- ---------------------------------------------------------------- shape')
w(f"  select count(*) into v_structures from public.academy_course_structures where app_slug = '{S}' and active;")
w("  if v_structures <> 3 then")
w(f"    raise exception 'D2 go-live refused: {S} has % active deep structures, expected 3', v_structures;")
w('  end if;')
w(f"  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{S}';")
w('  if v_questions <> 396 then')
w(f"    raise exception 'D2 go-live refused: {S} has % quiz questions, expected 396', v_questions;")
w('  end if;')
for cond, msg in ((f"select tier from public.academy_quiz_questions where app_slug = '{S}' group by tier having count(*) <> 132",
                   '% tier(s) do not carry exactly 132 questions'),
                  (f"select tier, module_key from public.academy_quiz_questions where app_slug = '{S}' and scope = 'module' group by tier, module_key having count(*) <> 15",
                   '% module bank(s) do not carry exactly 15 questions'),
                  (f"select tier from public.academy_quiz_questions where app_slug = '{S}' and scope = 'final' group by tier having count(*) <> 42",
                   '% final exam(s) do not carry exactly 42 questions')):
    w(f'  select count(*) into v_n from ({cond}) t;')
    w('  if v_n <> 0 then')
    w(f"    raise exception 'D2 go-live refused: {msg}', v_n;")
    w('  end if;')
w(f"  select count(*) into v_n from public.academy_quiz_questions where app_slug = '{S}'")
w('     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);')
w('  if v_n <> 0 then')
w("    raise exception 'D2 go-live refused: % question(s) do not offer four options with a key inside them', v_n;")
w('  end if;')
w('  select count(*) into v_lessons from public.academy_course_structures s,')
w("         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk")
w(f"   where s.app_slug = '{S}' and s.active;")
w('  if v_lessons <> 78 then')
w(f"    raise exception 'D2 go-live refused: {S} carries % lesson keys, expected 78', v_lessons;")
w('  end if;')
w("  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m")
w(f"   where s.app_slug = '{S}' and s.active;")
w('  if v_modules <> 18 then')
w(f"    raise exception 'D2 go-live refused: {S} carries % modules, expected 18 (six per tier)', v_modules;")
w('  end if;')
w('  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq')
w(f"     where qq.app_slug = '{S}' and qq.scope = 'module' and not exists (")
w("       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m")
w("        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;")
w('  if v_n <> 0 then')
w("    raise exception 'D2 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;")
w('  end if;')
w(f"  select count(*) into v_capstones from public.academy_capstones where app_slug = '{S}';")
w('  if v_capstones <> 3 then')
w(f"    raise exception 'D2 go-live refused: {S} has % capstones, expected 3', v_capstones;")
w('  end if;')
w(f"  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}';")
w('  if v_graded <> 18 then')
w(f"    raise exception 'D2 go-live refused: {S} has % graded capstone fields, expected 18', v_graded;")
w('  end if;')
w(f"  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}' group by c.tier having count(*) <> 6) t;")
w('  if v_n <> 0 then')
w("    raise exception 'D2 go-live refused: % tier(s) do not grade exactly six fields', v_n;")
w('  end if;')
w(f"  if not exists (select 1 from public.academy_apps where slug = '{S}' and module = '{MODULE}' and path_order = {PATH_ORDER} and prereq_slug is null) then")
w(f"    raise exception 'D2 go-live refused: the {S} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';")
w('  end if;')
w(f"  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{S}') then")
w(f"    raise exception 'D2 go-live refused: another course already holds path_order {PATH_ORDER}';")
w('  end if;')
w('')

# ------------------------------------------------------------ the grader
w('  -- ------------------------------------------------- the grader is numeric')
w("  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names")
w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
w(f"   where c.app_slug = '{S}'")
w("     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'")
w("          or (f->>'expected')::numeric <= 0")
w("          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001")
w("          or (f->>'tol')::numeric <> 0.0000005")
w("          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');")
w('  if v_n <> 0 then')
w("    raise exception 'D2 go-live refused: % graded field(s) are not a positive non-whole number at tolerance 0.0000005 with a label and a unit: %', v_n, v_names;")
w('  end if;')
w("  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names")
w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
w(f"   where c.app_slug = '{S}'")
w("     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric")
w("          or abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric")
w("          or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric);")
w('  if v_n <> 0 then')
w("    raise exception 'D2 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or pass one a unit off in the sixth decimal: %', v_n, v_names;")
w('  end if;')
w('')

# ------------------------------------------------------------ the prompts
w('  -- ---------------------------------------- the prompts the learner reads')
n = GC.n
STATED = {
    'beginner': [f"groupSplit at test fraction {n(AKS['testFraction'])} and seed {n(AKS['seed'])}",
                 'target DT, features GR, RHOB and NPHI', 'the population standard deviation',
                 'about the mean of the test targets'] + [f for f, _ in GC.CASES['beginner']],
    'intermediate': [f"ridge at lambda {n(OBS['lambda'])}", f"groupKFold with k {n(OBS['k'])} and seed {n(OBS['seed'])}",
                     'folds counted from 0', f"test fraction {n(OBS['testFraction'])} and seed {n(OBS['paySeed'])}",
                     'the F1 of pay, label 1'] + [f for f, _ in GC.CASES['intermediate']],
    'advanced': [f"l2 {n(ISS['l2'])}", f"RT at or above {n(ISS['rtCut'])} ohm.m", f"maxIter {n(ISS['maxIter'])}",
                 f"{n(ISS['nRepeats'])} repeats and seed {n(ISS['seed'])}", f"ridge at lambda {n(ISS['lambda'])}",
                 'trainGroupCounts ' + ', '.join(n(c) for c in ISS['counts'])] + [f for f, _ in GC.CASES['advanced']],
}
for tier in GC.TIERS:
    cert, dataset, title, prompt = GC.TIER[tier]
    for s_ in STATED[tier]:
        if s_ not in prompt:
            refused.append(f'{tier} prompt does not carry the stated setting "{s_}"')
    md5 = hashlib.md5(prompt.encode('utf-8')).hexdigest()
    w(f"  select prompt into v_prompt from public.academy_capstones where app_slug = '{S}' and tier = '{tier}';")
    w(f"  if v_prompt is null or md5(v_prompt) <> '{md5}' then")
    w(f"    raise exception 'D2 go-live refused: the {tier} prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);")
    w('  end if;')
    w(f"  if not exists (select 1 from public.academy_capstones where app_slug = '{S}' and tier = '{tier}'")
    w(f"                    and cert_tier = '{cert}' and dataset = {lit(dataset)} and title = {lit(title)}) then")
    w(f"    raise exception 'D2 go-live refused: the {tier} capstone does not carry the certificate tier, dataset and title gen_course.py rendered';")
    w('  end if;')
    w("  select count(*), string_agg(l, ' / ') into v_n, v_names")
    w(f"    from unnest(array[{', '.join(lit(s_) for s_ in STATED[tier])}]) l where strpos(v_prompt, l) = 0;")
    w('  if v_n <> 0 then')
    w(f"    raise exception 'D2 go-live refused: % stated setting(s) or case file(s) are not named in the shipped {tier} prompt: %', v_n, v_names;")
    w('  end if;')
w('  -- No number handed in any capstone text of this course may sit within its')
w('  -- tolerance of any graded value of any tier.')
w("  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names")
w("    from (select c.tier as ctier, m[1]::double precision as x")
w("            from public.academy_capstones c,")
w("                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||")
w("                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),")
w("                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m")
w(f"           where c.app_slug = '{S}') h,")
w("         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t")
w(f"            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}') g")
w('   where abs(abs(h.x) - abs(g.v)) <= g.t;')
w('  if v_n <> 0 then')
w("    raise exception 'D2 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;")
w('  end if;')
w('')

# ---------------------------------------------------- the graded values
w('  -- --------------------------------------- the eighteen graded values')
for k in KEYS:
    w(f"  select (f->>'expected')::double precision into {V[k]}")
    w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
    w(f"   where c.app_slug = '{S}' and c.tier = '{TIER_OF[k]}' and f->>'key' = '{k}';")
    w(f'  if {V[k]} is null then')
    w(f"    raise exception 'D2 go-live refused: the seeded rows carry no value{name(k)}';")
    w('  end if;')
w('')

# ------------------------------------------------------ 1. the ledger
w('  -- ------------------------------------------ 1. against the engine ledger')
for k in KEYS:
    COUNT['ledger'].add(k)
    w(f'  if {V[k]} <> {fl(ENGINE[k])} then')
    w(f"    raise exception 'D2 go-live refused: the seeded value is %, and the engine returned {fl(ENGINE[k])}{name(k)}', {V[k]};")
    w('  end if;')
w('')

# ------------------------------------------------- 2. the second route
w('  -- ----------------------------------------------- 2. the second route in SQL')
AKF, AKSD = fl(AKS['testFraction']), AKS['seed']
OBF, OBSD, OBL, OBK, OBFOLD, OBPS = fl(OBS['testFraction']), OBS['seed'], fl(OBS['lambda']), OBS['k'], OBS['fold'], OBS['paySeed']
ISF, ISSD, ISL2, ISRT, ISMI, ISREP, ISLAM = (fl(ISS['testFraction']), ISS['seed'], fl(ISS['l2']), fl(ISS['rtCut']),
                                            ISS['maxIter'], ISS['nRepeats'], fl(ISS['lambda']))
NOS = f"ISUAMA-{GC.IS_NW}"

# AKPARA: one whole-well split, shared by the six Associate routes.
w(f'  v_te := pg_temp.d2_gtest(v_ak_well, {AKF}, {AKSD});')
w('  v_itr := pg_temp.d2_rows(v_ak_well, v_te, false); v_ite := pg_temp.d2_rows(v_ak_well, v_te, true);')
w('  v_x := pg_temp.d2_t(array[v_ak_gr, v_ak_rhob, v_ak_nphi]);')
w('  v_xtr := pg_temp.d2_sub(v_x, v_itr); v_xte := pg_temp.d2_sub(v_x, v_ite);')
w('  v_ytr := pg_temp.d2_vsub(v_ak_dt, v_itr); v_yte := pg_temp.d2_vsub(v_ak_dt, v_ite);')
w('  v_ntr := array_length(v_itr, 1);')
w('  v_b := pg_temp.d2_ols(v_xtr, v_ytr);')
w('  v_rss := (select sum((a - b) * (a - b)) from unnest(v_ytr, pg_temp.d2_pred(v_b, v_xtr)) as t(a, b));')
route('akpara_rhob_train_centre_g_cm3', ['v_s := (select avg(x) from unnest(pg_temp.d2_vsub(v_ak_rhob, v_itr)) x);'])
route('akpara_gr_train_scale_gapi', ['v_s := (select stddev_pop(x) from unnest(pg_temp.d2_vsub(v_ak_gr, v_itr)) x);'])
route('akpara_ols_nphi_coef_us_ft_per_vv', ['v_s := v_b[4];'])
route('akpara_ols_residual_se_us_ft', ['v_s := sqrt(v_rss / (v_ntr::double precision - 4.0));'])
route('akpara_test_rmse_us_ft', ['v_s := pg_temp.d2_rmse(v_yte, pg_temp.d2_pred(v_b, v_xte));'])
route('akpara_test_r2', ['v_s := pg_temp.d2_r2(v_yte, pg_temp.d2_pred(v_b, v_xte));'])

# OBORIA
w(f'  v_te := pg_temp.d2_gtest(v_ob_well, {OBF}, {OBSD});')
w('  v_itr := pg_temp.d2_rows(v_ob_well, v_te, false); v_ite := pg_temp.d2_rows(v_ob_well, v_te, true);')
w('  v_x := pg_temp.d2_t(array[v_ob_gr, v_ob_rhob, v_ob_nphi, v_ob_easting, v_ob_northing, v_ob_kb, v_ob_mudweight]);')
w('  v_ytr := pg_temp.d2_vsub(v_ob_dt, v_itr);')
route('oboria_ridge_gr_coef_us_ft_per_gapi', [f'v_s := (pg_temp.d2_ridge(pg_temp.d2_sub(v_x, v_itr), v_ytr, {OBL}))[2];'])


def fold_rmse(seed, fold, target='v_s'):
    """OLS on the logs, trained off one fold of groupKFold and scored on it."""
    return [
        f'v_ord := pg_temp.d2_order(v_ob_well, {seed});',
        f'v_wl := array(select v_ord[q] from generate_series(1, array_length(v_ord, 1)) q where (q - 1) % {OBK} = {fold} order by q);',
        'v_itr := pg_temp.d2_rows(v_ob_well, v_wl, false); v_ite := pg_temp.d2_rows(v_ob_well, v_wl, true);',
        'v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));',
        f'{target} := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_ite)));']


route('oboria_fold2_test_rmse_us_ft', fold_rmse(OBSD, OBFOLD))


def leak(seed, cols, target='v_s'):
    """leakageDemo: the same OLS under randomRowSplit and groupSplit; group RMSE less random-row RMSE."""
    c = 'array[' + ', '.join(str(j) for j in cols) + ']'
    return [
        'v_n := array_length(v_ob_well, 1);',
        f'v_pm := pg_temp.d2_perm(v_n, pg_temp.d2_u({seed}, v_n - 1), 0);',
        f'v_irr := array(select v_pm[q] + 1 from generate_series(1, pg_temp.d2_ceil({OBF}, v_n)) q);',
        'v_ite := array(select i from generate_series(1, v_n) i where i = any(v_irr) order by i);',
        'v_itr := array(select i from generate_series(1, v_n) i where not (i = any(v_irr)) order by i);',
        f'v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, {c}), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));',
        f'v_rr := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, {c}), v_ite)));',
        f'v_te := pg_temp.d2_gtest(v_ob_well, {OBF}, {seed});',
        'v_itr := pg_temp.d2_rows(v_ob_well, v_te, false); v_ite := pg_temp.d2_rows(v_ob_well, v_te, true);',
        f'v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, {c}), v_itr), pg_temp.d2_vsub(v_ob_dt, v_itr));',
        f'v_rg := pg_temp.d2_rmse(pg_temp.d2_vsub(v_ob_dt, v_ite), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, {c}), v_ite)));',
        f'{target} := v_rg - v_rr;']


route('oboria_leak_optimism_rmse_us_ft', leak(OBSD, [1, 2, 3, 4, 5, 6, 7]))

PAYX = 'pg_temp.d2_t(array[v_ob_rhob, v_ob_nphi, v_ob_rt])'


def pay_fit(seed, l2='0.0'):
    return [
        f'v_te := pg_temp.d2_gtest(v_ob_well, {OBF}, {seed});',
        'v_itr := pg_temp.d2_rows(v_ob_well, v_te, false); v_ite := pg_temp.d2_rows(v_ob_well, v_te, true);',
        f'v_b := pg_temp.d2_logit(pg_temp.d2_sub({PAYX}, v_itr), pg_temp.d2_vsub(v_ob_pay, v_itr), {l2}, 100, 1e-10);',
        f'v_ph := pg_temp.d2_prob(v_b, pg_temp.d2_sub({PAYX}, v_ite));',
        'v_yte := pg_temp.d2_vsub(v_ob_pay, v_ite);']


route('oboria_logistic_rt_coef_per_ohmm', pay_fit(OBPS) + ['v_s := v_b[4];'])
route('oboria_pay_f1', ['v_s := pg_temp.d2_f1(v_yte, v_ph, 1.0);'])
route('oboria_test_log_loss', ['v_s := pg_temp.d2_logloss(v_yte, v_ph);'])

# ISUAMA
w("  v_ix := array(select i from generate_subscripts(v_is_dt, 1) i where v_is_dt[i] is not null order by i);")
w("  v_wl := array(select v_is_well[i] from unnest(v_ix) with ordinality u(i, o) order by o);")
w('  v_y := pg_temp.d2_vsub(v_is_dt, v_ix);')
w('  v_x := pg_temp.d2_sub(pg_temp.d2_t(array[v_is_gr, v_is_rhob, v_is_nphi, v_is_cali, v_is_easting, v_is_northing, v_is_kb, v_is_mudweight]), v_ix);')
w('  if exists (select 1 from unnest(v_wl) x where x = ' + lit(NOS) + ') or (select count(*) from unnest(v_is_dt) x where x is null) <> '
  + str(GC.IS_PER) + ' then')
w(f"    raise exception 'D2 go-live refused: the rows without a sonic are not exactly the {GC.IS_PER} rows of {NOS}{name('isuama_pred_dt_first_row_us_ft')}';")
w('  end if;')
route('isuama_scaled_condition_attrs', ['v_s := pg_temp.d2_cond(pg_temp.d2_cols(v_x, array[1, 2, 3, 5, 6, 7, 8]), true);'])
HCROWS = f'array(select i from generate_subscripts(v_is_rt, 1) i where v_is_rt[i] >= {ISRT} order by i)'
HCX = f'pg_temp.d2_t(array[pg_temp.d2_vsub(v_is_phic, {HCROWS})])'
HCY = f'pg_temp.d2_vsub(v_is_pay, {HCROWS})'
route('isuama_l2_phic_coef_per_vv', [f'v_s := (pg_temp.d2_logit({HCX}, {HCY}, {ISL2}, 100, 1e-10))[2];'])
ISPX = 'pg_temp.d2_t(array[v_is_rhob, v_is_nphi, v_is_rt])'
route('isuama_nphi_coef_after_three_updates_per_vv', [f'v_s := (pg_temp.d2_logit({ISPX}, v_is_pay, 0.0, {ISMI}, 1e-10))[3];'])


def perm_drop(split_seed, perm_seed, reps, target='v_s'):
    return [
        f'v_te := pg_temp.d2_gtest(v_wl, {ISF}, {split_seed});',
        'v_itr := pg_temp.d2_rows(v_wl, v_te, false); v_ite := pg_temp.d2_rows(v_wl, v_te, true);',
        'v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4]), v_itr), pg_temp.d2_vsub(v_y, v_itr));',
        f'{target} := pg_temp.d2_permdrop(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3, 4]), v_ite), pg_temp.d2_vsub(v_y, v_ite), 3, {reps}, {perm_seed});']


route('isuama_perm_nphi_mean_drop_us_ft', perm_drop(ISSD, ISSD, ISREP))


def lc_point(seed, count, on_train=False, target='v_s'):
    """learningCurve: one groupSplit fixes the test wells; the first `count`
    training wells of the split's shuffled order are fitted."""
    score_rows = 'v_itr' if on_train else 'v_ite'
    return [
        f'v_ord := pg_temp.d2_order(v_wl, {seed});',
        f'v_n := pg_temp.d2_ceil({ISF}, array_length(v_ord, 1));',
        'v_te := v_ord[1 : v_n];',
        f'v_itr := pg_temp.d2_rows(v_wl, v_ord[v_n + 1 : v_n + {count}], true); v_ite := pg_temp.d2_rows(v_wl, v_te, true);',
        'v_b := pg_temp.d2_ols(pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_itr), pg_temp.d2_vsub(v_y, v_itr));',
        f'{target} := pg_temp.d2_rmse(pg_temp.d2_vsub(v_y, {score_rows}), pg_temp.d2_pred(v_b, pg_temp.d2_sub(pg_temp.d2_cols(v_x, array[1, 2, 3]), {score_rows})));']


route('isuama_lc_test_rmse_three_wells_us_ft', lc_point(ISSD, ISS['counts'][ISS['countIndex']]))
NOSROWS = f"array(select i from generate_subscripts(v_is_well, 1) i where v_is_well[i] = {lit(NOS)} order by i)"
NOSX = f'pg_temp.d2_sub(pg_temp.d2_t(array[v_is_gr, v_is_rhob, v_is_nphi]), {NOSROWS})'
route('isuama_pred_dt_first_row_us_ft', [
    f'v_b := pg_temp.d2_ridge(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_y, {ISLAM});',
    f'v_s := (pg_temp.d2_pred(v_b, {NOSX}))[1];'])
w('')

# ---------------------------------------------------------- 3. the traps
w('  -- ------------------------------------------------------------ 3. the traps')
# Associate: the Akpara split again.
w(f'  v_te := pg_temp.d2_gtest(v_ak_well, {AKF}, {AKSD});')
w('  v_itr := pg_temp.d2_rows(v_ak_well, v_te, false); v_ite := pg_temp.d2_rows(v_ak_well, v_te, true);')
w('  v_x := pg_temp.d2_t(array[v_ak_gr, v_ak_rhob, v_ak_nphi]);')
w('  v_xtr := pg_temp.d2_sub(v_x, v_itr); v_xte := pg_temp.d2_sub(v_x, v_ite);')
w('  v_ytr := pg_temp.d2_vsub(v_ak_dt, v_itr); v_yte := pg_temp.d2_vsub(v_ak_dt, v_ite);')
w('  v_ntr := array_length(v_itr, 1);')
w('  v_b := pg_temp.d2_ols(v_xtr, v_ytr);')
w('  v_rss := (select sum((a - b) * (a - b)) from unnest(v_ytr, pg_temp.d2_pred(v_b, v_xtr)) as t(a, b));')
trap('akpara_rhob_train_centre_g_cm3', 'the centre fitted on every row', ['v_wrong := (select avg(x) from unnest(v_ak_rhob) x);'])
trap('akpara_rhob_train_centre_g_cm3', 'the centre fitted on the test wells', ['v_wrong := (select avg(x) from unnest(pg_temp.d2_vsub(v_ak_rhob, v_ite)) x);'])
trap('akpara_gr_train_scale_gapi', 'the sample standard deviation', ['v_wrong := (select stddev_samp(x) from unnest(pg_temp.d2_vsub(v_ak_gr, v_itr)) x);'])
trap('akpara_gr_train_scale_gapi', 'the scale fitted on every row', ['v_wrong := (select stddev_pop(x) from unnest(v_ak_gr) x);'])
trap('akpara_ols_nphi_coef_us_ft_per_vv', 'NPHI alone', ['v_wrong := (pg_temp.d2_ols(pg_temp.d2_cols(v_xtr, array[3]), v_ytr))[2];'])
trap('akpara_ols_nphi_coef_us_ft_per_vv', 'the fit without an intercept', ['v_wrong := (pg_temp.d2_ols0(v_xtr, v_ytr))[4];'])
trap('akpara_ols_nphi_coef_us_ft_per_vv', 'the rate per hundredth of v/v', ['v_wrong := v_b[4] / 100.0;'])
trap('akpara_ols_residual_se_us_ft', 'RSS over n', ['v_wrong := sqrt(v_rss / v_ntr::double precision);'])
trap('akpara_ols_residual_se_us_ft', 'RSS over n - 1', ['v_wrong := sqrt(v_rss / (v_ntr::double precision - 1.0));'])
trap('akpara_test_rmse_us_ft', 'the training RMSE', ['v_wrong := pg_temp.d2_rmse(v_ytr, pg_temp.d2_pred(v_b, v_xtr));'])
trap('akpara_test_rmse_us_ft', 'the test MAE', ['v_wrong := pg_temp.d2_mae(v_yte, pg_temp.d2_pred(v_b, v_xte));'])
trap('akpara_test_r2', 'R-squared about the training mean', [
    'v_wrong := pg_temp.d2_r2(v_yte, pg_temp.d2_pred(v_b, v_xte), (select avg(x) from unnest(v_ytr) x));'])
trap('akpara_test_r2', 'the training R-squared', ['v_wrong := pg_temp.d2_r2(v_ytr, pg_temp.d2_pred(v_b, v_xtr));'])

# Professional
w(f'  v_te := pg_temp.d2_gtest(v_ob_well, {OBF}, {OBSD});')
w('  v_itr := pg_temp.d2_rows(v_ob_well, v_te, false);')
w('  v_x := pg_temp.d2_t(array[v_ob_gr, v_ob_rhob, v_ob_nphi, v_ob_easting, v_ob_northing, v_ob_kb, v_ob_mudweight]);')
w('  v_xtr := pg_temp.d2_sub(v_x, v_itr); v_ytr := pg_temp.d2_vsub(v_ob_dt, v_itr);')
trap('oboria_ridge_gr_coef_us_ft_per_gapi', 'lambda times n', [
    f'v_wrong := (pg_temp.d2_ridge(v_xtr, v_ytr, {OBL} * array_length(v_itr, 1)::double precision))[2];'])
trap('oboria_ridge_gr_coef_us_ft_per_gapi', 'least squares in place of ridge', ['v_wrong := (pg_temp.d2_ols(v_xtr, v_ytr))[2];'])
trap('oboria_ridge_gr_coef_us_ft_per_gapi', 'the standardised coefficient', [f'v_wrong := (pg_temp.d2_ridge(v_xtr, v_ytr, {OBL}, true))[2];'])
trap('oboria_fold2_test_rmse_us_ft', 'fold 0', fold_rmse(OBSD, 0, 'v_wrong'))
trap('oboria_fold2_test_rmse_us_ft', 'the fold numbered from one', fold_rmse(OBSD, OBFOLD - 1, 'v_wrong'))
trap('oboria_fold2_test_rmse_us_ft', 'the next seed', fold_rmse(OBSD + 1, OBFOLD, 'v_wrong'))
trap('oboria_leak_optimism_rmse_us_ft', 'the sign reversed', leak(OBSD, [1, 2, 3, 4, 5, 6, 7], 'v_wrong') + ['v_wrong := -v_wrong;'])
trap('oboria_leak_optimism_rmse_us_ft', 'the logs alone', leak(OBSD, [1, 2, 3], 'v_wrong'))
trap('oboria_leak_optimism_rmse_us_ft', 'the next seed', leak(OBSD + 1, [1, 2, 3, 4, 5, 6, 7], 'v_wrong'))
trap('oboria_logistic_rt_coef_per_ohmm', 'the odds ratio quoted', pay_fit(OBPS) + ['v_wrong := exp(v_b[4]);'])
trap('oboria_logistic_rt_coef_per_ohmm', 'a penalty of l2 1', pay_fit(OBPS, '1.0') + ['v_wrong := v_b[4];'])
trap('oboria_logistic_rt_coef_per_ohmm', 'the sonic split seed used for pay', pay_fit(OBSD) + ['v_wrong := v_b[4];'])
w('')
w('  -- the pay split of the brief, for the F1 and log loss traps')
for l in pay_fit(OBPS):
    w('  ' + l)
trap('oboria_pay_f1', 'the macro F1', ['v_wrong := 0.5 * (pg_temp.d2_f1(v_yte, v_ph, 1.0) + pg_temp.d2_f1(v_yte, v_ph, 0.0));'])
trap('oboria_pay_f1', 'the F1 of label 0', ['v_wrong := pg_temp.d2_f1(v_yte, v_ph, 0.0);'])
trap('oboria_pay_f1', 'the accuracy', [
    'v_wrong := (select count(*) filter (where (q > 0.5) = (a = 1.0))::double precision / count(*)::double precision from unnest(v_yte, v_ph) as t(a, q));'])
trap('oboria_test_log_loss', 'the base ten log', ['v_wrong := pg_temp.d2_logloss(v_yte, v_ph) / ln(10.0);'])
trap('oboria_test_log_loss', 'the summed loss', ['v_wrong := pg_temp.d2_logloss(v_yte, v_ph) * array_length(v_yte, 1)::double precision;'])

# Expert
w("  v_ix := array(select i from generate_subscripts(v_is_dt, 1) i where v_is_dt[i] is not null order by i);")
w("  v_wl := array(select v_is_well[i] from unnest(v_ix) with ordinality u(i, o) order by o);")
w('  v_y := pg_temp.d2_vsub(v_is_dt, v_ix);')
w('  v_x := pg_temp.d2_sub(pg_temp.d2_t(array[v_is_gr, v_is_rhob, v_is_nphi, v_is_cali, v_is_easting, v_is_northing, v_is_kb, v_is_mudweight]), v_ix);')
trap('isuama_scaled_condition_attrs', 'the raw condition number', ['v_wrong := pg_temp.d2_cond(pg_temp.d2_cols(v_x, array[1, 2, 3, 5, 6, 7, 8]), false);'])
trap('isuama_scaled_condition_attrs', 'the logs alone', ['v_wrong := pg_temp.d2_cond(pg_temp.d2_cols(v_x, array[1, 2, 3]), true);'])
trap('isuama_l2_phic_coef_per_vv', 'the penalty not halved', [f'v_wrong := (pg_temp.d2_logit({HCX}, {HCY}, 2.0 * {ISL2}, 100, 1e-10))[2];'])
trap('isuama_l2_phic_coef_per_vv', 'the penalty times n', [
    f'v_wrong := (pg_temp.d2_logit({HCX}, {HCY}, {ISL2} * array_length({HCROWS}, 1)::double precision, 100, 1e-10))[2];'])
trap('isuama_l2_phic_coef_per_vv', 'every row in place of the high RT rows', [
    f'v_wrong := (pg_temp.d2_logit(pg_temp.d2_t(array[v_is_phic]), v_is_pay, {ISL2}, 100, 1e-10))[2];'])
trap('isuama_nphi_coef_after_three_updates_per_vv', 'the converged value', [f'v_wrong := (pg_temp.d2_logit({ISPX}, v_is_pay, 0.0, 100, 1e-10))[3];'])
trap('isuama_nphi_coef_after_three_updates_per_vv', 'two updates', [f'v_wrong := (pg_temp.d2_logit({ISPX}, v_is_pay, 0.0, {ISMI - 1}, 1e-10))[3];'])
trap('isuama_nphi_coef_after_three_updates_per_vv', 'four updates', [f'v_wrong := (pg_temp.d2_logit({ISPX}, v_is_pay, 0.0, {ISMI + 1}, 1e-10))[3];'])
trap('isuama_perm_nphi_mean_drop_us_ft', 'the next permutation seed', perm_drop(ISSD, ISSD + 1, ISREP, 'v_wrong'))
trap('isuama_perm_nphi_mean_drop_us_ft', 'one repeat', perm_drop(ISSD, ISSD, 1, 'v_wrong'))
trap('isuama_lc_test_rmse_three_wells_us_ft', 'the training score quoted', lc_point(ISSD, ISS['counts'][ISS['countIndex']], True, 'v_wrong'))
trap('isuama_lc_test_rmse_three_wells_us_ft', 'the fourth point', lc_point(ISSD, ISS['counts'][ISS['countIndex'] + 1], False, 'v_wrong'))
trap('isuama_lc_test_rmse_three_wells_us_ft', 'the next seed', lc_point(ISSD + 1, ISS['counts'][ISS['countIndex']], False, 'v_wrong'))
trap('isuama_pred_dt_first_row_us_ft', 'least squares in place of ridge', [
    'v_b := pg_temp.d2_ols(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_y);', f'v_wrong := (pg_temp.d2_pred(v_b, {NOSX}))[1];'])
trap('isuama_pred_dt_first_row_us_ft', 'lambda times n', [
    f'v_b := pg_temp.d2_ridge(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_y, {ISLAM} * array_length(v_y, 1)::double precision);',
    f'v_wrong := (pg_temp.d2_pred(v_b, {NOSX}))[1];'])
trap('isuama_pred_dt_first_row_us_ft', 'the last row of the well', [
    f'v_b := pg_temp.d2_ridge(pg_temp.d2_cols(v_x, array[1, 2, 3]), v_y, {ISLAM});',
    f'v_wrong := (pg_temp.d2_pred(v_b, {NOSX}))[{GC.IS_PER}];'])
w('')

# ------------------------------------------------------------ the flip
w('  -- ------------------------------------------------------------- the flip')
w(f"  update public.academy_apps set status = 'available' where slug = '{S}';")
w(f"  if not exists (select 1 from public.academy_apps where slug = '{S}' and status = 'available') then")
w(f"    raise exception 'D2 go-live refused: {S} did not reach status available';")
w('  end if;')
w("  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')")
w('    into v_available, v_soon from public.academy_apps;')
w(f"  raise notice 'D2 go-live: {S} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',")
w('    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;')
w('end $$;')

SQL = HEADER + HELPERS + '\n' + '\n'.join(decl) + '\n' + '\n'.join(P) + '\n'

# ------------------------------------------------------------ self checks
for k in KEYS:
    if k not in COUNT['ledger']:
        refused.append(f'{k} has no ledger check')
    if k not in COUNT['route']:
        refused.append(f'{k} has no second route')
    if COUNT['trap'].get(k, 0) < 2:
        refused.append(f'{k} has {COUNT["trap"].get(k, 0)} trap(s); two or more are required')
code = '\n'.join(l.split('--', 1)[0] if not l.lstrip().startswith('raise') else '' for l in SQL.splitlines()
                 if not l.lstrip().startswith('--'))
bare = re.findall(r'/\s*(?:\d+(?![\d.])|count\([^)]*\)(?!::double precision)|array_length\([^)]*\)(?!::double precision))', code)
if bare:
    refused.append(f'bare integer denominator(s): {bare[:5]}')
odd = [ln for ln, l in enumerate(SQL.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2]
if odd:
    refused.append(f'odd-quote code lines {odd[:5]}')
if re.search('[–—]', SQL):
    refused.append('an en or em dash in the go-live')
for ln in SQL.splitlines():
    if 'raise exception' in ln and 'v_g_' in ln and '[graded field:' not in ln:
        refused.append(f'a refusal reads a graded value and names none: {ln.strip()[:120]}')
for b in ('-- ------------------------------------------ 1. against the engine ledger',
          '-- ----------------------------------------------- 2. the second route in SQL'):
    if SQL.count(b) != 1:
        refused.append(f'the banner "{b}" is not in the go-live exactly once')

if __name__ == '__main__':
    if refused:
        for r in refused:
            print('  REFUSED:', r)
        print('NOTHING WRITTEN.')
        sys.exit(1)
    open(OUT, 'w').write(SQL)
    print(f'wrote {OUT}: {len(SQL.splitlines())} lines')
    print(f"ledger 18, second route 18, traps {sum(COUNT['trap'].values())} over 18 fields (min {min(COUNT['trap'].values())}), "
          f'prompt md5 3, stated settings {sum(len(v) for v in STATED.values())}')
