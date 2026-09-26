#!/usr/bin/env python3
"""Generate the D5 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction,
and checked three ways, none of which restates the generator that wrote them.
Modelled on tools/course-waves/forecastml/gen_golive.py (D4).

1. AGAINST THE ENGINE LEDGER. gen_course.py runs `node d5_capstone.mjs --json`
   through the vendored engines/dataai/evaluate.js when this file is
   generated, and refuses unless fields.json carries exactly what that run
   returned. The go-live compares the seeded rows to THAT RUN'S values, to the
   last bit, so a capstone row an earlier seed left behind (the course
   migration inserts with `on conflict do nothing`) is refused by name, and so
   is a move of one part in 1e7.

2. BY A SECOND ROUTE IN SQL over the data the learner is handed in the case
   files. Every graded value is recomputed by Postgres with no engine code:
   the tokens, BM25 with the Lucene idf and scikit-learn's TF-IDF from their
   published forms; the capstone runs RE-RETRIEVED in SQL and refused unless
   they equal the lists the case files hand the learner; precision, recall,
   reciprocal rank, average precision and nDCG from their definitions; the
   SQuAD normalisation and token F1; the extraction outcomes and macro F1;
   the paired bootstrap on the mulberry32 stream rebuilt in 64-bit integer
   arithmetic with the lib/stats quantile rule; the claim grammar and the
   cited-and-retrieved support rule; Cohen's kappa; the Brier score and its
   Murphy terms with WBC as Stephenson, Coelho and Jolliffe (2008) label it in
   their eq. 7. Each must agree with the seeded value to 1e-9 relative.

3. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE: for every field, two
   or more wrong methods a learner who missed the lesson would use (each one
   already swept with the ENGINE by discriminate.mjs) are computed in SQL, and
   the go-live refuses unless each misses the graded value by more than the
   field's tolerance.

And, before any of it: the shape of the ladder (3 structures, 78 lesson keys,
18 modules, 396 questions, 132 a tier, 15 a module bank, 42 an exam, four
options with a key inside them, 3 capstones, 18 fields, 6 a tier), the numeric
grader simulated on every field at its own shipped tolerance, each prompt byte
for byte (md5) as gen_course.py rendered it with every stated setting and case
file named, and a prompt sweep: no number handed in any capstone text sits
within its tolerance of any graded value.

THE HELPERS ARE TEMPORARY FUNCTIONS, read from golive_helpers.sql beside this
file and created in pg_temp at the head of the go-live (create or replace, so a
second run in one session changes nothing). They vanish with the session and
create nothing in any schema a learner or another migration can see. The claim
grammar uses regexp_instr and regexp_substr (PostgreSQL 15 and later).

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a graded field without a ledger check, a second route and two traps; a
division by a bare integer; an unclosed literal; an em or en dash.

Usage: python3 gen_golive.py
   D5_WAVE, D5_REPO, D5_ENGINES, D5_TOLERANCE as gen_course.py
   D5_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   D5_GOLIVE_OUT  where to write
"""
import hashlib
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
W = os.environ.get('D5_WAVE', '/root/dai-wip-appliedai')
REPO = os.environ.get('D5_REPO', '/root/wt-dai-d5-nextgen')
sys.path.insert(0, HERE)
os.environ['D5_WAVE'] = W
import gen_course as GC  # noqa: E402  (runs the engine; writes nothing on import)

DATE = GC.DATE
COURSE = os.environ.get('D5_COURSE_SQL', f'{REPO}/migrations/{DATE}_d5_appliedai_course.sql')
OUT = os.environ.get('D5_GOLIVE_OUT', f'{REPO}/migrations/{DATE}_d5_appliedai_go_live.sql')
SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
fields = GC.fields
KEYS, TIER_OF, F, TOL = GC.KEYS, GC.TIER_OF, GC.F, GC.TOL
ENGINE = {k: GC.ENGINE[(TIER_OF[k], k)] for k in KEYS}
OR, NN, AW = GC.OR, GC.NN, GC.AW
ORS, NNS, AWS = GC.ORS, GC.NNS, GC.AWS
refused = list(GC.bad)

course_sql = open(COURSE, encoding='utf-8').read() if os.path.exists(COURSE) else None
if course_sql != GC.SQL:
    refused.append(f'the course migration at {COURSE} is not the one gen_course.py renders now')
TOL6 = 5e-7
for k in KEYS:
    if TOL[k] < TOL6:
        refused.append(f'{k} is graded at {TOL[k]}, below the six-decimal floor {TOL6}')


def fl(x):
    """A float literal SQL reads back as this exact double."""
    return repr(float(x)) + '::double precision'


def lit(s):
    return "'" + s.replace("'", "''") + "'"


def tarr(xs):
    return 'array[' + ', '.join(lit(x) for x in xs) + ']::text[]'


def darr(xs):
    return 'array[' + ', '.join(repr(float(x)) for x in xs) + ']::double precision[]'


def iarr(xs):
    return 'array[' + ', '.join(str(int(x)) for x in xs) + ']::int[]'


def jlit(o):
    return lit(json.dumps(o, ensure_ascii=False, separators=(',', ':'))) + '::jsonb'


def name(*keys):
    for k in keys:
        assert k in KEYS, k
    return ' [graded field: ' + ', '.join(f'{TIER_OF[k]}/{k}' for k in keys) + ']'


P = []  # the body
w = P.append
COUNT = {'ledger': set(), 'route': set(), 'trap': {}}
V = {k: f'v_g_{k}' for k in KEYS}


def route(key, expr_lines):
    """expr_lines compute v_s; then compare with the seeded value."""
    COUNT['route'].add(key)
    for l in expr_lines:
        w('  ' + l)
    w(f'  if v_s is null or abs(v_s - {V[key]}) > 1e-9 * abs({V[key]}) then')
    w(f"    raise exception 'D5 go-live refused: the second route in SQL gives %, and the seeded value is %{name(key)}', v_s, {V[key]};")
    w('  end if;')


def trap(key, label, expr_lines):
    COUNT['trap'][key] = COUNT['trap'].get(key, 0) + 1
    for l in expr_lines:
        w('  ' + l)
    w(f'  if v_wrong is null or abs(v_wrong - {V[key]}) <= {repr(float(TOL[key]))} then')
    assert "'" not in label, label
    w(f"    raise exception 'D5 go-live refused: {label} gives %, within the tolerance of the seeded %, so the field does not discriminate the trap{name(key)}', v_wrong, {V[key]};")
    w('  end if;')


# ------------------------------------------------------------------- header
HEADER = f"""-- ============================================================================
-- D5 GO-LIVE (HELD): Applied AI and Language Models flips to 'available', the
-- FIFTH course of the Data & AI module, at path_order {PATH_ORDER}.
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
"""

HELPERS = open(os.path.join(HERE, 'golive_helpers.sql'), encoding='utf-8').read()

# -------------------------------------------------------------- declarations
ORQ = {q['id']: q['text'] for q in OR['queries']}
NNQ = {q['id']: q['text'] for q in NN['queries']}
decl = ['do $$', '#variable_conflict use_column', 'declare',
        '  v_structures int; v_questions int; v_capstones int; v_lessons int;',
        '  v_modules int; v_graded int; v_available int; v_soon int; v_n int; i int;',
        '  v_names text; v_prompt text; v_s double precision; v_wrong double precision;',
        '  v_r double precision[]; v_c double precision[]; v_k double precision[]; v_run jsonb; v_rp jsonb; v_rq jsonb;',
        '  v_dp double precision[]; v_dq double precision[]; v_df double precision;']
for k in KEYS:
    decl.append(f'  {V[k]} double precision;')
decl += [
    f"  v_or_ids text[] := {tarr([d['id'] for d in OR['documents']])};",
    f"  v_or_tx text[] := {tarr([d['text'] for d in OR['documents']])};",
    f"  v_or_qids text[] := {tarr([q['id'] for q in OR['queries']])};",
    f"  v_or_qtx text[] := {tarr([q['text'] for q in OR['queries']])};",
    f"  v_or_j jsonb := {jlit(OR['judgments'])};",
    f"  v_or_ans jsonb := {jlit([{k: a[k] for k in ('query', 'text', 'citations')} for a in OR['answers']])};",
    f"  v_or_ret jsonb := {jlit({a['query']: a['retrieved'] for a in OR['answers']})};",
    f"  v_nn_ids text[] := {tarr([d['id'] for d in NN['documents']])};",
    f"  v_nn_tx text[] := {tarr([d['text'] for d in NN['documents']])};",
    f"  v_nn_qids text[] := {tarr([q['id'] for q in NN['queries']])};",
    f"  v_nn_qtx text[] := {tarr([q['text'] for q in NN['queries']])};",
    f"  v_nn_j jsonb := {jlit(NN['judgments'])};",
    f"  v_nn_p jsonb := {jlit(NN['runs']['P'])};",
    f"  v_nn_q jsonb := {jlit(NN['runs']['Q'])};",
    f"  v_nn_sa text[] := {tarr([s['answer'] for s in NN['shorts']])};",
    f"  v_nn_sr text[] := {tarr([s['reference'] for s in NN['shorts']])};",
    f"  v_nn_xf jsonb := {jlit(NN['extraction']['fields'])};",
    f"  v_nn_xl jsonb := {jlit(NN['extraction']['labels'])};",
    f"  v_nn_xp jsonb := {jlit(NN['extraction']['predictions'])};",
    f"  v_nn_ans jsonb := {jlit(NN['answers'])};",
    f"  v_aw_a int[] := {iarr(AW['ratings']['a'])};",
    f"  v_aw_b int[] := {iarr(AW['ratings']['b'])};",
    f"  v_aw_y int[] := {iarr(AW['calibration']['yTrue'])};",
    f"  v_aw_p double precision[] := {darr(AW['calibration']['probabilities'])};",
    f"  v_aw_l int[] := {iarr(AWS['labels'])};",
    'begin', '']
# ------------------------------------------------------------------- shape
S = SLUG
w('  -- ---------------------------------------------------------------- shape')
w(f"  select count(*) into v_structures from public.academy_course_structures where app_slug = '{S}' and active;")
w("  if v_structures <> 3 then")
w(f"    raise exception 'D5 go-live refused: {S} has % active deep structures, expected 3', v_structures;")
w('  end if;')
w(f"  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{S}';")
w('  if v_questions <> 396 then')
w(f"    raise exception 'D5 go-live refused: {S} has % quiz questions, expected 396', v_questions;")
w('  end if;')
for cond, msg in ((f"select tier from public.academy_quiz_questions where app_slug = '{S}' group by tier having count(*) <> 132",
                   '% tier(s) do not carry exactly 132 questions'),
                  (f"select tier, module_key from public.academy_quiz_questions where app_slug = '{S}' and scope = 'module' group by tier, module_key having count(*) <> 15",
                   '% module bank(s) do not carry exactly 15 questions'),
                  (f"select tier from public.academy_quiz_questions where app_slug = '{S}' and scope = 'final' group by tier having count(*) <> 42",
                   '% final exam(s) do not carry exactly 42 questions')):
    w(f'  select count(*) into v_n from ({cond}) t;')
    w('  if v_n <> 0 then')
    w(f"    raise exception 'D5 go-live refused: {msg}', v_n;")
    w('  end if;')
w(f"  select count(*) into v_n from public.academy_quiz_questions where app_slug = '{S}'")
w('     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);')
w('  if v_n <> 0 then')
w("    raise exception 'D5 go-live refused: % question(s) do not offer four options with a key inside them', v_n;")
w('  end if;')
w('  select count(*) into v_lessons from public.academy_course_structures s,')
w("         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk")
w(f"   where s.app_slug = '{S}' and s.active;")
w('  if v_lessons <> 78 then')
w(f"    raise exception 'D5 go-live refused: {S} carries % lesson keys, expected 78', v_lessons;")
w('  end if;')
w("  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m")
w(f"   where s.app_slug = '{S}' and s.active;")
w('  if v_modules <> 18 then')
w(f"    raise exception 'D5 go-live refused: {S} carries % modules, expected 18 (six per tier)', v_modules;")
w('  end if;')
w('  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq')
w(f"     where qq.app_slug = '{S}' and qq.scope = 'module' and not exists (")
w("       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m")
w("        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;")
w('  if v_n <> 0 then')
w("    raise exception 'D5 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;")
w('  end if;')
w(f"  select count(*) into v_capstones from public.academy_capstones where app_slug = '{S}';")
w('  if v_capstones <> 3 then')
w(f"    raise exception 'D5 go-live refused: {S} has % capstones, expected 3', v_capstones;")
w('  end if;')
w(f"  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}';")
w('  if v_graded <> 18 then')
w(f"    raise exception 'D5 go-live refused: {S} has % graded capstone fields, expected 18', v_graded;")
w('  end if;')
w(f"  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}' group by c.tier having count(*) <> 6) t;")
w('  if v_n <> 0 then')
w("    raise exception 'D5 go-live refused: % tier(s) do not grade exactly six fields', v_n;")
w('  end if;')
w(f"  if not exists (select 1 from public.academy_apps where slug = '{S}' and module = '{MODULE}' and path_order = {PATH_ORDER} and prereq_slug is null) then")
w(f"    raise exception 'D5 go-live refused: the {S} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';")
w('  end if;')
w(f"  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{S}') then")
w(f"    raise exception 'D5 go-live refused: another course already holds path_order {PATH_ORDER}';")
w('  end if;')
w('')
# ------------------------------------------------------------ the grader
w('  -- ------------------------------------------------- the grader is numeric')
TOL_ROWS = ', '.join(f"({lit(TIER_OF[k])}, {lit(k)}, {TOL[k]!r}::numeric)" for k in KEYS)
w("  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names")
w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
w(f"   where c.app_slug = '{S}'")
w("     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'")
w("          or abs((f->>'expected')::numeric) <= 0.001")
w("          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001")
w(f"          or (f->>'tol')::numeric is distinct from (select t.tol from (values {TOL_ROWS}) t(tier, k, tol) where t.tier = c.tier and t.k = f->>'key')")
w("          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');")
w('  if v_n <> 0 then')
w("    raise exception 'D5 go-live refused: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;")
w('  end if;')
w("  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names")
w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
w(f"   where c.app_slug = '{S}'")
w("     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric")
w("          or ((f->>'tol')::numeric = 0.0000005")
w("              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric")
w("                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));")
w('  if v_n <> 0 then')
w("    raise exception 'D5 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or, at the six-decimal floor, pass one a unit off in the sixth decimal: %', v_n, v_names;")
w('  end if;')
w('')

# ------------------------------------------------------------ the prompts
w('  -- ---------------------------------------- the prompts the learner reads')
n = GC.n
STATED = {
    'beginner': [f"BM25 with k1 {n(ORS['k1'])} and b {n(ORS['b'])}", f"cutoff k {n(ORS['k'])}",
                 f"relevant at grade {n(ORS['relevantGrade'])} or more", f"numericRelTol {n(ORS['numericRelTol'])}",
                 'the stop list off', f"TF-IDF with {ORS['tfidf']}", f"\"{ORS['idfTerm']}\"",
                 f"query {ORS['topQuery']}", f"query {ORS['cosQuery']}", 'cites and retrieved']
                + [f for f, _ in GC.CASES['beginner']],
    'intermediate': [f"cut at {n(NNS['k'])}", f"BM25 with k1 {n(NNS['P']['k1'])} and b {n(NNS['P']['b'])}",
                     'sublinear tf on', f"relevant at grade {n(NNS['mapGrade'])} or more", 'exponential gain',
                     f"seed {n(NNS['bootSeed'])}, {n(NNS['nBoot'])} replicates, level {n(NNS['level'])}",
                     'paired bootstrap', 'P minus Q', f"numericRelTol {n(NNS['numericRelTol'])}", "Q's run for that query"]
                    + [f for f, _ in GC.CASES['intermediate']],
    'advanced': ['unweighted, with the labels 0, 1, 2 and 3', 'linear weights', f"{n(AWS['bins'])} equal-width bins",
                 AWS['edgeRule'], '1 closes the last bin', 'eq. 7', 'twice the pooled within-bin covariance']
                + [f for f, _ in GC.CASES['advanced']],
}
for tier in GC.TIERS:
    cert, dataset, title, prompt = GC.TIER[tier]
    for s_ in STATED[tier]:
        if s_ not in prompt:
            refused.append(f'{tier} prompt does not carry the stated setting "{s_}"')
    md5 = hashlib.md5(prompt.encode('utf-8')).hexdigest()
    w(f"  select prompt into v_prompt from public.academy_capstones where app_slug = '{S}' and tier = '{tier}';")
    w(f"  if v_prompt is null or md5(v_prompt) <> '{md5}' then")
    w(f"    raise exception 'D5 go-live refused: the {tier} prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);")
    w('  end if;')
    w(f"  if not exists (select 1 from public.academy_capstones where app_slug = '{S}' and tier = '{tier}'")
    w(f"                    and cert_tier = '{cert}' and dataset = {lit(dataset)} and title = {lit(title)}) then")
    w(f"    raise exception 'D5 go-live refused: the {tier} capstone does not carry the certificate tier, dataset and title gen_course.py rendered';")
    w('  end if;')
    w("  select count(*), string_agg(l, ' / ') into v_n, v_names")
    w(f"    from unnest(array[{', '.join(lit(s_) for s_ in STATED[tier])}]) l where strpos(v_prompt, l) = 0;")
    w('  if v_n <> 0 then')
    w(f"    raise exception 'D5 go-live refused: % stated setting(s) or case file(s) are not named in the shipped {tier} prompt: %', v_n, v_names;")
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
w("    raise exception 'D5 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;")
w('  end if;')
w('')

# ---------------------------------------------------- the graded values
w('  -- --------------------------------------- the eighteen graded values')
for k in KEYS:
    w(f"  select (f->>'expected')::double precision into {V[k]}")
    w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
    w(f"   where c.app_slug = '{S}' and c.tier = '{TIER_OF[k]}' and f->>'key' = '{k}';")
    w(f'  if {V[k]} is null then')
    w(f"    raise exception 'D5 go-live refused: the seeded rows carry no value{name(k)}';")
    w('  end if;')
w('')

# ------------------------------------------------------ 1. the ledger
w('  -- ------------------------------------------ 1. against the engine ledger')
for k in KEYS:
    COUNT['ledger'].add(k)
    w(f'  if {V[k]} <> {fl(ENGINE[k])} then')
    w(f"    raise exception 'D5 go-live refused: the seeded value is %, and the engine returned {repr(float(ENGINE[k]))}{name(k)}', {V[k]};")
    w('  end if;')
w('')

# ------------------------------------------------- 2. the second route
w('  -- ----------------------------------------------- 2. the second route in SQL')
K1, B, OK = fl(ORS['k1']), fl(ORS['b']), ORS['k']
TG, TC = lit(ORS['idfTerm']), ORS['topQuery']
w(f"  v_run := pg_temp.d5_run(v_or_ids, v_or_tx, v_or_qids, v_or_qtx, 'bm25', {OK}, {K1}, {B}, false);")
w('  if v_run <> v_or_ret then')
w("    raise exception 'D5 go-live refused: the second route re-ranks the ORLU queries as %, and the case file hands %"
  f"{name('orlu_bm25_mean_recall_at4', 'orlu_bm25_mrr_at4', 'orlu_answers_supported_fraction')}', v_run, v_or_ret;")
w('  end if;')
route('orlu_bm25_idf_pressure', [f'v_s := pg_temp.d5_bm25_idf(v_or_tx, {TG});'])
w(f"  v_r := pg_temp.d5_bm25(v_or_tx, {lit(ORQ[TC])}, {K1}, {B});")
route('orlu_o1_bm25_top_score', ['v_s := (select max(x) from unnest(v_r) x);'])
w(f"  v_c := pg_temp.d5_tfidf(v_or_tx, {lit(ORQ[ORS['cosQuery']])}, false);")
route('orlu_o4_tfidf_top_cosine', ['v_s := (select max(x) from unnest(v_c) x);'])
route('orlu_bm25_mean_recall_at4', [f"v_s := pg_temp.d5_mean(v_run, v_or_j, {OK}, {ORS['relevantGrade']}, 'linear', 2);"])
route('orlu_bm25_mrr_at4', [f"v_s := pg_temp.d5_mean(v_run, v_or_j, {OK}, {ORS['relevantGrade']}, 'linear', 3);"])
route('orlu_answers_supported_fraction', [f"v_s := (pg_temp.d5_ground(v_or_ids, v_or_tx, v_or_ans, v_run, {fl(ORS['numericRelTol'])}))[1];"])

NK = NNS['k']
w(f"  v_rp := pg_temp.d5_run(v_nn_ids, v_nn_tx, v_nn_qids, v_nn_qtx, 'bm25', {NK}, {fl(NNS['P']['k1'])}, {fl(NNS['P']['b'])}, false);")
w(f"  v_rq := pg_temp.d5_run(v_nn_ids, v_nn_tx, v_nn_qids, v_nn_qtx, 'tfidf', {NK}, null, null, {'true' if NNS['Q']['sublinearTf'] else 'false'});")
w('  if v_rp <> v_nn_p or v_rq <> v_nn_q then')
w("    raise exception 'D5 go-live refused: the second route re-ranks the NNEWI runs differently from the lists the case file hands the learner"
  f"{name('nnewi_p_map_at5_grade2', 'nnewi_q_ndcg_at5_exponential', 'nnewi_paired_ndcg_upper', 'nnewi_q_supported_fraction')}';")
w('  end if;')
route('nnewi_p_map_at5_grade2', [f"v_s := pg_temp.d5_mean(v_rp, v_nn_j, {NK}, {NNS['mapGrade']}, 'linear', 4);"])
route('nnewi_q_ndcg_at5_exponential', [f"v_s := pg_temp.d5_mean(v_rq, v_nn_j, {NK}, {NNS['ndcgGrade']}, 'exponential', 7);"])
route('nnewi_short_mean_token_f1', ['v_s := (select avg((pg_temp.d5_f1(pg_temp.d5_squad(v_nn_sa[i2]), pg_temp.d5_squad(v_nn_sr[i2])))[1])',
                                    '          from generate_subscripts(v_nn_sa, 1) i2);'])
w('  v_k := pg_temp.d5_extract(v_nn_xf, v_nn_xl, v_nn_xp);')
route('nnewi_extraction_macro_f1', ['v_s := v_k[1];'])
w(f"  v_dp := pg_temp.d5_per(v_rp, v_nn_j, {NK}, {NNS['ndcgGrade']}, 'linear', 7);")
w(f"  v_dq := pg_temp.d5_per(v_rq, v_nn_j, {NK}, {NNS['ndcgGrade']}, 'linear', 7);")
BOOT = f"{NNS['nBoot']}, {NNS['bootSeed']}, {fl(NNS['level'])}"
route('nnewi_paired_ndcg_upper', [f"v_s := (pg_temp.d5_boot(v_dp, v_dq, {BOOT}, true))[2];"])
route('nnewi_q_supported_fraction', [f"v_s := (pg_temp.d5_ground(v_nn_ids, v_nn_tx, v_nn_ans, v_rq, {fl(NNS['numericRelTol'])}))[1];"])

w("  v_k := pg_temp.d5_kappa(v_aw_a, v_aw_b, v_aw_l, 'none');")
route('awka_kappa_unweighted', ['v_s := v_k[1];'])
w("  v_k := pg_temp.d5_kappa(v_aw_a, v_aw_b, v_aw_l, 'linear');")
route('awka_kappa_linear', ['v_s := v_k[1];'])
w(f"  v_c := pg_temp.d5_cal(v_aw_y, v_aw_p, {AWS['bins']}, 'engine');")
route('awka_brier', ['v_s := v_c[1];'])
route('awka_reliability_bins8', ['v_s := v_c[2];'])
route('awka_resolution_bins8', ['v_s := v_c[3];'])
route('awka_wbc_bins8', ['v_s := v_c[6];'])
w('')

# ------------------------------------------------------------ 3. the traps
w('  -- ------------------------------------------------------------- 3. the traps')
w('  -- The traps recompute what they read, so they stand when the blocks above')
w('  -- are cut (the dry run cuts them to prove a trap fires on its own).')
w(f"  v_run := pg_temp.d5_run(v_or_ids, v_or_tx, v_or_qids, v_or_qtx, 'bm25', {OK}, {K1}, {B}, false);")
w(f"  v_r := pg_temp.d5_bm25(v_or_tx, {lit(ORQ[TC])}, {K1}, {B});")
w(f"  v_rp := pg_temp.d5_run(v_nn_ids, v_nn_tx, v_nn_qids, v_nn_qtx, 'bm25', {NK}, {fl(NNS['P']['k1'])}, {fl(NNS['P']['b'])}, false);")
w(f"  v_rq := pg_temp.d5_run(v_nn_ids, v_nn_tx, v_nn_qids, v_nn_qtx, 'tfidf', {NK}, null, null, {'true' if NNS['Q']['sublinearTf'] else 'false'});")
w(f"  v_dp := pg_temp.d5_per(v_rp, v_nn_j, {NK}, {NNS['ndcgGrade']}, 'linear', 7);")
w(f"  v_dq := pg_temp.d5_per(v_rq, v_nn_j, {NK}, {NNS['ndcgGrade']}, 'linear', 7);")
w(f'  v_df := (select count(*) from unnest(v_or_tx) t where {TG} = any(pg_temp.d5_tok(t)));')
NOR = len(OR['documents'])
trap('orlu_bm25_idf_pressure', 'the Robertson idf without the 1 +', [f'v_wrong := ln(({NOR} - v_df + 0.5) / (v_df + 0.5));'])
trap('orlu_bm25_idf_pressure', 'the idf in log base 10', [f'v_wrong := log(1.0 + ({NOR} - v_df + 0.5) / (v_df + 0.5));'])
trap('orlu_bm25_idf_pressure', 'the TF-IDF smoothed idf', [f'v_wrong := ln((1.0 + {NOR}) / (1.0 + v_df)) + 1;'])
trap('orlu_o1_bm25_top_score', 'b at 0', [f"v_wrong := (select max(x) from unnest(pg_temp.d5_bm25(v_or_tx, {lit(ORQ[TC])}, {K1}, 0.0::double precision)) x);"])
trap('orlu_o1_bm25_top_score', 'k1 at 2', [f"v_wrong := (select max(x) from unnest(pg_temp.d5_bm25(v_or_tx, {lit(ORQ[TC])}, 2.0::double precision, {B})) x);"])
trap('orlu_o1_bm25_top_score', 'the second-ranked score', ['v_wrong := (select x from unnest(v_r) x order by x desc offset 1 limit 1);'])
trap('orlu_o1_bm25_top_score', 'the TF-IDF cosine quoted', [f"v_wrong := (select max(x) from unnest(pg_temp.d5_tfidf(v_or_tx, {lit(ORQ[TC])}, false)) x);"])
trap('orlu_o4_tfidf_top_cosine', 'sublinear tf', [f"v_wrong := (select max(x) from unnest(pg_temp.d5_tfidf(v_or_tx, {lit(ORQ[ORS['cosQuery']])}, true)) x);"])
trap('orlu_o4_tfidf_top_cosine', 'the second-ranked cosine',
     [f"v_wrong := (select x from unnest(pg_temp.d5_tfidf(v_or_tx, {lit(ORQ[ORS['cosQuery']])}, false)) x order by x desc offset 1 limit 1);"])
trap('orlu_o4_tfidf_top_cosine', 'the BM25 score quoted', [f"v_wrong := (select max(x) from unnest(pg_temp.d5_bm25(v_or_tx, {lit(ORQ[ORS['cosQuery']])}, {K1}, {B})) x);"])
trap('orlu_bm25_mean_recall_at4', 'cutoff 2', [f"v_wrong := pg_temp.d5_mean(v_run, v_or_j, 2, {ORS['relevantGrade']}, 'linear', 2);"])
trap('orlu_bm25_mean_recall_at4', 'relevant at grade 2', [f"v_wrong := pg_temp.d5_mean(v_run, v_or_j, {OK}, 2, 'linear', 2);"])
trap('orlu_bm25_mean_recall_at4', 'the mean precision quoted', [f"v_wrong := pg_temp.d5_mean(v_run, v_or_j, {OK}, {ORS['relevantGrade']}, 'linear', 1);"])
trap('orlu_bm25_mrr_at4', 'relevant at grade 2', [f"v_wrong := pg_temp.d5_mean(v_run, v_or_j, {OK}, 2, 'linear', 3);"])
trap('orlu_bm25_mrr_at4', 'cutoff 1', [f"v_wrong := pg_temp.d5_mean(v_run, v_or_j, 1, {ORS['relevantGrade']}, 'linear', 3);"])
trap('orlu_bm25_mrr_at4', 'the MAP quoted', [f"v_wrong := pg_temp.d5_mean(v_run, v_or_j, {OK}, {ORS['relevantGrade']}, 'linear', 4);"])
w(f"  v_k := pg_temp.d5_ground(v_or_ids, v_or_tx, v_or_ans, v_run, {fl(ORS['numericRelTol'])});")
trap('orlu_answers_supported_fraction', 'the retrieved lists ignored', [f"v_wrong := (pg_temp.d5_ground(v_or_ids, v_or_tx, v_or_ans, null, {fl(ORS['numericRelTol'])}))[1];"])
trap('orlu_answers_supported_fraction', 'the mean of the per-answer fractions', ['v_wrong := v_k[2];'])
trap('orlu_answers_supported_fraction', 'the numbers alone', ['v_wrong := v_k[3];'])
trap('nnewi_p_map_at5_grade2', 'relevant at grade 1', [f"v_wrong := pg_temp.d5_mean(v_rp, v_nn_j, {NK}, 1, 'linear', 4);"])
trap('nnewi_p_map_at5_grade2', 'system Q', [f"v_wrong := pg_temp.d5_mean(v_rq, v_nn_j, {NK}, {NNS['mapGrade']}, 'linear', 4);"])
trap('nnewi_p_map_at5_grade2', 'cutoff 3', [f"v_wrong := pg_temp.d5_mean(v_rp, v_nn_j, 3, {NNS['mapGrade']}, 'linear', 4);"])
trap('nnewi_q_ndcg_at5_exponential', 'linear gain', [f"v_wrong := pg_temp.d5_mean(v_rq, v_nn_j, {NK}, 1, 'linear', 7);"])
trap('nnewi_q_ndcg_at5_exponential', 'system P', [f"v_wrong := pg_temp.d5_mean(v_rp, v_nn_j, {NK}, 1, 'exponential', 7);"])
trap('nnewi_q_ndcg_at5_exponential', 'cutoff 3', ["v_wrong := pg_temp.d5_mean(v_rq, v_nn_j, 3, 1, 'exponential', 7);"])
trap('nnewi_short_mean_token_f1', 'the exact-match rate', ['v_wrong := (select avg(case when pg_temp.d5_squad(v_nn_sa[i2]) = pg_temp.d5_squad(v_nn_sr[i2]) then 1.0 else 0.0 end)',
                                                         '              from generate_subscripts(v_nn_sa, 1) i2);'])
trap('nnewi_short_mean_token_f1', 'the mean token precision', ['v_wrong := (select avg(coalesce((pg_temp.d5_f1(pg_temp.d5_squad(v_nn_sa[i2]), pg_temp.d5_squad(v_nn_sr[i2])))[2], 0))',
                                                             '              from generate_subscripts(v_nn_sa, 1) i2);'])
trap('nnewi_short_mean_token_f1', 'the mean token recall', ['v_wrong := (select avg(coalesce((pg_temp.d5_f1(pg_temp.d5_squad(v_nn_sa[i2]), pg_temp.d5_squad(v_nn_sr[i2])))[3], 0))',
                                                          '              from generate_subscripts(v_nn_sa, 1) i2);'])
w('  v_k := pg_temp.d5_extract(v_nn_xf, v_nn_xl, v_nn_xp);')
trap('nnewi_extraction_macro_f1', 'the micro F1', ['v_wrong := v_k[2];'])
trap('nnewi_extraction_macro_f1', 'the macro accuracy', ['v_wrong := v_k[3];'])
trap('nnewi_extraction_macro_f1', 'the text fields alone', ['v_wrong := v_k[6];'])
trap('nnewi_paired_ndcg_upper', 'the lower bound', [f"v_wrong := (pg_temp.d5_boot(v_dp, v_dq, {BOOT}, true))[1];"])
trap('nnewi_paired_ndcg_upper', 'the unpaired bootstrap', [f"v_wrong := (pg_temp.d5_boot(v_dp, v_dq, {BOOT}, false))[2];"])
trap('nnewi_paired_ndcg_upper', 'the next seed', [f"v_wrong := (pg_temp.d5_boot(v_dp, v_dq, {NNS['nBoot']}, {NNS['bootSeed'] + 1}, {fl(NNS['level'])}, true))[2];"])
trap('nnewi_paired_ndcg_upper', 'Q minus P', [f"v_wrong := (pg_temp.d5_boot(v_dq, v_dp, {BOOT}, true))[2];"])
w(f"  v_k := pg_temp.d5_ground(v_nn_ids, v_nn_tx, v_nn_ans, v_rq, {fl(NNS['numericRelTol'])});")
trap('nnewi_q_supported_fraction', 'the retrieved lists ignored', [f"v_wrong := (pg_temp.d5_ground(v_nn_ids, v_nn_tx, v_nn_ans, null, {fl(NNS['numericRelTol'])}))[1];"])
trap('nnewi_q_supported_fraction', 'the mean of the per-answer fractions', ['v_wrong := v_k[2];'])
trap('nnewi_q_supported_fraction', 'the numbers alone', ['v_wrong := v_k[3];'])
w("  v_k := pg_temp.d5_kappa(v_aw_a, v_aw_b, v_aw_l, 'none');")
trap('awka_kappa_unweighted', 'the observed agreement quoted', ['v_wrong := v_k[2];'])
trap('awka_kappa_unweighted', 'linear weights', ["v_wrong := (pg_temp.d5_kappa(v_aw_a, v_aw_b, v_aw_l, 'linear'))[1];"])
trap('awka_kappa_unweighted', 'quadratic weights', ["v_wrong := (pg_temp.d5_kappa(v_aw_a, v_aw_b, v_aw_l, 'quadratic'))[1];"])
trap('awka_kappa_linear', 'unweighted', ['v_wrong := v_k[1];'])
trap('awka_kappa_linear', 'quadratic weights', ["v_wrong := (pg_temp.d5_kappa(v_aw_a, v_aw_b, v_aw_l, 'quadratic'))[1];"])
trap('awka_kappa_linear', 'one minus the observed weighted disagreement', ["v_wrong := 1 - (pg_temp.d5_kappa(v_aw_a, v_aw_b, v_aw_l, 'linear'))[3];"])
w(f"  v_c := pg_temp.d5_cal(v_aw_y, v_aw_p, {AWS['bins']}, 'engine');")
w(f"  v_r := pg_temp.d5_cal(v_aw_y, v_aw_p, {AWS['bins']}, 'library');")
w("  v_k := pg_temp.d5_cal(v_aw_y, v_aw_p, 10, 'engine');")
trap('awka_brier', 'the ECE quoted', ['v_wrong := v_c[7];'])
trap('awka_brier', 'REL - RES + UNC without the within-bin terms', ['v_wrong := v_c[2] - v_c[3] + v_c[4];'])
trap('awka_brier', 'the mean absolute difference', ['v_wrong := (select avg(abs(v_aw_p[i2] - v_aw_y[i2])) from generate_subscripts(v_aw_p, 1) i2);'])
trap('awka_reliability_bins8', 'ten bins', ['v_wrong := v_k[2];'])
trap('awka_reliability_bins8', 'the library edge rule', ['v_wrong := v_r[2];'])
trap('awka_reliability_bins8', 'the resolution quoted', ['v_wrong := v_c[3];'])
trap('awka_resolution_bins8', 'ten bins', ['v_wrong := v_k[3];'])
trap('awka_resolution_bins8', 'the reliability quoted', ['v_wrong := v_c[2];'])
trap('awka_resolution_bins8', 'the uncertainty quoted', ['v_wrong := v_c[4];'])
trap('awka_wbc_bins8', 'the within-bin variance quoted', ['v_wrong := v_c[5];'])
trap('awka_wbc_bins8', 'ten bins', ['v_wrong := v_k[6];'])
trap('awka_wbc_bins8', 'the pooled within-bin covariance without the factor 2', ['v_wrong := v_c[6] / 2.0;'])
trap('awka_wbc_bins8', 'the library edge rule', ['v_wrong := v_r[6];'])
w('')

# ------------------------------------------------------------ the flip
w('  -- ------------------------------------------------------------- the flip')
w(f"  update public.academy_apps set status = 'available' where slug = '{S}';")
w(f"  if not exists (select 1 from public.academy_apps where slug = '{S}' and status = 'available') then")
w(f"    raise exception 'D5 go-live refused: {S} did not reach status available';")
w('  end if;')
w("  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')")
w('    into v_available, v_soon from public.academy_apps;')
w(f"  raise notice 'D5 go-live: {S} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',")
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
                 if not l.lstrip().startswith('--') and not re.match(r"\s*v_(or|nn|aw)_\w+ (text|jsonb|int|double)", l))
bare = re.findall(r'/\s*(?:\d+(?![\d.])|count\([^)]*\)(?!::double precision)|array_length\([^)]*\)(?!::double precision))', code)
if bare:
    refused.append(f'bare integer denominator(s): {bare[:5]}')
odd = [ln for ln, l in enumerate(SQL.splitlines(), 1)
       if not l.lstrip().startswith('--') and l.split('--', 1)[0].count("'") % 2
       and not re.match(r"\s*v_(or|nn|aw)_\w+ (text|jsonb|int|double)", l)]
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
