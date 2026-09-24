
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
