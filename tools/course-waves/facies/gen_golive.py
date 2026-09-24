#!/usr/bin/env python3
"""Generate the D3 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction,
and checked three ways, none of which restates the generator that wrote them.
Modelled on tools/course-waves/mlcore/gen_golive.py (D2).

1. AGAINST THE ENGINE LEDGER. gen_course.py runs `node d3_capstone.mjs --json`
   through the vendored engines/dataai/cluster.js when this file is generated,
   and refuses unless fields.json carries exactly what that run returned. The
   go-live compares the seeded rows to THAT RUN'S values, to the last bit, so a
   capstone row an earlier seed left behind (the course migration inserts with
   `on conflict do nothing`) is refused by name, and so is a move of one part in
   1e7.

2. BY A SECOND ROUTE IN SQL over the data the learner is handed in the case
   files. Every graded value is recomputed by Postgres with no engine code, on
   roads the engine does not take where one exists: the scalers by the SQL
   aggregates stddev_pop, stddev_samp, min and max; the first principal
   component by POWER ITERATION on Z'Z / (n - 1) (the engine uses cyclic Jacobi
   rotations on every eigenvalue); k-means++ and Lloyd passes with the
   mulberry32 stream rebuilt in 64-bit integer arithmetic; Ward from CLUSTER
   CENTROIDS AND SIZES, sqrt(2 |A||B| / (|A| + |B|)) ||c_A - c_B|| (the engine
   uses the Lance-Williams update of a distance matrix); the silhouette,
   adjusted Rand index and classification report from their definitions (F1
   as 2 P R / (P + R), the engine's is 2 tp / (2 tp + fp + fn)); one-to-one
   matching by ENUMERATING every map (the engine runs the Hungarian method);
   kNN by sorting every distance in SQL; and the CART tree with every split
   scored EXACTLY in numeric on counts gathered by SQL. Each must agree with
   the seeded value to 1e-9 relative. The route refuses, rather than guesses,
   where the engine's tie band would decide (a tied merge, a tie across the
   k-th neighbour, two best one-to-one maps).

3. BY THE TRAPS THE COURSE IS BUILT ON, which must BITE: for every field, two
   or more wrong methods a learner who missed the lesson would use (each one
   already swept with the ENGINE by discriminate.mjs) are computed in SQL, and
   the go-live refuses unless each misses the graded value by more than the
   field's tolerance.

And, before any of it: the shape of the ladder (3 structures, 78 lesson keys,
18 modules, 396 questions, 132 a tier, 15 a module bank, 42 an exam, four
options with a key inside them, 3 capstones, 18 fields, 6 a tier), the numeric
grader simulated on every field, each prompt byte for byte (md5) as
gen_course.py rendered it with every stated setting and case file named, and a
prompt sweep: no number handed in any capstone text sits within its tolerance
of any graded value. Two graded values are negative (a loading and a score,
whose sign the engine's sign rule fixes), so a graded value must be non-zero
and non-whole, and the grader is simulated on its signed value.

THE HELPERS ARE TEMPORARY FUNCTIONS, read from golive_helpers.sql beside this
file and created in pg_temp at the head of the go-live (create or replace, so a
second run in one session changes nothing). They vanish with the session and
create nothing in any schema a learner or another migration can see.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a graded field without a ledger check, a second route and two traps; a
division by a bare integer; an unclosed literal; an em or en dash.

Usage: python3 gen_golive.py
   D3_WAVE, D3_REPO, D3_ENGINES, D3_TOLERANCE as gen_course.py
   D3_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   D3_GOLIVE_OUT  where to write
"""
import hashlib
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
W = os.environ.get('D3_WAVE', '/root/dai-wip-facies')
REPO = os.environ.get('D3_REPO', '/root/wt-dai-d3-nextgen')
sys.path.insert(0, HERE)
os.environ['D3_WAVE'] = W
import gen_course as GC  # noqa: E402  (runs the engine; writes nothing on import)

DATE = GC.DATE
COURSE = os.environ.get('D3_COURSE_SQL', f'{REPO}/migrations/{DATE}_d3_facies_course.sql')
OUT = os.environ.get('D3_GOLIVE_OUT', f'{REPO}/migrations/{DATE}_d3_facies_go_live.sql')
SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
fields = GC.fields
KEYS, TIER_OF, F, TOL = GC.KEYS, GC.TIER_OF, GC.F, GC.TOL
ENGINE = {k: GC.ENGINE[(TIER_OF[k], k)] for k in KEYS}
IH, NK, OG = GC.IH, GC.NK, GC.OG
IHS, NKS, OGS = GC.IHS, GC.NKS, GC.OGS
refused = list(GC.bad)

course_sql = open(COURSE, encoding='utf-8').read()
if course_sql != GC.SQL:
    refused.append(f'the course migration at {COURSE} is not the one gen_course.py renders now')
TOL6 = 5e-7
for k in KEYS:
    if TOL[k] != TOL6:
        refused.append(f'{k} is graded at {TOL[k]}; every D3 field is graded at the six-decimal floor {TOL6}')


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


P = []  # the body
w = P.append
COUNT = {'ledger': set(), 'route': set(), 'trap': {}}


def route(key, expr_lines):
    """expr_lines compute v_s; then compare with the seeded value."""
    COUNT['route'].add(key)
    for l in expr_lines:
        w('  ' + l)
    w(f'  if v_s is null or abs(v_s - {V[key]}) > 1e-9 * greatest(1.0, abs({V[key]})) then')
    w(f"    raise exception 'D3 go-live refused: the second route in SQL gives %, and the seeded value is %{name(key)}', v_s, {V[key]};")
    w('  end if;')


def trap(key, label, expr_lines):
    COUNT['trap'][key] = COUNT['trap'].get(key, 0) + 1
    for l in expr_lines:
        w('  ' + l)
    w(f'  if v_wrong is null or abs(v_wrong - {V[key]}) <= {fl(TOL[key])} then')
    w(f"    raise exception 'D3 go-live refused: {label} gives %, within the tolerance of the seeded %, so the field does not discriminate the trap{name(key)}', v_wrong, {V[key]};")
    w('  end if;')




def tarr_null(xs):
    return 'array[' + ', '.join('null' if x is None else lit(x) for x in xs) + ']::text[]'


V = {k: f'v_g_{k}' for k in KEYS}

# ------------------------------------------------------------------- header
HEADER = f"""-- ============================================================================
-- D3 GO-LIVE (HELD): Electrofacies flips to 'available', the THIRD course of
-- the Data & AI module, at path_order {PATH_ORDER}.
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
"""

HELPERS = open(os.path.join(HERE, 'golive_helpers.sql'), encoding='utf-8').read()

# -------------------------------------------------------------- declarations
decl = ['do $$', '#variable_conflict use_column', 'declare',
        '  v_structures int; v_questions int; v_capstones int; v_lessons int;',
        '  v_modules int; v_graded int; v_available int; v_soon int; v_n int; i int; j int;',
        '  v_names text; v_prompt text; v_s double precision; v_wrong double precision;',
        '  v_x double precision[]; v_x5 double precision[]; v_z double precision[]; v_r double precision[];',
        '  v_km double precision[]; v_k3 double precision[]; v_h double precision[]; v_hc double precision[];',
        '  v_lab int[]; v_labc int[]; v_pred text[]; v_dist double precision[]; v_tree jsonb; v_cls text[];',
        '  v_tr int[]; v_te int[]; v_cored int[]; v_un int[]; v_ytr text[]; v_yte text[]; v_cs double precision[];']
for k in KEYS:
    decl.append(f'  {V[k]} double precision;')
CH = ['depth', 'GR', 'RHOB', 'NPHI', 'PEF', 'CALI']
for pre, fld in (('ih', IH['field']), ('nk', NK['field']), ('og', OG['field'])):
    decl.append(f"  v_{pre}_well text[] := {tarr([r['well'] for r in fld['rows']])};")
    decl.append(f"  v_{pre}_fac text[] := {tarr_null([r['FACIES'] for r in fld['rows']])};")
    for c in CH:
        decl.append(f"  v_{pre}_{c.lower()} double precision[] := {arr([r[c] for r in fld['rows']])};")
decl += ['begin', '']

# ------------------------------------------------------------------- shape
S = SLUG
w('  -- ---------------------------------------------------------------- shape')
w(f"  select count(*) into v_structures from public.academy_course_structures where app_slug = '{S}' and active;")
w("  if v_structures <> 3 then")
w(f"    raise exception 'D3 go-live refused: {S} has % active deep structures, expected 3', v_structures;")
w('  end if;')
w(f"  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{S}';")
w('  if v_questions <> 396 then')
w(f"    raise exception 'D3 go-live refused: {S} has % quiz questions, expected 396', v_questions;")
w('  end if;')
for cond, msg in ((f"select tier from public.academy_quiz_questions where app_slug = '{S}' group by tier having count(*) <> 132",
                   '% tier(s) do not carry exactly 132 questions'),
                  (f"select tier, module_key from public.academy_quiz_questions where app_slug = '{S}' and scope = 'module' group by tier, module_key having count(*) <> 15",
                   '% module bank(s) do not carry exactly 15 questions'),
                  (f"select tier from public.academy_quiz_questions where app_slug = '{S}' and scope = 'final' group by tier having count(*) <> 42",
                   '% final exam(s) do not carry exactly 42 questions')):
    w(f'  select count(*) into v_n from ({cond}) t;')
    w('  if v_n <> 0 then')
    w(f"    raise exception 'D3 go-live refused: {msg}', v_n;")
    w('  end if;')
w(f"  select count(*) into v_n from public.academy_quiz_questions where app_slug = '{S}'")
w('     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);')
w('  if v_n <> 0 then')
w("    raise exception 'D3 go-live refused: % question(s) do not offer four options with a key inside them', v_n;")
w('  end if;')
w('  select count(*) into v_lessons from public.academy_course_structures s,')
w("         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk")
w(f"   where s.app_slug = '{S}' and s.active;")
w('  if v_lessons <> 78 then')
w(f"    raise exception 'D3 go-live refused: {S} carries % lesson keys, expected 78', v_lessons;")
w('  end if;')
w("  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m")
w(f"   where s.app_slug = '{S}' and s.active;")
w('  if v_modules <> 18 then')
w(f"    raise exception 'D3 go-live refused: {S} carries % modules, expected 18 (six per tier)', v_modules;")
w('  end if;')
w('  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq')
w(f"     where qq.app_slug = '{S}' and qq.scope = 'module' and not exists (")
w("       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m")
w("        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;")
w('  if v_n <> 0 then')
w("    raise exception 'D3 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;")
w('  end if;')
w(f"  select count(*) into v_capstones from public.academy_capstones where app_slug = '{S}';")
w('  if v_capstones <> 3 then')
w(f"    raise exception 'D3 go-live refused: {S} has % capstones, expected 3', v_capstones;")
w('  end if;')
w(f"  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}';")
w('  if v_graded <> 18 then')
w(f"    raise exception 'D3 go-live refused: {S} has % graded capstone fields, expected 18', v_graded;")
w('  end if;')
w(f"  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}' group by c.tier having count(*) <> 6) t;")
w('  if v_n <> 0 then')
w("    raise exception 'D3 go-live refused: % tier(s) do not grade exactly six fields', v_n;")
w('  end if;')
w(f"  if not exists (select 1 from public.academy_apps where slug = '{S}' and module = '{MODULE}' and path_order = {PATH_ORDER} and prereq_slug is null) then")
w(f"    raise exception 'D3 go-live refused: the {S} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';")
w('  end if;')
w(f"  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{S}') then")
w(f"    raise exception 'D3 go-live refused: another course already holds path_order {PATH_ORDER}';")
w('  end if;')
w('')

# ------------------------------------------------------------ the grader
w('  -- ------------------------------------------------- the grader is numeric')
w("  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names")
w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
w(f"   where c.app_slug = '{S}'")
w("     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'")
w("          or abs((f->>'expected')::numeric) <= 0.001")
w("          or abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= 0.001")
w("          or (f->>'tol')::numeric <> 0.0000005")
w("          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');")
w('  if v_n <> 0 then')
w("    raise exception 'D3 go-live refused: % graded field(s) are not a non-zero, non-whole number at tolerance 0.0000005 with a label and a unit: %', v_n, v_names;")
w('  end if;')
w("  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names")
w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
w(f"   where c.app_slug = '{S}'")
w("     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric")
w("          or abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric")
w("          or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric);")
w('  if v_n <> 0 then')
w("    raise exception 'D3 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or pass one a unit off in the sixth decimal: %', v_n, v_names;")
w('  end if;')
w('')


# ------------------------------------------------------------ the prompts
w('  -- ---------------------------------------- the prompts the learner reads')
n = GC.n
STATED = {
    'beginner': [f"k-means with k {n(IHS['k'])}, seed {n(IHS['seed'])} and {GC.NINIT_DEFAULT} starts",
                 'the population standard deviation (n)', f"row {n(IHS['centreRow'])}", 'the correlation matrix',
                 "the engine's sign convention"] + [f for f, _ in GC.CASES['beginner']],
    'intermediate': [f"over k 1 to {n(NKS['kMax'])} with seed {n(NKS['seed'])} and {GC.NINIT_DEFAULT} starts",
                     f"Ward linkage cut at k {n(NKS['k'])}", f"complete linkage cut at k {n(NKS['k'])}",
                     f"k-means at k {n(NKS['kOver'])}, seed {n(NKS['seed'])} and {GC.NINIT_DEFAULT} starts",
                     'scored on the standardised logs'] + [f for f, _ in GC.CASES['intermediate']],
    'advanced': [f"kNN with k {n(OGS['k'])}", f"row 0 of {OGS['heldOut']}", f"maxDepth {GC.MAXDEPTH_DEFAULT}",
                 'column order GR, RHOB, NPHI, PEF, CALI', f"maxDepth {n(OGS['depth'])}",
                 f"{n(OGS['hotAdd'])} gAPI high", 'fitted on the training rows'] + [f for f, _ in GC.CASES['advanced']],
}
for tier in GC.TIERS:
    cert, dataset, title, prompt = GC.TIER[tier]
    for s_ in STATED[tier]:
        if s_ not in prompt:
            refused.append(f'{tier} prompt does not carry the stated setting "{s_}"')
    md5 = hashlib.md5(prompt.encode('utf-8')).hexdigest()
    w(f"  select prompt into v_prompt from public.academy_capstones where app_slug = '{S}' and tier = '{tier}';")
    w(f"  if v_prompt is null or md5(v_prompt) <> '{md5}' then")
    w(f"    raise exception 'D3 go-live refused: the {tier} prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);")
    w('  end if;')
    w(f"  if not exists (select 1 from public.academy_capstones where app_slug = '{S}' and tier = '{tier}'")
    w(f"                    and cert_tier = '{cert}' and dataset = {lit(dataset)} and title = {lit(title)}) then")
    w(f"    raise exception 'D3 go-live refused: the {tier} capstone does not carry the certificate tier, dataset and title gen_course.py rendered';")
    w('  end if;')
    w("  select count(*), string_agg(l, ' / ') into v_n, v_names")
    w(f"    from unnest(array[{', '.join(lit(s_) for s_ in STATED[tier])}]) l where strpos(v_prompt, l) = 0;")
    w('  if v_n <> 0 then')
    w(f"    raise exception 'D3 go-live refused: % stated setting(s) or case file(s) are not named in the shipped {tier} prompt: %', v_n, v_names;")
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
w("    raise exception 'D3 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;")
w('  end if;')
w('')

# ---------------------------------------------------- the graded values
w('  -- --------------------------------------- the eighteen graded values')
for k in KEYS:
    w(f"  select (f->>'expected')::double precision into {V[k]}")
    w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
    w(f"   where c.app_slug = '{S}' and c.tier = '{TIER_OF[k]}' and f->>'key' = '{k}';")
    w(f'  if {V[k]} is null then')
    w(f"    raise exception 'D3 go-live refused: the seeded rows carry no value{name(k)}';")
    w('  end if;')
w('')

# ------------------------------------------------------ 1. the ledger
w('  -- ------------------------------------------ 1. against the engine ledger')
for k in KEYS:
    COUNT['ledger'].add(k)
    w(f'  if {V[k]} <> {fl(ENGINE[k])} then')
    w(f"    raise exception 'D3 go-live refused: the seeded value is %, and the engine returned {fl(ENGINE[k])}{name(k)}', {V[k]};")
    w('  end if;')
w('')


# ------------------------------------------------- 2. the second route
w('  -- ----------------------------------------------- 2. the second route in SQL')
NI = GC.NINIT_DEFAULT
MI = 300
IHK, IHSD, CR = IHS['k'], IHS['seed'], IHS['centreRow']
NKK, NKSD, NKKO = NKS['k'], NKS['seed'], NKS['kOver']
OGK, OGD, OGHOT = OGS['k'], OGS['depth'], OGS['hotAdd']
MD = GC.MAXDEPTH_DEFAULT
HELD, UNC = OGS['heldOut'], OGS['uncored']

OG_SETUP = [
    'v_x := pg_temp.d3_flat(array[v_og_gr, v_og_rhob, v_og_nphi, v_og_pef]);',
    'v_x5 := pg_temp.d3_flat(array[v_og_gr, v_og_rhob, v_og_nphi, v_og_pef, v_og_cali]);',
    f"v_tr := array(select i from generate_subscripts(v_og_well, 1) i where v_og_fac[i] is not null and v_og_well[i] <> {lit(HELD)} order by i);",
    f"v_te := array(select i from generate_subscripts(v_og_well, 1) i where v_og_well[i] = {lit(HELD)} order by i);",
    "v_cored := array(select i from generate_subscripts(v_og_well, 1) i where v_og_fac[i] is not null order by i);",
    f"v_un := array(select i from generate_subscripts(v_og_well, 1) i where v_og_well[i] = {lit(UNC)} order by i);",
    'v_ytr := array(select v_og_fac[i] from unnest(v_tr) with ordinality u(i, o) order by o);',
    'v_yte := array(select v_og_fac[i] from unnest(v_te) with ordinality u(i, o) order by o);',
    "v_cls := array(select distinct f collate \"C\" from unnest(v_og_fac) f where f is not null order by 1);",
    "v_cs := pg_temp.d3_fit(pg_temp.d3_rows(v_x, 4, v_tr), 4, 'pop');",
    f"select pred, dist into v_pred, v_dist from pg_temp.d3_knn(pg_temp.d3_apply(pg_temp.d3_rows(v_x, 4, v_tr), 4, v_cs), v_ytr, pg_temp.d3_apply(pg_temp.d3_rows(v_x, 4, v_te), 4, v_cs), 4, {OGK});",
    f"v_tree := pg_temp.d3_cart(pg_temp.d3_rows(v_x5, 5, v_cored), 5, array(select v_og_fac[i] from unnest(v_cored) with ordinality u(i, o) order by o), array(select g from generate_series(1, array_length(v_cored, 1)) g), 0, {MD}, v_cls);",
]


def dot4(z, row, v):
    return ' + '.join(f'{z}[{(row - 1) * 4 + j}] * {v}[{2 + j}]' for j in (1, 2, 3, 4))

# IHIALA
w('  v_x := pg_temp.d3_flat(array[v_ih_gr, v_ih_rhob, v_ih_nphi, v_ih_pef]);')
w("  v_r := pg_temp.d3_pc1(v_x, 4, 'samp');")
w("  v_z := pg_temp.d3_apply(v_x, 4, pg_temp.d3_fit(v_x, 4, 'samp'));")
route('ihiala_gr_scale_gapi', ["v_s := (pg_temp.d3_fit(v_x, 4, 'pop'))[5];"])
route('ihiala_pc1_ratio', ['v_s := v_r[1] / v_r[2];'])
route('ihiala_pc1_nphi_loading', ['v_s := v_r[5] * sqrt(v_r[1]);'])
route('ihiala_pc1_score_first_row', [f'v_s := {dot4("v_z", 1, "v_r")};'])
w("  v_z := pg_temp.d3_apply(v_x, 4, pg_temp.d3_fit(v_x, 4, 'pop'));")
w(f'  v_km := pg_temp.d3_kmeans(v_z, 4, {IHK}, {IHSD}, {NI}, {MI});')
w('  v_lab := pg_temp.d3_lab(v_km, 2);')
w('  if v_km[2] <> 1.0 then')
w("    raise exception 'D3 go-live refused: the second route k-means did not converge [graded field: beginner/ihiala_kmeans_inertia]';")
w('  end if;')
route('ihiala_kmeans_inertia', ['v_s := v_km[1];'])
route('ihiala_row24_cluster_gr_centre_gapi', [f'v_s := (select avg(v_ih_gr[i]) from generate_series(1, array_length(v_lab, 1)) i where v_lab[i] = v_lab[{CR + 1}]);'])

# NKWELLE
w('  v_x := pg_temp.d3_flat(array[v_nk_gr, v_nk_rhob, v_nk_nphi, v_nk_pef]);')
w("  v_z := pg_temp.d3_apply(v_x, 4, pg_temp.d3_fit(v_x, 4, 'pop'));")
w(f'  v_k3 := pg_temp.d3_kmeans(v_z, 4, {NKK - 1}, {NKSD}, {NI}, {MI});')
w(f'  v_km := pg_temp.d3_kmeans(v_z, 4, {NKK}, {NKSD}, {NI}, {MI});')
route('nkwelle_elbow_drop_fraction_k4', ['v_s := (v_k3[1] - v_km[1]) / v_k3[1];'])
w(f"  v_h := pg_temp.d3_hclust(v_z, 4, 'ward', {NKK});")
w(f"  v_hc := pg_temp.d3_hclust(v_z, 4, 'complete', {NKK});")
w('  v_lab := pg_temp.d3_lab(v_h, 2); v_labc := pg_temp.d3_lab(v_hc, 2);')
route('nkwelle_ward_silhouette', ['v_s := pg_temp.d3_sil(v_z, 4, v_lab);'])
route('nkwelle_ward_height_above_cut', ['v_s := v_h[2];'])
route('nkwelle_complete_ari', ['v_s := pg_temp.d3_ari(v_nk_fac, array(select l::text from unnest(v_labc) with ordinality t(l, o) order by o), true);'])
route('nkwelle_one_to_one_macro_f1', ["v_s := (pg_temp.d3_report(v_nk_fac, pg_temp.d3_map(v_nk_fac, pg_temp.d3_lab(v_km, 2), 'one-to-one')))[2];"])
route('nkwelle_majority_accuracy_k6', [f"v_s := (pg_temp.d3_report(v_nk_fac, pg_temp.d3_map(v_nk_fac, pg_temp.d3_lab(pg_temp.d3_kmeans(v_z, 4, {NKKO}, {NKSD}, {NI}, {MI}), 2), 'majority')))[1];"])

# OGBUNIKE
for l in OG_SETUP:
    w('  ' + l)
route('ogbunike_knn_heldout_accuracy', ['v_s := (pg_temp.d3_report(v_yte, v_pred))[1];'])
route('ogbunike_knn_nearest_distance', ['v_s := v_dist[1];'])
w("  if (v_tree->0->>'f')::int <> 3 or (v_tree->0->>'right')::int <> 2 then")
w("    raise exception 'D3 go-live refused: the second route tree does not split its root on NPHI with node 2 on the right [graded field: advanced/ogbunike_cart_node2_gini]';")
w('  end if;')
route('ogbunike_cart_node2_gini', ["v_s := (v_tree->2->>'gini')::double precision;"])
route('ogbunike_cart_nphi_importance', ['v_s := pg_temp.d3_imp(v_tree, 3);'])

def tree_acc(depth, target='v_s'):
    return [f"{target} := (pg_temp.d3_report(v_yte, pg_temp.d3_cart_pred(pg_temp.d3_cart(pg_temp.d3_rows(v_x5, 5, v_tr), 5, v_ytr, array(select g from generate_series(1, array_length(v_tr, 1)) g), 0, {depth}, v_cls), pg_temp.d3_rows(v_x5, 5, v_te), 5)))[1];"]

route('ogbunike_cart_depth3_heldout_accuracy', tree_acc(OGD))
w("  v_cs := pg_temp.d3_fit(pg_temp.d3_rows(v_x, 4, v_cored), 4, 'minmax');")
route('ogbunike_uncored_gr_minmax_max', ['v_s := (select max(v) from unnest(pg_temp.d3_apply(pg_temp.d3_rows(v_x, 4, v_un), 4, v_cs)) with ordinality u(v, o) where o % 4 = 1);'])
w('')

# ------------------------------------------------------------ 3. the traps
w('  -- ------------------------------------------------------------ 3. the traps')
w('  v_x := pg_temp.d3_flat(array[v_ih_gr, v_ih_rhob, v_ih_nphi, v_ih_pef]);')
w("  v_r := pg_temp.d3_pc1(v_x, 4, 'samp');")
trap('ihiala_gr_scale_gapi', 'the sample standard deviation', ["v_wrong := (pg_temp.d3_fit(v_x, 4, 'samp'))[5];"])
trap('ihiala_gr_scale_gapi', 'the min max range', ["v_wrong := (pg_temp.d3_fit(v_x, 4, 'minmax'))[5];"])
trap('ihiala_pc1_ratio', 'the covariance matrix', ["v_wrong := (pg_temp.d3_pc1(v_x, 4, 'cov'))[1] / (pg_temp.d3_pc1(v_x, 4, 'cov'))[2];"])
trap('ihiala_pc1_ratio', 'the caliper included', ["v_wrong := (pg_temp.d3_pc1(pg_temp.d3_flat(array[v_ih_gr, v_ih_rhob, v_ih_nphi, v_ih_pef, v_ih_cali]), 5, 'samp'))[1] / 5.0;"])
trap('ihiala_pc1_nphi_loading', 'the unit weight quoted', ['v_wrong := v_r[5];'])
trap('ihiala_pc1_nphi_loading', 'the weight times the eigenvalue', ['v_wrong := v_r[5] * v_r[1];'])
w("  v_z := pg_temp.d3_apply(v_x, 4, pg_temp.d3_fit(v_x, 4, 'pop'));")
trap('ihiala_pc1_score_first_row', 'the population standard deviation', [f'v_wrong := {dot4("v_z", 1, "v_r")};'])
w("  v_z := pg_temp.d3_apply(v_x, 4, pg_temp.d3_fit(v_x, 4, 'samp'));")
trap('ihiala_pc1_score_first_row', 'the last row', [f'v_wrong := {dot4("v_z", GC.IH_N, "v_r")};'])
w("  v_z := pg_temp.d3_apply(v_x, 4, pg_temp.d3_fit(v_x, 4, 'pop'));")
trap('ihiala_kmeans_inertia', 'one start', [f'v_wrong := (pg_temp.d3_kmeans(v_z, 4, {IHK}, {IHSD}, 1, {MI}))[1];'])
trap('ihiala_kmeans_inertia', 'k one more', [f'v_wrong := (pg_temp.d3_kmeans(v_z, 4, {IHK + 1}, {IHSD}, {NI}, {MI}))[1];'])
w(f'  v_lab := pg_temp.d3_lab(pg_temp.d3_kmeans(v_z, 4, {IHK}, {IHSD}, {NI}, {MI}), 2);')
trap('ihiala_row24_cluster_gr_centre_gapi', 'the cluster of row 0 read', ['v_wrong := (select avg(v_ih_gr[i]) from generate_series(1, array_length(v_lab, 1)) i where v_lab[i] = v_lab[1]);'])
trap('ihiala_row24_cluster_gr_centre_gapi', 'the centre in standard units', [f'v_wrong := (select avg(v_z[(i - 1) * 4 + 1]) from generate_series(1, array_length(v_lab, 1)) i where v_lab[i] = v_lab[{CR + 1}]);'])
trap('ihiala_row24_cluster_gr_centre_gapi', 'the row GR quoted', [f'v_wrong := v_ih_gr[{CR + 1}];'])

w('  v_x := pg_temp.d3_flat(array[v_nk_gr, v_nk_rhob, v_nk_nphi, v_nk_pef]);')
w("  v_z := pg_temp.d3_apply(v_x, 4, pg_temp.d3_fit(v_x, 4, 'pop'));")
w(f'  v_k3 := pg_temp.d3_kmeans(v_z, 4, {NKK - 1}, {NKSD}, {NI}, {MI});')
w(f'  v_km := pg_temp.d3_kmeans(v_z, 4, {NKK}, {NKSD}, {NI}, {MI});')
trap('nkwelle_elbow_drop_fraction_k4', 'the drop, not divided', ['v_wrong := v_k3[1] - v_km[1];'])
trap('nkwelle_elbow_drop_fraction_k4', 'the drop divided by the inertia at k', ['v_wrong := (v_k3[1] - v_km[1]) / v_km[1];'])
w(f"  v_h := pg_temp.d3_hclust(v_z, 4, 'ward', {NKK});")
w(f"  v_hc := pg_temp.d3_hclust(v_z, 4, 'complete', {NKK});")
w('  v_lab := pg_temp.d3_lab(v_h, 2); v_labc := pg_temp.d3_lab(v_hc, 2);')
trap('nkwelle_ward_silhouette', 'the complete linkage cut', ['v_wrong := pg_temp.d3_sil(v_z, 4, v_labc);'])
trap('nkwelle_ward_silhouette', 'the k-means labels', ['v_wrong := pg_temp.d3_sil(v_z, 4, pg_temp.d3_lab(v_km, 2));'])
trap('nkwelle_ward_height_above_cut', 'the height below the cut', ['v_wrong := v_h[1];'])
trap('nkwelle_ward_height_above_cut', 'complete linkage', ['v_wrong := v_hc[2];'])
trap('nkwelle_complete_ari', 'the Ward cut', ['v_wrong := pg_temp.d3_ari(v_nk_fac, array(select l::text from unnest(v_lab) with ordinality t(l, o) order by o), true);'])
trap('nkwelle_complete_ari', 'the unadjusted Rand index', ['v_wrong := pg_temp.d3_ari(v_nk_fac, array(select l::text from unnest(v_labc) with ordinality t(l, o) order by o), false);'])
w("  v_pred := pg_temp.d3_map(v_nk_fac, pg_temp.d3_lab(v_km, 2), 'one-to-one');")
trap('nkwelle_one_to_one_macro_f1', 'the accuracy quoted', ['v_wrong := (pg_temp.d3_report(v_nk_fac, v_pred))[1];'])
trap('nkwelle_one_to_one_macro_f1', 'the weighted F1', ['v_wrong := (pg_temp.d3_report(v_nk_fac, v_pred))[3];'])
trap('nkwelle_majority_accuracy_k6', 'majority matching at k one less', [f"v_wrong := (pg_temp.d3_report(v_nk_fac, pg_temp.d3_map(v_nk_fac, pg_temp.d3_lab(pg_temp.d3_kmeans(v_z, 4, {NKKO - 1}, {NKSD}, {NI}, {MI}), 2), 'majority')))[1];"])
trap('nkwelle_majority_accuracy_k6', 'one-to-one at the smaller k', ['v_wrong := (pg_temp.d3_report(v_nk_fac, v_pred))[1];'])

for l in OG_SETUP:
    w('  ' + l)
trap('ogbunike_knn_heldout_accuracy', 'k 1', ['select pred into v_pred from pg_temp.d3_knn(pg_temp.d3_apply(pg_temp.d3_rows(v_x, 4, v_tr), 4, v_cs), v_ytr, pg_temp.d3_apply(pg_temp.d3_rows(v_x, 4, v_te), 4, v_cs), 4, 1);',
                                              'v_wrong := (pg_temp.d3_report(v_yte, v_pred))[1];'])
trap('ogbunike_knn_heldout_accuracy', 'no scaling', [f'select pred into v_pred from pg_temp.d3_knn(pg_temp.d3_rows(v_x, 4, v_tr), v_ytr, pg_temp.d3_rows(v_x, 4, v_te), 4, {OGK});',
                                                     'v_wrong := (pg_temp.d3_report(v_yte, v_pred))[1];'])
trap('ogbunike_knn_nearest_distance', 'the squared distance', ['v_wrong := v_dist[1] * v_dist[1];'])
trap('ogbunike_knn_nearest_distance', 'the raw logs', [f'select dist into v_dist from pg_temp.d3_knn(pg_temp.d3_rows(v_x, 4, v_tr), v_ytr, pg_temp.d3_rows(v_x, 4, v_te), 4, {OGK});',
                                                       'v_wrong := v_dist[1];'])
trap('ogbunike_cart_node2_gini', 'the root Gini', ["v_wrong := (v_tree->0->>'gini')::double precision;"])
trap('ogbunike_cart_node2_gini', 'node 1 read', ["v_wrong := (v_tree->1->>'gini')::double precision;"])
trap('ogbunike_cart_nphi_importance', 'the root decrease quoted', [f"v_wrong := (v_tree->0->>'rise')::double precision / {len([r for r in OG['field']['rows'] if r['FACIES'] is not None])}.0;"])
trap('ogbunike_cart_nphi_importance', 'the tree of the held-out depth', [f"v_wrong := pg_temp.d3_imp(pg_temp.d3_cart(pg_temp.d3_rows(v_x5, 5, v_cored), 5, array(select v_og_fac[i] from unnest(v_cored) with ordinality u(i, o) order by o), array(select g from generate_series(1, array_length(v_cored, 1)) g), 0, {OGD}, v_cls), 3);"])
trap('ogbunike_cart_depth3_heldout_accuracy', 'depth one more', tree_acc(OGD + 1, 'v_wrong'))
trap('ogbunike_cart_depth3_heldout_accuracy', 'depth one less', tree_acc(OGD - 1, 'v_wrong'))
w("  v_cs := pg_temp.d3_fit(pg_temp.d3_rows(v_x, 4, v_cored), 4, 'minmax');")
trap('ogbunike_uncored_gr_minmax_max', 'the stated offset removed', [f'v_wrong := ((select max(v_og_gr[i]) from unnest(v_un) i) - {OGHOT}.0 - v_cs[1]) / v_cs[5];'])
trap('ogbunike_uncored_gr_minmax_max', 'the mean in place of the highest', ['v_wrong := ((select avg(v_og_gr[i]) from unnest(v_un) i) - v_cs[1]) / v_cs[5];'])
w('')

# ------------------------------------------------------------ the flip
w('  -- ------------------------------------------------------------- the flip')
w(f"  update public.academy_apps set status = 'available' where slug = '{S}';")
w(f"  if not exists (select 1 from public.academy_apps where slug = '{S}' and status = 'available') then")
w(f"    raise exception 'D3 go-live refused: {S} did not reach status available';")
w('  end if;')
w("  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')")
w('    into v_available, v_soon from public.academy_apps;')
w(f"  raise notice 'D3 go-live: {S} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',")
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
