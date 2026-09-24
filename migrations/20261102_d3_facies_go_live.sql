-- ============================================================================
-- D3 GO-LIVE (HELD): Electrofacies flips to 'available', the THIRD course of
-- the Data & AI module, at path_order 68.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/facies. The 78 lessons, the teaching lab
-- (faciesLab.js), its three explorer panels and the three capstone case files
-- ship in the ZIP and NOT in this database, so a flip before the upload puts a
-- live catalogue tile in front of a route that does not exist. This file is
-- written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values d3_capstone.mjs returned through
--      the vendored engines/dataai/cluster.js when this file was generated, to
--      the last bit, so a capstone row an earlier seed left behind, or a move
--      of one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the data in the case files: scalers by
--      the SQL aggregates, the first principal component by power iteration,
--      k-means++ and Lloyd on the mulberry32 stream rebuilt in 64-bit integer
--      arithmetic, Ward from centroids and sizes, the silhouette, the adjusted
--      Rand index and the classification report from their definitions,
--      one-to-one matching by enumeration, kNN by sorting every distance, and
--      the CART tree scored exactly in numeric, each to 1e-9 relative;
--   3. by the TRAPS the course is built on, each of which must bite on these
--      inputs: the reading a learner who missed the lesson would give is
--      computed and refused if it lands within the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
--
-- THE GRADER IS NUMERIC. academy_submit_capstone casts expected, tol and the
-- answer to numeric and passes abs(answer - expected) <= tol. Every field must
-- carry a non-zero, non-whole expected value at the six-decimal floor 5e-7
-- with a label and a unit, the six-decimal answer the prompt asks for must
-- pass, and one unit either side of it in the sixth decimal must fail.
--
-- EVERY DENOMINATOR BELOW IS A FLOAT, ON PURPOSE. Postgres divides integer by
-- integer as an integer, and the generator refuses a bare integer denominator.
--
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================

-- ------------------------------------------------ the second route's helpers
-- Every helper works on a FLAT row-major matrix (element i, j of an n x p
-- matrix is x[(i - 1) * p + j]) so no two-dimensional array is ever assigned
-- in place.

-- a x b modulo 2^32 for a, b in [0, 2^32), with b split into 16-bit halves so
-- no product leaves bigint.
create or replace function pg_temp.d3_imul(a bigint, b bigint) returns bigint
language sql immutable as $f$
  select ((a * (b & 65535)) + (((a * (b >> 16)) & 65535) << 16)) & 4294967295
$f$;

-- n draws of mulberry32(seed), each in [0, 1).
create or replace function pg_temp.d3_u(p_seed bigint, p_n int) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  a bigint := p_seed & 4294967295; t bigint; u double precision[] := '{}'; i int;
begin
  for i in 1 .. p_n loop
    a := (a + 1831565813) & 4294967295;
    t := pg_temp.d3_imul(a # (a >> 15), a | 1);
    t := t # ((t + pg_temp.d3_imul(t # (t >> 7), t | 61)) & 4294967295);
    u := u || ((t # (t >> 14))::double precision / 4294967296.0);
  end loop;
  return u;
end $f$;

-- columns (each an array of n) to a flat n x p matrix, and the rows idx of a
-- flat matrix (1-based).
create or replace function pg_temp.d3_flat(cols double precision[]) returns double precision[]
language sql immutable as $f$
  select array(select cols[j][i] from generate_series(1, array_length(cols, 2)) i,
                                     generate_series(1, array_length(cols, 1)) j order by i, j)
$f$;
create or replace function pg_temp.d3_rows(x double precision[], p int, idx int[]) returns double precision[]
language sql immutable as $f$
  select array(select x[(i - 1) * p + j] from unnest(idx) with ordinality u(i, o), generate_series(1, p) j order by o, j)
$f$;

-- A scaler fitted on a flat matrix: centre then scale, 2p numbers. mode
-- 'pop' and 'samp' centre on the mean and divide by the population or the
-- sample standard deviation, both by the SQL aggregates; 'minmax' centres on
-- the minimum and divides by the range; 'none' is the identity.
create or replace function pg_temp.d3_fit(x double precision[], p int, mode text) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare cs double precision[] := '{}'; sc double precision[] := '{}'; j int; m double precision; s double precision;
begin
  for j in 1 .. p loop
    select case mode when 'minmax' then min(v) when 'none' then 0.0 else avg(v) end,
           case mode when 'pop' then stddev_pop(v) when 'samp' then stddev_samp(v) when 'minmax' then max(v) - min(v) else 1.0 end
      into m, s
      from (select x[g] as v from generate_series(j, array_length(x, 1), p) g) t;
    cs := cs || m; sc := sc || s;
  end loop;
  return cs || sc;
end $f$;
create or replace function pg_temp.d3_apply(x double precision[], p int, cs double precision[]) returns double precision[]
language sql immutable as $f$
  select array(select (x[g] - cs[((g - 1) % p) + 1]) / cs[p + ((g - 1) % p) + 1] from generate_series(1, array_length(x, 1)) g order by g)
$f$;

-- The first principal component by POWER ITERATION on the correlation
-- (samp) or covariance (cov) matrix, formed as Z'Z / (n - 1). Returns
-- [lambda1, trace, v1 .. vp] with the largest absolute weight made positive.
create or replace function pg_temp.d3_pc1(x double precision[], p int, mode text) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(x, 1) / p; z double precision[]; c double precision[] := '{}';
  v double precision[]; w double precision[]; a int; b int; i int; it int; s double precision; nrm double precision;
  lam double precision; big int; tr double precision := 0.0; delta double precision;
begin
  if mode = 'samp' then z := pg_temp.d3_apply(x, p, pg_temp.d3_fit(x, p, 'samp'));
  else z := pg_temp.d3_apply(x, p, (select array_agg(v order by o) from unnest(pg_temp.d3_fit(x, p, 'pop')) with ordinality u(v, o) where o <= p) || array_fill(1.0::double precision, array[p]));
  end if;
  for a in 1 .. p loop for b in 1 .. p loop
    s := 0.0;
    for i in 0 .. n - 1 loop s := s + z[i * p + a] * z[i * p + b]; end loop;
    c := c || (s / (n - 1)::double precision);
  end loop; end loop;
  for a in 1 .. p loop tr := tr + c[(a - 1) * p + a]; end loop;
  v := array_fill(1.0::double precision, array[p]);
  for it in 1 .. 200000 loop
    w := array_fill(0.0::double precision, array[p]);
    for a in 1 .. p loop for b in 1 .. p loop w[a] := w[a] + c[(a - 1) * p + b] * v[b]; end loop; end loop;
    nrm := sqrt((select sum(t * t) from unnest(w) t));
    delta := 0.0;
    for a in 1 .. p loop w[a] := w[a] / nrm; delta := greatest(delta, abs(w[a] - v[a])); end loop;
    v := w;
    exit when delta < 1e-15;
  end loop;
  big := 1;
  for a in 2 .. p loop if abs(v[a]) > abs(v[big]) * (1.0 + 1e-9) then big := a; end if; end loop;
  if v[big] < 0 then for a in 1 .. p loop v[a] := -v[a]; end loop; end if;
  lam := 0.0;
  for a in 1 .. p loop for b in 1 .. p loop lam := lam + v[a] * c[(a - 1) * p + b] * v[b]; end loop; end loop;
  return array[lam, tr] || v;
end $f$;

-- k-means on an already scaled flat matrix: k-means++ (one candidate per
-- step, one mulberry32 stream shared by the starts in turn) and Lloyd passes
-- to the first pass that returns the labels before it; the lowest inertia
-- over the starts wins and a later start within 1e-12 (relative) of it does
-- not replace it. An empty cluster takes the row farthest from its centre
-- among clusters with two rows or more. Returns [inertia, converged (1/0),
-- label of row 1 .. label of row n] with labels from 0.
create or replace function pg_temp.d3_kmeans(z double precision[], p int, k int, p_seed bigint, ninit int, maxiter int) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(z, 1) / p; u double precision[] := pg_temp.d3_u(p_seed, ninit * k);
  uo int := 0; r int; c int; i int; j int; it int; s double precision; d double precision;
  picks int[]; d2 double precision[]; tot double precision; target double precision; cum double precision; pk int; lastpos int;
  cen double precision[]; lab int[]; prev int[]; dd double precision[]; ds double precision[]; m double precision; thr double precision; bst int;
  inertia double precision; changed int; conv boolean; cnt int[]; sm double precision[];
  best_in double precision; best_lab int[]; best_conv boolean; ord int[]; e int; q int; old int;
begin
  for r in 1 .. ninit loop
    -- k-means++
    uo := uo + 1; picks := array[floor(u[uo] * n)::int];
    d2 := '{}';
    for i in 0 .. n - 1 loop
      s := 0.0; for j in 1 .. p loop d := z[i * p + j] - z[picks[1] * p + j]; s := s + d * d; end loop; d2 := d2 || s;
    end loop;
    for c in 2 .. k loop
      tot := 0.0; for i in 1 .. n loop tot := tot + d2[i]; end loop;
      uo := uo + 1; target := u[uo] * tot;
      cum := 0.0; pk := -1; lastpos := -1;
      for i in 1 .. n loop
        if d2[i] > 0 then lastpos := i - 1; end if;
        cum := cum + d2[i];
        if cum > target then pk := i - 1; exit; end if;
      end loop;
      if pk < 0 then pk := lastpos; end if;
      picks := picks || pk;
      for i in 0 .. n - 1 loop
        s := 0.0; for j in 1 .. p loop d := z[i * p + j] - z[pk * p + j]; s := s + d * d; end loop;
        if s < d2[i + 1] then d2[i + 1] := s; end if;
      end loop;
    end loop;
    cen := '{}';
    for c in 1 .. k loop for j in 1 .. p loop cen := cen || z[picks[c] * p + j]; end loop; end loop;
    -- Lloyd
    prev := null; conv := false; it := 0;
    while it < maxiter loop
      it := it + 1;
      lab := '{}'; dd := '{}'; inertia := 0.0;
      for i in 0 .. n - 1 loop
        ds := '{}'; m := 'infinity';
        for c in 0 .. k - 1 loop
          s := 0.0; for j in 1 .. p loop d := z[i * p + j] - cen[c * p + j]; s := s + d * d; end loop;
          ds := ds || s; if s < m then m := s; end if;
        end loop;
        thr := m + m * 1e-12; bst := 1;
        while ds[bst] > thr loop bst := bst + 1; end loop;
        lab := lab || (bst - 1); dd := dd || ds[bst]; inertia := inertia + ds[bst];
      end loop;
      if prev is not null then
        changed := 0; for i in 1 .. n loop if lab[i] <> prev[i] then changed := changed + 1; end if; end loop;
        if changed = 0 then conv := true; exit; end if;
      end if;
      cnt := array_fill(0, array[k]); sm := array_fill(0.0::double precision, array[k * p]);
      for i in 0 .. n - 1 loop
        cnt[lab[i + 1] + 1] := cnt[lab[i + 1] + 1] + 1;
        for j in 1 .. p loop sm[lab[i + 1] * p + j] := sm[lab[i + 1] * p + j] + z[i * p + j]; end loop;
      end loop;
      if exists (select 1 from unnest(cnt) x where x = 0) then
        ord := array(select g from generate_series(1, n) g order by dd[g] desc, g);
        q := 1;
        for e in 1 .. k loop
          if cnt[e] = 0 then
            while q <= n and cnt[lab[ord[q]] + 1] < 2 loop q := q + 1; end loop;
            exit when q > n;
            old := lab[ord[q]] + 1; cnt[old] := cnt[old] - 1;
            for j in 1 .. p loop
              sm[(old - 1) * p + j] := sm[(old - 1) * p + j] - z[(ord[q] - 1) * p + j];
              sm[(e - 1) * p + j] := z[(ord[q] - 1) * p + j];
            end loop;
            cnt[e] := 1; q := q + 1;
          end if;
        end loop;
      end if;
      for c in 1 .. k loop
        if cnt[c] > 0 then for j in 1 .. p loop cen[(c - 1) * p + j] := sm[(c - 1) * p + j] / cnt[c]::double precision; end loop; end if;
      end loop;
      prev := lab;
    end loop;
    if not conv then
      lab := '{}'; inertia := 0.0;
      for i in 0 .. n - 1 loop
        ds := '{}'; m := 'infinity';
        for c in 0 .. k - 1 loop
          s := 0.0; for j in 1 .. p loop d := z[i * p + j] - cen[c * p + j]; s := s + d * d; end loop;
          ds := ds || s; if s < m then m := s; end if;
        end loop;
        thr := m + m * 1e-12; bst := 1;
        while ds[bst] > thr loop bst := bst + 1; end loop;
        lab := lab || (bst - 1); inertia := inertia + ds[bst];
      end loop;
    end if;
    if best_in is null or inertia < best_in - best_in * 1e-12 then
      best_in := inertia; best_lab := lab; best_conv := conv;
    end if;
  end loop;
  return array[best_in, case when best_conv then 1.0 else 0.0 end] || array(select l::double precision from unnest(best_lab) with ordinality t(l, o) order by o);
end $f$;

-- The labels of a result array (from d3_kmeans or d3_hclust) as int[].
create or replace function pg_temp.d3_lab(res double precision[], skip int) returns int[]
language sql immutable as $f$
  select array(select res[g]::int from generate_series(skip + 1, array_length(res, 1)) g order by g)
$f$;

-- Agglomerative clustering on a scaled flat matrix, merging the pair with the
-- smallest height until n - k merges are made, then making one more. WARD is
-- computed from CLUSTER CENTROIDS AND SIZES: the height of A with B is
-- sqrt(2 |A||B| / (|A| + |B|)) ||c_A - c_B||, the square root of twice the
-- rise in the within-cluster sum of squares; COMPLETE keeps the largest
-- Euclidean distance between members. A pair within 1e-12 (relative) of the
-- smallest height, other than the one taken, is refused as a tie. Returns
-- [height of merge n - k (the last kept), height of merge n - k + 1 (the
-- first undone), labels after n - k merges numbered by first row].
create or replace function pg_temp.d3_hclust(z double precision[], p int, mode text, k int) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(z, 1) / p; cen double precision[] := z; sz int[] := array_fill(1, array[n]);
  act boolean[] := array_fill(true, array[n]); grp int[]; h double precision[] := array_fill(0.0::double precision, array[n * n]);
  a int; b int; t int; j int; st int; m double precision; ba int; bb int; s double precision; d double precision;
  below double precision; above double precision; lab int[]; nxt int; first_of int[]; ties int;
begin
  grp := array(select g from generate_series(1, n) g);
  for a in 1 .. n loop for b in a + 1 .. n loop
    s := 0.0; for j in 1 .. p loop d := z[(a - 1) * p + j] - z[(b - 1) * p + j]; s := s + d * d; end loop;
    h[(a - 1) * n + b] := sqrt(s); h[(b - 1) * n + a] := sqrt(s);
  end loop; end loop;
  for st in 1 .. n - k + 1 loop
    m := 'infinity'; ba := 0; bb := 0;
    for a in 1 .. n loop
      continue when not act[a];
      for b in a + 1 .. n loop
        continue when not act[b];
        if h[(a - 1) * n + b] < m then m := h[(a - 1) * n + b]; ba := a; bb := b; end if;
      end loop;
    end loop;
    ties := 0;
    for a in 1 .. n loop
      continue when not act[a];
      for b in a + 1 .. n loop
        continue when not act[b];
        if h[(a - 1) * n + b] <= m + m * 1e-12 then ties := ties + 1; end if;
      end loop;
    end loop;
    if ties > 1 then raise exception 'd3_hclust: a tied merge at step %, which this route does not order', st; end if;
    if st = n - k then below := m; end if;
    if st = n - k + 1 then above := m; exit; end if;
    -- merge bb into ba
    for j in 1 .. p loop
      cen[(ba - 1) * p + j] := (sz[ba] * cen[(ba - 1) * p + j] + sz[bb] * cen[(bb - 1) * p + j]) / (sz[ba] + sz[bb])::double precision;
    end loop;
    sz[ba] := sz[ba] + sz[bb]; act[bb] := false;
    for t in 1 .. n loop if grp[t] = bb then grp[t] := ba; end if; end loop;
    for t in 1 .. n loop
      continue when not act[t] or t = ba;
      if mode = 'complete' then
        d := greatest(h[(ba - 1) * n + t], h[(bb - 1) * n + t]);
      else
        s := 0.0; for j in 1 .. p loop s := s + (cen[(ba - 1) * p + j] - cen[(t - 1) * p + j]) ^ 2; end loop;
        d := sqrt(2.0 * sz[ba] * sz[t] / (sz[ba] + sz[t])::double precision * s);
      end if;
      h[(ba - 1) * n + t] := d; h[(t - 1) * n + ba] := d;
    end loop;
    if st = n - k then
      first_of := array_fill(-1, array[n]); nxt := 0; lab := '{}';
      for t in 1 .. n loop
        if first_of[grp[t]] < 0 then first_of[grp[t]] := nxt; nxt := nxt + 1; end if;
        lab := lab || first_of[grp[t]];
      end loop;
    end if;
  end loop;
  if k = n then lab := array(select g - 1 from generate_series(1, n) g); end if;
  return array[below, above] || array(select l::double precision from unnest(lab) with ordinality t(l, o) order by o);
end $f$;

-- The mean silhouette of labels on a scaled flat matrix: for each row, a is
-- its mean distance to the other rows of its cluster and b the smallest mean
-- distance to another cluster; a row alone in its cluster scores 0.
create or replace function pg_temp.d3_sil(z double precision[], p int, lab int[]) returns double precision
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(lab, 1); k int := (select max(l) from unnest(lab) l) + 1;
  sums double precision[] := array_fill(0.0::double precision, array[n * k]); sz int[] := array_fill(0, array[k]);
  i int; j int; t int; s double precision; d double precision; a double precision; b double precision; tot double precision := 0.0;
begin
  for i in 1 .. n loop sz[lab[i] + 1] := sz[lab[i] + 1] + 1; end loop;
  for i in 1 .. n loop
    for j in i + 1 .. n loop
      s := 0.0; for t in 1 .. p loop d := z[(i - 1) * p + t] - z[(j - 1) * p + t]; s := s + d * d; end loop;
      d := sqrt(s);
      sums[(i - 1) * k + lab[j] + 1] := sums[(i - 1) * k + lab[j] + 1] + d;
      sums[(j - 1) * k + lab[i] + 1] := sums[(j - 1) * k + lab[i] + 1] + d;
    end loop;
  end loop;
  for i in 1 .. n loop
    if sz[lab[i] + 1] = 1 then continue; end if;
    a := sums[(i - 1) * k + lab[i] + 1] / (sz[lab[i] + 1] - 1)::double precision;
    b := 'infinity';
    for t in 1 .. k loop
      if t <> lab[i] + 1 and sz[t] > 0 then b := least(b, sums[(i - 1) * k + t] / sz[t]::double precision); end if;
    end loop;
    if greatest(a, b) > 0 then tot := tot + (b - a) / greatest(a, b); end if;
  end loop;
  return tot / n::double precision;
end $f$;

-- The adjusted Rand index of two labellings, and the unadjusted Rand index.
create or replace function pg_temp.d3_ari(a text[], b text[], adjusted boolean) returns double precision
language sql immutable as $f$
  with t as (select a[i] as x, b[i] as y from generate_series(1, array_length(a, 1)) i),
  n as (select count(*)::double precision as n from t),
  sij as (select sum(c * (c - 1) / 2.0) as v from (select count(*)::double precision as c from t group by x, y) q),
  sa as (select sum(c * (c - 1) / 2.0) as v from (select count(*)::double precision as c from t group by x) q),
  sb as (select sum(c * (c - 1) / 2.0) as v from (select count(*)::double precision as c from t group by y) q)
  select case when adjusted then
           (sij.v - sa.v * sb.v / (n.n * (n.n - 1.0) / 2.0)) / ((sa.v + sb.v) / 2.0 - sa.v * sb.v / (n.n * (n.n - 1.0) / 2.0))
         else (n.n * (n.n - 1.0) / 2.0 + 2.0 * sij.v - sa.v - sb.v) / (n.n * (n.n - 1.0) / 2.0) end
    from n, sij, sa, sb
$f$;

-- Accuracy, macro F1 (the mean over the classes of 2 P R / (P + R)) and the
-- support-weighted F1 of predictions against the truth, over the classes of
-- the truth and the predictions; a zero denominator scores 0.
create or replace function pg_temp.d3_report(yt text[], yp text[]) returns double precision[]
language sql immutable as $f$
  with t as (select yt[i] as a, yp[i] as q from generate_series(1, array_length(yt, 1)) i),
  cls as (select a as c from t union select q from t),
  pc as (select c,
                count(*) filter (where t.a = c and t.q = c)::double precision as tp,
                count(*) filter (where t.q = c)::double precision as np,
                count(*) filter (where t.a = c)::double precision as nt
           from cls cross join t group by c),
  f as (select c, nt,
               case when np = 0 then 0.0 else tp / np end as pr,
               case when nt = 0 then 0.0 else tp / nt end as rc from pc)
  select array[(select count(*) filter (where a = q)::double precision / count(*)::double precision from t),
               (select avg(case when pr + rc = 0 then 0.0 else 2.0 * pr * rc / (pr + rc) end) from f),
               (select sum(nt * case when pr + rc = 0 then 0.0 else 2.0 * pr * rc / (pr + rc) end) / sum(nt) from f)]
$f$;

-- Clusters mapped to facies. ONE-TO-ONE: every injective map of the (at most
-- four) clusters onto the facies is enumerated and the one matching the most
-- rows taken; a second map with the same total is refused as a tie. MAJORITY:
-- each cluster takes its most common facies, a tie to the facies that sorts
-- first. Returns the mapped prediction of every row.
create or replace function pg_temp.d3_map(yt text[], lab int[], mode text) returns text[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  cl int[] := array(select distinct l from unnest(lab) l order by l);
  fc text[] := array(select distinct x collate "C" from unnest(yt) x order by 1);
  mp text[] := '{}'; c int; best bigint := -1; nbest int := 0; tot bigint; perm text[];
begin
  if mode = 'majority' then
    foreach c in array cl loop
      mp := mp || (select y from (select yt[i] as y, count(*) as n from generate_series(1, array_length(lab, 1)) i
                                    where lab[i] = c group by yt[i]) q order by n desc, y collate "C" limit 1);
    end loop;
  else
    if array_length(cl, 1) <> 4 or array_length(fc, 1) <> 4 then
      raise exception 'd3_map: one-to-one over % clusters and % facies is outside this route', array_length(cl, 1), array_length(fc, 1);
    end if;
    for perm in
      select array[f1, f2, f3, f4] from unnest(fc) f1, unnest(fc) f2, unnest(fc) f3, unnest(fc) f4
       where f1 not in (f2, f3, f4) and f2 not in (f3, f4) and f3 <> f4
    loop
      tot := (select count(*) from generate_series(1, array_length(lab, 1)) i
                where yt[i] = perm[array_position(cl, lab[i])]);
      if tot > best then best := tot; mp := perm; nbest := 1; elsif tot = best then nbest := nbest + 1; end if;
    end loop;
    if nbest <> 1 then raise exception 'd3_map: % one-to-one maps share the best total', nbest; end if;
  end if;
  return array(select mp[array_position(cl, lab[i])] from generate_series(1, array_length(lab, 1)) i order by i);
end $f$;

-- kNN on scaled flat matrices: for each new row the k training rows with the
-- smallest squared distance, ordered by distance then row; a pair of
-- distances within 1e-12 (relative) of each other across the k-th place is
-- refused as a tie. The vote is the majority label; a tied vote goes to the
-- tied label whose nearest member comes first. Returns the predictions, and
-- the distance of each new row to its nearest training row in dist.
create or replace function pg_temp.d3_knn(a double precision[], ya text[], b double precision[], p int, k int, out pred text[], out dist double precision[])
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  na int := array_length(a, 1) / p; nb int := array_length(b, 1) / p; r int; nbr record; lbl text; win text;
  best int; cnt int; ds double precision[];
begin
  pred := '{}'; dist := '{}';
  for r in 1 .. nb loop
    ds := array(select sum((b[(r - 1) * p + j] - a[(i - 1) * p + j]) ^ 2)
                  from generate_series(1, na) i, generate_series(1, p) j group by i order by i);
    if exists (select 1 from (select v, row_number() over (order by v, i) as rk
                                from unnest(ds) with ordinality u(v, i)) q
                where q.rk > k and q.v <= (select max(v) from (select v from unnest(ds) v order by v limit k) w) * (1.0 + 1e-12)) then
      raise exception 'd3_knn: a tie across the k-th neighbour of new row %', r;
    end if;
    win := null; best := 0;
    for nbr in select ya[i] as y, min(o) as firstpos, count(*) as c
                 from (select i, row_number() over (order by v, i) as o from unnest(ds) with ordinality u(v, i)) q
                where o <= k group by ya[i] order by min(o) loop
      if nbr.c > best then best := nbr.c; win := nbr.y; end if;
    end loop;
    pred := pred || win;
    dist := dist || sqrt((select min(v) from unnest(ds) v));
  end loop;
end $f$;

-- A CART classification tree on the Gini criterion, grown depth first, left
-- before right. Every candidate split (the midpoint a/2 + b/2 of consecutive
-- distinct values of a node, a when that rounds to b) is scored EXACTLY in
-- numeric as the weighted child impurity sum over classes of c_L^2 / n_L +
-- c_R^2 / n_R; the largest wins, a tie to the lower feature and then the lower
-- threshold, and a node splits only on a decrease above zero. Returns the
-- nodes as a jsonb array numbered depth first.
create or replace function pg_temp.d3_cart(x double precision[], p int, y text[], rws int[], depth int, maxdepth int, cls text[]) returns jsonb
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  m int := array_length(rws, 1); cnt int[]; g double precision; pred text; pure boolean;
  f int; bestf int := 0; bestt double precision; bsl numeric; bsr numeric; bnl numeric; bnr numeric; psq numeric;
  cand record; lft int[]; rgt int[]; ln jsonb; rn jsonb; node jsonb;
  i int; gl double precision; gr double precision;
begin
  cnt := array(select (select count(*) from unnest(rws) r where y[r] = c)::int from unnest(cls) with ordinality u(c, o) order by o);
  g := 1.0 - (select sum((c::double precision / m::double precision) ^ 2) from unnest(cnt) c);
  pred := (select c from unnest(cls) with ordinality u(c, o) order by cnt[o] desc, o limit 1);
  pure := (select count(*) from unnest(cnt) c where c > 0) = 1;
  node := jsonb_build_object('n', m, 'gini', g, 'prediction', pred, 'leaf', true, 'depth', depth);
  if pure or depth >= maxdepth or m < 2 then return jsonb_build_array(node); end if;
  psq := (select sum(c::numeric * c::numeric) from unnest(cnt) c);
  for f in 1 .. p loop
    for cand in
      with v as (select r, x[(r - 1) * p + f] as val from unnest(rws) r),
      d as (select distinct val from v),
      pairs as (select val as lo, lead(val) over (order by val) as hi from d)
      select lo, hi,
             case when lo / 2.0 + hi / 2.0 = hi then lo else lo / 2.0 + hi / 2.0 end as t,
             (select count(*) from v where v.val <= lo) as nl,
             (select sum(q * q) from (select count(*)::numeric as q from v where v.val <= lo group by y[v.r]) s) as sl,
             (select sum(q * q) from (select count(*)::numeric as q from v where v.val > lo group by y[v.r]) s) as sr
        from pairs where hi is not null order by lo
    loop
      -- sl / nl + sr / nr against the best so far, cross-multiplied on the
      -- integer counts so the comparison is exact
      if bestf = 0 or (cand.sl * (m - cand.nl) + cand.sr * cand.nl) * bnl * bnr
                      > (bsl * bnr + bsr * bnl) * cand.nl * (m - cand.nl) then
        bsl := cand.sl; bsr := cand.sr; bnl := cand.nl; bnr := m - cand.nl; bestf := f; bestt := cand.t;
      end if;
    end loop;
  end loop;
  if bestf = 0 or not ((bsl * bnr + bsr * bnl) * m::numeric > psq * bnl * bnr) then return jsonb_build_array(node); end if;
  lft := array(select r from unnest(rws) r where x[(r - 1) * p + bestf] <= bestt order by r);
  rgt := array(select r from unnest(rws) r where x[(r - 1) * p + bestf] > bestt order by r);
  ln := pg_temp.d3_cart(x, p, y, lft, depth + 1, maxdepth, cls);
  rn := pg_temp.d3_cart(x, p, y, rgt, depth + 1, maxdepth, cls);
  gl := (ln->0->>'gini')::double precision; gr := (rn->0->>'gini')::double precision;
  node := node || jsonb_build_object('leaf', false, 'f', bestf, 't', bestt, 'left', 1, 'right', 1 + jsonb_array_length(ln),
                                     'rise', m * g - array_length(lft, 1) * gl - array_length(rgt, 1) * gr);
  -- shift the child ids of the two subtrees to their places in the whole
  return jsonb_build_array(node)
         || (select coalesce(jsonb_agg(case when (e->>'leaf')::boolean then e
                                            else e || jsonb_build_object('left', (e->>'left')::int + 1, 'right', (e->>'right')::int + 1) end
                                       order by o), '[]'::jsonb) from jsonb_array_elements(ln) with ordinality u(e, o))
         || (select coalesce(jsonb_agg(case when (e->>'leaf')::boolean then e
                                            else e || jsonb_build_object('left', (e->>'left')::int + 1 + jsonb_array_length(ln),
                                                                         'right', (e->>'right')::int + 1 + jsonb_array_length(ln)) end
                                       order by o), '[]'::jsonb) from jsonb_array_elements(rn) with ordinality u(e, o));
end $f$;

-- A tree's predictions for the rows of a flat matrix, and a feature's share
-- of the summed impurity rises (its importance).
create or replace function pg_temp.d3_cart_pred(tree jsonb, x double precision[], p int) returns text[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare out_ text[] := '{}'; r int; nd int; e jsonb;
begin
  for r in 1 .. array_length(x, 1) / p loop
    nd := 0; e := tree->nd;
    while not (e->>'leaf')::boolean loop
      if x[(r - 1) * p + (e->>'f')::int] <= (e->>'t')::double precision then nd := (e->>'left')::int; else nd := (e->>'right')::int; end if;
      e := tree->nd;
    end loop;
    out_ := out_ || (e->>'prediction');
  end loop;
  return out_;
end $f$;
create or replace function pg_temp.d3_imp(tree jsonb, f int) returns double precision
language sql immutable as $f$
  select coalesce(sum((e->>'rise')::double precision) filter (where (e->>'f')::int = f), 0.0)
         / nullif(sum((e->>'rise')::double precision) filter (where not (e->>'leaf')::boolean), 0.0)
    from jsonb_array_elements(tree) e
$f$;

do $$
#variable_conflict use_column
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int; i int; j int;
  v_names text; v_prompt text; v_s double precision; v_wrong double precision;
  v_x double precision[]; v_x5 double precision[]; v_z double precision[]; v_r double precision[];
  v_km double precision[]; v_k3 double precision[]; v_h double precision[]; v_hc double precision[];
  v_lab int[]; v_labc int[]; v_pred text[]; v_dist double precision[]; v_tree jsonb; v_cls text[];
  v_tr int[]; v_te int[]; v_cored int[]; v_un int[]; v_ytr text[]; v_yte text[]; v_cs double precision[];
  v_g_ihiala_gr_scale_gapi double precision;
  v_g_ihiala_pc1_ratio double precision;
  v_g_ihiala_pc1_nphi_loading double precision;
  v_g_ihiala_pc1_score_first_row double precision;
  v_g_ihiala_kmeans_inertia double precision;
  v_g_ihiala_row24_cluster_gr_centre_gapi double precision;
  v_g_nkwelle_elbow_drop_fraction_k4 double precision;
  v_g_nkwelle_ward_silhouette double precision;
  v_g_nkwelle_ward_height_above_cut double precision;
  v_g_nkwelle_complete_ari double precision;
  v_g_nkwelle_one_to_one_macro_f1 double precision;
  v_g_nkwelle_majority_accuracy_k6 double precision;
  v_g_ogbunike_knn_heldout_accuracy double precision;
  v_g_ogbunike_knn_nearest_distance double precision;
  v_g_ogbunike_cart_node2_gini double precision;
  v_g_ogbunike_cart_nphi_importance double precision;
  v_g_ogbunike_cart_depth3_heldout_accuracy double precision;
  v_g_ogbunike_uncored_gr_minmax_max double precision;
  v_ih_well text[] := array['IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-1', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-2', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-3', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-4', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-5', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6', 'IHIALA-6']::text[];
  v_ih_fac text[] := array['shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'sandstone', 'sandstone', 'sandstone', 'shale', 'shale', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'limestone', 'limestone', 'limestone', 'limestone', 'shale', 'shale', 'shale', 'shale', 'limestone', 'limestone', 'limestone', 'limestone', 'sandstone', 'limestone', 'shale', 'shale', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'limestone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'shale', 'shale', 'shale', 'shale', 'shale', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'shale', 'shale', 'shale', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'limestone', 'limestone', 'limestone', 'shaly-sand', 'shaly-sand', 'shale', 'shale', 'shale', 'shale']::text[];
  v_ih_depth double precision[] := array[5435.0, 5436.0, 5437.0, 5438.0, 5439.0, 5440.0, 5441.0, 5442.0, 5443.0, 5444.0, 5445.0, 5446.0, 5447.0, 5448.0, 5449.0, 5450.0, 5451.0, 5452.0, 5453.0, 5454.0, 5455.0, 5456.0, 5457.0, 5458.0, 5459.0, 5485.0, 5486.0, 5487.0, 5488.0, 5489.0, 5490.0, 5491.0, 5492.0, 5493.0, 5494.0, 5495.0, 5496.0, 5497.0, 5498.0, 5499.0, 5500.0, 5501.0, 5502.0, 5503.0, 5504.0, 5505.0, 5506.0, 5507.0, 5508.0, 5509.0, 5518.0, 5519.0, 5520.0, 5521.0, 5522.0, 5523.0, 5524.0, 5525.0, 5526.0, 5527.0, 5528.0, 5529.0, 5530.0, 5531.0, 5532.0, 5533.0, 5534.0, 5535.0, 5536.0, 5537.0, 5538.0, 5539.0, 5540.0, 5541.0, 5542.0, 5589.0, 5590.0, 5591.0, 5592.0, 5593.0, 5594.0, 5595.0, 5596.0, 5597.0, 5598.0, 5599.0, 5600.0, 5601.0, 5602.0, 5603.0, 5604.0, 5605.0, 5606.0, 5607.0, 5608.0, 5609.0, 5610.0, 5611.0, 5612.0, 5613.0, 5640.0, 5641.0, 5642.0, 5643.0, 5644.0, 5645.0, 5646.0, 5647.0, 5648.0, 5649.0, 5650.0, 5651.0, 5652.0, 5653.0, 5654.0, 5655.0, 5656.0, 5657.0, 5658.0, 5659.0, 5660.0, 5661.0, 5662.0, 5663.0, 5664.0, 5689.0, 5690.0, 5691.0, 5692.0, 5693.0, 5694.0, 5695.0, 5696.0, 5697.0, 5698.0, 5699.0, 5700.0, 5701.0, 5702.0, 5703.0, 5704.0, 5705.0, 5706.0, 5707.0, 5708.0, 5709.0, 5710.0, 5711.0, 5712.0, 5713.0]::double precision[];
  v_ih_gr double precision[] := array[113.4, 96.9, 131.1, 100.1, 105.7, 121.5, 29.4, 57.5, 49.8, 114.7, 125.6, 35.4, 46.8, 35.2, 41.5, 45.7, 49.9, 42.8, 52.2, 27.6, 54.0, 27.1, 48.9, 52.9, 43.4, 32.3, 28.5, 51.0, 24.9, 109.4, 139.4, 113.9, 114.5, 23.7, 17.7, 26.5, 35.9, 42.9, 21.6, 110.2, 114.8, 59.7, 83.2, 57.3, 66.5, 89.9, 60.8, 44.9, 47.3, 45.5, 58.1, 53.0, 54.2, 46.6, 29.0, 35.0, 41.0, 41.8, 41.7, 45.9, 45.4, 33.3, 50.8, 38.6, 40.2, 23.3, 31.8, 52.6, 49.6, 50.3, 30.5, 41.1, 39.0, 51.1, 43.1, 120.2, 119.1, 132.5, 109.0, 106.5, 37.5, 50.5, 48.3, 44.3, 31.0, 43.3, 35.4, 42.1, 32.9, 41.4, 43.7, 41.9, 34.1, 42.0, 49.3, 31.9, 31.0, 54.3, 27.1, 48.2, 28.2, 22.6, 25.2, 21.6, 19.3, 35.1, 22.5, 25.8, 28.0, 37.1, 24.8, 38.3, 37.7, 47.0, 55.8, 62.2, 38.8, 20.2, 37.8, 37.4, 23.0, 28.3, 24.6, 20.5, 27.1, 30.4, 47.6, 36.0, 48.9, 32.1, 44.6, 47.1, 33.2, 114.6, 118.3, 97.0, 72.5, 79.8, 36.5, 57.3, 35.2, 30.2, 22.4, 33.3, 46.2, 75.1, 109.0, 107.2, 121.6, 126.9]::double precision[];
  v_ih_rhob double precision[] := array[2.513, 2.568, 2.593, 2.534, 2.587, 2.553, 2.278, 2.352, 2.284, 2.517, 2.441, 2.261, 2.336, 2.312, 2.294, 2.334, 2.329, 2.291, 2.349, 2.284, 2.293, 2.339, 2.315, 2.348, 2.332, 2.701, 2.661, 2.65, 2.684, 2.522, 2.5, 2.532, 2.496, 2.607, 2.675, 2.644, 2.679, 2.302, 2.667, 2.514, 2.462, 2.475, 2.423, 2.431, 2.33, 2.421, 2.368, 2.358, 2.331, 2.282, 2.297, 2.321, 2.316, 2.3, 2.246, 2.249, 2.279, 2.386, 2.294, 2.375, 2.268, 2.265, 2.283, 2.355, 2.299, 2.284, 2.672, 2.292, 2.312, 2.268, 2.263, 2.31, 2.321, 2.335, 2.335, 2.591, 2.527, 2.523, 2.505, 2.587, 2.238, 2.246, 2.273, 2.297, 2.338, 2.4, 2.238, 2.348, 2.325, 2.287, 2.34, 2.37, 2.362, 2.307, 2.319, 2.314, 2.364, 2.328, 2.349, 2.323, 2.68, 2.652, 2.646, 2.678, 2.685, 2.673, 2.664, 2.688, 2.68, 2.287, 2.34, 2.275, 2.292, 2.257, 2.364, 2.2, 2.243, 2.237, 2.259, 2.7, 2.694, 2.651, 2.641, 2.655, 2.632, 2.738, 2.321, 2.341, 2.351, 2.301, 2.312, 2.293, 2.295, 2.529, 2.547, 2.51, 2.34, 2.334, 2.42, 2.371, 2.338, 2.662, 2.658, 2.65, 2.369, 2.34, 2.475, 2.516, 2.539, 2.545]::double precision[];
  v_ih_nphi double precision[] := array[0.303, 0.353, 0.283, 0.329, 0.326, 0.333, 0.185, 0.175, 0.189, 0.273, 0.335, 0.275, 0.215, 0.194, 0.189, 0.231, 0.227, 0.242, 0.191, 0.24, 0.153, 0.25, 0.173, 0.208, 0.212, 0.038, 0.081, 0.074, 0.044, 0.303, 0.34, 0.325, 0.303, 0.042, 0.08, 0.051, 0.077, 0.182, 0.107, 0.391, 0.289, 0.241, 0.242, 0.26, 0.237, 0.193, 0.197, 0.233, 0.209, 0.231, 0.203, 0.204, 0.205, 0.196, 0.218, 0.24, 0.239, 0.232, 0.203, 0.21, 0.205, 0.258, 0.179, 0.28, 0.264, 0.209, 0.053, 0.151, 0.191, 0.186, 0.22, 0.258, 0.169, 0.186, 0.218, 0.295, 0.285, 0.3, 0.327, 0.354, 0.173, 0.186, 0.179, 0.159, 0.195, 0.206, 0.178, 0.213, 0.148, 0.29, 0.24, 0.201, 0.236, 0.17, 0.201, 0.202, 0.196, 0.278, 0.194, 0.204, 0.043, 0.061, 0.093, 0.049, 0.09, 0.028, 0.095, 0.071, 0.097, 0.193, 0.208, 0.224, 0.193, 0.212, 0.153, 0.207, 0.197, 0.17, 0.182, 0.083, 0.051, 0.094, 0.071, 0.101, 0.088, 0.055, 0.213, 0.234, 0.244, 0.219, 0.164, 0.188, 0.211, 0.305, 0.323, 0.31, 0.181, 0.214, 0.32, 0.22, 0.272, 0.093, 0.054, 0.097, 0.221, 0.213, 0.277, 0.332, 0.311, 0.31]::double precision[];
  v_ih_pef double precision[] := array[2.97, 3.02, 3.36, 3.43, 3.49, 3.85, 1.62, 1.68, 1.64, 3.75, 3.54, 1.76, 1.82, 1.59, 1.73, 1.71, 1.92, 1.58, 1.82, 1.88, 1.42, 1.92, 1.59, 1.78, 1.93, 4.8, 4.82, 4.92, 4.97, 3.08, 3.3, 3.36, 3.62, 5.07, 4.96, 5.0, 4.88, 1.95, 5.05, 3.75, 3.04, 2.2, 2.44, 2.79, 2.07, 2.29, 2.59, 1.73, 1.69, 2.12, 1.73, 2.04, 1.74, 1.89, 1.77, 2.04, 1.92, 2.01, 2.12, 1.77, 1.48, 2.05, 1.82, 1.63, 1.71, 1.34, 4.4, 2.09, 1.58, 1.93, 1.96, 1.86, 1.75, 1.78, 1.68, 3.54, 3.26, 2.94, 3.4, 3.02, 1.44, 1.86, 1.67, 2.27, 1.59, 1.66, 1.95, 1.6, 1.77, 1.91, 2.0, 1.74, 1.91, 2.24, 1.67, 1.77, 1.87, 1.87, 1.64, 1.94, 4.8, 5.14, 5.15, 4.75, 4.8, 4.94, 5.56, 4.46, 4.64, 1.99, 1.79, 1.67, 1.92, 1.88, 1.84, 1.72, 1.65, 1.82, 1.5, 4.83, 4.72, 4.47, 4.62, 5.05, 4.53, 5.3, 2.22, 1.93, 1.77, 1.96, 1.89, 1.58, 1.83, 3.19, 3.61, 3.0, 2.75, 2.11, 2.59, 2.32, 2.44, 5.16, 5.37, 4.66, 2.33, 2.64, 3.07, 3.59, 2.75, 3.58]::double precision[];
  v_ih_cali double precision[] := array[8.6, 8.76, 9.1, 8.85, 8.61, 8.76, 8.71, 8.78, 8.71, 8.86, 8.87, 8.73, 9.04, 8.86, 8.72, 8.83, 8.62, 8.72, 8.76, 9.11, 8.76, 8.94, 8.99, 9.39, 8.62, 8.98, 8.64, 8.71, 8.82, 8.77, 8.92, 9.12, 8.62, 8.65, 8.7, 8.83, 8.69, 8.61, 8.62, 8.61, 8.79, 9.07, 9.13, 8.73, 8.63, 8.98, 8.74, 8.6, 8.85, 8.73, 8.99, 8.88, 8.87, 8.94, 8.7, 8.7, 9.27, 8.99, 8.61, 8.77, 8.61, 8.65, 8.6, 8.9, 8.82, 8.98, 9.17, 8.99, 8.78, 8.6, 8.71, 8.84, 9.11, 8.69, 8.76, 8.65, 9.22, 8.64, 8.71, 8.7, 8.98, 8.95, 8.71, 8.76, 8.65, 8.75, 8.97, 8.71, 8.74, 8.87, 9.33, 8.73, 8.71, 8.92, 8.77, 8.77, 8.65, 8.83, 9.12, 8.77, 8.83, 8.76, 8.84, 9.06, 8.61, 8.89, 8.63, 8.93, 8.83, 9.08, 8.62, 9.22, 9.0, 8.77, 8.88, 8.88, 8.86, 8.67, 8.89, 9.07, 8.85, 8.61, 9.06, 9.0, 8.91, 8.66, 8.74, 8.79, 8.9, 8.82, 8.67, 8.7, 8.61, 8.7, 8.76, 8.87, 8.68, 8.78, 8.96, 8.89, 8.86, 8.9, 9.01, 8.76, 8.61, 8.69, 8.7, 9.22, 8.86, 8.71]::double precision[];
  v_nk_well text[] := array['NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-1', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-2', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-3', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-4', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-5', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-6', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7', 'NKWELLE-7']::text[];
  v_nk_fac text[] := array['sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'limestone', 'limestone', 'limestone', 'limestone', 'shale', 'shale', 'shale', 'shale', 'sandstone', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'shale', 'limestone', 'limestone', 'limestone', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'sandstone', 'sandstone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'sandstone', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'shale', 'shale', 'shaly-sand', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'shale', 'shale', 'shale', 'shaly-sand', 'limestone', 'limestone', 'limestone', 'sandstone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'shaly-sand', 'limestone', 'limestone', 'limestone', 'shaly-sand', 'shaly-sand', 'limestone', 'sandstone', 'sandstone', 'sandstone', 'shaly-sand', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'limestone', 'limestone', 'limestone', 'limestone', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'limestone', 'limestone', 'limestone', 'shale', 'shale', 'shale', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'limestone', 'limestone', 'limestone', 'limestone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'sandstone', 'sandstone', 'sandstone']::text[];
  v_nk_depth double precision[] := array[7752.0, 7753.0, 7754.0, 7755.0, 7756.0, 7757.0, 7758.0, 7759.0, 7760.0, 7761.0, 7762.0, 7763.0, 7764.0, 7765.0, 7766.0, 7767.0, 7768.0, 7769.0, 7770.0, 7771.0, 7772.0, 7773.0, 7774.0, 7775.0, 7794.0, 7795.0, 7796.0, 7797.0, 7798.0, 7799.0, 7800.0, 7801.0, 7802.0, 7803.0, 7804.0, 7805.0, 7806.0, 7807.0, 7808.0, 7809.0, 7810.0, 7811.0, 7812.0, 7813.0, 7814.0, 7815.0, 7816.0, 7817.0, 7853.0, 7854.0, 7855.0, 7856.0, 7857.0, 7858.0, 7859.0, 7860.0, 7861.0, 7862.0, 7863.0, 7864.0, 7865.0, 7866.0, 7867.0, 7868.0, 7869.0, 7870.0, 7871.0, 7872.0, 7873.0, 7874.0, 7875.0, 7876.0, 7901.0, 7902.0, 7903.0, 7904.0, 7905.0, 7906.0, 7907.0, 7908.0, 7909.0, 7910.0, 7911.0, 7912.0, 7913.0, 7914.0, 7915.0, 7916.0, 7917.0, 7918.0, 7919.0, 7920.0, 7921.0, 7922.0, 7923.0, 7924.0, 7947.0, 7948.0, 7949.0, 7950.0, 7951.0, 7952.0, 7953.0, 7954.0, 7955.0, 7956.0, 7957.0, 7958.0, 7959.0, 7960.0, 7961.0, 7962.0, 7963.0, 7964.0, 7965.0, 7966.0, 7967.0, 7968.0, 7969.0, 7970.0, 8001.0, 8002.0, 8003.0, 8004.0, 8005.0, 8006.0, 8007.0, 8008.0, 8009.0, 8010.0, 8011.0, 8012.0, 8013.0, 8014.0, 8015.0, 8016.0, 8017.0, 8018.0, 8019.0, 8020.0, 8021.0, 8022.0, 8023.0, 8024.0, 8056.0, 8057.0, 8058.0, 8059.0, 8060.0, 8061.0, 8062.0, 8063.0, 8064.0, 8065.0, 8066.0, 8067.0, 8068.0, 8069.0, 8070.0, 8071.0, 8072.0, 8073.0, 8074.0, 8075.0, 8076.0, 8077.0, 8078.0, 8079.0]::double precision[];
  v_nk_gr double precision[] := array[47.2, 27.4, 54.6, 37.9, 43.8, 31.5, 108.5, 105.8, 132.5, 107.9, 122.3, 103.8, 18.8, 22.3, 21.5, 25.2, 110.5, 126.1, 104.5, 132.8, 41.5, 69.1, 69.6, 54.0, 44.2, 52.3, 47.8, 38.0, 42.0, 125.3, 25.1, 22.7, 26.5, 73.9, 64.8, 57.7, 55.7, 30.7, 52.4, 31.1, 35.9, 14.6, 24.4, 16.3, 21.9, 125.5, 101.1, 116.1, 103.1, 89.6, 124.7, 46.7, 130.6, 101.8, 101.9, 108.0, 106.3, 129.0, 100.4, 69.2, 104.3, 63.0, 83.6, 86.0, 52.3, 48.2, 36.2, 38.2, 46.8, 36.8, 38.8, 46.0, 134.8, 116.1, 66.8, 39.7, 37.1, 35.3, 44.3, 36.3, 50.5, 50.3, 48.4, 34.4, 17.4, 32.7, 39.4, 97.0, 117.4, 114.0, 52.7, 27.7, 29.1, 36.5, 46.5, 30.5, 13.9, 23.6, 23.5, 36.7, 67.5, 20.8, 14.8, 27.3, 63.0, 70.9, 17.6, 53.6, 40.4, 40.3, 62.6, 26.1, 25.4, 32.2, 22.7, 27.6, 9.0, 27.2, 22.3, 20.6, 32.8, 24.4, 35.0, 59.3, 50.5, 86.4, 26.4, 19.7, 19.9, 32.9, 48.4, 47.9, 51.9, 68.4, 23.2, 22.9, 25.9, 102.3, 140.4, 122.0, 43.3, 37.8, 54.0, 27.9, 22.7, 21.8, 18.4, 16.9, 24.2, 38.7, 51.2, 43.2, 47.3, 57.8, 53.0, 65.4, 30.6, 24.2, 31.3, 24.0, 17.6, 27.3, 23.2, 23.9, 18.9, 32.1, 21.7, 46.8]::double precision[];
  v_nk_rhob double precision[] := array[2.268, 2.366, 2.366, 2.25, 2.216, 2.414, 2.493, 2.6, 2.532, 2.574, 2.488, 2.475, 2.658, 2.639, 2.626, 2.642, 2.573, 2.553, 2.445, 2.553, 2.309, 2.384, 2.386, 2.478, 2.404, 2.265, 2.267, 2.321, 2.299, 2.44, 2.664, 2.67, 2.728, 2.427, 2.389, 2.345, 2.404, 2.236, 2.29, 2.675, 2.716, 2.659, 2.64, 2.684, 2.669, 2.535, 2.522, 2.553, 2.61, 2.508, 2.603, 2.294, 2.588, 2.529, 2.497, 2.528, 2.567, 2.454, 2.553, 2.343, 2.306, 2.412, 2.343, 2.478, 2.358, 2.42, 2.256, 2.318, 2.285, 2.362, 2.332, 2.288, 2.443, 2.499, 2.298, 2.278, 2.332, 2.332, 2.239, 2.331, 2.272, 2.313, 2.32, 2.295, 2.326, 2.279, 2.275, 2.598, 2.458, 2.596, 2.344, 2.65, 2.678, 2.689, 2.354, 2.656, 2.615, 2.666, 2.68, 2.649, 2.438, 2.664, 2.619, 2.698, 2.345, 2.418, 2.68, 2.291, 2.325, 2.295, 2.397, 2.655, 2.68, 2.679, 2.626, 2.646, 2.612, 2.656, 2.615, 2.673, 2.603, 2.663, 2.625, 2.434, 2.308, 2.313, 2.679, 2.664, 2.626, 2.673, 2.429, 2.369, 2.337, 2.418, 2.659, 2.685, 2.599, 2.555, 2.42, 2.522, 2.302, 2.325, 2.25, 2.244, 2.613, 2.639, 2.638, 2.662, 2.316, 2.318, 2.276, 2.302, 2.395, 2.394, 2.308, 2.419, 2.607, 2.629, 2.634, 2.666, 2.708, 2.641, 2.702, 2.648, 2.683, 2.404, 2.224, 2.353]::double precision[];
  v_nk_nphi double precision[] := array[0.215, 0.185, 0.225, 0.22, 0.179, 0.188, 0.317, 0.257, 0.347, 0.387, 0.32, 0.311, 0.074, 0.107, 0.049, 0.047, 0.333, 0.365, 0.356, 0.339, 0.229, 0.232, 0.241, 0.223, 0.18, 0.218, 0.186, 0.18, 0.185, 0.326, 0.064, 0.05, 0.04, 0.215, 0.254, 0.312, 0.244, 0.277, 0.187, 0.095, 0.05, 0.089, 0.079, 0.075, 0.056, 0.292, 0.335, 0.307, 0.32, 0.231, 0.314, 0.189, 0.323, 0.313, 0.304, 0.279, 0.28, 0.311, 0.323, 0.276, 0.251, 0.189, 0.22, 0.205, 0.271, 0.213, 0.239, 0.21, 0.222, 0.213, 0.271, 0.19, 0.39, 0.294, 0.196, 0.199, 0.204, 0.228, 0.226, 0.243, 0.207, 0.205, 0.216, 0.214, 0.211, 0.183, 0.181, 0.346, 0.316, 0.325, 0.209, 0.069, 0.042, 0.058, 0.174, 0.068, 0.082, 0.059, 0.056, 0.071, 0.245, 0.086, 0.06, 0.076, 0.319, 0.228, 0.1, 0.24, 0.239, 0.222, 0.254, 0.081, 0.087, 0.05, 0.058, 0.065, 0.044, 0.052, 0.068, 0.049, 0.065, 0.038, 0.051, 0.277, 0.227, 0.175, 0.052, 0.097, 0.044, 0.074, 0.257, 0.269, 0.194, 0.247, 0.068, 0.062, 0.059, 0.298, 0.29, 0.262, 0.238, 0.225, 0.185, 0.265, 0.061, 0.103, 0.06, 0.105, 0.202, 0.26, 0.17, 0.207, 0.263, 0.226, 0.195, 0.182, 0.087, 0.089, 0.115, 0.059, 0.057, 0.077, 0.06, 0.068, 0.033, 0.19, 0.178, 0.203]::double precision[];
  v_nk_pef double precision[] := array[1.62, 2.16, 1.52, 1.79, 1.53, 1.89, 3.73, 3.66, 3.27, 3.28, 3.66, 3.44, 5.06, 4.92, 4.39, 5.08, 3.34, 3.25, 3.37, 3.65, 1.65, 2.54, 1.76, 3.08, 1.84, 1.68, 1.59, 1.79, 1.97, 3.01, 5.34, 4.91, 5.16, 2.16, 2.61, 2.18, 2.39, 2.24, 1.84, 5.18, 4.9, 4.91, 5.07, 4.42, 5.11, 3.55, 2.91, 3.26, 3.14, 3.4, 3.32, 2.17, 3.32, 3.29, 3.18, 3.11, 3.28, 3.46, 3.21, 2.58, 1.84, 2.53, 2.66, 2.1, 2.39, 2.53, 2.08, 2.25, 1.62, 2.08, 1.9, 2.09, 3.3, 3.35, 2.72, 1.69, 1.84, 1.84, 2.1, 1.72, 1.45, 1.81, 2.01, 1.85, 1.84, 1.79, 1.43, 3.34, 3.04, 3.29, 2.82, 4.63, 4.67, 4.63, 1.53, 5.54, 4.58, 4.8, 5.01, 4.76, 2.35, 5.26, 5.16, 5.01, 2.97, 2.53, 5.18, 1.78, 1.81, 1.29, 1.67, 5.24, 4.47, 5.02, 4.82, 4.94, 4.36, 4.97, 4.66, 5.31, 4.95, 5.02, 4.56, 2.03, 2.0, 2.67, 4.98, 4.62, 5.01, 5.18, 2.1, 2.4, 2.43, 2.67, 4.95, 4.85, 5.22, 3.5, 3.21, 3.27, 1.83, 1.81, 1.91, 1.8, 5.29, 5.12, 4.62, 5.15, 1.91, 1.91, 1.81, 1.7, 3.36, 2.34, 2.32, 2.43, 4.62, 4.98, 4.95, 5.03, 4.79, 4.82, 4.82, 4.69, 5.23, 2.18, 1.86, 1.75]::double precision[];
  v_nk_cali double precision[] := array[8.9, 8.82, 8.71, 9.03, 8.89, 8.74, 8.75, 8.82, 8.96, 8.98, 8.65, 9.03, 8.71, 8.61, 8.68, 8.74, 8.97, 8.65, 8.76, 9.03, 8.72, 9.22, 8.78, 8.85, 8.91, 8.72, 9.08, 8.88, 8.63, 9.23, 9.29, 9.09, 8.86, 9.16, 8.74, 9.21, 9.05, 8.64, 8.83, 9.41, 8.73, 8.61, 8.93, 8.69, 8.61, 9.11, 9.21, 8.77, 8.66, 9.01, 9.08, 8.63, 8.66, 8.75, 8.76, 8.67, 8.74, 8.64, 8.91, 8.71, 8.79, 8.92, 8.77, 9.09, 8.77, 9.26, 8.94, 8.82, 8.61, 8.99, 8.96, 9.04, 9.22, 8.72, 9.32, 9.03, 8.78, 8.6, 9.04, 8.6, 8.7, 9.16, 8.71, 8.77, 8.79, 8.81, 8.61, 8.78, 9.83, 8.68, 9.13, 8.79, 8.85, 8.61, 8.88, 8.67, 8.71, 8.82, 8.68, 8.87, 8.67, 8.67, 8.97, 8.86, 9.1, 8.68, 8.66, 8.86, 9.11, 8.65, 8.82, 8.93, 8.82, 8.88, 9.14, 8.9, 8.65, 8.86, 8.8, 8.82, 8.61, 8.79, 9.3, 8.69, 8.84, 8.62, 8.72, 8.72, 9.03, 8.63, 8.9, 9.3, 8.61, 8.69, 8.78, 8.69, 9.05, 8.65, 9.28, 8.72, 8.65, 8.69, 8.66, 8.7, 8.61, 8.9, 8.79, 8.66, 8.92, 8.7, 9.11, 8.9, 9.13, 8.78, 8.73, 9.01, 8.72, 9.14, 8.69, 8.87, 8.68, 8.99, 8.65, 9.51, 8.98, 8.82, 8.71, 8.69]::double precision[];
  v_og_well text[] := array['OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-1', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-2', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-3', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-4', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-5', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-6', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7', 'OGBUNIKE-7']::text[];
  v_og_fac text[] := array['limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'sandstone', 'limestone', 'limestone', 'sandstone', 'sandstone', 'sandstone', 'limestone', 'limestone', 'limestone', 'shaly-sand', 'shaly-sand', 'shale', 'shale', 'shale', 'shale', 'shale', 'limestone', 'limestone', 'limestone', 'limestone', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shale', 'shale', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'sandstone', 'sandstone', 'shale', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shale', 'shale', 'limestone', 'limestone', 'limestone', 'limestone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'sandstone', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'shale', 'limestone', 'limestone', 'limestone', 'limestone', 'sandstone', 'sandstone', 'sandstone', 'shaly-sand', 'sandstone', 'sandstone', 'sandstone', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shaly-sand', 'shale', 'shale', 'shale', 'shale', 'shale', 'limestone', 'limestone', 'limestone', 'limestone', 'limestone', 'sandstone', 'sandstone', 'limestone', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]::text[];
  v_og_depth double precision[] := array[5010.0, 5011.0, 5012.0, 5013.0, 5014.0, 5015.0, 5016.0, 5017.0, 5018.0, 5019.0, 5020.0, 5021.0, 5022.0, 5023.0, 5024.0, 5025.0, 5026.0, 5027.0, 5028.0, 5029.0, 5030.0, 5031.0, 5032.0, 5033.0, 5034.0, 5080.0, 5081.0, 5082.0, 5083.0, 5084.0, 5085.0, 5086.0, 5087.0, 5088.0, 5089.0, 5090.0, 5091.0, 5092.0, 5093.0, 5094.0, 5095.0, 5096.0, 5097.0, 5098.0, 5099.0, 5100.0, 5101.0, 5102.0, 5103.0, 5104.0, 5117.0, 5118.0, 5119.0, 5120.0, 5121.0, 5122.0, 5123.0, 5124.0, 5125.0, 5126.0, 5127.0, 5128.0, 5129.0, 5130.0, 5131.0, 5132.0, 5133.0, 5134.0, 5135.0, 5136.0, 5137.0, 5138.0, 5139.0, 5140.0, 5141.0, 5176.0, 5177.0, 5178.0, 5179.0, 5180.0, 5181.0, 5182.0, 5183.0, 5184.0, 5185.0, 5186.0, 5187.0, 5188.0, 5189.0, 5190.0, 5191.0, 5192.0, 5193.0, 5194.0, 5195.0, 5196.0, 5197.0, 5198.0, 5199.0, 5200.0, 5231.0, 5232.0, 5233.0, 5234.0, 5235.0, 5236.0, 5237.0, 5238.0, 5239.0, 5240.0, 5241.0, 5242.0, 5243.0, 5244.0, 5245.0, 5246.0, 5247.0, 5248.0, 5249.0, 5250.0, 5251.0, 5252.0, 5253.0, 5254.0, 5255.0, 5285.0, 5286.0, 5287.0, 5288.0, 5289.0, 5290.0, 5291.0, 5292.0, 5293.0, 5294.0, 5295.0, 5296.0, 5297.0, 5298.0, 5299.0, 5300.0, 5301.0, 5302.0, 5303.0, 5304.0, 5305.0, 5306.0, 5307.0, 5308.0, 5309.0, 5329.0, 5330.0, 5331.0, 5332.0, 5333.0, 5334.0, 5335.0, 5336.0, 5337.0, 5338.0, 5339.0, 5340.0, 5341.0, 5342.0, 5343.0, 5344.0, 5345.0, 5346.0, 5347.0, 5348.0, 5349.0, 5350.0, 5351.0, 5352.0, 5353.0]::double precision[];
  v_og_gr double precision[] := array[22.7, 23.4, 20.6, 23.5, 31.8, 27.8, 30.9, 28.4, 25.5, 25.0, 25.3, 22.8, 17.6, 36.6, 20.6, 27.6, 29.1, 9.7, 16.8, 49.9, 23.7, 29.2, 45.3, 37.9, 32.5, 26.1, 33.1, 22.2, 78.2, 69.4, 104.6, 95.6, 115.2, 110.6, 104.5, 29.1, 25.1, 32.5, 16.2, 69.4, 69.0, 59.6, 107.6, 116.0, 34.8, 12.3, 20.8, 28.4, 22.4, 19.3, 37.9, 32.2, 108.1, 52.5, 50.4, 42.4, 42.7, 37.2, 102.9, 104.9, 98.2, 105.5, 109.8, 99.7, 45.7, 71.6, 62.3, 61.6, 70.1, 122.3, 130.7, 27.6, 25.4, 13.3, 32.6, 41.6, 31.1, 38.6, 45.3, 44.3, 28.2, 47.8, 39.0, 38.1, 63.3, 45.7, 52.8, 61.0, 46.5, 47.2, 44.7, 48.1, 102.8, 67.3, 71.2, 66.1, 59.5, 36.8, 59.9, 86.4, 37.0, 52.1, 32.9, 31.2, 42.2, 101.9, 116.0, 104.8, 92.1, 111.3, 103.7, 101.2, 93.6, 104.8, 112.2, 94.4, 98.7, 101.2, 124.9, 108.8, 95.2, 21.5, 27.5, 32.2, 26.3, 49.3, 51.5, 48.4, 67.1, 48.5, 42.5, 62.3, 86.0, 72.8, 56.0, 64.8, 90.3, 104.5, 120.9, 92.9, 121.5, 86.6, 27.2, 25.7, 26.4, 34.8, 32.1, 53.8, 44.3, 31.5, 157.6, 138.1, 135.4, 130.3, 132.6, 133.2, 150.1, 142.1, 44.8, 58.3, 52.4, 48.9, 55.2, 56.7, 49.0, 54.0, 57.3, 53.3, 45.3, 46.9, 49.4, 61.9, 66.9, 67.9, 66.5]::double precision[];
  v_og_rhob double precision[] := array[2.636, 2.69, 2.657, 2.665, 2.715, 2.697, 2.667, 2.708, 2.643, 2.71, 2.687, 2.664, 2.682, 2.66, 2.695, 2.638, 2.63, 2.639, 2.664, 2.322, 2.671, 2.656, 2.39, 2.274, 2.39, 2.657, 2.662, 2.624, 2.347, 2.389, 2.497, 2.552, 2.603, 2.532, 2.401, 2.674, 2.671, 2.697, 2.683, 2.287, 2.273, 2.428, 2.496, 2.522, 2.59, 2.702, 2.606, 2.661, 2.702, 2.704, 2.269, 2.249, 2.534, 2.324, 2.223, 2.331, 2.258, 2.269, 2.544, 2.554, 2.573, 2.596, 2.538, 2.483, 2.374, 2.304, 2.401, 2.445, 2.37, 2.506, 2.587, 2.667, 2.651, 2.663, 2.662, 2.346, 2.394, 2.27, 2.325, 2.217, 2.243, 2.263, 2.426, 2.358, 2.287, 2.346, 2.321, 2.382, 2.461, 2.414, 2.376, 2.406, 2.412, 2.353, 2.394, 2.414, 2.32, 2.369, 2.357, 2.293, 2.273, 2.197, 2.367, 2.295, 2.286, 2.476, 2.508, 2.509, 2.534, 2.548, 2.519, 2.499, 2.545, 2.472, 2.502, 2.579, 2.593, 2.521, 2.531, 2.571, 2.547, 2.667, 2.628, 2.692, 2.653, 2.315, 2.361, 2.356, 2.3, 2.302, 2.311, 2.36, 2.298, 2.415, 2.481, 2.385, 2.344, 2.594, 2.551, 2.553, 2.517, 2.427, 2.629, 2.624, 2.574, 2.711, 2.658, 2.314, 2.197, 2.712, 2.492, 2.538, 2.516, 2.485, 2.564, 2.555, 2.592, 2.5, 2.664, 2.625, 2.627, 2.68, 2.65, 2.644, 2.653, 2.679, 2.665, 2.59, 2.667, 2.657, 2.639, 2.289, 2.356, 2.32, 2.315]::double precision[];
  v_og_nphi double precision[] := array[0.08, 0.072, 0.075, 0.047, 0.067, 0.055, 0.051, 0.041, 0.045, 0.057, 0.066, 0.031, 0.102, 0.08, 0.043, 0.046, 0.043, 0.063, 0.078, 0.198, 0.067, 0.074, 0.212, 0.214, 0.199, 0.047, 0.077, 0.104, 0.243, 0.269, 0.339, 0.299, 0.339, 0.343, 0.376, 0.069, 0.078, 0.091, 0.05, 0.215, 0.256, 0.185, 0.297, 0.329, 0.06, 0.063, 0.053, 0.081, 0.063, 0.066, 0.194, 0.174, 0.335, 0.235, 0.202, 0.202, 0.164, 0.21, 0.348, 0.309, 0.347, 0.319, 0.295, 0.279, 0.238, 0.239, 0.305, 0.249, 0.259, 0.311, 0.373, 0.035, 0.075, 0.062, 0.082, 0.223, 0.222, 0.218, 0.148, 0.22, 0.134, 0.245, 0.186, 0.2, 0.199, 0.235, 0.278, 0.2, 0.202, 0.223, 0.266, 0.223, 0.252, 0.265, 0.264, 0.232, 0.307, 0.177, 0.306, 0.313, 0.183, 0.218, 0.221, 0.183, 0.192, 0.361, 0.329, 0.264, 0.306, 0.323, 0.241, 0.315, 0.398, 0.332, 0.341, 0.305, 0.327, 0.32, 0.288, 0.394, 0.344, 0.038, 0.059, 0.057, 0.072, 0.188, 0.198, 0.237, 0.313, 0.236, 0.152, 0.206, 0.261, 0.23, 0.246, 0.221, 0.252, 0.383, 0.331, 0.363, 0.318, 0.312, 0.074, 0.086, 0.054, 0.076, 0.041, 0.26, 0.198, 0.097, 0.33, 0.313, 0.341, 0.334, 0.318, 0.331, 0.299, 0.356, 0.028, 0.059, 0.091, 0.046, 0.1, 0.09, 0.056, 0.092, 0.054, 0.036, 0.065, 0.06, 0.055, 0.198, 0.268, 0.228, 0.145]::double precision[];
  v_og_pef double precision[] := array[5.18, 4.81, 5.43, 4.88, 5.87, 5.31, 5.31, 5.3, 5.2, 5.41, 5.29, 4.5, 5.15, 5.31, 4.98, 4.93, 4.63, 5.12, 4.74, 2.17, 4.69, 4.76, 1.53, 1.68, 1.93, 4.92, 5.2, 5.71, 2.48, 2.46, 3.51, 3.17, 3.04, 3.52, 3.08, 5.04, 4.65, 5.18, 4.66, 2.55, 1.72, 1.95, 3.48, 2.84, 4.91, 5.17, 5.12, 5.19, 4.98, 4.8, 1.78, 1.75, 3.4, 1.62, 1.7, 2.12, 2.14, 1.97, 3.17, 3.17, 2.98, 3.09, 3.25, 3.67, 2.47, 3.08, 2.42, 3.02, 2.31, 3.44, 3.02, 5.28, 4.87, 5.1, 4.6, 1.65, 1.75, 1.67, 2.1, 1.54, 1.93, 1.49, 1.68, 1.86, 1.68, 2.72, 2.0, 2.29, 1.69, 3.14, 2.77, 2.02, 2.48, 2.09, 1.99, 1.91, 2.63, 2.4, 2.17, 2.3, 1.86, 1.4, 1.91, 1.61, 1.99, 3.38, 3.23, 3.21, 3.04, 3.2, 3.46, 2.94, 3.7, 3.13, 2.66, 3.0, 3.29, 3.08, 3.28, 3.6, 3.32, 5.36, 4.8, 4.99, 4.55, 1.22, 1.78, 1.73, 1.88, 1.8, 1.85, 1.83, 2.5, 2.06, 2.26, 2.34, 2.3, 3.38, 3.18, 3.09, 2.95, 3.16, 5.16, 5.25, 4.78, 4.87, 5.13, 1.73, 1.84, 4.87, 2.72, 3.12, 3.3, 2.94, 3.12, 2.89, 3.57, 3.43, 4.79, 4.56, 4.79, 5.13, 5.28, 4.89, 5.14, 4.89, 4.84, 4.96, 5.11, 4.63, 4.75, 1.89, 1.72, 1.66, 1.64]::double precision[];
  v_og_cali double precision[] := array[8.73, 8.6, 8.68, 8.98, 8.79, 8.7, 8.72, 8.66, 8.68, 8.85, 8.85, 8.86, 8.72, 8.69, 9.17, 8.85, 8.75, 8.91, 8.62, 8.63, 8.9, 9.05, 8.69, 8.61, 8.61, 9.18, 9.12, 8.77, 8.74, 8.87, 8.73, 8.77, 8.72, 8.73, 8.94, 8.65, 8.72, 8.85, 8.94, 8.7, 8.87, 8.77, 8.68, 8.66, 8.71, 8.67, 8.75, 8.65, 8.63, 8.64, 8.75, 9.03, 9.07, 8.6, 9.01, 8.67, 9.08, 8.66, 9.13, 9.26, 9.06, 8.62, 8.84, 8.7, 8.85, 8.82, 8.73, 8.6, 8.82, 8.92, 8.75, 8.72, 8.69, 8.79, 8.84, 9.29, 8.84, 8.78, 8.77, 8.66, 8.77, 8.76, 8.78, 8.65, 8.71, 8.67, 8.76, 8.72, 8.86, 8.7, 9.49, 8.95, 9.01, 8.92, 8.7, 9.07, 8.76, 8.65, 8.79, 8.9, 9.05, 8.72, 8.73, 8.82, 9.35, 8.93, 8.67, 9.22, 8.82, 8.69, 8.65, 9.21, 9.14, 8.82, 9.42, 8.68, 8.66, 8.65, 8.61, 8.74, 8.61, 8.71, 8.95, 8.63, 8.61, 8.98, 8.75, 8.61, 8.83, 8.76, 8.93, 8.65, 8.76, 8.9, 8.64, 8.72, 8.68, 8.89, 8.81, 8.62, 8.95, 8.69, 9.38, 8.84, 8.65, 8.86, 8.79, 9.31, 8.72, 8.73, 8.67, 8.6, 9.02, 9.05, 9.01, 8.85, 8.89, 8.9, 8.74, 8.8, 9.03, 8.96, 9.08, 8.79, 9.01, 8.63, 8.86, 8.6, 8.67, 8.89, 9.01, 8.75, 8.94, 8.63, 8.72]::double precision[];
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'facies' and active;
  if v_structures <> 3 then
    raise exception 'D3 go-live refused: facies has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'facies';
  if v_questions <> 396 then
    raise exception 'D3 go-live refused: facies has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'facies' group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'D3 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;
  select count(*) into v_n from (select tier, module_key from public.academy_quiz_questions where app_slug = 'facies' and scope = 'module' group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'D3 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'facies' and scope = 'final' group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'D3 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = 'facies'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'D3 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;
  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'facies' and s.active;
  if v_lessons <> 78 then
    raise exception 'D3 go-live refused: facies carries % lesson keys, expected 78', v_lessons;
  end if;
  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'facies' and s.active;
  if v_modules <> 18 then
    raise exception 'D3 go-live refused: facies carries % modules, expected 18 (six per tier)', v_modules;
  end if;
  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'facies' and qq.scope = 'module' and not exists (
       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'D3 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'facies';
  if v_capstones <> 3 then
    raise exception 'D3 go-live refused: facies has % capstones, expected 3', v_capstones;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'facies';
  if v_graded <> 18 then
    raise exception 'D3 go-live refused: facies has % graded capstone fields, expected 18', v_graded;
  end if;
  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'facies' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'D3 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'facies' and module = 'data_ai' and path_order = 68 and prereq_slug is null) then
    raise exception 'D3 go-live refused: the facies catalogue row is not data_ai at path_order 68 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 68 and slug <> 'facies') then
    raise exception 'D3 go-live refused: another course already holds path_order 68';
  end if;

  -- ------------------------------------------------- the grader is numeric
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or abs((f->>'expected')::numeric) <= 0.001
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric <> 0.0000005
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'D3 go-live refused: % graded field(s) are not a non-zero, non-whole number at tolerance 0.0000005 with a label and a unit: %', v_n, v_names;
  end if;
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
          or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric);
  if v_n <> 0 then
    raise exception 'D3 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;

  -- ---------------------------------------- the prompts the learner reads
  select prompt into v_prompt from public.academy_capstones where app_slug = 'facies' and tier = 'beginner';
  if v_prompt is null or md5(v_prompt) <> '9402d9c10b947f355fed464544638f27' then
    raise exception 'D3 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'facies' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'IHIALA, 6 cored wells, 150 rows' and title = 'Grouping logs into electrofacies') then
    raise exception 'D3 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['k-means with k 4, seed 7 and 10 starts', 'the population standard deviation (n)', 'row 24', 'the correlation matrix', 'the engine''s sign convention', 'ihiala_wells.csv']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D3 go-live refused: % stated setting(s) or case file(s) are not named in the shipped beginner prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'facies' and tier = 'intermediate';
  if v_prompt is null or md5(v_prompt) <> '7070a54b59bb3033acb11554bb6e7b89' then
    raise exception 'D3 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'facies' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'NKWELLE, 7 cored wells, 168 rows' and title = 'Judging groups against core') then
    raise exception 'D3 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['over k 1 to 8 with seed 5 and 10 starts', 'Ward linkage cut at k 4', 'complete linkage cut at k 4', 'k-means at k 6, seed 5 and 10 starts', 'scored on the standardised logs', 'nkwelle_wells.csv']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D3 go-live refused: % stated setting(s) or case file(s) are not named in the shipped intermediate prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'facies' and tier = 'advanced';
  if v_prompt is null or md5(v_prompt) <> '82d1792f96bda0c8cd2edfe235580395' then
    raise exception 'D3 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'facies' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'OGBUNIKE, 7 wells, one of them uncored' and title = 'Predicting facies and the engine''s own rules') then
    raise exception 'D3 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['kNN with k 5', 'row 0 of OGBUNIKE-4', 'maxDepth 5', 'column order GR, RHOB, NPHI, PEF, CALI', 'maxDepth 3', '26 gAPI high', 'fitted on the training rows', 'ogbunike_wells.csv']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D3 go-live refused: % stated setting(s) or case file(s) are not named in the shipped advanced prompt: %', v_n, v_names;
  end if;
  -- No number handed in any capstone text of this course may sit within its
  -- tolerance of any graded value of any tier.
  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names
    from (select c.tier as ctier, m[1]::double precision as x
            from public.academy_capstones c,
                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||
                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),
                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m
           where c.app_slug = 'facies') h,
         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'facies') g
   where abs(abs(h.x) - abs(g.v)) <= g.t;
  if v_n <> 0 then
    raise exception 'D3 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_ihiala_gr_scale_gapi
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'beginner' and f->>'key' = 'ihiala_gr_scale_gapi';
  if v_g_ihiala_gr_scale_gapi is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: beginner/ihiala_gr_scale_gapi]';
  end if;
  select (f->>'expected')::double precision into v_g_ihiala_pc1_ratio
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'beginner' and f->>'key' = 'ihiala_pc1_ratio';
  if v_g_ihiala_pc1_ratio is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: beginner/ihiala_pc1_ratio]';
  end if;
  select (f->>'expected')::double precision into v_g_ihiala_pc1_nphi_loading
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'beginner' and f->>'key' = 'ihiala_pc1_nphi_loading';
  if v_g_ihiala_pc1_nphi_loading is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: beginner/ihiala_pc1_nphi_loading]';
  end if;
  select (f->>'expected')::double precision into v_g_ihiala_pc1_score_first_row
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'beginner' and f->>'key' = 'ihiala_pc1_score_first_row';
  if v_g_ihiala_pc1_score_first_row is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: beginner/ihiala_pc1_score_first_row]';
  end if;
  select (f->>'expected')::double precision into v_g_ihiala_kmeans_inertia
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'beginner' and f->>'key' = 'ihiala_kmeans_inertia';
  if v_g_ihiala_kmeans_inertia is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: beginner/ihiala_kmeans_inertia]';
  end if;
  select (f->>'expected')::double precision into v_g_ihiala_row24_cluster_gr_centre_gapi
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'beginner' and f->>'key' = 'ihiala_row24_cluster_gr_centre_gapi';
  if v_g_ihiala_row24_cluster_gr_centre_gapi is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: beginner/ihiala_row24_cluster_gr_centre_gapi]';
  end if;
  select (f->>'expected')::double precision into v_g_nkwelle_elbow_drop_fraction_k4
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'intermediate' and f->>'key' = 'nkwelle_elbow_drop_fraction_k4';
  if v_g_nkwelle_elbow_drop_fraction_k4 is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: intermediate/nkwelle_elbow_drop_fraction_k4]';
  end if;
  select (f->>'expected')::double precision into v_g_nkwelle_ward_silhouette
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'intermediate' and f->>'key' = 'nkwelle_ward_silhouette';
  if v_g_nkwelle_ward_silhouette is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: intermediate/nkwelle_ward_silhouette]';
  end if;
  select (f->>'expected')::double precision into v_g_nkwelle_ward_height_above_cut
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'intermediate' and f->>'key' = 'nkwelle_ward_height_above_cut';
  if v_g_nkwelle_ward_height_above_cut is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: intermediate/nkwelle_ward_height_above_cut]';
  end if;
  select (f->>'expected')::double precision into v_g_nkwelle_complete_ari
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'intermediate' and f->>'key' = 'nkwelle_complete_ari';
  if v_g_nkwelle_complete_ari is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: intermediate/nkwelle_complete_ari]';
  end if;
  select (f->>'expected')::double precision into v_g_nkwelle_one_to_one_macro_f1
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'intermediate' and f->>'key' = 'nkwelle_one_to_one_macro_f1';
  if v_g_nkwelle_one_to_one_macro_f1 is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: intermediate/nkwelle_one_to_one_macro_f1]';
  end if;
  select (f->>'expected')::double precision into v_g_nkwelle_majority_accuracy_k6
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'intermediate' and f->>'key' = 'nkwelle_majority_accuracy_k6';
  if v_g_nkwelle_majority_accuracy_k6 is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: intermediate/nkwelle_majority_accuracy_k6]';
  end if;
  select (f->>'expected')::double precision into v_g_ogbunike_knn_heldout_accuracy
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'advanced' and f->>'key' = 'ogbunike_knn_heldout_accuracy';
  if v_g_ogbunike_knn_heldout_accuracy is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: advanced/ogbunike_knn_heldout_accuracy]';
  end if;
  select (f->>'expected')::double precision into v_g_ogbunike_knn_nearest_distance
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'advanced' and f->>'key' = 'ogbunike_knn_nearest_distance';
  if v_g_ogbunike_knn_nearest_distance is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: advanced/ogbunike_knn_nearest_distance]';
  end if;
  select (f->>'expected')::double precision into v_g_ogbunike_cart_node2_gini
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'advanced' and f->>'key' = 'ogbunike_cart_node2_gini';
  if v_g_ogbunike_cart_node2_gini is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: advanced/ogbunike_cart_node2_gini]';
  end if;
  select (f->>'expected')::double precision into v_g_ogbunike_cart_nphi_importance
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'advanced' and f->>'key' = 'ogbunike_cart_nphi_importance';
  if v_g_ogbunike_cart_nphi_importance is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: advanced/ogbunike_cart_nphi_importance]';
  end if;
  select (f->>'expected')::double precision into v_g_ogbunike_cart_depth3_heldout_accuracy
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'advanced' and f->>'key' = 'ogbunike_cart_depth3_heldout_accuracy';
  if v_g_ogbunike_cart_depth3_heldout_accuracy is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: advanced/ogbunike_cart_depth3_heldout_accuracy]';
  end if;
  select (f->>'expected')::double precision into v_g_ogbunike_uncored_gr_minmax_max
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'facies' and c.tier = 'advanced' and f->>'key' = 'ogbunike_uncored_gr_minmax_max';
  if v_g_ogbunike_uncored_gr_minmax_max is null then
    raise exception 'D3 go-live refused: the seeded rows carry no value [graded field: advanced/ogbunike_uncored_gr_minmax_max]';
  end if;

  -- ------------------------------------------ 1. against the engine ledger
  if v_g_ihiala_gr_scale_gapi <> 30.964884168289004 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 30.964884168289004 [graded field: beginner/ihiala_gr_scale_gapi]', v_g_ihiala_gr_scale_gapi;
  end if;
  if v_g_ihiala_pc1_ratio <> 0.5691754468344539 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 0.5691754468344539 [graded field: beginner/ihiala_pc1_ratio]', v_g_ihiala_pc1_ratio;
  end if;
  if v_g_ihiala_pc1_nphi_loading <> -0.7646436270213334 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned -0.7646436270213334 [graded field: beginner/ihiala_pc1_nphi_loading]', v_g_ihiala_pc1_nphi_loading;
  end if;
  if v_g_ihiala_pc1_score_first_row <> -0.5709520560870318 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned -0.5709520560870318 [graded field: beginner/ihiala_pc1_score_first_row]', v_g_ihiala_pc1_score_first_row;
  end if;
  if v_g_ihiala_kmeans_inertia <> 47.80610578301488 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 47.80610578301488 [graded field: beginner/ihiala_kmeans_inertia]', v_g_ihiala_kmeans_inertia;
  end if;
  if v_g_ihiala_row24_cluster_gr_centre_gapi <> 41.956626506024094 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 41.956626506024094 [graded field: beginner/ihiala_row24_cluster_gr_centre_gapi]', v_g_ihiala_row24_cluster_gr_centre_gapi;
  end if;
  if v_g_nkwelle_elbow_drop_fraction_k4 <> 0.29491071673313907 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 0.29491071673313907 [graded field: intermediate/nkwelle_elbow_drop_fraction_k4]', v_g_nkwelle_elbow_drop_fraction_k4;
  end if;
  if v_g_nkwelle_ward_silhouette <> 0.5894448481870038 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 0.5894448481870038 [graded field: intermediate/nkwelle_ward_silhouette]', v_g_nkwelle_ward_silhouette;
  end if;
  if v_g_nkwelle_ward_height_above_cut <> 6.101223754624051 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 6.101223754624051 [graded field: intermediate/nkwelle_ward_height_above_cut]', v_g_nkwelle_ward_height_above_cut;
  end if;
  if v_g_nkwelle_complete_ari <> 0.9716598290573624 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 0.9716598290573624 [graded field: intermediate/nkwelle_complete_ari]', v_g_nkwelle_complete_ari;
  end if;
  if v_g_nkwelle_one_to_one_macro_f1 <> 0.9797123780174628 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 0.9797123780174628 [graded field: intermediate/nkwelle_one_to_one_macro_f1]', v_g_nkwelle_one_to_one_macro_f1;
  end if;
  if v_g_nkwelle_majority_accuracy_k6 <> 0.9761904761904762 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 0.9761904761904762 [graded field: intermediate/nkwelle_majority_accuracy_k6]', v_g_nkwelle_majority_accuracy_k6;
  end if;
  if v_g_ogbunike_knn_heldout_accuracy <> 0.76 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 0.76 [graded field: advanced/ogbunike_knn_heldout_accuracy]', v_g_ogbunike_knn_heldout_accuracy;
  end if;
  if v_g_ogbunike_knn_nearest_distance <> 0.2483094734611528 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 0.2483094734611528 [graded field: advanced/ogbunike_knn_nearest_distance]', v_g_ogbunike_knn_nearest_distance;
  end if;
  if v_g_ogbunike_cart_node2_gini <> 0.6649365628604382 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 0.6649365628604382 [graded field: advanced/ogbunike_cart_node2_gini]', v_g_ogbunike_cart_node2_gini;
  end if;
  if v_g_ogbunike_cart_nphi_importance <> 0.40300385114933807 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 0.40300385114933807 [graded field: advanced/ogbunike_cart_nphi_importance]', v_g_ogbunike_cart_nphi_importance;
  end if;
  if v_g_ogbunike_cart_depth3_heldout_accuracy <> 0.64 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 0.64 [graded field: advanced/ogbunike_cart_depth3_heldout_accuracy]', v_g_ogbunike_cart_depth3_heldout_accuracy;
  end if;
  if v_g_ogbunike_uncored_gr_minmax_max <> 1.222314049586777 then
    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned 1.222314049586777 [graded field: advanced/ogbunike_uncored_gr_minmax_max]', v_g_ogbunike_uncored_gr_minmax_max;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  v_x := pg_temp.d3_flat(array[v_ih_gr, v_ih_rhob, v_ih_nphi, v_ih_pef]);
  v_r := pg_temp.d3_pc1(v_x, 4, 'samp');
  v_z := pg_temp.d3_apply(v_x, 4, pg_temp.d3_fit(v_x, 4, 'samp'));
  v_s := (pg_temp.d3_fit(v_x, 4, 'pop'))[5];
  if v_s is null or abs(v_s - v_g_ihiala_gr_scale_gapi) > 1e-9 * greatest(1.0, abs(v_g_ihiala_gr_scale_gapi)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ihiala_gr_scale_gapi]', v_s, v_g_ihiala_gr_scale_gapi;
  end if;
  v_s := v_r[1] / v_r[2];
  if v_s is null or abs(v_s - v_g_ihiala_pc1_ratio) > 1e-9 * greatest(1.0, abs(v_g_ihiala_pc1_ratio)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ihiala_pc1_ratio]', v_s, v_g_ihiala_pc1_ratio;
  end if;
  v_s := v_r[5] * sqrt(v_r[1]);
  if v_s is null or abs(v_s - v_g_ihiala_pc1_nphi_loading) > 1e-9 * greatest(1.0, abs(v_g_ihiala_pc1_nphi_loading)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ihiala_pc1_nphi_loading]', v_s, v_g_ihiala_pc1_nphi_loading;
  end if;
  v_s := v_z[1] * v_r[3] + v_z[2] * v_r[4] + v_z[3] * v_r[5] + v_z[4] * v_r[6];
  if v_s is null or abs(v_s - v_g_ihiala_pc1_score_first_row) > 1e-9 * greatest(1.0, abs(v_g_ihiala_pc1_score_first_row)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ihiala_pc1_score_first_row]', v_s, v_g_ihiala_pc1_score_first_row;
  end if;
  v_z := pg_temp.d3_apply(v_x, 4, pg_temp.d3_fit(v_x, 4, 'pop'));
  v_km := pg_temp.d3_kmeans(v_z, 4, 4, 7, 10, 300);
  v_lab := pg_temp.d3_lab(v_km, 2);
  if v_km[2] <> 1.0 then
    raise exception 'D3 go-live refused: the second route k-means did not converge [graded field: beginner/ihiala_kmeans_inertia]';
  end if;
  v_s := v_km[1];
  if v_s is null or abs(v_s - v_g_ihiala_kmeans_inertia) > 1e-9 * greatest(1.0, abs(v_g_ihiala_kmeans_inertia)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ihiala_kmeans_inertia]', v_s, v_g_ihiala_kmeans_inertia;
  end if;
  v_s := (select avg(v_ih_gr[i]) from generate_series(1, array_length(v_lab, 1)) i where v_lab[i] = v_lab[25]);
  if v_s is null or abs(v_s - v_g_ihiala_row24_cluster_gr_centre_gapi) > 1e-9 * greatest(1.0, abs(v_g_ihiala_row24_cluster_gr_centre_gapi)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/ihiala_row24_cluster_gr_centre_gapi]', v_s, v_g_ihiala_row24_cluster_gr_centre_gapi;
  end if;
  v_x := pg_temp.d3_flat(array[v_nk_gr, v_nk_rhob, v_nk_nphi, v_nk_pef]);
  v_z := pg_temp.d3_apply(v_x, 4, pg_temp.d3_fit(v_x, 4, 'pop'));
  v_k3 := pg_temp.d3_kmeans(v_z, 4, 3, 5, 10, 300);
  v_km := pg_temp.d3_kmeans(v_z, 4, 4, 5, 10, 300);
  v_s := (v_k3[1] - v_km[1]) / v_k3[1];
  if v_s is null or abs(v_s - v_g_nkwelle_elbow_drop_fraction_k4) > 1e-9 * greatest(1.0, abs(v_g_nkwelle_elbow_drop_fraction_k4)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nkwelle_elbow_drop_fraction_k4]', v_s, v_g_nkwelle_elbow_drop_fraction_k4;
  end if;
  v_h := pg_temp.d3_hclust(v_z, 4, 'ward', 4);
  v_hc := pg_temp.d3_hclust(v_z, 4, 'complete', 4);
  v_lab := pg_temp.d3_lab(v_h, 2); v_labc := pg_temp.d3_lab(v_hc, 2);
  v_s := pg_temp.d3_sil(v_z, 4, v_lab);
  if v_s is null or abs(v_s - v_g_nkwelle_ward_silhouette) > 1e-9 * greatest(1.0, abs(v_g_nkwelle_ward_silhouette)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nkwelle_ward_silhouette]', v_s, v_g_nkwelle_ward_silhouette;
  end if;
  v_s := v_h[2];
  if v_s is null or abs(v_s - v_g_nkwelle_ward_height_above_cut) > 1e-9 * greatest(1.0, abs(v_g_nkwelle_ward_height_above_cut)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nkwelle_ward_height_above_cut]', v_s, v_g_nkwelle_ward_height_above_cut;
  end if;
  v_s := pg_temp.d3_ari(v_nk_fac, array(select l::text from unnest(v_labc) with ordinality t(l, o) order by o), true);
  if v_s is null or abs(v_s - v_g_nkwelle_complete_ari) > 1e-9 * greatest(1.0, abs(v_g_nkwelle_complete_ari)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nkwelle_complete_ari]', v_s, v_g_nkwelle_complete_ari;
  end if;
  v_s := (pg_temp.d3_report(v_nk_fac, pg_temp.d3_map(v_nk_fac, pg_temp.d3_lab(v_km, 2), 'one-to-one')))[2];
  if v_s is null or abs(v_s - v_g_nkwelle_one_to_one_macro_f1) > 1e-9 * greatest(1.0, abs(v_g_nkwelle_one_to_one_macro_f1)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nkwelle_one_to_one_macro_f1]', v_s, v_g_nkwelle_one_to_one_macro_f1;
  end if;
  v_s := (pg_temp.d3_report(v_nk_fac, pg_temp.d3_map(v_nk_fac, pg_temp.d3_lab(pg_temp.d3_kmeans(v_z, 4, 6, 5, 10, 300), 2), 'majority')))[1];
  if v_s is null or abs(v_s - v_g_nkwelle_majority_accuracy_k6) > 1e-9 * greatest(1.0, abs(v_g_nkwelle_majority_accuracy_k6)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nkwelle_majority_accuracy_k6]', v_s, v_g_nkwelle_majority_accuracy_k6;
  end if;
  v_x := pg_temp.d3_flat(array[v_og_gr, v_og_rhob, v_og_nphi, v_og_pef]);
  v_x5 := pg_temp.d3_flat(array[v_og_gr, v_og_rhob, v_og_nphi, v_og_pef, v_og_cali]);
  v_tr := array(select i from generate_subscripts(v_og_well, 1) i where v_og_fac[i] is not null and v_og_well[i] <> 'OGBUNIKE-4' order by i);
  v_te := array(select i from generate_subscripts(v_og_well, 1) i where v_og_well[i] = 'OGBUNIKE-4' order by i);
  v_cored := array(select i from generate_subscripts(v_og_well, 1) i where v_og_fac[i] is not null order by i);
  v_un := array(select i from generate_subscripts(v_og_well, 1) i where v_og_well[i] = 'OGBUNIKE-7' order by i);
  v_ytr := array(select v_og_fac[i] from unnest(v_tr) with ordinality u(i, o) order by o);
  v_yte := array(select v_og_fac[i] from unnest(v_te) with ordinality u(i, o) order by o);
  v_cls := array(select distinct f collate "C" from unnest(v_og_fac) f where f is not null order by 1);
  v_cs := pg_temp.d3_fit(pg_temp.d3_rows(v_x, 4, v_tr), 4, 'pop');
  select pred, dist into v_pred, v_dist from pg_temp.d3_knn(pg_temp.d3_apply(pg_temp.d3_rows(v_x, 4, v_tr), 4, v_cs), v_ytr, pg_temp.d3_apply(pg_temp.d3_rows(v_x, 4, v_te), 4, v_cs), 4, 5);
  v_tree := pg_temp.d3_cart(pg_temp.d3_rows(v_x5, 5, v_cored), 5, array(select v_og_fac[i] from unnest(v_cored) with ordinality u(i, o) order by o), array(select g from generate_series(1, array_length(v_cored, 1)) g), 0, 5, v_cls);
  v_s := (pg_temp.d3_report(v_yte, v_pred))[1];
  if v_s is null or abs(v_s - v_g_ogbunike_knn_heldout_accuracy) > 1e-9 * greatest(1.0, abs(v_g_ogbunike_knn_heldout_accuracy)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/ogbunike_knn_heldout_accuracy]', v_s, v_g_ogbunike_knn_heldout_accuracy;
  end if;
  v_s := v_dist[1];
  if v_s is null or abs(v_s - v_g_ogbunike_knn_nearest_distance) > 1e-9 * greatest(1.0, abs(v_g_ogbunike_knn_nearest_distance)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/ogbunike_knn_nearest_distance]', v_s, v_g_ogbunike_knn_nearest_distance;
  end if;
  if (v_tree->0->>'f')::int <> 3 or (v_tree->0->>'right')::int <> 2 then
    raise exception 'D3 go-live refused: the second route tree does not split its root on NPHI with node 2 on the right [graded field: advanced/ogbunike_cart_node2_gini]';
  end if;
  v_s := (v_tree->2->>'gini')::double precision;
  if v_s is null or abs(v_s - v_g_ogbunike_cart_node2_gini) > 1e-9 * greatest(1.0, abs(v_g_ogbunike_cart_node2_gini)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/ogbunike_cart_node2_gini]', v_s, v_g_ogbunike_cart_node2_gini;
  end if;
  v_s := pg_temp.d3_imp(v_tree, 3);
  if v_s is null or abs(v_s - v_g_ogbunike_cart_nphi_importance) > 1e-9 * greatest(1.0, abs(v_g_ogbunike_cart_nphi_importance)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/ogbunike_cart_nphi_importance]', v_s, v_g_ogbunike_cart_nphi_importance;
  end if;
  v_s := (pg_temp.d3_report(v_yte, pg_temp.d3_cart_pred(pg_temp.d3_cart(pg_temp.d3_rows(v_x5, 5, v_tr), 5, v_ytr, array(select g from generate_series(1, array_length(v_tr, 1)) g), 0, 3, v_cls), pg_temp.d3_rows(v_x5, 5, v_te), 5)))[1];
  if v_s is null or abs(v_s - v_g_ogbunike_cart_depth3_heldout_accuracy) > 1e-9 * greatest(1.0, abs(v_g_ogbunike_cart_depth3_heldout_accuracy)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/ogbunike_cart_depth3_heldout_accuracy]', v_s, v_g_ogbunike_cart_depth3_heldout_accuracy;
  end if;
  v_cs := pg_temp.d3_fit(pg_temp.d3_rows(v_x, 4, v_cored), 4, 'minmax');
  v_s := (select max(v) from unnest(pg_temp.d3_apply(pg_temp.d3_rows(v_x, 4, v_un), 4, v_cs)) with ordinality u(v, o) where o % 4 = 1);
  if v_s is null or abs(v_s - v_g_ogbunike_uncored_gr_minmax_max) > 1e-9 * greatest(1.0, abs(v_g_ogbunike_uncored_gr_minmax_max)) then
    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/ogbunike_uncored_gr_minmax_max]', v_s, v_g_ogbunike_uncored_gr_minmax_max;
  end if;

  -- ------------------------------------------------------------ 3. the traps
  v_x := pg_temp.d3_flat(array[v_ih_gr, v_ih_rhob, v_ih_nphi, v_ih_pef]);
  v_r := pg_temp.d3_pc1(v_x, 4, 'samp');
  v_wrong := (pg_temp.d3_fit(v_x, 4, 'samp'))[5];
  if v_wrong is null or abs(v_wrong - v_g_ihiala_gr_scale_gapi) <= 5e-07 then
    raise exception 'D3 go-live refused: the sample standard deviation gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ihiala_gr_scale_gapi]', v_wrong, v_g_ihiala_gr_scale_gapi;
  end if;
  v_wrong := (pg_temp.d3_fit(v_x, 4, 'minmax'))[5];
  if v_wrong is null or abs(v_wrong - v_g_ihiala_gr_scale_gapi) <= 5e-07 then
    raise exception 'D3 go-live refused: the min max range gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ihiala_gr_scale_gapi]', v_wrong, v_g_ihiala_gr_scale_gapi;
  end if;
  v_wrong := (pg_temp.d3_pc1(v_x, 4, 'cov'))[1] / (pg_temp.d3_pc1(v_x, 4, 'cov'))[2];
  if v_wrong is null or abs(v_wrong - v_g_ihiala_pc1_ratio) <= 5e-07 then
    raise exception 'D3 go-live refused: the covariance matrix gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ihiala_pc1_ratio]', v_wrong, v_g_ihiala_pc1_ratio;
  end if;
  v_wrong := (pg_temp.d3_pc1(pg_temp.d3_flat(array[v_ih_gr, v_ih_rhob, v_ih_nphi, v_ih_pef, v_ih_cali]), 5, 'samp'))[1] / 5.0;
  if v_wrong is null or abs(v_wrong - v_g_ihiala_pc1_ratio) <= 5e-07 then
    raise exception 'D3 go-live refused: the caliper included gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ihiala_pc1_ratio]', v_wrong, v_g_ihiala_pc1_ratio;
  end if;
  v_wrong := v_r[5];
  if v_wrong is null or abs(v_wrong - v_g_ihiala_pc1_nphi_loading) <= 5e-07 then
    raise exception 'D3 go-live refused: the unit weight quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ihiala_pc1_nphi_loading]', v_wrong, v_g_ihiala_pc1_nphi_loading;
  end if;
  v_wrong := v_r[5] * v_r[1];
  if v_wrong is null or abs(v_wrong - v_g_ihiala_pc1_nphi_loading) <= 5e-07 then
    raise exception 'D3 go-live refused: the weight times the eigenvalue gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ihiala_pc1_nphi_loading]', v_wrong, v_g_ihiala_pc1_nphi_loading;
  end if;
  v_z := pg_temp.d3_apply(v_x, 4, pg_temp.d3_fit(v_x, 4, 'pop'));
  v_wrong := v_z[1] * v_r[3] + v_z[2] * v_r[4] + v_z[3] * v_r[5] + v_z[4] * v_r[6];
  if v_wrong is null or abs(v_wrong - v_g_ihiala_pc1_score_first_row) <= 5e-07 then
    raise exception 'D3 go-live refused: the population standard deviation gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ihiala_pc1_score_first_row]', v_wrong, v_g_ihiala_pc1_score_first_row;
  end if;
  v_z := pg_temp.d3_apply(v_x, 4, pg_temp.d3_fit(v_x, 4, 'samp'));
  v_wrong := v_z[597] * v_r[3] + v_z[598] * v_r[4] + v_z[599] * v_r[5] + v_z[600] * v_r[6];
  if v_wrong is null or abs(v_wrong - v_g_ihiala_pc1_score_first_row) <= 5e-07 then
    raise exception 'D3 go-live refused: the last row gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ihiala_pc1_score_first_row]', v_wrong, v_g_ihiala_pc1_score_first_row;
  end if;
  v_z := pg_temp.d3_apply(v_x, 4, pg_temp.d3_fit(v_x, 4, 'pop'));
  v_wrong := (pg_temp.d3_kmeans(v_z, 4, 4, 7, 1, 300))[1];
  if v_wrong is null or abs(v_wrong - v_g_ihiala_kmeans_inertia) <= 5e-07 then
    raise exception 'D3 go-live refused: one start gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ihiala_kmeans_inertia]', v_wrong, v_g_ihiala_kmeans_inertia;
  end if;
  v_wrong := (pg_temp.d3_kmeans(v_z, 4, 5, 7, 10, 300))[1];
  if v_wrong is null or abs(v_wrong - v_g_ihiala_kmeans_inertia) <= 5e-07 then
    raise exception 'D3 go-live refused: k one more gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ihiala_kmeans_inertia]', v_wrong, v_g_ihiala_kmeans_inertia;
  end if;
  v_lab := pg_temp.d3_lab(pg_temp.d3_kmeans(v_z, 4, 4, 7, 10, 300), 2);
  v_wrong := (select avg(v_ih_gr[i]) from generate_series(1, array_length(v_lab, 1)) i where v_lab[i] = v_lab[1]);
  if v_wrong is null or abs(v_wrong - v_g_ihiala_row24_cluster_gr_centre_gapi) <= 5e-07 then
    raise exception 'D3 go-live refused: the cluster of row 0 read gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ihiala_row24_cluster_gr_centre_gapi]', v_wrong, v_g_ihiala_row24_cluster_gr_centre_gapi;
  end if;
  v_wrong := (select avg(v_z[(i - 1) * 4 + 1]) from generate_series(1, array_length(v_lab, 1)) i where v_lab[i] = v_lab[25]);
  if v_wrong is null or abs(v_wrong - v_g_ihiala_row24_cluster_gr_centre_gapi) <= 5e-07 then
    raise exception 'D3 go-live refused: the centre in standard units gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ihiala_row24_cluster_gr_centre_gapi]', v_wrong, v_g_ihiala_row24_cluster_gr_centre_gapi;
  end if;
  v_wrong := v_ih_gr[25];
  if v_wrong is null or abs(v_wrong - v_g_ihiala_row24_cluster_gr_centre_gapi) <= 5e-07 then
    raise exception 'D3 go-live refused: the row GR quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/ihiala_row24_cluster_gr_centre_gapi]', v_wrong, v_g_ihiala_row24_cluster_gr_centre_gapi;
  end if;
  v_x := pg_temp.d3_flat(array[v_nk_gr, v_nk_rhob, v_nk_nphi, v_nk_pef]);
  v_z := pg_temp.d3_apply(v_x, 4, pg_temp.d3_fit(v_x, 4, 'pop'));
  v_k3 := pg_temp.d3_kmeans(v_z, 4, 3, 5, 10, 300);
  v_km := pg_temp.d3_kmeans(v_z, 4, 4, 5, 10, 300);
  v_wrong := v_k3[1] - v_km[1];
  if v_wrong is null or abs(v_wrong - v_g_nkwelle_elbow_drop_fraction_k4) <= 5e-07 then
    raise exception 'D3 go-live refused: the drop, not divided gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkwelle_elbow_drop_fraction_k4]', v_wrong, v_g_nkwelle_elbow_drop_fraction_k4;
  end if;
  v_wrong := (v_k3[1] - v_km[1]) / v_km[1];
  if v_wrong is null or abs(v_wrong - v_g_nkwelle_elbow_drop_fraction_k4) <= 5e-07 then
    raise exception 'D3 go-live refused: the drop divided by the inertia at k gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkwelle_elbow_drop_fraction_k4]', v_wrong, v_g_nkwelle_elbow_drop_fraction_k4;
  end if;
  v_h := pg_temp.d3_hclust(v_z, 4, 'ward', 4);
  v_hc := pg_temp.d3_hclust(v_z, 4, 'complete', 4);
  v_lab := pg_temp.d3_lab(v_h, 2); v_labc := pg_temp.d3_lab(v_hc, 2);
  v_wrong := pg_temp.d3_sil(v_z, 4, v_labc);
  if v_wrong is null or abs(v_wrong - v_g_nkwelle_ward_silhouette) <= 5e-07 then
    raise exception 'D3 go-live refused: the complete linkage cut gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkwelle_ward_silhouette]', v_wrong, v_g_nkwelle_ward_silhouette;
  end if;
  v_wrong := pg_temp.d3_sil(v_z, 4, pg_temp.d3_lab(v_km, 2));
  if v_wrong is null or abs(v_wrong - v_g_nkwelle_ward_silhouette) <= 5e-07 then
    raise exception 'D3 go-live refused: the k-means labels gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkwelle_ward_silhouette]', v_wrong, v_g_nkwelle_ward_silhouette;
  end if;
  v_wrong := v_h[1];
  if v_wrong is null or abs(v_wrong - v_g_nkwelle_ward_height_above_cut) <= 5e-07 then
    raise exception 'D3 go-live refused: the height below the cut gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkwelle_ward_height_above_cut]', v_wrong, v_g_nkwelle_ward_height_above_cut;
  end if;
  v_wrong := v_hc[2];
  if v_wrong is null or abs(v_wrong - v_g_nkwelle_ward_height_above_cut) <= 5e-07 then
    raise exception 'D3 go-live refused: complete linkage gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkwelle_ward_height_above_cut]', v_wrong, v_g_nkwelle_ward_height_above_cut;
  end if;
  v_wrong := pg_temp.d3_ari(v_nk_fac, array(select l::text from unnest(v_lab) with ordinality t(l, o) order by o), true);
  if v_wrong is null or abs(v_wrong - v_g_nkwelle_complete_ari) <= 5e-07 then
    raise exception 'D3 go-live refused: the Ward cut gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkwelle_complete_ari]', v_wrong, v_g_nkwelle_complete_ari;
  end if;
  v_wrong := pg_temp.d3_ari(v_nk_fac, array(select l::text from unnest(v_labc) with ordinality t(l, o) order by o), false);
  if v_wrong is null or abs(v_wrong - v_g_nkwelle_complete_ari) <= 5e-07 then
    raise exception 'D3 go-live refused: the unadjusted Rand index gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkwelle_complete_ari]', v_wrong, v_g_nkwelle_complete_ari;
  end if;
  v_pred := pg_temp.d3_map(v_nk_fac, pg_temp.d3_lab(v_km, 2), 'one-to-one');
  v_wrong := (pg_temp.d3_report(v_nk_fac, v_pred))[1];
  if v_wrong is null or abs(v_wrong - v_g_nkwelle_one_to_one_macro_f1) <= 5e-07 then
    raise exception 'D3 go-live refused: the accuracy quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkwelle_one_to_one_macro_f1]', v_wrong, v_g_nkwelle_one_to_one_macro_f1;
  end if;
  v_wrong := (pg_temp.d3_report(v_nk_fac, v_pred))[3];
  if v_wrong is null or abs(v_wrong - v_g_nkwelle_one_to_one_macro_f1) <= 5e-07 then
    raise exception 'D3 go-live refused: the weighted F1 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkwelle_one_to_one_macro_f1]', v_wrong, v_g_nkwelle_one_to_one_macro_f1;
  end if;
  v_wrong := (pg_temp.d3_report(v_nk_fac, pg_temp.d3_map(v_nk_fac, pg_temp.d3_lab(pg_temp.d3_kmeans(v_z, 4, 5, 5, 10, 300), 2), 'majority')))[1];
  if v_wrong is null or abs(v_wrong - v_g_nkwelle_majority_accuracy_k6) <= 5e-07 then
    raise exception 'D3 go-live refused: majority matching at k one less gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkwelle_majority_accuracy_k6]', v_wrong, v_g_nkwelle_majority_accuracy_k6;
  end if;
  v_wrong := (pg_temp.d3_report(v_nk_fac, v_pred))[1];
  if v_wrong is null or abs(v_wrong - v_g_nkwelle_majority_accuracy_k6) <= 5e-07 then
    raise exception 'D3 go-live refused: one-to-one at the smaller k gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nkwelle_majority_accuracy_k6]', v_wrong, v_g_nkwelle_majority_accuracy_k6;
  end if;
  v_x := pg_temp.d3_flat(array[v_og_gr, v_og_rhob, v_og_nphi, v_og_pef]);
  v_x5 := pg_temp.d3_flat(array[v_og_gr, v_og_rhob, v_og_nphi, v_og_pef, v_og_cali]);
  v_tr := array(select i from generate_subscripts(v_og_well, 1) i where v_og_fac[i] is not null and v_og_well[i] <> 'OGBUNIKE-4' order by i);
  v_te := array(select i from generate_subscripts(v_og_well, 1) i where v_og_well[i] = 'OGBUNIKE-4' order by i);
  v_cored := array(select i from generate_subscripts(v_og_well, 1) i where v_og_fac[i] is not null order by i);
  v_un := array(select i from generate_subscripts(v_og_well, 1) i where v_og_well[i] = 'OGBUNIKE-7' order by i);
  v_ytr := array(select v_og_fac[i] from unnest(v_tr) with ordinality u(i, o) order by o);
  v_yte := array(select v_og_fac[i] from unnest(v_te) with ordinality u(i, o) order by o);
  v_cls := array(select distinct f collate "C" from unnest(v_og_fac) f where f is not null order by 1);
  v_cs := pg_temp.d3_fit(pg_temp.d3_rows(v_x, 4, v_tr), 4, 'pop');
  select pred, dist into v_pred, v_dist from pg_temp.d3_knn(pg_temp.d3_apply(pg_temp.d3_rows(v_x, 4, v_tr), 4, v_cs), v_ytr, pg_temp.d3_apply(pg_temp.d3_rows(v_x, 4, v_te), 4, v_cs), 4, 5);
  v_tree := pg_temp.d3_cart(pg_temp.d3_rows(v_x5, 5, v_cored), 5, array(select v_og_fac[i] from unnest(v_cored) with ordinality u(i, o) order by o), array(select g from generate_series(1, array_length(v_cored, 1)) g), 0, 5, v_cls);
  select pred into v_pred from pg_temp.d3_knn(pg_temp.d3_apply(pg_temp.d3_rows(v_x, 4, v_tr), 4, v_cs), v_ytr, pg_temp.d3_apply(pg_temp.d3_rows(v_x, 4, v_te), 4, v_cs), 4, 1);
  v_wrong := (pg_temp.d3_report(v_yte, v_pred))[1];
  if v_wrong is null or abs(v_wrong - v_g_ogbunike_knn_heldout_accuracy) <= 5e-07 then
    raise exception 'D3 go-live refused: k 1 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ogbunike_knn_heldout_accuracy]', v_wrong, v_g_ogbunike_knn_heldout_accuracy;
  end if;
  select pred into v_pred from pg_temp.d3_knn(pg_temp.d3_rows(v_x, 4, v_tr), v_ytr, pg_temp.d3_rows(v_x, 4, v_te), 4, 5);
  v_wrong := (pg_temp.d3_report(v_yte, v_pred))[1];
  if v_wrong is null or abs(v_wrong - v_g_ogbunike_knn_heldout_accuracy) <= 5e-07 then
    raise exception 'D3 go-live refused: no scaling gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ogbunike_knn_heldout_accuracy]', v_wrong, v_g_ogbunike_knn_heldout_accuracy;
  end if;
  v_wrong := v_dist[1] * v_dist[1];
  if v_wrong is null or abs(v_wrong - v_g_ogbunike_knn_nearest_distance) <= 5e-07 then
    raise exception 'D3 go-live refused: the squared distance gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ogbunike_knn_nearest_distance]', v_wrong, v_g_ogbunike_knn_nearest_distance;
  end if;
  select dist into v_dist from pg_temp.d3_knn(pg_temp.d3_rows(v_x, 4, v_tr), v_ytr, pg_temp.d3_rows(v_x, 4, v_te), 4, 5);
  v_wrong := v_dist[1];
  if v_wrong is null or abs(v_wrong - v_g_ogbunike_knn_nearest_distance) <= 5e-07 then
    raise exception 'D3 go-live refused: the raw logs gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ogbunike_knn_nearest_distance]', v_wrong, v_g_ogbunike_knn_nearest_distance;
  end if;
  v_wrong := (v_tree->0->>'gini')::double precision;
  if v_wrong is null or abs(v_wrong - v_g_ogbunike_cart_node2_gini) <= 5e-07 then
    raise exception 'D3 go-live refused: the root Gini gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ogbunike_cart_node2_gini]', v_wrong, v_g_ogbunike_cart_node2_gini;
  end if;
  v_wrong := (v_tree->1->>'gini')::double precision;
  if v_wrong is null or abs(v_wrong - v_g_ogbunike_cart_node2_gini) <= 5e-07 then
    raise exception 'D3 go-live refused: node 1 read gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ogbunike_cart_node2_gini]', v_wrong, v_g_ogbunike_cart_node2_gini;
  end if;
  v_wrong := (v_tree->0->>'rise')::double precision / 150.0;
  if v_wrong is null or abs(v_wrong - v_g_ogbunike_cart_nphi_importance) <= 5e-07 then
    raise exception 'D3 go-live refused: the root decrease quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ogbunike_cart_nphi_importance]', v_wrong, v_g_ogbunike_cart_nphi_importance;
  end if;
  v_wrong := pg_temp.d3_imp(pg_temp.d3_cart(pg_temp.d3_rows(v_x5, 5, v_cored), 5, array(select v_og_fac[i] from unnest(v_cored) with ordinality u(i, o) order by o), array(select g from generate_series(1, array_length(v_cored, 1)) g), 0, 3, v_cls), 3);
  if v_wrong is null or abs(v_wrong - v_g_ogbunike_cart_nphi_importance) <= 5e-07 then
    raise exception 'D3 go-live refused: the tree of the held-out depth gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ogbunike_cart_nphi_importance]', v_wrong, v_g_ogbunike_cart_nphi_importance;
  end if;
  v_wrong := (pg_temp.d3_report(v_yte, pg_temp.d3_cart_pred(pg_temp.d3_cart(pg_temp.d3_rows(v_x5, 5, v_tr), 5, v_ytr, array(select g from generate_series(1, array_length(v_tr, 1)) g), 0, 4, v_cls), pg_temp.d3_rows(v_x5, 5, v_te), 5)))[1];
  if v_wrong is null or abs(v_wrong - v_g_ogbunike_cart_depth3_heldout_accuracy) <= 5e-07 then
    raise exception 'D3 go-live refused: depth one more gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ogbunike_cart_depth3_heldout_accuracy]', v_wrong, v_g_ogbunike_cart_depth3_heldout_accuracy;
  end if;
  v_wrong := (pg_temp.d3_report(v_yte, pg_temp.d3_cart_pred(pg_temp.d3_cart(pg_temp.d3_rows(v_x5, 5, v_tr), 5, v_ytr, array(select g from generate_series(1, array_length(v_tr, 1)) g), 0, 2, v_cls), pg_temp.d3_rows(v_x5, 5, v_te), 5)))[1];
  if v_wrong is null or abs(v_wrong - v_g_ogbunike_cart_depth3_heldout_accuracy) <= 5e-07 then
    raise exception 'D3 go-live refused: depth one less gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ogbunike_cart_depth3_heldout_accuracy]', v_wrong, v_g_ogbunike_cart_depth3_heldout_accuracy;
  end if;
  v_cs := pg_temp.d3_fit(pg_temp.d3_rows(v_x, 4, v_cored), 4, 'minmax');
  v_wrong := ((select max(v_og_gr[i]) from unnest(v_un) i) - 26.0 - v_cs[1]) / v_cs[5];
  if v_wrong is null or abs(v_wrong - v_g_ogbunike_uncored_gr_minmax_max) <= 5e-07 then
    raise exception 'D3 go-live refused: the stated offset removed gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ogbunike_uncored_gr_minmax_max]', v_wrong, v_g_ogbunike_uncored_gr_minmax_max;
  end if;
  v_wrong := ((select avg(v_og_gr[i]) from unnest(v_un) i) - v_cs[1]) / v_cs[5];
  if v_wrong is null or abs(v_wrong - v_g_ogbunike_uncored_gr_minmax_max) <= 5e-07 then
    raise exception 'D3 go-live refused: the mean in place of the highest gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/ogbunike_uncored_gr_minmax_max]', v_wrong, v_g_ogbunike_uncored_gr_minmax_max;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'facies';
  if not exists (select 1 from public.academy_apps where slug = 'facies' and status = 'available') then
    raise exception 'D3 go-live refused: facies did not reach status available';
  end if;
  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon from public.academy_apps;
  raise notice 'D3 go-live: facies available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
