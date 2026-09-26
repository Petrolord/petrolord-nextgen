-- ============================================================================
-- D5 GO-LIVE (HELD): Applied AI and Language Models flips to 'available', the
-- FIFTH course of the Data & AI module, at path_order 70.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/appliedai. The 78 lessons, the teaching lab
-- (evaluateLab.js), its three explorer panels and the three capstone case
-- files ship in the ZIP and NOT in this database, so a flip before the upload
-- puts a live catalogue tile in front of a route that does not exist. This
-- file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values d5_capstone.mjs returned through
--      the vendored engines/dataai/evaluate.js when this file was generated,
--      to the last bit, so a capstone row an earlier seed left behind, or a
--      move of one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the data in the case files: tokens, BM25
--      (Lucene idf) and TF-IDF (scikit-learn's smoothed idf) from their
--      published forms, the capstone runs re-retrieved and refused unless
--      they equal the lists the case files hand the learner, the retrieval
--      metrics from their definitions, SQuAD token F1, the extraction
--      outcomes, the paired bootstrap on the mulberry32 stream rebuilt in
--      64-bit integer arithmetic with the lib/stats quantile rule, the claim
--      grammar with the cited-and-retrieved support rule, Cohen's kappa, and
--      the Brier score with its Murphy terms (WBC as Stephenson, Coelho and
--      Jolliffe 2008 label it in their eq. 7, twice the pooled within-bin
--      covariance), each to 1e-9 relative;
--   3. by the TRAPS the course is built on, each of which must bite on these
--      inputs: the reading a learner who missed the lesson would give is
--      computed and refused if it lands within the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
-- The claim grammar uses regexp_instr and regexp_substr (PostgreSQL 15+).
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

do $$
#variable_conflict use_column
declare
  v_structures int; v_questions int; v_capstones int; v_lessons int;
  v_modules int; v_graded int; v_available int; v_soon int; v_n int; i int;
  v_names text; v_prompt text; v_s double precision; v_wrong double precision;
  v_r double precision[]; v_c double precision[]; v_k double precision[]; v_run jsonb; v_rp jsonb; v_rq jsonb;
  v_dp double precision[]; v_dq double precision[]; v_df double precision;
  v_g_orlu_bm25_idf_pressure double precision;
  v_g_orlu_o1_bm25_top_score double precision;
  v_g_orlu_o4_tfidf_top_cosine double precision;
  v_g_orlu_bm25_mean_recall_at4 double precision;
  v_g_orlu_bm25_mrr_at4 double precision;
  v_g_orlu_answers_supported_fraction double precision;
  v_g_nnewi_p_map_at5_grade2 double precision;
  v_g_nnewi_q_ndcg_at5_exponential double precision;
  v_g_nnewi_short_mean_token_f1 double precision;
  v_g_nnewi_extraction_macro_f1 double precision;
  v_g_nnewi_paired_ndcg_upper double precision;
  v_g_nnewi_q_supported_fraction double precision;
  v_g_awka_kappa_unweighted double precision;
  v_g_awka_kappa_linear double precision;
  v_g_awka_brier double precision;
  v_g_awka_reliability_bins8 double precision;
  v_g_awka_resolution_bins8 double precision;
  v_g_awka_wbc_bins8 double precision;
  v_or_ids text[] := array['ORL-01', 'ORL-02', 'ORL-03', 'ORL-04', 'ORL-05', 'ORL-06', 'ORL-07', 'ORL-08', 'ORL-09', 'ORL-10', 'ORL-11', 'ORL-12', 'ORL-13', 'ORL-14', 'ORL-15', 'ORL-16', 'ORL-17', 'ORL-18', 'ORL-19', 'ORL-20', 'ORL-21', 'ORL-22']::text[];
  v_or_tx text[] := array['Static pressure survey on 2021-01-01: average reservoir pressure 2,783 psia at the 1560 m TVD datum, down from 3200 psia initial. Cumulative field oil at the survey was 99,595 stb.', 'Ekene-6 end of well summary. Top of the Ekene Sand at 1546 m TVD and base at 1580 m TVD, 34 m of gross sand, with the top above the 1560 m TVD oil-water contact. The well was completed as an oil producer and came on stream on 2020-09-01 at 90 bopd.', 'Static pressure survey on 2022-01-01: average reservoir pressure 2,378 psia at the 1560 m TVD datum, down from 3200 psia initial. Cumulative field oil at the survey was 195,408 stb.', 'Voidage replacement ratio target: 0.85 in the first month of injection, rising by 0.04 a month to 1.05 from the sixth month. Cumulative VRR at the end of 2025 is 1.035.', 'Year end report 2025-12-01. Ekene-6 24.0 bopd at 45.0 percent water cut; Ekene-3 26.6 bopd at 25.0 percent; Ekene-1 29.4 bopd at 8.0 percent; Ekene-5 38.5 bopd, still water free.', 'Water breakthrough at Ekene-1 dated 2025-06-01, the last of the three flooded producers. Oil 34.0 bopd. Ekene-6 water cut is now 23.0 percent.', 'Rates on 2023-01-01, the first day of injection: Ekene-1 32.2 bopd, Ekene-3 36.2 bopd, Ekene-5 41.4 bopd and Ekene-6 42.7 bopd, no water.', 'Field report 2025-01-01. Ekene-6 44.1 bopd with 5.0 bwpd, a water cut of 10.2 percent. Ekene-3 39.1 bopd with 0.7 bwpd. Ekene-1 35.9 bopd and Ekene-5 43.2 bopd, both water free.', 'Static pressure survey on 2023-01-01: average reservoir pressure 2,096 psia at the datum, close to the 2000 psia bubble point, with cumulative field oil of 261,475 stb. The waterflood started the same day to hold pressure above the bubble point.', 'Field morning report 2021-01-01. Ekene-1 77.3 bopd, Ekene-3 87.9 bopd, Ekene-5 75.7 bopd and Ekene-6 79.9 bopd. All four producers are water free and declining as expected under primary depletion.', 'Primary decline fits: Ekene-1 exponential with Di 0.0012 per day; Ekene-3 hyperbolic with b 0.5 and Di 0.002 per day; Ekene-5 harmonic with Di 0.0015 per day; Ekene-6 hyperbolic with b 0.35 and Di 0.001 per day.', 'Produced water from the flooded producers passes a hydrocyclone and a degasser. Oil in water measured 25 mg/l on 2025-04-08 against the 40 mg/l discharge limit.', 'Injection started on 2023-01-01. Ekene-2 took 92.7 bwpd at a wellhead pressure of 2,235 psi and Ekene-4 took 61.8 bwpd at 2,174 psi, a 60 to 40 split.', 'Static pressure survey on 2022-07-01: average reservoir pressure 2,226 psia at the 1560 m TVD datum, down from 3200 psia initial. Cumulative field oil at the survey was 230,985 stb.', 'The test separator on the Ekene platform operates at 150 psig and 120 F. It was recalibrated on 2021-08-03 and the oil meter factor set to 0.998.', 'Pressure surveys under the flood: 2,098 psia on 2024-02-01 and 2,119 psia on 2025-08-01. Pressure is recovering slowly with the voidage replacement ratio held at 1.05.', 'Static pressure survey on 2020-07-01: average reservoir pressure 3,038 psia at the 1560 m TVD datum, down from 3200 psia initial. Cumulative field oil at the survey was 38,864 stb.', 'Ekene-3 end of well summary. Top of the Ekene Sand at 1541 m TVD and base at 1570 m TVD, 29 m of gross sand, with the top above the 1560 m TVD oil-water contact. The well was completed as an oil producer and came on stream on 2020-03-01 at 150 bopd.', 'Water breakthrough at Ekene-6 dated 2024-03-01, the first producer to see injected water. Oil rate 54.7 bopd. Water sampling started to confirm injection water chemistry.', 'Minor diesel spill of 0.5 bbl on deck during bunkering on 2022-08-09. It was contained in the drip trays and cleaned up with absorbent pads, with no discharge to sea. The bunkering hose coupling was replaced.', 'Water breakthrough at Ekene-3 dated 2024-09-01, with oil at 41.5 bopd. Ekene-6 water cut has reached 3.7 percent.', 'Well test Ekene-3 on 2022-06-01: 45.2 bopd through the test separator over 12 hours, GOR 400 scf/stb, no water.']::text[];
  v_or_qids text[] := array['O1', 'O2', 'O3', 'O4', 'O5']::text[];
  v_or_qtx text[] := array['water cut reported for Ekene-6 at the close of 2025', 'pressure in the reservoir when water injection started', 'first day oil rate of Ekene-3', 'discharge limit for oil in produced water', 'voidage replacement target during injection']::text[];
  v_or_j jsonb := '{"O1":{"ORL-02":0,"ORL-04":0,"ORL-05":3,"ORL-06":1,"ORL-08":1,"ORL-19":1,"ORL-21":1},"O2":{"ORL-01":1,"ORL-03":1,"ORL-07":1,"ORL-09":3,"ORL-13":1,"ORL-14":1,"ORL-16":1,"ORL-17":1},"O3":{"ORL-10":1,"ORL-11":1,"ORL-17":0,"ORL-18":3,"ORL-21":1,"ORL-22":1},"O4":{"ORL-12":3,"ORL-19":0,"ORL-20":1},"O5":{"ORL-04":3,"ORL-13":1,"ORL-16":2}}'::jsonb;
  v_or_ans jsonb := '[{"query":"O1","text":"Ekene-6 water cut was 45.0 percent on 2025-12-01 with oil at 24.0 bopd, up from 23.0 percent at mid-year.","citations":["ORL-05"]},{"query":"O2","text":"Average reservoir pressure was 2,096 psia on 2023-01-01, just above the 2000 psia bubble point, after 261,475 stb of field oil.","citations":["ORL-09"]},{"query":"O3","text":"Ekene-3 came on stream on 2020-03-01 at 150 bopd with a GOR of 400 scf/stb, from 29 m of gross sand below a 1541 m TVD top.","citations":["ORL-18"]},{"query":"O4","text":"The discharge limit is 40 mg/l; the 2025-04-08 sample read 25 mg/l, under the 30 mg/l action level.","citations":["ORL-12"]},{"query":"O5","text":"The VRR target was 0.85 in the first month of injection and 1.05 from the sixth, with the injection split 60 to 40 between Ekene-2 and Ekene-4.","citations":["ORL-04","ORL-13"]}]'::jsonb;
  v_or_ret jsonb := '{"O1":["ORL-06","ORL-05","ORL-08","ORL-21"],"O2":["ORL-19","ORL-09","ORL-13","ORL-04"],"O3":["ORL-07","ORL-19","ORL-11","ORL-18"],"O4":["ORL-12","ORL-20","ORL-04","ORL-19"],"O5":["ORL-04","ORL-16","ORL-20","ORL-19"]}'::jsonb;
  v_nn_ids text[] := array['NNW-01', 'NNW-02', 'NNW-03', 'NNW-04', 'NNW-05', 'NNW-06', 'NNW-07', 'NNW-08', 'NNW-09', 'NNW-10', 'NNW-11', 'NNW-12', 'NNW-13', 'NNW-14', 'NNW-15', 'NNW-16', 'NNW-17', 'NNW-18', 'NNW-19', 'NNW-20', 'NNW-21', 'NNW-22', 'NNW-23', 'NNW-24', 'NNW-25', 'NNW-26', 'NNW-27', 'NNW-28', 'NNW-29', 'NNW-30', 'NNW-31', 'NNW-32', 'NNW-33', 'NNW-34', 'NNW-35', 'NNW-36', 'NNW-37', 'NNW-38', 'NNW-39', 'NNW-40', 'NNW-41', 'NNW-42', 'NNW-43', 'NNW-44', 'NNW-45']::text[];
  v_nn_tx text[] := array['Ekene-5 daily drilling report 2020-04-11. Pulled the 12.25 in bit at 1760 m MD after 310 m at an average rate of penetration of 14 m/hr. Bit graded 2-3-WT. Mud weight 12.4 ppg.', 'Voidage replacement ratio target: 0.85 in the first month of injection, rising by 0.04 a month to 1.05 from the sixth month. Cumulative VRR at the end of 2025 is 1.035.', 'Injection started on 2023-01-01. Ekene-2 took 92.7 bwpd at a wellhead pressure of 2,235 psi and Ekene-4 took 61.8 bwpd at 2,174 psi, a 60 to 40 split.', 'Water breakthrough at Ekene-6 dated 2024-03-01, the first producer to see injected water. Oil rate 54.7 bopd. Water sampling started to confirm injection water chemistry.', 'Field report 2025-01-01. Ekene-6 44.1 bopd with 5.0 bwpd, a water cut of 10.2 percent. Ekene-3 39.1 bopd with 0.7 bwpd. Ekene-1 35.9 bopd and Ekene-5 43.2 bopd, both water free.', 'Ekene-3 drilling report 2019-11-20. Background gas 0.4 percent and connection gas 1.2 percent while drilling the Ekene Sand at 1550 m MD. Mud weight held at 12.4 ppg; no influx.', 'Ekene-4 daily drilling report 2020-10-09. Partial losses of 15 bbl/hr at 1612 m MD while drilling with 12.6 ppg mud. Pumped a 40 bbl lost circulation material pill and losses stopped.', 'Well test Ekene-3 on 2022-06-01: 45.2 bopd through the test separator over 12 hours, GOR 400 scf/stb, no water.', 'Ekene-4 injectivity index fell from 0.5 to 0.35 bbl/d/psi from 2025-01-01, seen as a kink in the Hall plot slope. On 2025-01-01 it took 83.7 bwpd at 2,289 psi wellhead pressure.', 'Water breakthrough at Ekene-1 dated 2025-06-01, the last of the three flooded producers. Oil 34.0 bopd. Ekene-6 water cut is now 23.0 percent.', 'Static pressure survey on 2020-07-01: average reservoir pressure 3,038 psia at the 1560 m TVD datum, down from 3200 psia initial. Cumulative field oil at the survey was 38,864 stb.', 'Pressure surveys under the flood: 2,098 psia on 2024-02-01 and 2,119 psia on 2025-08-01. Pressure is recovering slowly with the voidage replacement ratio held at 1.05.', 'Corey relative permeability for the Ekene Sand: connate water saturation 0.35, residual oil 0.25, krw end point 0.3 and kro end point 0.9, water exponent 2.5 and oil exponent 2. With oil viscosity 1.8 cp and water viscosity 0.5 cp the end-point mobility ratio is 1.2.', 'Ekene-6 is the first producer to respond to injection: 47.7 bopd on 2023-06-01 against 42.7 bopd at flood start, about 3 months after injection began.', 'Ekene-6 daily drilling report 2020-07-18. Drilled 12.25 in hole from 1450 m to 1800 m MD with 12.4 ppg mud. Ran and cemented 9.625 in casing with the shoe at 1800 m MD. No losses.', 'Injection on 2024-03-01: Ekene-2 139.3 bwpd at 2,329 psi wellhead pressure and Ekene-4 92.8 bwpd at 2,236 psi.', 'Year end report 2025-12-01. Ekene-6 24.0 bopd at 45.0 percent water cut; Ekene-3 26.6 bopd at 25.0 percent; Ekene-1 29.4 bopd at 8.0 percent; Ekene-5 38.5 bopd, still water free.', 'Ekene-2 end of well summary. Top of the Ekene Sand at 1565 m TVD and base at 1601 m TVD. The sand was found below the 1560 m TVD oil-water contact and is water bearing, so the well was suspended. It was converted to a water injector for the waterflood that started on 2023-01-01.', 'Associated gas at 400 scf/stb is used as fuel gas for the power generators. Gas beyond the fuel demand is flared under the platform flaring consent.', 'Ekene reservoir fluid summary. Stock tank oil gravity 32 API, reservoir temperature 180 F, bubble point 2000 psia and solution gas oil ratio 400 scf/stb. Boi is 1.2 rb/stb at the initial pressure of 3200 psia, where the oil viscosity is 2.05 cp.', 'Ekene-3 daily drilling report 2019-11-02. Drilled 17.5 in hole to 1450 m MD with 10.5 ppg mud and set 13.375 in casing at 1450 m MD, above the Ogbia Shale pressure ramp.', 'Produced water from the flooded producers passes a hydrocyclone and a degasser. Oil in water measured 25 mg/l on 2025-04-08 against the 40 mg/l discharge limit.', 'Ekene-4 end of well summary. Top of the Ekene Sand at 1590 m TVD and base at 1615 m TVD. The sand was found below the 1560 m TVD oil-water contact and is water bearing, so the well was suspended. It was converted to a water injector for the waterflood that started on 2023-01-01.', 'Core plug EK1-P from Ekene-1: permeability 420 md and porosity 0.23, with an air-brine capillary pressure test. The reservoir average permeability used for modelling is 250 md.', 'Stratigraphic tops at Ekene-1 in m MD below KB: Benin Formation 350, Agbada Formation 1150, Ogbia Shale 1290, Ekene Sand 1548, Oboro Unconformity 1790, Oboro Sand 1845 and Akata Formation 2080. The Oboro Sand is the deeper gas target, with a gas-water contact at 1935 m MD at Ekene-1.', 'Laboratory oil formation volume factor: 1.19712 rb/stb at 3400 psia, 1.2 at 3200 psia, 1.20432 at 2900 psia, 1.20864 at 2600 psia and 1.21728 at 2000 psia, the bubble point. The solution gas oil ratio stays at 400 scf/stb above the bubble point.', 'Volumetric STOIIP for the Ekene Sand is 12,139,208 stb, from net to gross 0.8, porosity 0.2, initial water saturation 0.35 and Boi 1.2 rb/stb over 169 oil cells of 100 m. Material balance on the primary history returns the same 12,139,208 stb.', 'Field morning report 2021-01-01. Ekene-1 77.3 bopd, Ekene-3 87.9 bopd, Ekene-5 75.7 bopd and Ekene-6 79.9 bopd. All four producers are water free and declining as expected under primary depletion.', 'Ekene-3 end of well summary. Top of the Ekene Sand at 1541 m TVD and base at 1570 m TVD, 29 m of gross sand, with the top above the 1560 m TVD oil-water contact. The well was completed as an oil producer and came on stream on 2020-03-01 at 150 bopd.', 'Scale inhibitor squeeze planned at Ekene-6 after water breakthrough. Continuous downhole dosing started on 2024-04-02 at 20 ppm based on produced water rate.', 'Morning report 2020-04-01. Ekene-1 flowing at 107.6 bopd with no water. Producing GOR steady at 400 scf/stb, as expected above the bubble point.', 'Monthly H2S drill on 2022-05-06. Full muster at the lifeboat station in 7 minutes. Ekene produced gas has tested at 0 ppm H2S; the drill keeps the crew ready for the deeper Oboro gas.', 'Water breakthrough at Ekene-3 dated 2024-09-01, with oil at 41.5 bopd. Ekene-6 water cut has reached 3.7 percent.', 'Rates on 2023-01-01, the first day of injection: Ekene-1 32.2 bopd, Ekene-3 36.2 bopd, Ekene-5 41.4 bopd and Ekene-6 42.7 bopd, no water.', 'Near miss on 2021-03-14: a 2 kg wrench fell 6 m from the monkey board to the drill floor on the Ekene platform. Nobody was in the drop zone and there was no injury. Tool lanyards and the drop zone barrier rule were re-briefed at the next toolbox talk.', 'Primary decline fits: Ekene-1 exponential with Di 0.0012 per day; Ekene-3 hyperbolic with b 0.5 and Di 0.002 per day; Ekene-5 harmonic with Di 0.0015 per day; Ekene-6 hyperbolic with b 0.35 and Di 0.001 per day.', 'Permit to work audit on 2023-03-22: 48 permits reviewed, 3 findings, all for missing gas test records on hot work permits. Supervisors were re-briefed and a gas test column was added to the permit form.', 'Well test Ekene-5 on 2021-06-01: 64.6 bopd over 12 hours, GOR 400 scf/stb, no water. The rate sits on the harmonic decline trend.', 'Ekene-1 responded to the flood 5 months after injection began. Rate on 2023-10-01 was 38.2 bopd, up from 32.2 bopd in June.', 'Ekene-1 end of well summary. Top of the Ekene Sand at 1548 m TVD and base at 1580 m TVD, 32 m of gross sand, with the top above the 1560 m TVD oil-water contact. The well was completed as an oil producer and came on stream on 2020-01-01 at 120 bopd.', 'Injection pump A was overhauled on 2024-11-19 and returned to service. Injection filter change-out moved from monthly to fortnightly after solids were found upstream of the Ekene-4 wellhead.', 'Ekene-6 production 2022-10-01: 45.9 bopd, water free. Decline continues on trend. The well will be watched for response once injection starts at Ekene-2 and Ekene-4.', 'Ekene-5 has produced no water to date. It responded late to the flood, about 9 months after injection began, and the oil rate on 2025-12-01 was 38.5 bopd.', 'Minor diesel spill of 0.5 bbl on deck during bunkering on 2022-08-09. It was contained in the drip trays and cleaned up with absorbent pads, with no discharge to sea. The bunkering hose coupling was replaced.', 'EUR at the 10 bopd economic limit on primary decline alone: Ekene-1 91,667 stb, Ekene-3 111,270 stb, Ekene-5 153,506 stb and Ekene-6 105,267 stb. The flood adds to these.']::text[];
  v_nn_qids text[] := array['N1', 'N2', 'N3', 'N4', 'N5', 'N6', 'N7', 'N8']::text[];
  v_nn_qtx text[] := array['first oil rate at Ekene-3', 'wells turned into water injectors', 'date of water breakthrough at Ekene-6', 'injectivity index fall at Ekene-4', 'drilling fluid density in the Ekene Sand', 'decline model and Di fitted for Ekene-1', 'target voidage replacement ratio during the flood', 'permitted oil in water for overboard discharge']::text[];
  v_nn_j jsonb := '{"N1":{"NNW-01":0,"NNW-06":0,"NNW-08":1,"NNW-11":0,"NNW-20":0,"NNW-21":0,"NNW-27":0,"NNW-28":1,"NNW-29":3,"NNW-33":1,"NNW-36":1,"NNW-40":0},"N2":{"NNW-03":2,"NNW-04":0,"NNW-09":1,"NNW-16":1,"NNW-18":3,"NNW-23":3,"NNW-35":0,"NNW-37":0,"NNW-41":1},"N3":{"NNW-04":3,"NNW-08":0,"NNW-10":1,"NNW-14":0,"NNW-17":1,"NNW-30":2,"NNW-33":1},"N4":{"NNW-03":1,"NNW-06":0,"NNW-09":3,"NNW-16":1,"NNW-34":0,"NNW-36":0,"NNW-38":0,"NNW-41":2,"NNW-42":0,"NNW-45":0},"N5":{"NNW-01":1,"NNW-06":3,"NNW-07":2,"NNW-15":2,"NNW-18":0,"NNW-21":1,"NNW-23":0,"NNW-32":0,"NNW-35":0},"N6":{"NNW-05":0,"NNW-24":0,"NNW-26":0,"NNW-31":1,"NNW-36":3,"NNW-38":0,"NNW-42":0,"NNW-45":1},"N7":{"NNW-02":3,"NNW-03":1,"NNW-12":2,"NNW-13":0,"NNW-14":0,"NNW-25":0,"NNW-39":0,"NNW-43":0},"N8":{"NNW-04":0,"NNW-18":0,"NNW-19":0,"NNW-22":3,"NNW-30":0,"NNW-32":0,"NNW-43":0,"NNW-44":1}}'::jsonb;
  v_nn_p jsonb := '{"N1":["NNW-04","NNW-14","NNW-34","NNW-33","NNW-01"],"N2":["NNW-04","NNW-13","NNW-33","NNW-18","NNW-23"],"N3":["NNW-10","NNW-33","NNW-30","NNW-04","NNW-43"],"N4":["NNW-09","NNW-06","NNW-16","NNW-17","NNW-03"],"N5":["NNW-06","NNW-21","NNW-25","NNW-15","NNW-01"],"N6":["NNW-36","NNW-42","NNW-45","NNW-13","NNW-24"],"N7":["NNW-02","NNW-12","NNW-44","NNW-25","NNW-39"],"N8":["NNW-22","NNW-13","NNW-44","NNW-18","NNW-23"]}'::jsonb;
  v_nn_q jsonb := '{"N1":["NNW-04","NNW-33","NNW-34","NNW-14","NNW-43"],"N2":["NNW-04","NNW-33","NNW-10","NNW-30","NNW-18"],"N3":["NNW-33","NNW-10","NNW-04","NNW-30","NNW-43"],"N4":["NNW-09","NNW-06","NNW-16","NNW-17","NNW-42"],"N5":["NNW-06","NNW-21","NNW-15","NNW-25","NNW-20"],"N6":["NNW-36","NNW-42","NNW-45","NNW-38","NNW-13"],"N7":["NNW-02","NNW-12","NNW-44","NNW-39","NNW-43"],"N8":["NNW-22","NNW-13","NNW-44","NNW-18","NNW-23"]}'::jsonb;
  v_nn_sa text[] := array['150 bopd', 'Ekene 2 and Ekene 4', '2024-03-01', '0.35 bbl/d/psi', '12.6 ppg', 'exponential, Di 0.0012 per day', '0.85 rising by 0.04 a month to 1.05', '40 mg/l']::text[];
  v_nn_sr text[] := array['150 bopd', 'Ekene-2 and Ekene-4', '2024-03-01', 'from 0.5 to 0.35 bbl/d/psi', '12.4 ppg', 'exponential, Di 0.0012 per day', '0.85 rising to 1.05', '40 mg/l']::text[];
  v_nn_xf jsonb := '[{"name":"well","type":"text"},{"name":"date","type":"text"},{"name":"event","type":"text"},{"name":"oil_rate_bopd","type":"number","absTol":0.05},{"name":"water_cut_pct","type":"number","absTol":0.05},{"name":"reservoir_pressure_psia","type":"number","absTol":0.5}]'::jsonb;
  v_nn_xl jsonb := '[{"id":"NX-01","fields":{"well":"Ekene-3","date":"2020-03-01","event":"first oil","oil_rate_bopd":150}},{"id":"NX-02","fields":{"well":"Ekene-5","date":"2020-06-01","event":"first oil","oil_rate_bopd":100}},{"id":"NX-03","fields":{"well":"Ekene-6","date":"2020-09-01","event":"first oil","oil_rate_bopd":90}},{"id":"NX-04","fields":{"date":"2020-07-01","event":"pressure survey","reservoir_pressure_psia":3038}},{"id":"NX-05","fields":{"date":"2021-07-01","event":"pressure survey","reservoir_pressure_psia":2562}},{"id":"NX-06","fields":{"date":"2022-07-01","event":"pressure survey","reservoir_pressure_psia":2226}},{"id":"NX-07","fields":{"well":"Ekene-1","date":"2020-04-01","event":"production","oil_rate_bopd":107.6,"water_cut_pct":0}},{"id":"NX-08","fields":{"well":"Ekene-3","date":"2024-09-01","event":"water breakthrough","oil_rate_bopd":41.5}},{"id":"NX-09","fields":{"well":"Ekene-5","date":"2025-12-01","event":"production","oil_rate_bopd":38.5,"water_cut_pct":0}},{"id":"NX-10","fields":{"well":"Ekene-4","date":"2025-01-01","event":"injectivity decline"}},{"id":"NX-11","fields":{"well":"Ekene-6","date":"2020-07-18","event":"casing"}},{"id":"NX-12","fields":{"date":"2021-03-14","event":"near miss"}},{"id":"NX-13","fields":{"date":"2025-04-08","event":"water treatment"}},{"id":"NX-14","fields":{"well":"Ekene-1","event":"core plug"}}]'::jsonb;
  v_nn_xp jsonb := '[{"id":"NX-01","fields":{"well":"Ekene 3","date":"2020-03-01","event":"first oil","oil_rate_bopd":"150 bopd"}},{"id":"NX-02","fields":{"well":"Ekene 5","date":"2020-06-01","event":"first oil","oil_rate_bopd":100}},{"id":"NX-03","fields":{"well":"Ekene-6","date":"2020-09-01","event":"first oil","oil_rate_bopd":90}},{"id":"NX-04","fields":{"well":"Ekene-1","date":"2020-07-01","event":"pressure survey","reservoir_pressure_psia":3038}},{"id":"NX-05","fields":{"date":"2021-07-01","event":"pressure survey","reservoir_pressure_psia":2562}},{"id":"NX-06","fields":{"date":"2022-07-01","event":"pressure survey","reservoir_pressure_psia":2226}},{"id":"NX-07","fields":{"well":"Ekene-1","date":"2020-04-01","event":"production","oil_rate_bopd":107.6}},{"id":"NX-08","fields":{"well":"Ekene-3","date":"2024-09-01","event":"water breakthrough","oil_rate_bopd":41.5,"water_cut_pct":3.7}},{"id":"NX-09","fields":{"well":"Ekene-5","date":"2025-12-01","event":"production","oil_rate_bopd":38.5,"water_cut_pct":0}},{"id":"NX-10","fields":{"well":"Ekene-4","date":"2025-01-01","event":"injectivity decline"}},{"id":"NX-11","fields":{"well":"Ekene-6","date":"2020-07-18","event":"casing run"}},{"id":"NX-12","fields":{"date":"2021-03-14","event":"the near miss"}},{"id":"NX-13","fields":{"date":"2025-04-08","event":"water treatment"}}]'::jsonb;
  v_nn_ans jsonb := '[{"query":"N1","text":"Ekene-3 started at 150 bopd on 2020-03-01.","citations":["NNW-29"]},{"query":"N2","text":"Ekene-2 and Ekene-4 were converted to injectors, taking 92.7 and 61.8 bwpd at start-up.","citations":["NNW-18","NNW-23"]},{"query":"N3","text":"Water broke through at Ekene-6 on 2024-09-01.","citations":["NNW-33"]},{"query":"N4","text":"Ekene-4 injectivity index fell to 0.35 bbl/d/psi, seen as a \"kink in the Hall plot slope\".","citations":["NNW-09"]},{"query":"N5","text":"Mud weight in the Ekene Sand was 12.6 ppg.","citations":["NNW-06"]},{"query":"N6","text":"Ekene-1 declines exponentially with Di 0.0012 per day.","citations":["NNW-36"]},{"query":"N7","text":"The VRR target is 1.05, reached from the sixth month.","citations":["NNW-12"]},{"query":"N8","text":"Oil in water must stay below 40 mg/l.","citations":["NNW-22"]}]'::jsonb;
  v_aw_a int[] := array[0, 3, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 2, 0, 0, 0, 1, 3, 1, 0, 3, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 3, 1, 3, 2, 1, 0, 0, 0, 3, 0, 1, 1, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 0, 2, 0, 1, 1, 0, 3, 1, 1, 0, 3, 2, 1, 3, 1, 3, 1, 0, 1, 3, 0]::int[];
  v_aw_b int[] := array[0, 3, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 3, 1, 1, 0, 1, 3, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 3, 1, 3, 2, 1, 0, 1, 0, 3, 0, 2, 1, 1, 0, 0, 0, 1, 3, 2, 0, 0, 1, 0, 0, 0, 1, 2, 1, 0, 0, 1, 0, 0, 0, 1, 0, 2, 0, 3, 0, 3, 1, 0, 3, 1, 1, 0, 3, 2, 1, 3, 1, 3, 0, 0, 1, 3, 0]::int[];
  v_aw_y int[] := array[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0]::int[];
  v_aw_p double precision[] := array[0.67, 0.6, 0.6, 0.93, 0.18, 0.05, 0.25, 0.35, 0.4, 0.15, 0.12, 0.12, 0.11, 0.12, 0.52, 0.45, 0.45, 0.05, 0.25, 0.2, 0.05, 0.4, 0.17, 0.91, 0.84, 0.08, 0.98, 0.68, 0.14, 0.11, 0.29, 0.32, 0.28, 0.32, 0.3, 0.56, 0.56, 0.54, 0.56, 0.33, 0.1, 0.21, 0.37, 0.95, 0.25, 0.06, 0.2, 0.26, 0.21, 0.25, 0.29, 0.08, 0.99, 0.09, 0.05, 0.3, 0.34, 0.35, 0.87, 0.4, 0.24, 1.0, 0.57, 0.25, 0.32, 0.75, 0.86, 0.95, 0.25, 0.25, 0.23, 0.19, 0.37, 0.12, 0.11, 0.14, 0.26, 0.26, 0.33, 0.38, 0.41, 0.05, 0.98, 0.85, 0.85, 0.85, 0.85, 0.53, 0.99, 0.22, 0.99, 0.32, 0.12, 0.24, 0.21, 1.0, 0.27, 0.45, 0.4, 0.13, 0.4, 0.12, 0.05, 0.06, 0.36, 0.92, 0.36, 0.44, 0.69, 0.71, 0.69, 0.71, 0.99, 0.68, 0.11, 0.34, 0.99, 0.47, 0.37, 0.19, 0.11, 0.13]::double precision[];
  v_aw_l int[] := array[0, 1, 2, 3]::int[];
begin

  -- ---------------------------------------------------------------- shape
  select count(*) into v_structures from public.academy_course_structures where app_slug = 'appliedai' and active;
  if v_structures <> 3 then
    raise exception 'D5 go-live refused: appliedai has % active deep structures, expected 3', v_structures;
  end if;
  select count(*) into v_questions from public.academy_quiz_questions where app_slug = 'appliedai';
  if v_questions <> 396 then
    raise exception 'D5 go-live refused: appliedai has % quiz questions, expected 396', v_questions;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'appliedai' group by tier having count(*) <> 132) t;
  if v_n <> 0 then
    raise exception 'D5 go-live refused: % tier(s) do not carry exactly 132 questions', v_n;
  end if;
  select count(*) into v_n from (select tier, module_key from public.academy_quiz_questions where app_slug = 'appliedai' and scope = 'module' group by tier, module_key having count(*) <> 15) t;
  if v_n <> 0 then
    raise exception 'D5 go-live refused: % module bank(s) do not carry exactly 15 questions', v_n;
  end if;
  select count(*) into v_n from (select tier from public.academy_quiz_questions where app_slug = 'appliedai' and scope = 'final' group by tier having count(*) <> 42) t;
  if v_n <> 0 then
    raise exception 'D5 go-live refused: % final exam(s) do not carry exactly 42 questions', v_n;
  end if;
  select count(*) into v_n from public.academy_quiz_questions where app_slug = 'appliedai'
     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);
  if v_n <> 0 then
    raise exception 'D5 go-live refused: % question(s) do not offer four options with a key inside them', v_n;
  end if;
  select count(*) into v_lessons from public.academy_course_structures s,
         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk
   where s.app_slug = 'appliedai' and s.active;
  if v_lessons <> 78 then
    raise exception 'D5 go-live refused: appliedai carries % lesson keys, expected 78', v_lessons;
  end if;
  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
   where s.app_slug = 'appliedai' and s.active;
  if v_modules <> 18 then
    raise exception 'D5 go-live refused: appliedai carries % modules, expected 18 (six per tier)', v_modules;
  end if;
  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq
     where qq.app_slug = 'appliedai' and qq.scope = 'module' and not exists (
       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m
        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;
  if v_n <> 0 then
    raise exception 'D5 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;
  end if;
  select count(*) into v_capstones from public.academy_capstones where app_slug = 'appliedai';
  if v_capstones <> 3 then
    raise exception 'D5 go-live refused: appliedai has % capstones, expected 3', v_capstones;
  end if;
  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'appliedai';
  if v_graded <> 18 then
    raise exception 'D5 go-live refused: appliedai has % graded capstone fields, expected 18', v_graded;
  end if;
  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'appliedai' group by c.tier having count(*) <> 6) t;
  if v_n <> 0 then
    raise exception 'D5 go-live refused: % tier(s) do not grade exactly six fields', v_n;
  end if;
  if not exists (select 1 from public.academy_apps where slug = 'appliedai' and module = 'data_ai' and path_order = 70 and prereq_slug is null) then
    raise exception 'D5 go-live refused: the appliedai catalogue row is not data_ai at path_order 70 with no prerequisite';
  end if;
  if exists (select 1 from public.academy_apps where path_order = 70 and slug <> 'appliedai') then
    raise exception 'D5 go-live refused: another course already holds path_order 70';
  end if;

  -- ------------------------------------------------- the grader is numeric
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai'
     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'
          or abs((f->>'expected')::numeric) <= 0.001
          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001
          or (f->>'tol')::numeric is distinct from (select t.tol from (values ('beginner', 'orlu_bm25_idf_pressure', 5e-07::numeric), ('beginner', 'orlu_o1_bm25_top_score', 5e-07::numeric), ('beginner', 'orlu_o4_tfidf_top_cosine', 5e-07::numeric), ('beginner', 'orlu_bm25_mean_recall_at4', 5e-07::numeric), ('beginner', 'orlu_bm25_mrr_at4', 5e-07::numeric), ('beginner', 'orlu_answers_supported_fraction', 5e-07::numeric), ('intermediate', 'nnewi_p_map_at5_grade2', 5e-07::numeric), ('intermediate', 'nnewi_q_ndcg_at5_exponential', 5e-07::numeric), ('intermediate', 'nnewi_short_mean_token_f1', 5e-07::numeric), ('intermediate', 'nnewi_extraction_macro_f1', 5e-07::numeric), ('intermediate', 'nnewi_paired_ndcg_upper', 5e-07::numeric), ('intermediate', 'nnewi_q_supported_fraction', 5e-07::numeric), ('advanced', 'awka_kappa_unweighted', 5e-07::numeric), ('advanced', 'awka_kappa_linear', 5e-07::numeric), ('advanced', 'awka_brier', 5e-07::numeric), ('advanced', 'awka_reliability_bins8', 5e-07::numeric), ('advanced', 'awka_resolution_bins8', 5e-07::numeric), ('advanced', 'awka_wbc_bins8', 5e-07::numeric)) t(tier, k, tol) where t.tier = c.tier and t.k = f->>'key')
          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');
  if v_n <> 0 then
    raise exception 'D5 go-live refused: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;
  end if;
  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai'
     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric
          or ((f->>'tol')::numeric = 0.0000005
              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric
                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));
  if v_n <> 0 then
    raise exception 'D5 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or, at the six-decimal floor, pass one a unit off in the sixth decimal: %', v_n, v_names;
  end if;

  -- ---------------------------------------- the prompts the learner reads
  select prompt into v_prompt from public.academy_capstones where app_slug = 'appliedai' and tier = 'beginner';
  if v_prompt is null or md5(v_prompt) <> '3ecdc7d832f564273b76dd7f9eef0ff7' then
    raise exception 'D5 go-live refused: the beginner prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'appliedai' and tier = 'beginner'
                    and cert_tier = 'associate' and dataset = 'ORLU, 22 passages, 5 queries and their cited answers' and title = 'Retrieving passages and checking cited answers') then
    raise exception 'D5 go-live refused: the beginner capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['BM25 with k1 1.2 and b 0.75', 'cutoff k 4', 'relevant at grade 1 or more', 'numericRelTol 0', 'the stop list off', 'TF-IDF with raw counts', '"pressure"', 'query O1', 'query O4', 'cites and retrieved', 'orlu_case.json']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D5 go-live refused: % stated setting(s) or case file(s) are not named in the shipped beginner prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'appliedai' and tier = 'intermediate';
  if v_prompt is null or md5(v_prompt) <> 'add8fe9e306de6ac200b17830b4da669' then
    raise exception 'D5 go-live refused: the intermediate prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'appliedai' and tier = 'intermediate'
                    and cert_tier = 'professional' and dataset = 'NNEWI, 45 passages, 8 queries and two fixed systems' and title = 'Scoring retrieval and answers honestly') then
    raise exception 'D5 go-live refused: the intermediate capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['cut at 5', 'BM25 with k1 1.5 and b 0.5', 'sublinear tf on', 'relevant at grade 2 or more', 'exponential gain', 'seed 44, 2000 replicates, level 0.95', 'paired bootstrap', 'P minus Q', 'numericRelTol 0', 'Q''s run for that query', 'nnewi_case.json']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D5 go-live refused: % stated setting(s) or case file(s) are not named in the shipped intermediate prompt: %', v_n, v_names;
  end if;
  select prompt into v_prompt from public.academy_capstones where app_slug = 'appliedai' and tier = 'advanced';
  if v_prompt is null or md5(v_prompt) <> '2aeee9055559dfbc39fca5788c1578b3' then
    raise exception 'D5 go-live refused: the advanced prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);
  end if;
  if not exists (select 1 from public.academy_capstones where app_slug = 'appliedai' and tier = 'advanced'
                    and cert_tier = 'expert' and dataset = 'AWKA, 96 rating pairs and 122 calibration rows' and title = 'Agreement and calibration') then
    raise exception 'D5 go-live refused: the advanced capstone does not carry the certificate tier, dataset and title gen_course.py rendered';
  end if;
  select count(*), string_agg(l, ' / ') into v_n, v_names
    from unnest(array['unweighted, with the labels 0, 1, 2 and 3', 'linear weights', '8 equal-width bins', 'an interior edge opens the upper bin', '1 closes the last bin', 'eq. 7', 'twice the pooled within-bin covariance', 'awka_case.json']) l where strpos(v_prompt, l) = 0;
  if v_n <> 0 then
    raise exception 'D5 go-live refused: % stated setting(s) or case file(s) are not named in the shipped advanced prompt: %', v_n, v_names;
  end if;
  -- No number handed in any capstone text of this course may sit within its
  -- tolerance of any graded value of any tier.
  select count(*), string_agg(g.ftier || '/' || g.k || ' in the ' || h.ctier || ' capstone text', ', ') into v_n, v_names
    from (select c.tier as ctier, m[1]::double precision as x
            from public.academy_capstones c,
                 lateral regexp_matches(c.prompt || ' ' || c.dataset || ' ' || c.title || ' ' ||
                   (select string_agg((f->>'label') || ' ' || (f->>'unit'), ' ') from jsonb_array_elements(c.fields) f),
                   '(-?[0-9]+(?:[.][0-9]+)?)', 'g') m
           where c.app_slug = 'appliedai') h,
         (select c.tier as ftier, f->>'key' as k, (f->>'expected')::double precision as v, (f->>'tol')::double precision as t
            from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = 'appliedai') g
   where abs(abs(h.x) - abs(g.v)) <= g.t;
  if v_n <> 0 then
    raise exception 'D5 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;
  end if;

  -- --------------------------------------- the eighteen graded values
  select (f->>'expected')::double precision into v_g_orlu_bm25_idf_pressure
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'beginner' and f->>'key' = 'orlu_bm25_idf_pressure';
  if v_g_orlu_bm25_idf_pressure is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: beginner/orlu_bm25_idf_pressure]';
  end if;
  select (f->>'expected')::double precision into v_g_orlu_o1_bm25_top_score
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'beginner' and f->>'key' = 'orlu_o1_bm25_top_score';
  if v_g_orlu_o1_bm25_top_score is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: beginner/orlu_o1_bm25_top_score]';
  end if;
  select (f->>'expected')::double precision into v_g_orlu_o4_tfidf_top_cosine
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'beginner' and f->>'key' = 'orlu_o4_tfidf_top_cosine';
  if v_g_orlu_o4_tfidf_top_cosine is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: beginner/orlu_o4_tfidf_top_cosine]';
  end if;
  select (f->>'expected')::double precision into v_g_orlu_bm25_mean_recall_at4
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'beginner' and f->>'key' = 'orlu_bm25_mean_recall_at4';
  if v_g_orlu_bm25_mean_recall_at4 is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: beginner/orlu_bm25_mean_recall_at4]';
  end if;
  select (f->>'expected')::double precision into v_g_orlu_bm25_mrr_at4
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'beginner' and f->>'key' = 'orlu_bm25_mrr_at4';
  if v_g_orlu_bm25_mrr_at4 is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: beginner/orlu_bm25_mrr_at4]';
  end if;
  select (f->>'expected')::double precision into v_g_orlu_answers_supported_fraction
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'beginner' and f->>'key' = 'orlu_answers_supported_fraction';
  if v_g_orlu_answers_supported_fraction is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: beginner/orlu_answers_supported_fraction]';
  end if;
  select (f->>'expected')::double precision into v_g_nnewi_p_map_at5_grade2
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'intermediate' and f->>'key' = 'nnewi_p_map_at5_grade2';
  if v_g_nnewi_p_map_at5_grade2 is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: intermediate/nnewi_p_map_at5_grade2]';
  end if;
  select (f->>'expected')::double precision into v_g_nnewi_q_ndcg_at5_exponential
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'intermediate' and f->>'key' = 'nnewi_q_ndcg_at5_exponential';
  if v_g_nnewi_q_ndcg_at5_exponential is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: intermediate/nnewi_q_ndcg_at5_exponential]';
  end if;
  select (f->>'expected')::double precision into v_g_nnewi_short_mean_token_f1
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'intermediate' and f->>'key' = 'nnewi_short_mean_token_f1';
  if v_g_nnewi_short_mean_token_f1 is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: intermediate/nnewi_short_mean_token_f1]';
  end if;
  select (f->>'expected')::double precision into v_g_nnewi_extraction_macro_f1
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'intermediate' and f->>'key' = 'nnewi_extraction_macro_f1';
  if v_g_nnewi_extraction_macro_f1 is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: intermediate/nnewi_extraction_macro_f1]';
  end if;
  select (f->>'expected')::double precision into v_g_nnewi_paired_ndcg_upper
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'intermediate' and f->>'key' = 'nnewi_paired_ndcg_upper';
  if v_g_nnewi_paired_ndcg_upper is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: intermediate/nnewi_paired_ndcg_upper]';
  end if;
  select (f->>'expected')::double precision into v_g_nnewi_q_supported_fraction
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'intermediate' and f->>'key' = 'nnewi_q_supported_fraction';
  if v_g_nnewi_q_supported_fraction is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: intermediate/nnewi_q_supported_fraction]';
  end if;
  select (f->>'expected')::double precision into v_g_awka_kappa_unweighted
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'advanced' and f->>'key' = 'awka_kappa_unweighted';
  if v_g_awka_kappa_unweighted is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: advanced/awka_kappa_unweighted]';
  end if;
  select (f->>'expected')::double precision into v_g_awka_kappa_linear
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'advanced' and f->>'key' = 'awka_kappa_linear';
  if v_g_awka_kappa_linear is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: advanced/awka_kappa_linear]';
  end if;
  select (f->>'expected')::double precision into v_g_awka_brier
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'advanced' and f->>'key' = 'awka_brier';
  if v_g_awka_brier is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: advanced/awka_brier]';
  end if;
  select (f->>'expected')::double precision into v_g_awka_reliability_bins8
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'advanced' and f->>'key' = 'awka_reliability_bins8';
  if v_g_awka_reliability_bins8 is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: advanced/awka_reliability_bins8]';
  end if;
  select (f->>'expected')::double precision into v_g_awka_resolution_bins8
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'advanced' and f->>'key' = 'awka_resolution_bins8';
  if v_g_awka_resolution_bins8 is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: advanced/awka_resolution_bins8]';
  end if;
  select (f->>'expected')::double precision into v_g_awka_wbc_bins8
    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
   where c.app_slug = 'appliedai' and c.tier = 'advanced' and f->>'key' = 'awka_wbc_bins8';
  if v_g_awka_wbc_bins8 is null then
    raise exception 'D5 go-live refused: the seeded rows carry no value [graded field: advanced/awka_wbc_bins8]';
  end if;

  -- ------------------------------------------ 1. against the engine ledger
  if v_g_orlu_bm25_idf_pressure <> 1.120591195386885::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 1.120591195386885 [graded field: beginner/orlu_bm25_idf_pressure]', v_g_orlu_bm25_idf_pressure;
  end if;
  if v_g_orlu_o1_bm25_top_score <> 7.811644371347484::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 7.811644371347484 [graded field: beginner/orlu_o1_bm25_top_score]', v_g_orlu_o1_bm25_top_score;
  end if;
  if v_g_orlu_o4_tfidf_top_cosine <> 0.4097941058785764::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.4097941058785764 [graded field: beginner/orlu_o4_tfidf_top_cosine]', v_g_orlu_o4_tfidf_top_cosine;
  end if;
  if v_g_orlu_bm25_mean_recall_at4 <> 0.6233333333333333::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.6233333333333333 [graded field: beginner/orlu_bm25_mean_recall_at4]', v_g_orlu_bm25_mean_recall_at4;
  end if;
  if v_g_orlu_bm25_mrr_at4 <> 0.7666666666666666::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.7666666666666666 [graded field: beginner/orlu_bm25_mrr_at4]', v_g_orlu_bm25_mrr_at4;
  end if;
  if v_g_orlu_answers_supported_fraction <> 0.7619047619047619::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.7619047619047619 [graded field: beginner/orlu_answers_supported_fraction]', v_g_orlu_answers_supported_fraction;
  end if;
  if v_g_nnewi_p_map_at5_grade2 <> 0.5791666666666666::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.5791666666666666 [graded field: intermediate/nnewi_p_map_at5_grade2]', v_g_nnewi_p_map_at5_grade2;
  end if;
  if v_g_nnewi_q_ndcg_at5_exponential <> 0.6658434450685446::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.6658434450685446 [graded field: intermediate/nnewi_q_ndcg_at5_exponential]', v_g_nnewi_q_ndcg_at5_exponential;
  end if;
  if v_g_nnewi_short_mean_token_f1 <> 0.7560876623376623::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.7560876623376623 [graded field: intermediate/nnewi_short_mean_token_f1]', v_g_nnewi_short_mean_token_f1;
  end if;
  if v_g_nnewi_extraction_macro_f1 <> 0.8148148148148149::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.8148148148148149 [graded field: intermediate/nnewi_extraction_macro_f1]', v_g_nnewi_extraction_macro_f1;
  end if;
  if v_g_nnewi_paired_ndcg_upper <> 0.08662003730238574::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.08662003730238574 [graded field: intermediate/nnewi_paired_ndcg_upper]', v_g_nnewi_paired_ndcg_upper;
  end if;
  if v_g_nnewi_q_supported_fraction <> 0.5454545454545454::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.5454545454545454 [graded field: intermediate/nnewi_q_supported_fraction]', v_g_nnewi_q_supported_fraction;
  end if;
  if v_g_awka_kappa_unweighted <> 0.5760869565217391::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.5760869565217391 [graded field: advanced/awka_kappa_unweighted]', v_g_awka_kappa_unweighted;
  end if;
  if v_g_awka_kappa_linear <> 0.7321642088481466::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.7321642088481466 [graded field: advanced/awka_kappa_linear]', v_g_awka_kappa_linear;
  end if;
  if v_g_awka_brier <> 0.16416885245901644::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.16416885245901644 [graded field: advanced/awka_brier]', v_g_awka_brier;
  end if;
  if v_g_awka_reliability_bins8 <> 0.07224170442589009::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.07224170442589009 [graded field: advanced/awka_reliability_bins8]', v_g_awka_reliability_bins8;
  end if;
  if v_g_awka_resolution_bins8 <> 0.0739759723015178::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.0739759723015178 [graded field: advanced/awka_resolution_bins8]', v_g_awka_resolution_bins8;
  end if;
  if v_g_awka_wbc_bins8 <> 0.00292706470919057::double precision then
    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned 0.00292706470919057 [graded field: advanced/awka_wbc_bins8]', v_g_awka_wbc_bins8;
  end if;

  -- ----------------------------------------------- 2. the second route in SQL
  v_run := pg_temp.d5_run(v_or_ids, v_or_tx, v_or_qids, v_or_qtx, 'bm25', 4, 1.2::double precision, 0.75::double precision, false);
  if v_run <> v_or_ret then
    raise exception 'D5 go-live refused: the second route re-ranks the ORLU queries as %, and the case file hands % [graded field: beginner/orlu_bm25_mean_recall_at4, beginner/orlu_bm25_mrr_at4, beginner/orlu_answers_supported_fraction]', v_run, v_or_ret;
  end if;
  v_s := pg_temp.d5_bm25_idf(v_or_tx, 'pressure');
  if v_s is null or abs(v_s - v_g_orlu_bm25_idf_pressure) > 1e-9 * abs(v_g_orlu_bm25_idf_pressure) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/orlu_bm25_idf_pressure]', v_s, v_g_orlu_bm25_idf_pressure;
  end if;
  v_r := pg_temp.d5_bm25(v_or_tx, 'water cut reported for Ekene-6 at the close of 2025', 1.2::double precision, 0.75::double precision);
  v_s := (select max(x) from unnest(v_r) x);
  if v_s is null or abs(v_s - v_g_orlu_o1_bm25_top_score) > 1e-9 * abs(v_g_orlu_o1_bm25_top_score) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/orlu_o1_bm25_top_score]', v_s, v_g_orlu_o1_bm25_top_score;
  end if;
  v_c := pg_temp.d5_tfidf(v_or_tx, 'discharge limit for oil in produced water', false);
  v_s := (select max(x) from unnest(v_c) x);
  if v_s is null or abs(v_s - v_g_orlu_o4_tfidf_top_cosine) > 1e-9 * abs(v_g_orlu_o4_tfidf_top_cosine) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/orlu_o4_tfidf_top_cosine]', v_s, v_g_orlu_o4_tfidf_top_cosine;
  end if;
  v_s := pg_temp.d5_mean(v_run, v_or_j, 4, 1, 'linear', 2);
  if v_s is null or abs(v_s - v_g_orlu_bm25_mean_recall_at4) > 1e-9 * abs(v_g_orlu_bm25_mean_recall_at4) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/orlu_bm25_mean_recall_at4]', v_s, v_g_orlu_bm25_mean_recall_at4;
  end if;
  v_s := pg_temp.d5_mean(v_run, v_or_j, 4, 1, 'linear', 3);
  if v_s is null or abs(v_s - v_g_orlu_bm25_mrr_at4) > 1e-9 * abs(v_g_orlu_bm25_mrr_at4) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/orlu_bm25_mrr_at4]', v_s, v_g_orlu_bm25_mrr_at4;
  end if;
  v_s := (pg_temp.d5_ground(v_or_ids, v_or_tx, v_or_ans, v_run, 0.0::double precision))[1];
  if v_s is null or abs(v_s - v_g_orlu_answers_supported_fraction) > 1e-9 * abs(v_g_orlu_answers_supported_fraction) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: beginner/orlu_answers_supported_fraction]', v_s, v_g_orlu_answers_supported_fraction;
  end if;
  v_rp := pg_temp.d5_run(v_nn_ids, v_nn_tx, v_nn_qids, v_nn_qtx, 'bm25', 5, 1.5::double precision, 0.5::double precision, false);
  v_rq := pg_temp.d5_run(v_nn_ids, v_nn_tx, v_nn_qids, v_nn_qtx, 'tfidf', 5, null, null, true);
  if v_rp <> v_nn_p or v_rq <> v_nn_q then
    raise exception 'D5 go-live refused: the second route re-ranks the NNEWI runs differently from the lists the case file hands the learner [graded field: intermediate/nnewi_p_map_at5_grade2, intermediate/nnewi_q_ndcg_at5_exponential, intermediate/nnewi_paired_ndcg_upper, intermediate/nnewi_q_supported_fraction]';
  end if;
  v_s := pg_temp.d5_mean(v_rp, v_nn_j, 5, 2, 'linear', 4);
  if v_s is null or abs(v_s - v_g_nnewi_p_map_at5_grade2) > 1e-9 * abs(v_g_nnewi_p_map_at5_grade2) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nnewi_p_map_at5_grade2]', v_s, v_g_nnewi_p_map_at5_grade2;
  end if;
  v_s := pg_temp.d5_mean(v_rq, v_nn_j, 5, 1, 'exponential', 7);
  if v_s is null or abs(v_s - v_g_nnewi_q_ndcg_at5_exponential) > 1e-9 * abs(v_g_nnewi_q_ndcg_at5_exponential) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nnewi_q_ndcg_at5_exponential]', v_s, v_g_nnewi_q_ndcg_at5_exponential;
  end if;
  v_s := (select avg((pg_temp.d5_f1(pg_temp.d5_squad(v_nn_sa[i2]), pg_temp.d5_squad(v_nn_sr[i2])))[1])
            from generate_subscripts(v_nn_sa, 1) i2);
  if v_s is null or abs(v_s - v_g_nnewi_short_mean_token_f1) > 1e-9 * abs(v_g_nnewi_short_mean_token_f1) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nnewi_short_mean_token_f1]', v_s, v_g_nnewi_short_mean_token_f1;
  end if;
  v_k := pg_temp.d5_extract(v_nn_xf, v_nn_xl, v_nn_xp);
  v_s := v_k[1];
  if v_s is null or abs(v_s - v_g_nnewi_extraction_macro_f1) > 1e-9 * abs(v_g_nnewi_extraction_macro_f1) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nnewi_extraction_macro_f1]', v_s, v_g_nnewi_extraction_macro_f1;
  end if;
  v_dp := pg_temp.d5_per(v_rp, v_nn_j, 5, 1, 'linear', 7);
  v_dq := pg_temp.d5_per(v_rq, v_nn_j, 5, 1, 'linear', 7);
  v_s := (pg_temp.d5_boot(v_dp, v_dq, 2000, 44, 0.95::double precision, true))[2];
  if v_s is null or abs(v_s - v_g_nnewi_paired_ndcg_upper) > 1e-9 * abs(v_g_nnewi_paired_ndcg_upper) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nnewi_paired_ndcg_upper]', v_s, v_g_nnewi_paired_ndcg_upper;
  end if;
  v_s := (pg_temp.d5_ground(v_nn_ids, v_nn_tx, v_nn_ans, v_rq, 0.0::double precision))[1];
  if v_s is null or abs(v_s - v_g_nnewi_q_supported_fraction) > 1e-9 * abs(v_g_nnewi_q_supported_fraction) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: intermediate/nnewi_q_supported_fraction]', v_s, v_g_nnewi_q_supported_fraction;
  end if;
  v_k := pg_temp.d5_kappa(v_aw_a, v_aw_b, v_aw_l, 'none');
  v_s := v_k[1];
  if v_s is null or abs(v_s - v_g_awka_kappa_unweighted) > 1e-9 * abs(v_g_awka_kappa_unweighted) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/awka_kappa_unweighted]', v_s, v_g_awka_kappa_unweighted;
  end if;
  v_k := pg_temp.d5_kappa(v_aw_a, v_aw_b, v_aw_l, 'linear');
  v_s := v_k[1];
  if v_s is null or abs(v_s - v_g_awka_kappa_linear) > 1e-9 * abs(v_g_awka_kappa_linear) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/awka_kappa_linear]', v_s, v_g_awka_kappa_linear;
  end if;
  v_c := pg_temp.d5_cal(v_aw_y, v_aw_p, 8, 'engine');
  v_s := v_c[1];
  if v_s is null or abs(v_s - v_g_awka_brier) > 1e-9 * abs(v_g_awka_brier) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/awka_brier]', v_s, v_g_awka_brier;
  end if;
  v_s := v_c[2];
  if v_s is null or abs(v_s - v_g_awka_reliability_bins8) > 1e-9 * abs(v_g_awka_reliability_bins8) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/awka_reliability_bins8]', v_s, v_g_awka_reliability_bins8;
  end if;
  v_s := v_c[3];
  if v_s is null or abs(v_s - v_g_awka_resolution_bins8) > 1e-9 * abs(v_g_awka_resolution_bins8) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/awka_resolution_bins8]', v_s, v_g_awka_resolution_bins8;
  end if;
  v_s := v_c[6];
  if v_s is null or abs(v_s - v_g_awka_wbc_bins8) > 1e-9 * abs(v_g_awka_wbc_bins8) then
    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is % [graded field: advanced/awka_wbc_bins8]', v_s, v_g_awka_wbc_bins8;
  end if;

  -- ------------------------------------------------------------- 3. the traps
  -- The traps recompute what they read, so they stand when the blocks above
  -- are cut (the dry run cuts them to prove a trap fires on its own).
  v_run := pg_temp.d5_run(v_or_ids, v_or_tx, v_or_qids, v_or_qtx, 'bm25', 4, 1.2::double precision, 0.75::double precision, false);
  v_r := pg_temp.d5_bm25(v_or_tx, 'water cut reported for Ekene-6 at the close of 2025', 1.2::double precision, 0.75::double precision);
  v_rp := pg_temp.d5_run(v_nn_ids, v_nn_tx, v_nn_qids, v_nn_qtx, 'bm25', 5, 1.5::double precision, 0.5::double precision, false);
  v_rq := pg_temp.d5_run(v_nn_ids, v_nn_tx, v_nn_qids, v_nn_qtx, 'tfidf', 5, null, null, true);
  v_dp := pg_temp.d5_per(v_rp, v_nn_j, 5, 1, 'linear', 7);
  v_dq := pg_temp.d5_per(v_rq, v_nn_j, 5, 1, 'linear', 7);
  v_df := (select count(*) from unnest(v_or_tx) t where 'pressure' = any(pg_temp.d5_tok(t)));
  v_wrong := ln((22 - v_df + 0.5) / (v_df + 0.5));
  if v_wrong is null or abs(v_wrong - v_g_orlu_bm25_idf_pressure) <= 5e-07 then
    raise exception 'D5 go-live refused: the Robertson idf without the 1 + gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_bm25_idf_pressure]', v_wrong, v_g_orlu_bm25_idf_pressure;
  end if;
  v_wrong := log(1.0 + (22 - v_df + 0.5) / (v_df + 0.5));
  if v_wrong is null or abs(v_wrong - v_g_orlu_bm25_idf_pressure) <= 5e-07 then
    raise exception 'D5 go-live refused: the idf in log base 10 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_bm25_idf_pressure]', v_wrong, v_g_orlu_bm25_idf_pressure;
  end if;
  v_wrong := ln((1.0 + 22) / (1.0 + v_df)) + 1;
  if v_wrong is null or abs(v_wrong - v_g_orlu_bm25_idf_pressure) <= 5e-07 then
    raise exception 'D5 go-live refused: the TF-IDF smoothed idf gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_bm25_idf_pressure]', v_wrong, v_g_orlu_bm25_idf_pressure;
  end if;
  v_wrong := (select max(x) from unnest(pg_temp.d5_bm25(v_or_tx, 'water cut reported for Ekene-6 at the close of 2025', 1.2::double precision, 0.0::double precision)) x);
  if v_wrong is null or abs(v_wrong - v_g_orlu_o1_bm25_top_score) <= 5e-07 then
    raise exception 'D5 go-live refused: b at 0 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_o1_bm25_top_score]', v_wrong, v_g_orlu_o1_bm25_top_score;
  end if;
  v_wrong := (select max(x) from unnest(pg_temp.d5_bm25(v_or_tx, 'water cut reported for Ekene-6 at the close of 2025', 2.0::double precision, 0.75::double precision)) x);
  if v_wrong is null or abs(v_wrong - v_g_orlu_o1_bm25_top_score) <= 5e-07 then
    raise exception 'D5 go-live refused: k1 at 2 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_o1_bm25_top_score]', v_wrong, v_g_orlu_o1_bm25_top_score;
  end if;
  v_wrong := (select x from unnest(v_r) x order by x desc offset 1 limit 1);
  if v_wrong is null or abs(v_wrong - v_g_orlu_o1_bm25_top_score) <= 5e-07 then
    raise exception 'D5 go-live refused: the second-ranked score gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_o1_bm25_top_score]', v_wrong, v_g_orlu_o1_bm25_top_score;
  end if;
  v_wrong := (select max(x) from unnest(pg_temp.d5_tfidf(v_or_tx, 'water cut reported for Ekene-6 at the close of 2025', false)) x);
  if v_wrong is null or abs(v_wrong - v_g_orlu_o1_bm25_top_score) <= 5e-07 then
    raise exception 'D5 go-live refused: the TF-IDF cosine quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_o1_bm25_top_score]', v_wrong, v_g_orlu_o1_bm25_top_score;
  end if;
  v_wrong := (select max(x) from unnest(pg_temp.d5_tfidf(v_or_tx, 'discharge limit for oil in produced water', true)) x);
  if v_wrong is null or abs(v_wrong - v_g_orlu_o4_tfidf_top_cosine) <= 5e-07 then
    raise exception 'D5 go-live refused: sublinear tf gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_o4_tfidf_top_cosine]', v_wrong, v_g_orlu_o4_tfidf_top_cosine;
  end if;
  v_wrong := (select x from unnest(pg_temp.d5_tfidf(v_or_tx, 'discharge limit for oil in produced water', false)) x order by x desc offset 1 limit 1);
  if v_wrong is null or abs(v_wrong - v_g_orlu_o4_tfidf_top_cosine) <= 5e-07 then
    raise exception 'D5 go-live refused: the second-ranked cosine gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_o4_tfidf_top_cosine]', v_wrong, v_g_orlu_o4_tfidf_top_cosine;
  end if;
  v_wrong := (select max(x) from unnest(pg_temp.d5_bm25(v_or_tx, 'discharge limit for oil in produced water', 1.2::double precision, 0.75::double precision)) x);
  if v_wrong is null or abs(v_wrong - v_g_orlu_o4_tfidf_top_cosine) <= 5e-07 then
    raise exception 'D5 go-live refused: the BM25 score quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_o4_tfidf_top_cosine]', v_wrong, v_g_orlu_o4_tfidf_top_cosine;
  end if;
  v_wrong := pg_temp.d5_mean(v_run, v_or_j, 2, 1, 'linear', 2);
  if v_wrong is null or abs(v_wrong - v_g_orlu_bm25_mean_recall_at4) <= 5e-07 then
    raise exception 'D5 go-live refused: cutoff 2 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_bm25_mean_recall_at4]', v_wrong, v_g_orlu_bm25_mean_recall_at4;
  end if;
  v_wrong := pg_temp.d5_mean(v_run, v_or_j, 4, 2, 'linear', 2);
  if v_wrong is null or abs(v_wrong - v_g_orlu_bm25_mean_recall_at4) <= 5e-07 then
    raise exception 'D5 go-live refused: relevant at grade 2 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_bm25_mean_recall_at4]', v_wrong, v_g_orlu_bm25_mean_recall_at4;
  end if;
  v_wrong := pg_temp.d5_mean(v_run, v_or_j, 4, 1, 'linear', 1);
  if v_wrong is null or abs(v_wrong - v_g_orlu_bm25_mean_recall_at4) <= 5e-07 then
    raise exception 'D5 go-live refused: the mean precision quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_bm25_mean_recall_at4]', v_wrong, v_g_orlu_bm25_mean_recall_at4;
  end if;
  v_wrong := pg_temp.d5_mean(v_run, v_or_j, 4, 2, 'linear', 3);
  if v_wrong is null or abs(v_wrong - v_g_orlu_bm25_mrr_at4) <= 5e-07 then
    raise exception 'D5 go-live refused: relevant at grade 2 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_bm25_mrr_at4]', v_wrong, v_g_orlu_bm25_mrr_at4;
  end if;
  v_wrong := pg_temp.d5_mean(v_run, v_or_j, 1, 1, 'linear', 3);
  if v_wrong is null or abs(v_wrong - v_g_orlu_bm25_mrr_at4) <= 5e-07 then
    raise exception 'D5 go-live refused: cutoff 1 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_bm25_mrr_at4]', v_wrong, v_g_orlu_bm25_mrr_at4;
  end if;
  v_wrong := pg_temp.d5_mean(v_run, v_or_j, 4, 1, 'linear', 4);
  if v_wrong is null or abs(v_wrong - v_g_orlu_bm25_mrr_at4) <= 5e-07 then
    raise exception 'D5 go-live refused: the MAP quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_bm25_mrr_at4]', v_wrong, v_g_orlu_bm25_mrr_at4;
  end if;
  v_k := pg_temp.d5_ground(v_or_ids, v_or_tx, v_or_ans, v_run, 0.0::double precision);
  v_wrong := (pg_temp.d5_ground(v_or_ids, v_or_tx, v_or_ans, null, 0.0::double precision))[1];
  if v_wrong is null or abs(v_wrong - v_g_orlu_answers_supported_fraction) <= 5e-07 then
    raise exception 'D5 go-live refused: the retrieved lists ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_answers_supported_fraction]', v_wrong, v_g_orlu_answers_supported_fraction;
  end if;
  v_wrong := v_k[2];
  if v_wrong is null or abs(v_wrong - v_g_orlu_answers_supported_fraction) <= 5e-07 then
    raise exception 'D5 go-live refused: the mean of the per-answer fractions gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_answers_supported_fraction]', v_wrong, v_g_orlu_answers_supported_fraction;
  end if;
  v_wrong := v_k[3];
  if v_wrong is null or abs(v_wrong - v_g_orlu_answers_supported_fraction) <= 5e-07 then
    raise exception 'D5 go-live refused: the numbers alone gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: beginner/orlu_answers_supported_fraction]', v_wrong, v_g_orlu_answers_supported_fraction;
  end if;
  v_wrong := pg_temp.d5_mean(v_rp, v_nn_j, 5, 1, 'linear', 4);
  if v_wrong is null or abs(v_wrong - v_g_nnewi_p_map_at5_grade2) <= 5e-07 then
    raise exception 'D5 go-live refused: relevant at grade 1 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_p_map_at5_grade2]', v_wrong, v_g_nnewi_p_map_at5_grade2;
  end if;
  v_wrong := pg_temp.d5_mean(v_rq, v_nn_j, 5, 2, 'linear', 4);
  if v_wrong is null or abs(v_wrong - v_g_nnewi_p_map_at5_grade2) <= 5e-07 then
    raise exception 'D5 go-live refused: system Q gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_p_map_at5_grade2]', v_wrong, v_g_nnewi_p_map_at5_grade2;
  end if;
  v_wrong := pg_temp.d5_mean(v_rp, v_nn_j, 3, 2, 'linear', 4);
  if v_wrong is null or abs(v_wrong - v_g_nnewi_p_map_at5_grade2) <= 5e-07 then
    raise exception 'D5 go-live refused: cutoff 3 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_p_map_at5_grade2]', v_wrong, v_g_nnewi_p_map_at5_grade2;
  end if;
  v_wrong := pg_temp.d5_mean(v_rq, v_nn_j, 5, 1, 'linear', 7);
  if v_wrong is null or abs(v_wrong - v_g_nnewi_q_ndcg_at5_exponential) <= 5e-07 then
    raise exception 'D5 go-live refused: linear gain gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_q_ndcg_at5_exponential]', v_wrong, v_g_nnewi_q_ndcg_at5_exponential;
  end if;
  v_wrong := pg_temp.d5_mean(v_rp, v_nn_j, 5, 1, 'exponential', 7);
  if v_wrong is null or abs(v_wrong - v_g_nnewi_q_ndcg_at5_exponential) <= 5e-07 then
    raise exception 'D5 go-live refused: system P gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_q_ndcg_at5_exponential]', v_wrong, v_g_nnewi_q_ndcg_at5_exponential;
  end if;
  v_wrong := pg_temp.d5_mean(v_rq, v_nn_j, 3, 1, 'exponential', 7);
  if v_wrong is null or abs(v_wrong - v_g_nnewi_q_ndcg_at5_exponential) <= 5e-07 then
    raise exception 'D5 go-live refused: cutoff 3 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_q_ndcg_at5_exponential]', v_wrong, v_g_nnewi_q_ndcg_at5_exponential;
  end if;
  v_wrong := (select avg(case when pg_temp.d5_squad(v_nn_sa[i2]) = pg_temp.d5_squad(v_nn_sr[i2]) then 1.0 else 0.0 end)
                from generate_subscripts(v_nn_sa, 1) i2);
  if v_wrong is null or abs(v_wrong - v_g_nnewi_short_mean_token_f1) <= 5e-07 then
    raise exception 'D5 go-live refused: the exact-match rate gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_short_mean_token_f1]', v_wrong, v_g_nnewi_short_mean_token_f1;
  end if;
  v_wrong := (select avg(coalesce((pg_temp.d5_f1(pg_temp.d5_squad(v_nn_sa[i2]), pg_temp.d5_squad(v_nn_sr[i2])))[2], 0))
                from generate_subscripts(v_nn_sa, 1) i2);
  if v_wrong is null or abs(v_wrong - v_g_nnewi_short_mean_token_f1) <= 5e-07 then
    raise exception 'D5 go-live refused: the mean token precision gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_short_mean_token_f1]', v_wrong, v_g_nnewi_short_mean_token_f1;
  end if;
  v_wrong := (select avg(coalesce((pg_temp.d5_f1(pg_temp.d5_squad(v_nn_sa[i2]), pg_temp.d5_squad(v_nn_sr[i2])))[3], 0))
                from generate_subscripts(v_nn_sa, 1) i2);
  if v_wrong is null or abs(v_wrong - v_g_nnewi_short_mean_token_f1) <= 5e-07 then
    raise exception 'D5 go-live refused: the mean token recall gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_short_mean_token_f1]', v_wrong, v_g_nnewi_short_mean_token_f1;
  end if;
  v_k := pg_temp.d5_extract(v_nn_xf, v_nn_xl, v_nn_xp);
  v_wrong := v_k[2];
  if v_wrong is null or abs(v_wrong - v_g_nnewi_extraction_macro_f1) <= 5e-07 then
    raise exception 'D5 go-live refused: the micro F1 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_extraction_macro_f1]', v_wrong, v_g_nnewi_extraction_macro_f1;
  end if;
  v_wrong := v_k[3];
  if v_wrong is null or abs(v_wrong - v_g_nnewi_extraction_macro_f1) <= 5e-07 then
    raise exception 'D5 go-live refused: the macro accuracy gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_extraction_macro_f1]', v_wrong, v_g_nnewi_extraction_macro_f1;
  end if;
  v_wrong := v_k[6];
  if v_wrong is null or abs(v_wrong - v_g_nnewi_extraction_macro_f1) <= 5e-07 then
    raise exception 'D5 go-live refused: the text fields alone gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_extraction_macro_f1]', v_wrong, v_g_nnewi_extraction_macro_f1;
  end if;
  v_wrong := (pg_temp.d5_boot(v_dp, v_dq, 2000, 44, 0.95::double precision, true))[1];
  if v_wrong is null or abs(v_wrong - v_g_nnewi_paired_ndcg_upper) <= 5e-07 then
    raise exception 'D5 go-live refused: the lower bound gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_paired_ndcg_upper]', v_wrong, v_g_nnewi_paired_ndcg_upper;
  end if;
  v_wrong := (pg_temp.d5_boot(v_dp, v_dq, 2000, 44, 0.95::double precision, false))[2];
  if v_wrong is null or abs(v_wrong - v_g_nnewi_paired_ndcg_upper) <= 5e-07 then
    raise exception 'D5 go-live refused: the unpaired bootstrap gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_paired_ndcg_upper]', v_wrong, v_g_nnewi_paired_ndcg_upper;
  end if;
  v_wrong := (pg_temp.d5_boot(v_dp, v_dq, 2000, 45, 0.95::double precision, true))[2];
  if v_wrong is null or abs(v_wrong - v_g_nnewi_paired_ndcg_upper) <= 5e-07 then
    raise exception 'D5 go-live refused: the next seed gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_paired_ndcg_upper]', v_wrong, v_g_nnewi_paired_ndcg_upper;
  end if;
  v_wrong := (pg_temp.d5_boot(v_dq, v_dp, 2000, 44, 0.95::double precision, true))[2];
  if v_wrong is null or abs(v_wrong - v_g_nnewi_paired_ndcg_upper) <= 5e-07 then
    raise exception 'D5 go-live refused: Q minus P gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_paired_ndcg_upper]', v_wrong, v_g_nnewi_paired_ndcg_upper;
  end if;
  v_k := pg_temp.d5_ground(v_nn_ids, v_nn_tx, v_nn_ans, v_rq, 0.0::double precision);
  v_wrong := (pg_temp.d5_ground(v_nn_ids, v_nn_tx, v_nn_ans, null, 0.0::double precision))[1];
  if v_wrong is null or abs(v_wrong - v_g_nnewi_q_supported_fraction) <= 5e-07 then
    raise exception 'D5 go-live refused: the retrieved lists ignored gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_q_supported_fraction]', v_wrong, v_g_nnewi_q_supported_fraction;
  end if;
  v_wrong := v_k[2];
  if v_wrong is null or abs(v_wrong - v_g_nnewi_q_supported_fraction) <= 5e-07 then
    raise exception 'D5 go-live refused: the mean of the per-answer fractions gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_q_supported_fraction]', v_wrong, v_g_nnewi_q_supported_fraction;
  end if;
  v_wrong := v_k[3];
  if v_wrong is null or abs(v_wrong - v_g_nnewi_q_supported_fraction) <= 5e-07 then
    raise exception 'D5 go-live refused: the numbers alone gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: intermediate/nnewi_q_supported_fraction]', v_wrong, v_g_nnewi_q_supported_fraction;
  end if;
  v_k := pg_temp.d5_kappa(v_aw_a, v_aw_b, v_aw_l, 'none');
  v_wrong := v_k[2];
  if v_wrong is null or abs(v_wrong - v_g_awka_kappa_unweighted) <= 5e-07 then
    raise exception 'D5 go-live refused: the observed agreement quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_kappa_unweighted]', v_wrong, v_g_awka_kappa_unweighted;
  end if;
  v_wrong := (pg_temp.d5_kappa(v_aw_a, v_aw_b, v_aw_l, 'linear'))[1];
  if v_wrong is null or abs(v_wrong - v_g_awka_kappa_unweighted) <= 5e-07 then
    raise exception 'D5 go-live refused: linear weights gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_kappa_unweighted]', v_wrong, v_g_awka_kappa_unweighted;
  end if;
  v_wrong := (pg_temp.d5_kappa(v_aw_a, v_aw_b, v_aw_l, 'quadratic'))[1];
  if v_wrong is null or abs(v_wrong - v_g_awka_kappa_unweighted) <= 5e-07 then
    raise exception 'D5 go-live refused: quadratic weights gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_kappa_unweighted]', v_wrong, v_g_awka_kappa_unweighted;
  end if;
  v_wrong := v_k[1];
  if v_wrong is null or abs(v_wrong - v_g_awka_kappa_linear) <= 5e-07 then
    raise exception 'D5 go-live refused: unweighted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_kappa_linear]', v_wrong, v_g_awka_kappa_linear;
  end if;
  v_wrong := (pg_temp.d5_kappa(v_aw_a, v_aw_b, v_aw_l, 'quadratic'))[1];
  if v_wrong is null or abs(v_wrong - v_g_awka_kappa_linear) <= 5e-07 then
    raise exception 'D5 go-live refused: quadratic weights gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_kappa_linear]', v_wrong, v_g_awka_kappa_linear;
  end if;
  v_wrong := 1 - (pg_temp.d5_kappa(v_aw_a, v_aw_b, v_aw_l, 'linear'))[3];
  if v_wrong is null or abs(v_wrong - v_g_awka_kappa_linear) <= 5e-07 then
    raise exception 'D5 go-live refused: one minus the observed weighted disagreement gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_kappa_linear]', v_wrong, v_g_awka_kappa_linear;
  end if;
  v_c := pg_temp.d5_cal(v_aw_y, v_aw_p, 8, 'engine');
  v_r := pg_temp.d5_cal(v_aw_y, v_aw_p, 8, 'library');
  v_k := pg_temp.d5_cal(v_aw_y, v_aw_p, 10, 'engine');
  v_wrong := v_c[7];
  if v_wrong is null or abs(v_wrong - v_g_awka_brier) <= 5e-07 then
    raise exception 'D5 go-live refused: the ECE quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_brier]', v_wrong, v_g_awka_brier;
  end if;
  v_wrong := v_c[2] - v_c[3] + v_c[4];
  if v_wrong is null or abs(v_wrong - v_g_awka_brier) <= 5e-07 then
    raise exception 'D5 go-live refused: REL - RES + UNC without the within-bin terms gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_brier]', v_wrong, v_g_awka_brier;
  end if;
  v_wrong := (select avg(abs(v_aw_p[i2] - v_aw_y[i2])) from generate_subscripts(v_aw_p, 1) i2);
  if v_wrong is null or abs(v_wrong - v_g_awka_brier) <= 5e-07 then
    raise exception 'D5 go-live refused: the mean absolute difference gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_brier]', v_wrong, v_g_awka_brier;
  end if;
  v_wrong := v_k[2];
  if v_wrong is null or abs(v_wrong - v_g_awka_reliability_bins8) <= 5e-07 then
    raise exception 'D5 go-live refused: ten bins gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_reliability_bins8]', v_wrong, v_g_awka_reliability_bins8;
  end if;
  v_wrong := v_r[2];
  if v_wrong is null or abs(v_wrong - v_g_awka_reliability_bins8) <= 5e-07 then
    raise exception 'D5 go-live refused: the library edge rule gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_reliability_bins8]', v_wrong, v_g_awka_reliability_bins8;
  end if;
  v_wrong := v_c[3];
  if v_wrong is null or abs(v_wrong - v_g_awka_reliability_bins8) <= 5e-07 then
    raise exception 'D5 go-live refused: the resolution quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_reliability_bins8]', v_wrong, v_g_awka_reliability_bins8;
  end if;
  v_wrong := v_k[3];
  if v_wrong is null or abs(v_wrong - v_g_awka_resolution_bins8) <= 5e-07 then
    raise exception 'D5 go-live refused: ten bins gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_resolution_bins8]', v_wrong, v_g_awka_resolution_bins8;
  end if;
  v_wrong := v_c[2];
  if v_wrong is null or abs(v_wrong - v_g_awka_resolution_bins8) <= 5e-07 then
    raise exception 'D5 go-live refused: the reliability quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_resolution_bins8]', v_wrong, v_g_awka_resolution_bins8;
  end if;
  v_wrong := v_c[4];
  if v_wrong is null or abs(v_wrong - v_g_awka_resolution_bins8) <= 5e-07 then
    raise exception 'D5 go-live refused: the uncertainty quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_resolution_bins8]', v_wrong, v_g_awka_resolution_bins8;
  end if;
  v_wrong := v_c[5];
  if v_wrong is null or abs(v_wrong - v_g_awka_wbc_bins8) <= 5e-07 then
    raise exception 'D5 go-live refused: the within-bin variance quoted gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_wbc_bins8]', v_wrong, v_g_awka_wbc_bins8;
  end if;
  v_wrong := v_k[6];
  if v_wrong is null or abs(v_wrong - v_g_awka_wbc_bins8) <= 5e-07 then
    raise exception 'D5 go-live refused: ten bins gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_wbc_bins8]', v_wrong, v_g_awka_wbc_bins8;
  end if;
  v_wrong := v_c[6] / 2.0;
  if v_wrong is null or abs(v_wrong - v_g_awka_wbc_bins8) <= 5e-07 then
    raise exception 'D5 go-live refused: the pooled within-bin covariance without the factor 2 gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_wbc_bins8]', v_wrong, v_g_awka_wbc_bins8;
  end if;
  v_wrong := v_r[6];
  if v_wrong is null or abs(v_wrong - v_g_awka_wbc_bins8) <= 5e-07 then
    raise exception 'D5 go-live refused: the library edge rule gives %, within the tolerance of the seeded %, so the field does not discriminate the trap [graded field: advanced/awka_wbc_bins8]', v_wrong, v_g_awka_wbc_bins8;
  end if;

  -- ------------------------------------------------------------- the flip
  update public.academy_apps set status = 'available' where slug = 'appliedai';
  if not exists (select 1 from public.academy_apps where slug = 'appliedai' and status = 'available') then
    raise exception 'D5 go-live refused: appliedai did not reach status available';
  end if;
  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')
    into v_available, v_soon from public.academy_apps;
  raise notice 'D5 go-live: appliedai available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',
    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;
end $$;
