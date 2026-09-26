-- ------------------------------------------------ the second route's helpers
-- Temporary functions (pg_temp), created with create or replace: they vanish
-- with the session and create nothing in any schema. Each is written from the
-- published definition the course states (Okapi BM25 with the Lucene idf,
-- scikit-learn's smoothed TF-IDF, trec_eval's precision, recall, reciprocal
-- rank and average precision, nDCG with a log2(rank + 1) discount, the SQuAD
-- normalisation and token F1, Cohen's kappa, the Brier score and its Murphy
-- decomposition with the within-bin terms of Stephenson, Coelho and Jolliffe
-- 2008, the mulberry32 stream and the lib/stats quantile rule). No engine code
-- is run: the go-live recomputes each graded value from the capstone data.
-- Arrays are 1-based; a passage set is a pair of arrays, ids and texts.

-- Tokens: ASCII A to Z lowercased and nothing else changed, split on every run
-- of characters outside [a-z0-9], empty pieces dropped. No stop list (every
-- capstone states the stop list off).
create or replace function pg_temp.d5_tok(t text) returns text[]
language sql immutable as $f$
  select coalesce(array_agg(x order by o), '{}'::text[])
    from regexp_split_to_table(translate(t, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), '[^a-z0-9]+')
         with ordinality s(x, o)
   where x <> ''
$f$;

-- The distinct query terms, in order of first appearance.
create or replace function pg_temp.d5_qterms(q text) returns text[]
language sql immutable as $f$
  select coalesce(array_agg(x order by o), '{}'::text[])
    from (select x, min(o) o from unnest(pg_temp.d5_tok(q)) with ordinality u(x, o) group by x) d
$f$;

-- BM25 with the Lucene idf ln(1 + (N - df + 0.5) / (df + 0.5)): one score per
-- passage (0 where no query term occurs), in passage order.
create or replace function pg_temp.d5_bm25(texts text[], q text, k1 double precision, b double precision)
returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(texts, 1); toks text[][]; lens int[] := '{}'; total double precision := 0;
  avgdl double precision; terms text[] := pg_temp.d5_qterms(q); s double precision[] := '{}';
  i int; w text; df int; tf int; idf double precision; dt text[];
begin
  for i in 1 .. n loop
    lens := lens || cardinality(pg_temp.d5_tok(texts[i]));
    total := total + cardinality(pg_temp.d5_tok(texts[i]));
    s := s || 0.0::double precision;
  end loop;
  avgdl := total / n::double precision;
  foreach w in array terms loop
    select count(*) into df from generate_series(1, n) j where w = any(pg_temp.d5_tok(texts[j]));
    if df = 0 then continue; end if;
    idf := ln(1.0 + (n - df + 0.5) / (df + 0.5));
    for i in 1 .. n loop
      dt := pg_temp.d5_tok(texts[i]);
      select count(*) into tf from unnest(dt) x where x = w;
      if tf > 0 then
        s[i] := s[i] + (idf * tf * (k1 + 1)) / (tf + k1 * (1 - b + (b * lens[i]) / avgdl));
      end if;
    end loop;
  end loop;
  return s;
end $f$;

-- The BM25 idf of one term over a passage set.
create or replace function pg_temp.d5_bm25_idf(texts text[], term text) returns double precision
language sql immutable as $f$
  select ln(1.0 + (array_length(texts, 1) - df + 0.5) / (df + 0.5))
    from (select count(*)::double precision df from unnest(texts) t where term = any(pg_temp.d5_tok(t))) d
$f$;

-- TF-IDF as scikit-learn's default: idf ln((1 + N) / (1 + df)) + 1, raw
-- counts (or 1 + ln tf, sublinear, on passages and query alike), each vector
-- scaled to unit length; the query keeps only vocabulary terms. One cosine
-- per passage, in passage order.
create or replace function pg_temp.d5_tfidf(texts text[], q text, sub boolean) returns double precision[]
language sql immutable as $f$
  with tf as (select i d, x w, count(*)::double precision f
                from generate_series(1, array_length(texts, 1)) i, unnest(pg_temp.d5_tok(texts[i])) x group by i, x),
       idf as (select w, ln((1.0 + array_length(texts, 1)) / (1.0 + count(*))) + 1 idf from tf group by w),
       dw as (select tf.d, tf.w, (case when sub then 1 + ln(tf.f) else tf.f end) * idf.idf v from tf join idf using (w)),
       dn as (select d, sqrt(sum(v * v)) nrm from dw group by d),
       qc as (select x w, count(*)::double precision c from unnest(pg_temp.d5_tok(q)) x where x in (select w from idf) group by x),
       qw as (select qc.w, (case when sub then 1 + ln(qc.c) else qc.c end) * idf.idf v from qc join idf using (w)),
       qn as (select sqrt(sum(v * v)) nrm from qw),
       sc as (select dw.d, sum((qw.v / qn.nrm) * (dw.v / dn.nrm)) s
                from dw join qw using (w) join dn using (d), qn where qn.nrm > 0 group by dw.d)
  select array_agg(coalesce(sc.s, 0.0) order by i)
    from generate_series(1, array_length(texts, 1)) i left join sc on sc.d = i
$f$;

-- The ranking: score above 0, the score rounded to 12 significant digits
-- descending (the tie key), then the id ascending; the top k ids.
create or replace function pg_temp.d5_rank(ids text[], scores double precision[], k int) returns text[]
language sql immutable as $f$
  select coalesce(array_agg(id order by key desc, id collate "C"), '{}'::text[])
    from (select id, key
            from (select ids[i] id, round(scores[i]::numeric, 11 - floor(log(scores[i]::numeric))::int) key
                    from generate_series(1, array_length(ids, 1)) i where scores[i] > 0) a
           order by key desc, id collate "C" limit k) r
$f$;

-- One ranked list against its judgments (passage id to grade; unjudged is
-- grade 0) at cutoff k, relevant at grade t or more, with a gain. Returns
-- [precision, recall, reciprocal rank, average precision, DCG, ideal DCG,
-- nDCG, number relevant]; recall, AP and nDCG null where undefined.
create or replace function pg_temp.d5_metrics(run text[], j jsonb, k int, t int, gain text) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  nrel int; hits int := 0; rr double precision := 0; ap double precision := 0; dcg double precision := 0;
  idcg double precision := 0; g int; i int; top text[] := run[1:k]; ng int := 0;
begin
  select count(*) into nrel from jsonb_each_text(j) e where e.value::int >= t;
  for i in 1 .. coalesce(array_length(top, 1), 0) loop
    g := coalesce((j->>top[i])::int, 0);
    if g >= t then
      hits := hits + 1;
      if rr = 0 then rr := 1.0 / i; end if;
      ap := ap + hits / i::double precision;
    end if;
    dcg := dcg + (case when gain = 'exponential' then 2.0 ^ g - 1 else g end) / (ln(i + 1.0) / ln(2.0));
  end loop;
  for g in select e.value::int from jsonb_each_text(j) e order by e.value::int desc limit k loop
    ng := ng + 1;
    idcg := idcg + (case when gain = 'exponential' then 2.0 ^ g - 1 else g end) / (ln(ng + 1.0) / ln(2.0));
  end loop;
  return array[hits / k::double precision,
               case when nrel > 0 then hits / nrel::double precision end,
               rr,
               case when nrel > 0 then ap / nrel::double precision end,
               dcg, idcg,
               case when idcg > 0 then dcg / idcg end,
               nrel::double precision];
end $f$;

-- The mean of one metric (by its position in d5_metrics) over the queries of a
-- run object (query id to ranked ids) with a judgments object, the queries
-- with no relevant passage excluded.
create or replace function pg_temp.d5_mean(runs jsonb, js jsonb, k int, t int, gain text, pos int) returns double precision
language sql immutable as $f$
  select avg(m[pos]) from (
    select pg_temp.d5_metrics(array(select jsonb_array_elements_text(r.value)), js->r.key, k, t, gain) m
      from jsonb_each(runs) r) x
   where m[8] > 0
$f$;

-- The per-query value of one metric, queries in id order.
create or replace function pg_temp.d5_per(runs jsonb, js jsonb, k int, t int, gain text, pos int) returns double precision[]
language sql immutable as $f$
  select array_agg(m[pos] order by q collate "C") from (
    select r.key q, pg_temp.d5_metrics(array(select jsonb_array_elements_text(r.value)), js->r.key, k, t, gain) m
      from jsonb_each(runs) r) x
$f$;

-- A whole run in SQL: every query of a query set ranked over a passage set.
create or replace function pg_temp.d5_run(ids text[], texts text[], qids text[], qtexts text[], method text,
                                          k int, k1 double precision, b double precision, sub boolean) returns jsonb
language sql immutable as $f$
  select jsonb_object_agg(qids[i], to_jsonb(pg_temp.d5_rank(ids,
           case when method = 'bm25' then pg_temp.d5_bm25(texts, qtexts[i], k1, b)
                else pg_temp.d5_tfidf(texts, qtexts[i], sub) end, k)))
    from generate_series(1, array_length(qids, 1)) i
$f$;

-- The SQuAD normalisation: lowercase, drop ASCII punctuation, the words a, an
-- and the replaced by a space, whitespace collapsed; returned as tokens.
create or replace function pg_temp.d5_squad(t text) returns text[]
language sql immutable as $f$
  select coalesce(array_agg(x order by o), '{}'::text[])
    from regexp_split_to_table(
           regexp_replace(
             regexp_replace(lower(t), '[!"#$%&''()*+,./:;<=>?@\[\\\]^_`{|}~-]', '', 'g'),
             '\y(a|an|the)\y', ' ', 'g'),
           '\s+') with ordinality s(x, o)
   where x <> ''
$f$;

-- SQuAD token F1 on two token lists by multiset overlap; [f1, precision, recall].
create or replace function pg_temp.d5_f1(p text[], r text[]) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare common int; pr double precision; rc double precision;
begin
  if cardinality(p) = 0 or cardinality(r) = 0 then
    return array[case when cardinality(p) = cardinality(r) then 1.0 else 0.0 end, null, null];
  end if;
  select coalesce(sum(least(a.c, b.c)), 0) into common
    from (select x, count(*) c from unnest(p) x group by x) a join (select x, count(*) c from unnest(r) x group by x) b using (x);
  if common = 0 then return array[0.0, 0.0, 0.0]; end if;
  pr := common / cardinality(p)::double precision; rc := common / cardinality(r)::double precision;
  return array[(2 * pr * rc) / (pr + rc), pr, rc];
end $f$;

-- Extraction over labels and predictions ([{id, fields}]) with field specs
-- ([{name, type, absTol?, relTol?}]). Returns [macro F1, micro F1, macro
-- accuracy, precision, recall, mean F1 of the text fields].
create or replace function pg_temp.d5_extract(fields jsonb, labels jsonb, preds jsonb) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  f jsonb; l jsonb; pf jsonb; lv jsonb; pv jsonb; le boolean; pe boolean; o text; x double precision;
  cf int; wr int; mi int; un int; co int; tcf int := 0; twr int := 0; tmi int := 0; tun int := 0;
  cells int; pr double precision; rc double precision; f1s double precision[] := '{}'; accs double precision[] := '{}';
  tf1 double precision[] := '{}'; f1 double precision; tol double precision;
begin
  for f in select * from jsonb_array_elements(fields) loop
    cf := 0; wr := 0; mi := 0; un := 0; co := 0; cells := 0;
    for l in select * from jsonb_array_elements(labels) loop
      pf := coalesce((select p->'fields' from jsonb_array_elements(preds) p where p->>'id' = l->>'id' limit 1), '{}'::jsonb);
      lv := l->'fields'->(f->>'name'); pv := pf->(f->>'name');
      le := lv is null or jsonb_typeof(lv) = 'null' or (jsonb_typeof(lv) = 'string' and btrim(lv #>> '{}') = '');
      pe := pv is null or jsonb_typeof(pv) = 'null' or (jsonb_typeof(pv) = 'string' and btrim(pv #>> '{}') = '');
      cells := cells + 1;
      if le and pe then o := 'empty';
      elsif pe then o := 'missed';
      elsif le then o := 'unsupported';
      elsif f->>'type' = 'text' then
        o := case when pg_temp.d5_squad(pv #>> '{}') = pg_temp.d5_squad(lv #>> '{}') then 'correct' else 'wrong' end;
      else
        if jsonb_typeof(pv) = 'number' then x := (pv #>> '{}')::double precision;
        elsif btrim(pv #>> '{}') ~ '^-?[0-9]+(,[0-9]{3})*([.][0-9]+)?$' then x := replace(btrim(pv #>> '{}'), ',', '')::double precision;
        else x := null; end if;
        tol := greatest(coalesce((f->>'absTol')::double precision, 0), coalesce((f->>'relTol')::double precision, 0) * abs((lv #>> '{}')::double precision));
        o := case when x is not null and abs(x - (lv #>> '{}')::double precision) <= tol then 'correct' else 'wrong' end;
      end if;
      if o = 'empty' then co := co + 1;
      elsif o = 'correct' then cf := cf + 1; co := co + 1;
      elsif o = 'wrong' then wr := wr + 1;
      elsif o = 'missed' then mi := mi + 1;
      else un := un + 1; end if;
    end loop;
    pr := case when cf + wr + un > 0 then cf / (cf + wr + un)::double precision end;
    rc := case when cf + wr + mi > 0 then cf / (cf + wr + mi)::double precision end;
    f1 := case when pr is null and rc is null then null
               when coalesce(pr, 0) + coalesce(rc, 0) = 0 then 0.0
               else (2 * coalesce(pr, 0) * coalesce(rc, 0)) / (coalesce(pr, 0) + coalesce(rc, 0)) end;
    if f1 is not null then f1s := f1s || f1; if f->>'type' = 'text' then tf1 := tf1 || f1; end if; end if;
    accs := accs || (co / cells::double precision);
    tcf := tcf + cf; twr := twr + wr; tmi := tmi + mi; tun := tun + un;
  end loop;
  pr := case when tcf + twr + tun > 0 then tcf / (tcf + twr + tun)::double precision end;
  rc := case when tcf + twr + tmi > 0 then tcf / (tcf + twr + tmi)::double precision end;
  return array[(select avg(v) from unnest(f1s) v),
               case when coalesce(pr, 0) + coalesce(rc, 0) = 0 then 0.0 else (2 * coalesce(pr, 0) * coalesce(rc, 0)) / (coalesce(pr, 0) + coalesce(rc, 0)) end,
               (select avg(v) from unnest(accs) v), pr, rc, (select avg(v) from unnest(tf1) v)];
end $f$;

-- a x b modulo 2^32 for a, b in [0, 2^32), with b split into 16-bit halves so
-- no product leaves bigint.
create or replace function pg_temp.d5_imul(a bigint, b bigint) returns bigint
language sql immutable as $f$
  select ((a * (b & 65535)) + (((a * (b >> 16)) & 65535) << 16)) & 4294967295
$f$;

-- The quantile rule of lib/stats on SORTED values: idx = n p; a fractional
-- idx takes the ceil(idx)-th value; a whole idx on an even count takes the
-- mean of the idx-th and (idx + 1)-th; on an odd count the (idx + 1)-th.
create or replace function pg_temp.d5_quant(x double precision[], p double precision) returns double precision
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

-- The bootstrap of a minus b: nboot replicates on one mulberry32(seed)
-- stream rebuilt in 64-bit integer arithmetic; paired draws n positions and
-- averages a - b there; unpaired draws n for a and then n for b. The
-- percentile interval at the tails round((1 - level) / 2, 12 places) and one
-- minus it. Returns [lower, upper].
create or replace function pg_temp.d5_boot(a double precision[], b double precision[], nboot int, seed bigint,
                                           level double precision, paired boolean) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(a, 1); st bigint := seed & 4294967295; t bigint; u double precision;
  reps double precision[] := array_fill(0.0::double precision, array[nboot]); r int; i int;
  s double precision; sb double precision; lo double precision; hi double precision; srt double precision[];
begin
  for r in 1 .. nboot loop
    s := 0; sb := 0;
    for i in 1 .. (case when paired then n else 2 * n end) loop
      st := (st + 1831565813) & 4294967295;
      t := pg_temp.d5_imul(st # (st >> 15), st | 1);
      t := t # ((t + pg_temp.d5_imul(t # (t >> 7), t | 61)) & 4294967295);
      u := (t # (t >> 14))::double precision / 4294967296.0;
      if paired then s := s + (a[floor(u * n)::int + 1] - b[floor(u * n)::int + 1]);
      elsif i <= n then s := s + a[floor(u * n)::int + 1];
      else sb := sb + b[floor(u * n)::int + 1]; end if;
    end loop;
    reps[r] := case when paired then s / n::double precision else s / n::double precision - sb / n::double precision end;
  end loop;
  srt := array(select v from unnest(reps) v order by v);
  lo := round(((1 - level) / 2.0) * 1000000000000.0) / 1000000000000.0;
  hi := round((1 - lo) * 1000000000000.0) / 1000000000000.0;
  return array[pg_temp.d5_quant(srt, lo), pg_temp.d5_quant(srt, hi)];
end $f$;

-- The claim grammar: quoted spans (straight or curly double quotes) first,
-- then ISO dates touching no letter or digit, then numbers (digits with comma
-- thousands groups and a decimal part; a leading minus only after a
-- non-alphanumeric; a number after a letter, or after - _ or / that follows a
-- letter or digit, is part of an identifier). Returns one row per claim:
-- kind, the date text, the number value, the quote tokens, in text order.
create or replace function pg_temp.d5_figs(s text, ord_base int)
returns table(pos int, kind text, dval text, nval double precision, qtoks text[])
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  t text := s; p int := 1; a int; m text; e int; pc text; pp text; neg boolean; v double precision;
begin
  loop
    a := regexp_instr(s, '[0-9]{4}-[0-9]{2}-[0-9]{2}', p);
    exit when a = 0;
    m := substr(s, a, 10); e := a + 10;
    if not (a > 1 and substr(s, a - 1, 1) ~ '[A-Za-z0-9]') and not (substr(s, e, 1) ~ '[A-Za-z0-9]') then
      pos := a; kind := 'date'; dval := m; nval := null; qtoks := null; return next;
      t := overlay(t placing repeat(' ', 10) from a for 10);
    end if;
    p := e;
  end loop;
  p := 1;
  loop
    a := regexp_instr(t, '[0-9]+(,[0-9]{3}(?![0-9]))*([.][0-9]+)?', p);
    exit when a = 0;
    m := regexp_substr(t, '[0-9]+(,[0-9]{3}(?![0-9]))*([.][0-9]+)?', p);
    p := a + length(m);
    pc := case when a > 1 then substr(t, a - 1, 1) else '' end;
    pp := case when a > 2 then substr(t, a - 2, 1) else '' end;
    continue when pc ~ '[A-Za-z]';
    continue when pc in ('-', '_', '/') and pp ~ '[A-Za-z0-9]';
    neg := pc = '-' and not (pp ~ '[A-Za-z0-9]');
    v := replace(m, ',', '')::double precision;
    pos := case when neg then a - 1 else a end; kind := 'number'; dval := null;
    nval := case when neg then -v else v end; qtoks := null; return next;
  end loop;
end $f$;

create or replace function pg_temp.d5_claims(s text)
returns table(pos int, kind text, dval text, nval double precision, qtoks text[])
language plpgsql immutable as $f$
#variable_conflict use_column
declare t text := s; p int := 1; a int; m text; tk text[];
begin
  loop
    a := regexp_instr(s, '["“][^"“”]*["”]', p);
    exit when a = 0;
    m := regexp_substr(s, '["“][^"“”]*["”]', p);
    tk := pg_temp.d5_tok(substr(m, 2, length(m) - 2));
    if cardinality(tk) > 0 then
      pos := a; kind := 'quote'; dval := null; nval := null; qtoks := tk; return next;
    end if;
    t := overlay(t placing repeat(' ', length(m)) from a for length(m));
    p := a + length(m);
  end loop;
  return query select * from pg_temp.d5_figs(t, 0);
end $f$;

-- Does a passage hold a claim? A date as the same date, a number within
-- reltol x |passage value| of a passage number, a quote as the same run of
-- tokens.
create or replace function pg_temp.d5_in(p_text text, p_kind text, p_dval text, p_nval double precision, p_qtoks text[],
                                         p_reltol double precision) returns boolean
language plpgsql immutable as $f$
declare pt text[]; i int; n int; k int;
begin
  if p_kind = 'date' then
    return exists (select 1 from pg_temp.d5_figs(p_text, 0) f where f.kind = 'date' and f.dval = p_dval);
  elsif p_kind = 'number' then
    return exists (select 1 from pg_temp.d5_figs(p_text, 0) f where f.kind = 'number' and abs(p_nval - f.nval) <= p_reltol * abs(f.nval));
  end if;
  pt := pg_temp.d5_tok(p_text); n := cardinality(pt); k := cardinality(p_qtoks);
  for i in 1 .. n - k + 1 loop
    if pt[i:i + k - 1] = p_qtoks then return true; end if;
  end loop;
  return false;
end $f$;

-- Groundedness of a set of answers ([{query, text, citations}]) over a
-- passage set, a claim supported only by a passage the answer cites that is
-- in the corpus and, when runs is not null, in the query's retrieved list.
-- Returns [pooled supported fraction, mean of the per-answer fractions,
-- number claims supported / number claims, share of answers with a claim that
-- are fully supported].
create or replace function pg_temp.d5_ground(ids text[], texts text[], answers jsonb, runs jsonb, reltol double precision)
returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  an jsonb; c record; elig text[]; nc int; ns int; tc int := 0; ts int := 0; fr double precision[] := '{}';
  nn int := 0; nns int := 0; full_ int := 0; withc int := 0; sup boolean;
begin
  for an in select * from jsonb_array_elements(answers) loop
    elig := array(select distinct x from jsonb_array_elements_text(an->'citations') x
                   where x = any(ids) and (runs is null or runs->(an->>'query') ? x));
    nc := 0; ns := 0;
    for c in select * from pg_temp.d5_claims(an->>'text') order by pos loop
      sup := exists (select 1 from unnest(elig) e
                      where pg_temp.d5_in(texts[array_position(ids, e)], c.kind, c.dval, c.nval, c.qtoks, reltol));
      nc := nc + 1; if sup then ns := ns + 1; end if;
      if c.kind = 'number' then nn := nn + 1; if sup then nns := nns + 1; end if; end if;
    end loop;
    tc := tc + nc; ts := ts + ns;
    if nc > 0 then fr := fr || (ns / nc::double precision); withc := withc + 1; if ns = nc then full_ := full_ + 1; end if; end if;
  end loop;
  return array[case when tc > 0 then ts / tc::double precision end,
               (select avg(v) from unnest(fr) v),
               case when nn > 0 then nns / nn::double precision end,
               case when withc > 0 then full_ / withc::double precision end];
end $f$;

-- Cohen's kappa on integer grades with the labels in order: 1 - sum w O /
-- sum w E, w 0 on the diagonal and 1 off it (none), |i - j| (linear) or
-- (i - j)^2 (quadratic). Returns [kappa, observed agreement, observed
-- weighted disagreement].
create or replace function pg_temp.d5_kappa(a int[], b int[], labels int[], weights text) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  m int := array_length(labels, 1); n int := array_length(a, 1); i int; j int; w double precision;
  o double precision; rw double precision; cl double precision; num double precision := 0; den double precision := 0;
  agree double precision := 0;
begin
  for i in 1 .. m loop
    for j in 1 .. m loop
      w := case when weights = 'none' then (case when i = j then 0 else 1 end)
                when weights = 'linear' then abs(i - j) else (i - j) ^ 2 end;
      select count(*) into o from generate_series(1, n) k where a[k] = labels[i] and b[k] = labels[j];
      select count(*) into rw from unnest(a) x where x = labels[i];
      select count(*) into cl from unnest(b) x where x = labels[j];
      num := num + w * o; den := den + (w * rw * cl) / n;
      if i = j then agree := agree + o; end if;
    end loop;
  end loop;
  return array[1 - num / den, agree / n, num / n];
end $f$;

-- Calibration at m equal-width bins. rule 'engine': p is in bin i when
-- i/m <= p < (i+1)/m, the edges as computed in double precision, 1 in the
-- last bin; rule 'library': a probability exactly on an interior edge goes to
-- the LOWER bin. Returns [Brier, REL, RES, UNC, WBV, WBC, ECE], WBC = 2 sum
-- (y - observed_k)(p - mean p_k) / N as Stephenson, Coelho and Jolliffe
-- (2008) label it in their eq. 7.
create or replace function pg_temp.d5_cal(y int[], p double precision[], m int, rule text) returns double precision[]
language plpgsql immutable as $f$
#variable_conflict use_column
declare
  n int := array_length(y, 1); bin int[] := '{}'; i int; k int; e int; ob double precision; brier double precision := 0;
  rel double precision := 0; res double precision := 0; wbv double precision := 0; wbc double precision := 0; ece double precision := 0;
  nk int; pk double precision; ok double precision;
begin
  for i in 1 .. n loop
    k := least(m - 1, floor(p[i] * m)::int);
    if rule = 'engine' then
      if k > 0 and p[i] < k / m::double precision then k := k - 1;
      elsif k < m - 1 and p[i] >= (k + 1) / m::double precision then k := k + 1; end if;
    else
      for e in 1 .. m - 1 loop if p[i] = e / m::double precision then k := e - 1; end if; end loop;
    end if;
    bin := bin || k;
    brier := brier + (p[i] - y[i]) ^ 2;
  end loop;
  brier := brier / n;
  ob := (select avg(v::double precision) from unnest(y) v);
  for k in 0 .. m - 1 loop
    select count(*), avg(p[i2]), avg(y[i2]::double precision) into nk, pk, ok from generate_series(1, n) i2 where bin[i2] = k;
    continue when nk = 0;
    rel := rel + nk * (pk - ok) ^ 2; res := res + nk * (ok - ob) ^ 2; ece := ece + (nk / n::double precision) * abs(ok - pk);
    wbv := wbv + (select sum((p[i2] - pk) ^ 2) from generate_series(1, n) i2 where bin[i2] = k);
    wbc := wbc + (select sum((y[i2] - ok) * (p[i2] - pk)) from generate_series(1, n) i2 where bin[i2] = k);
  end loop;
  return array[brier, rel / n, res / n, ob * (1 - ob), wbv / n, (2 * wbc) / n, ece];
end $f$;
