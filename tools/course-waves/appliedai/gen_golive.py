#!/usr/bin/env python3
# CARRIED FROM D4 (forecastml) WITH ITS NAMES REWRITTEN, AND NOT YET D5's. This
# ship-phase generator is finished at the ship phase, when the banks and the
# capstone case files exist; until then its D4 content (datasets, prompts,
# checks) is not D5's and it is not run by run_gates.py.
"""Generate the D4 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction,
and checked three ways, none of which restates the generator that wrote them.
Modelled on tools/course-waves/facies/gen_golive.py (D3).

1. AGAINST THE ENGINE LEDGER. gen_course.py runs `node d5_capstone.mjs --json`
   through the vendored engines/dataai/forecast.js when this file is
   generated, and refuses unless fields.json carries exactly what that run
   returned. The go-live compares the seeded rows to THAT RUN'S values, to the
   last bit, so a capstone row an earlier seed left behind (the course
   migration inserts with `on conflict do nothing`) is refused by name, and so
   is a move of one part in 1e7.

2. BY A SECOND ROUTE IN SQL over the data the learner is handed in the case
   files. Every graded value is recomputed by Postgres with no engine code:
   the smoothing recursions from their published form; the fit by the stated
   rule (the coarse grid, then the compass search, both rebuilt in PL/pgSQL);
   the metrics from their definitions; the in-sample naive scale; the
   residual bootstrap with the mulberry32 stream rebuilt in 64-bit integer
   arithmetic and the quantile rule of lib/stats on sorted paths; the Arps
   fits by the SQL regression aggregates regr_slope and regr_intercept (the
   decline curve engine sums its own); and the rolling-origin backtests and
   the comparison with every window refitted. Each must agree with the
   seeded value to 1e-9 relative. The route refuses, rather than guesses,
   where a near tie would decide: an Arps model or b choice within 1e-9
   relative, or two ranked methods within 1e-9 relative.

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
create nothing in any schema a learner or another migration can see.

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a graded field without a ledger check, a second route and two traps; a
division by a bare integer; an unclosed literal; an em or en dash.

Usage: python3 gen_golive.py
   D5_WAVE, D5_REPO, D5_ENGINES, D5_TOLERANCE as gen_course.py
   D5_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   D5_GOLIVE_OUT  where to write
"""
import hashlib
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
COURSE = os.environ.get('D5_COURSE_SQL', f'{REPO}/migrations/{DATE}_d4_appliedai_course.sql')
OUT = os.environ.get('D5_GOLIVE_OUT', f'{REPO}/migrations/{DATE}_d4_appliedai_go_live.sql')
SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
fields = GC.fields
KEYS, TIER_OF, F, TOL = GC.KEYS, GC.TIER_OF, GC.F, GC.TOL
ENGINE = {k: GC.ENGINE[(TIER_OF[k], k)] for k in KEYS}
AG, NK, UM = GC.AG, GC.NK, GC.UM
AGS, NKS, UMS = GC.AGS, GC.NKS, GC.UMS
refused = list(GC.bad)

course_sql = open(COURSE, encoding='utf-8').read()
if course_sql != GC.SQL:
    refused.append(f'the course migration at {COURSE} is not the one gen_course.py renders now')
TOL6 = 5e-7
for k in KEYS:
    if TOL[k] < TOL6:
        refused.append(f'{k} is graded at {TOL[k]}, below the six-decimal floor {TOL6}')


def fl(x):
    """A float literal SQL reads back as this exact double."""
    return repr(float(x))


def arr(xs):
    return 'array[' + ', '.join('null' if x is None else fl(x) for x in xs) + ']::double precision[]'


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
    w(f"    raise exception 'D4 go-live refused: the second route in SQL gives %, and the seeded value is %{name(key)}', v_s, {V[key]};")
    w('  end if;')


def trap(key, label, expr_lines):
    COUNT['trap'][key] = COUNT['trap'].get(key, 0) + 1
    for l in expr_lines:
        w('  ' + l)
    w(f'  if v_wrong is null or abs(v_wrong - {V[key]}) <= {fl(TOL[key])} then')
    w(f"    raise exception 'D4 go-live refused: {label} gives %, within the tolerance of the seeded %, so the field does not discriminate the trap{name(key)}', v_wrong, {V[key]};")
    w('  end if;')


V = {k: f'v_g_{k}' for k in KEYS}

# ------------------------------------------------------------------- header
HEADER = f"""-- ============================================================================
-- D4 GO-LIVE (HELD): Data-Driven Production Forecasting flips to 'available',
-- the FOURTH course of the Data & AI module, at path_order {PATH_ORDER}.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/appliedai. The 78 lessons, the teaching lab
-- (forecastLab.js), its three explorer panels and the three capstone case
-- files ship in the ZIP and NOT in this database, so a flip before the upload
-- puts a live catalogue tile in front of a route that does not exist. This
-- file is written, dry-run and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values d5_capstone.mjs returned through
--      the vendored engines/dataai/forecast.js when this file was generated,
--      to the last bit, so a capstone row an earlier seed left behind, or a
--      move of one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the data in the case files: the
--      smoothing recursions from their published form, the fit by the stated
--      grid and compass rule rebuilt in PL/pgSQL, the metrics and the naive
--      scale from their definitions, the residual bootstrap on the mulberry32
--      stream rebuilt in 64-bit integer arithmetic with the quantile rule on
--      the sorted paths, the Arps fits by the SQL regression aggregates, and
--      the backtests and the comparison with every window refitted, each to
--      1e-9 relative; a near tie (an Arps choice or two ranked methods within
--      1e-9 relative) is refused rather than decided;
--   3. by the TRAPS the course is built on, each of which must bite on these
--      inputs: the reading a learner who missed the lesson would give is
--      computed and refused if it lands within the field's tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), created with create or
-- replace and gone when the session ends. Nothing is created in any schema.
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
decl = ['do $$', '#variable_conflict use_column', 'declare',
        '  v_structures int; v_questions int; v_capstones int; v_lessons int;',
        '  v_modules int; v_graded int; v_available int; v_soon int; v_n int; i int; j int;',
        '  v_names text; v_prompt text; v_s double precision; v_wrong double precision;',
        '  v_p double precision[]; v_r double precision[]; v_f double precision[]; v_y double precision[];',
        '  v_a double precision[]; v_b double precision[]; v_ar double precision[]; v_q double precision;',
        '  v_bt double precision[]; v_bh double precision[]; v_cm double precision[]; v_rk double precision[];']
for k in KEYS:
    decl.append(f'  {V[k]} double precision;')
SERIES = {}
for pre, fld in (('ag', AG), ('nk', NK), ('um', UM)):
    for i_, wl in enumerate(fld['field']['wells'], 1):
        var = f'v_{pre}{i_}'
        SERIES[wl['well']] = var
        decl.append(f"  {var} double precision[] := {arr(wl['rate'])};")
decl += ['begin', '']
# ------------------------------------------------------------------- shape
S = SLUG
w('  -- ---------------------------------------------------------------- shape')
w(f"  select count(*) into v_structures from public.academy_course_structures where app_slug = '{S}' and active;")
w("  if v_structures <> 3 then")
w(f"    raise exception 'D4 go-live refused: {S} has % active deep structures, expected 3', v_structures;")
w('  end if;')
w(f"  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{S}';")
w('  if v_questions <> 396 then')
w(f"    raise exception 'D4 go-live refused: {S} has % quiz questions, expected 396', v_questions;")
w('  end if;')
for cond, msg in ((f"select tier from public.academy_quiz_questions where app_slug = '{S}' group by tier having count(*) <> 132",
                   '% tier(s) do not carry exactly 132 questions'),
                  (f"select tier, module_key from public.academy_quiz_questions where app_slug = '{S}' and scope = 'module' group by tier, module_key having count(*) <> 15",
                   '% module bank(s) do not carry exactly 15 questions'),
                  (f"select tier from public.academy_quiz_questions where app_slug = '{S}' and scope = 'final' group by tier having count(*) <> 42",
                   '% final exam(s) do not carry exactly 42 questions')):
    w(f'  select count(*) into v_n from ({cond}) t;')
    w('  if v_n <> 0 then')
    w(f"    raise exception 'D4 go-live refused: {msg}', v_n;")
    w('  end if;')
w(f"  select count(*) into v_n from public.academy_quiz_questions where app_slug = '{S}'")
w('     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);')
w('  if v_n <> 0 then')
w("    raise exception 'D4 go-live refused: % question(s) do not offer four options with a key inside them', v_n;")
w('  end if;')
w('  select count(*) into v_lessons from public.academy_course_structures s,')
w("         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk")
w(f"   where s.app_slug = '{S}' and s.active;")
w('  if v_lessons <> 78 then')
w(f"    raise exception 'D4 go-live refused: {S} carries % lesson keys, expected 78', v_lessons;")
w('  end if;')
w("  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m")
w(f"   where s.app_slug = '{S}' and s.active;")
w('  if v_modules <> 18 then')
w(f"    raise exception 'D4 go-live refused: {S} carries % modules, expected 18 (six per tier)', v_modules;")
w('  end if;')
w('  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq')
w(f"     where qq.app_slug = '{S}' and qq.scope = 'module' and not exists (")
w("       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m")
w("        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;")
w('  if v_n <> 0 then')
w("    raise exception 'D4 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;")
w('  end if;')
w(f"  select count(*) into v_capstones from public.academy_capstones where app_slug = '{S}';")
w('  if v_capstones <> 3 then')
w(f"    raise exception 'D4 go-live refused: {S} has % capstones, expected 3', v_capstones;")
w('  end if;')
w(f"  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}';")
w('  if v_graded <> 18 then')
w(f"    raise exception 'D4 go-live refused: {S} has % graded capstone fields, expected 18', v_graded;")
w('  end if;')
w(f"  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}' group by c.tier having count(*) <> 6) t;")
w('  if v_n <> 0 then')
w("    raise exception 'D4 go-live refused: % tier(s) do not grade exactly six fields', v_n;")
w('  end if;')
w(f"  if not exists (select 1 from public.academy_apps where slug = '{S}' and module = '{MODULE}' and path_order = {PATH_ORDER} and prereq_slug is null) then")
w(f"    raise exception 'D4 go-live refused: the {S} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';")
w('  end if;')
w(f"  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{S}') then")
w(f"    raise exception 'D4 go-live refused: another course already holds path_order {PATH_ORDER}';")
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
w("    raise exception 'D4 go-live refused: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;")
w('  end if;')
w("  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names")
w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
w(f"   where c.app_slug = '{S}'")
w("     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric")
w("          or ((f->>'tol')::numeric = 0.0000005")
w("              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric")
w("                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));")
w('  if v_n <> 0 then')
w("    raise exception 'D4 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or, at the six-decimal floor, pass one a unit off in the sixth decimal: %', v_n, v_names;")
w('  end if;')
w('')


# ------------------------------------------------------------ the prompts
w('  -- ---------------------------------------- the prompts the learner reads')
n = GC.n
STATED = {
    'beginner': [f"alpha {n(AGS['alpha'])} and beta {n(AGS['beta'])} given", f"forecast at step {n(AGS['hHolt'])}",
                 f"forecast at step {n(AGS['hDamped'])}", 'with alpha and beta both left free',
                 'with alpha, beta and phi all left free', 'Fit on every month of the well named']
                + [f for f, _ in GC.CASES['beginner']],
    'intermediate': [f"months 0 to {n(GC.LAST_TRAIN)}", f"forecasting {n(NKS['h'])} steps",
                     f"first origin {n(NKS['firstOrigin'])}, horizon {n(NKS['horizon'])}, step {n(NKS['step'])}",
                     'refitted at every origin, m 1', 'with refit false', 'as the in-sample series and m 1',
                     f"shut in for months {n(GC.NK1_SHUT[0])} and {n(GC.NK1_SHUT[1])}"]
                    + [f for f, _ in GC.CASES['intermediate']],
    'advanced': [f"h {n(UMS['h'])}, {n(UMS['nSims'])} paths, seed {n(UMS['seed'])}, nonNegative true",
                 f"P50 at step {n(GC.P50_STEP)}", 'with the model Auto-Select',
                 f"first origin {n(UMS['firstOrigin'])}, horizon {n(UMS['horizon'])}, step {n(UMS['step'])}, refit true, m 1",
                 'ranked by MASE', f"shut in for months {n(GC.UM2_SHUT[0])} to {n(GC.UM2_SHUT[1])}"]
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
    w(f"    raise exception 'D4 go-live refused: the {tier} prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);")
    w('  end if;')
    w(f"  if not exists (select 1 from public.academy_capstones where app_slug = '{S}' and tier = '{tier}'")
    w(f"                    and cert_tier = '{cert}' and dataset = {lit(dataset)} and title = {lit(title)}) then")
    w(f"    raise exception 'D4 go-live refused: the {tier} capstone does not carry the certificate tier, dataset and title gen_course.py rendered';")
    w('  end if;')
    w("  select count(*), string_agg(l, ' / ') into v_n, v_names")
    w(f"    from unnest(array[{', '.join(lit(s_) for s_ in STATED[tier])}]) l where strpos(v_prompt, l) = 0;")
    w('  if v_n <> 0 then')
    w(f"    raise exception 'D4 go-live refused: % stated setting(s) or case file(s) are not named in the shipped {tier} prompt: %', v_n, v_names;")
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
w("    raise exception 'D4 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;")
w('  end if;')
w('')

# ---------------------------------------------------- the graded values
w('  -- --------------------------------------- the eighteen graded values')
for k in KEYS:
    w(f"  select (f->>'expected')::double precision into {V[k]}")
    w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
    w(f"   where c.app_slug = '{S}' and c.tier = '{TIER_OF[k]}' and f->>'key' = '{k}';")
    w(f'  if {V[k]} is null then')
    w(f"    raise exception 'D4 go-live refused: the seeded rows carry no value{name(k)}';")
    w('  end if;')
w('')

# ------------------------------------------------------ 1. the ledger
w('  -- ------------------------------------------ 1. against the engine ledger')
for k in KEYS:
    COUNT['ledger'].add(k)
    w(f'  if {V[k]} <> {fl(ENGINE[k])} then')
    w(f"    raise exception 'D4 go-live refused: the seeded value is %, and the engine returned {fl(ENGINE[k])}{name(k)}', {V[k]};")
    w('  end if;')
w('')

# ------------------------------------------------- 2. the second route
w('  -- ----------------------------------------------- 2. the second route in SQL')
A1, A2 = SERIES['AGULU-1'], SERIES['AGULU-2']
N1, N2 = SERIES['NANKA-1'], SERIES['NANKA-2']
U1, U2 = SERIES['UMUNZE-1'], SERIES['UMUNZE-2']
TR = NKS['train']
NH, NFO, NHZ, NST = NKS['h'], NKS['firstOrigin'], NKS['horizon'], NKS['step']
UH, USIM, USEED = UMS['h'], UMS['nSims'], UMS['seed']
UFO, UHZ, UST = UMS['firstOrigin'], UMS['horizon'], UMS['step']
P50S = GC.P50_STEP
AH, AD = AGS['hHolt'], AGS['hDamped']
METHODS = ['ses', 'holt', 'damped', 'arps']


def conv(key, expr):
    w(f'  if ({expr}) <> 1.0 then')
    w(f"    raise exception 'D4 go-live refused: a second route fit stopped at the evaluation cap before the stop rule{name(key)}';")
    w('  end if;')


# AGULU
w(f"  v_p := pg_temp.d5_opt({A2}, 'ses');")
conv('agulu2_ses_alpha', 'v_p[5]')
route('agulu2_ses_alpha', ['v_s := v_p[1];'])
w(f"  v_r := pg_temp.d5_run({A1}, 'holt', {fl(AGS['alpha'])}, {fl(AGS['beta'])}, null);")
route('agulu1_holt_fixed_mse_bopd2', [f'v_s := v_r[1] / (array_length({A1}, 1) - 2)::double precision;'])
w(f"  v_p := pg_temp.d5_opt({A1}, 'holt');")
conv('agulu1_holt_beta', 'v_p[5]')
route('agulu1_holt_beta', ['v_s := v_p[2];'])
w(f"  v_r := pg_temp.d5_run({A1}, 'holt', v_p[1], v_p[2], null);")
route('agulu1_holt_forecast_h12_bopd', [f"v_s := (pg_temp.d5_fc('holt', v_r[2], v_r[3], null, {AH}))[{AH}];"])
w(f"  v_p := pg_temp.d5_opt({A1}, 'damped');")
conv('agulu1_damped_phi', 'v_p[5]')
route('agulu1_damped_phi', ['v_s := v_p[3];'])
w(f"  v_r := pg_temp.d5_run({A1}, 'damped', v_p[1], v_p[2], v_p[3]);")
route('agulu1_damped_forecast_h24_bopd', [f"v_s := (pg_temp.d5_fc('damped', v_r[2], v_r[3], v_p[3], {AD}))[{AD}];"])

# NANKA
NK_SETUP = [
    f'v_y := {N1}[1:{TR}];',
    f'v_a := {N1}[{TR + 1}:{TR + NH}];',
    "v_p := pg_temp.d5_opt(v_y, 'damped');",
    "v_r := pg_temp.d5_run(v_y, 'damped', v_p[1], v_p[2], v_p[3]);",
    f"v_f := pg_temp.d5_fc('damped', v_r[2], v_r[3], v_p[3], {NH});",
    'v_q := pg_temp.d5_q(v_y, 1);',
]
for l in NK_SETUP:
    w('  ' + l)
conv('nanka1_holdout_damped_smape_pct', 'v_p[5]')
route('nanka1_holdout_damped_smape_pct', [
    'v_s := 100 * (select avg(case when abs(v_a[i]) + abs(v_f[i]) = 0 then 0.0',
    '                              else 2 * abs(v_a[i] - v_f[i]) / (abs(v_a[i]) + abs(v_f[i])) end)',
    '               from generate_subscripts(v_a, 1) i);'])
route('nanka1_holdout_damped_mase', ['v_s := (select avg(abs(v_a[i] - v_f[i])) from generate_subscripts(v_a, 1) i) / v_q;'])
route('nanka1_holdout_damped_me_bopd', ['v_s := (select avg(v_a[i] - v_f[i]) from generate_subscripts(v_a, 1) i);'])
w(f"  v_bt := pg_temp.d5_bt({N2}, 'holt', {NFO}, {NHZ}, {NST}, true, 1, null);")
w(f"  v_bh := pg_temp.d5_bt({N2}, 'holt', {NFO}, {NHZ}, {NST}, false, 1, null);")
conv('nanka2_backtest_holt_rmse_bopd', f'least(v_bt[{NHZ + 6}], v_bh[{NHZ + 6}])')
route('nanka2_backtest_holt_rmse_bopd', ['v_s := v_bt[1];'])
route('nanka2_backtest_holt_held_mase', ['v_s := v_bh[3];'])
route('nanka2_backtest_holt_step6_mae_bopd', [f'v_s := v_bt[{4 + NHZ}];'])

# UMUNZE
UM_SETUP = [
    f"v_p := pg_temp.d5_opt({U1}, 'damped');",
    f"v_b := pg_temp.d5_boot({U1}, 'damped', v_p[1], v_p[2], v_p[3], {UH}, {USIM}, {USEED}, true);",
    f"v_r := pg_temp.d5_run({U1}, 'damped', v_p[1], v_p[2], v_p[3]);",
    f"v_f := pg_temp.d5_fc('damped', v_r[2], v_r[3], v_p[3], {UH});",
]
for l in UM_SETUP:
    w('  ' + l)
conv('umunze1_damped_p90_h12_bopd', 'v_p[5]')
route('umunze1_damped_p90_h12_bopd', [f'v_s := v_b[{UH}];'])
route('umunze1_damped_p10_h12_bopd', [f'v_s := v_b[{2 * UH + UH}];'])
route('umunze1_damped_p50_h6_bopd', [f'v_s := v_b[{UH + P50S}];'])
w(f"  v_ar := pg_temp.d5_arps({U1}, 'Auto-Select');")
w('  if v_ar is null or v_ar[6] <= 1e-9 then')
w(f"    raise exception 'D4 go-live refused: the second route Arps choice turns on a near tie (relative RMSE gap %){name('umunze1_arps_di_per_month')}', v_ar[6];")
w('  end if;')
route('umunze1_arps_di_per_month', ['v_s := v_ar[2];'])
# the comparison: every method's pooled MASE, on the same origins
w('  v_cm := array[]::double precision[];')
for mt in METHODS:
    w(f"  v_bt := pg_temp.d5_bt({U2}, '{mt}', {UFO}, {UHZ}, {UST}, true, 1, 'Auto-Select');")
    if mt == 'arps':
        w(f'  if v_bt[{UHZ + 6}] <= 1e-9 then')
        w(f"    raise exception 'D4 go-live refused: a second route Arps window choice turns on a near tie (relative RMSE gap %){name('umunze2_compare_arps_mase')}', v_bt[{UHZ + 6}];")
        w('  end if;')
    else:
        conv('umunze2_compare_best_mase', f'v_bt[{UHZ + 6}]')
    w('  v_cm := v_cm || v_bt[3];')
w('  v_rk := array(select v from unnest(v_cm) v order by v);')
w('  if v_rk[2] - v_rk[1] <= 1e-9 * v_rk[1] then')
w(f"    raise exception 'D4 go-live refused: the second route ranking turns on a near tie (% and %){name('umunze2_compare_best_mase')}', v_rk[1], v_rk[2];")
w('  end if;')
route('umunze2_compare_arps_mase', ['v_s := v_cm[4];'])
route('umunze2_compare_best_mase', ['v_s := v_rk[1];'])
w('')

# ------------------------------------------------------------ 3. the traps
w('  -- ------------------------------------------------------------ 3. the traps')
trap('agulu2_ses_alpha', 'the grid start quoted', [f"v_wrong := (pg_temp.d5_grid({A2}, 'ses'))[1];"])
trap('agulu2_ses_alpha', 'fitted on the first three years', [f"v_wrong := (pg_temp.d5_opt({A2}[1:36], 'ses'))[1];"])
trap('agulu2_ses_alpha', 'the other well', [f"v_wrong := (pg_temp.d5_opt({A1}, 'ses'))[1];"])
w(f"  v_r := pg_temp.d5_run({A1}, 'holt', {fl(AGS['alpha'])}, {fl(AGS['beta'])}, null);")
trap('agulu1_holt_fixed_mse_bopd2', 'the SSE quoted', ['v_wrong := v_r[1];'])
trap('agulu1_holt_fixed_mse_bopd2', 'the SSE divided by every month', [f'v_wrong := v_r[1] / array_length({A1}, 1)::double precision;'])
trap('agulu1_holt_fixed_mse_bopd2', 'the root taken', [f'v_wrong := sqrt(v_r[1] / (array_length({A1}, 1) - 2)::double precision);'])
w(f"  v_p := pg_temp.d5_opt({A1}, 'holt');")
trap('agulu1_holt_beta', 'the alpha quoted', ['v_wrong := v_p[1];'])
trap('agulu1_holt_beta', 'the stated beta quoted', [f"v_wrong := {fl(AGS['beta'])};"])
trap('agulu1_holt_beta', 'the grid start quoted', [f"v_wrong := (pg_temp.d5_grid({A1}, 'holt'))[2];"])
w(f"  v_r := pg_temp.d5_run({A1}, 'holt', v_p[1], v_p[2], null);")
w(f"  v_f := pg_temp.d5_fc('holt', v_r[2], v_r[3], null, {AH + 1});")
trap('agulu1_holt_forecast_h12_bopd', 'the step before', [f'v_wrong := v_f[{AH - 1}];'])
trap('agulu1_holt_forecast_h12_bopd', 'the step after', [f'v_wrong := v_f[{AH + 1}];'])
w(f"  v_r := pg_temp.d5_run({A1}, 'holt', {fl(AGS['alpha'])}, {fl(AGS['beta'])}, null);")
trap('agulu1_holt_forecast_h12_bopd', 'the stated parameters used', [f"v_wrong := (pg_temp.d5_fc('holt', v_r[2], v_r[3], null, {AH}))[{AH}];"])
w(f"  v_p := pg_temp.d5_opt({A1}, 'damped');")
trap('agulu1_damped_phi', 'the upper bound quoted', ['v_wrong := 0.98;'])
trap('agulu1_damped_phi', 'the alpha quoted', ['v_wrong := v_p[1];'])
trap('agulu1_damped_phi', 'the grid start quoted', [f"v_wrong := (pg_temp.d5_grid({A1}, 'damped'))[3];"])
w(f"  v_r := pg_temp.d5_run({A1}, 'damped', v_p[1], v_p[2], v_p[3]);")
w(f"  v_f := pg_temp.d5_fc('damped', v_r[2], v_r[3], v_p[3], {AD + 1});")
trap('agulu1_damped_forecast_h24_bopd', 'the step twelve forecast', [f'v_wrong := v_f[{AH}];'])
trap('agulu1_damped_forecast_h24_bopd', 'the step after', [f'v_wrong := v_f[{AD + 1}];'])
trap('agulu1_damped_forecast_h24_bopd', 'the limit quoted', ['v_wrong := v_r[2] + v_r[3] * v_p[3] / (1 - v_p[3]);'])

for l in NK_SETUP:
    w('  ' + l)
trap('nanka1_holdout_damped_smape_pct', 'sMAPE on 0 to 100', [
    'v_wrong := 50 * (select avg(case when abs(v_a[i]) + abs(v_f[i]) = 0 then 0.0',
    '                                else 2 * abs(v_a[i] - v_f[i]) / (abs(v_a[i]) + abs(v_f[i])) end)',
    '                 from generate_subscripts(v_a, 1) i);'])
trap('nanka1_holdout_damped_smape_pct', 'the forecast alone in the denominator', [
    'v_wrong := 100 * (select avg(abs(v_a[i] - v_f[i]) / abs(v_f[i])) from generate_subscripts(v_a, 1) i);'])
trap('nanka1_holdout_damped_smape_pct', 'the shut-in months dropped', [
    'v_wrong := 100 * (select avg(2 * abs(v_a[i] - v_f[i]) / (abs(v_a[i]) + abs(v_f[i])))',
    '                    from generate_subscripts(v_a, 1) i where v_a[i] <> 0);'])
trap('nanka1_holdout_damped_mase', 'scaled by the hold-out naive error', [
    'v_wrong := (select avg(abs(v_a[i] - v_f[i])) from generate_subscripts(v_a, 1) i) / pg_temp.d5_q(v_a, 1);'])
trap('nanka1_holdout_damped_mase', 'scaled by the whole series', [
    f'v_wrong := (select avg(abs(v_a[i] - v_f[i])) from generate_subscripts(v_a, 1) i) / pg_temp.d5_q({N1}, 1);'])
trap('nanka1_holdout_damped_mase', 'the RMSE over the scale', [
    'v_wrong := sqrt((select avg((v_a[i] - v_f[i]) ^ 2) from generate_subscripts(v_a, 1) i)) / v_q;'])
trap('nanka1_holdout_damped_me_bopd', 'forecast minus actual', ['v_wrong := (select avg(v_f[i] - v_a[i]) from generate_subscripts(v_a, 1) i);'])
trap('nanka1_holdout_damped_me_bopd', 'the MAE quoted', ['v_wrong := (select avg(abs(v_a[i] - v_f[i])) from generate_subscripts(v_a, 1) i);'])
trap('nanka1_holdout_damped_me_bopd', 'the shut-in months dropped', ['v_wrong := (select avg(v_a[i] - v_f[i]) from generate_subscripts(v_a, 1) i where v_a[i] <> 0);'])
w(f"  v_bt := pg_temp.d5_bt({N2}, 'holt', {NFO}, {NHZ}, {NST}, true, 1, null);")
w(f"  v_bh := pg_temp.d5_bt({N2}, 'holt', {NFO}, {NHZ}, {NST}, false, 1, null);")
trap('nanka2_backtest_holt_rmse_bopd', 'the MAE quoted', ['v_wrong := v_bt[2];'])
trap('nanka2_backtest_holt_rmse_bopd', 'the parameters held', ['v_wrong := v_bh[1];'])
trap('nanka2_backtest_holt_rmse_bopd', 'a step of 1 between origins', [f"v_wrong := (pg_temp.d5_bt({N2}, 'holt', {NFO}, {NHZ}, 1, true, 1, null))[1];"])
trap('nanka2_backtest_holt_held_mase', 'the refitted run', ['v_wrong := v_bt[3];'])
trap('nanka2_backtest_holt_held_mase', 'a lag of 12', [f"v_wrong := (pg_temp.d5_bt({N2}, 'holt', {NFO}, {NHZ}, {NST}, false, 12, null))[3];"])
trap('nanka2_backtest_holt_step6_mae_bopd', 'step 1 read', ['v_wrong := v_bt[5];'])
trap('nanka2_backtest_holt_step6_mae_bopd', 'the overall MAE quoted', ['v_wrong := v_bt[2];'])
trap('nanka2_backtest_holt_step6_mae_bopd', 'the step before', [f'v_wrong := v_bt[{3 + NHZ}];'])
trap('nanka2_backtest_holt_step6_mae_bopd', 'the parameters held', [f'v_wrong := v_bh[{4 + NHZ}];'])

for l in UM_SETUP:
    w('  ' + l)
trap('umunze1_damped_p90_h12_bopd', 'the 90th percentile read as P90', [f'v_wrong := v_b[{3 * UH}];'])
trap('umunze1_damped_p90_h12_bopd', 'the point forecast', [f'v_wrong := v_f[{UH}];'])
trap('umunze1_damped_p90_h12_bopd', 'the step before', [f'v_wrong := v_b[{UH - 1}];'])
trap('umunze1_damped_p10_h12_bopd', 'the 10th percentile read as P10', [f'v_wrong := v_b[{UH}];'])
trap('umunze1_damped_p10_h12_bopd', 'the P50 quoted', [f'v_wrong := v_b[{2 * UH}];'])
trap('umunze1_damped_p50_h6_bopd', 'the point forecast', [f'v_wrong := v_f[{P50S}];'])
trap('umunze1_damped_p50_h6_bopd', 'the step before', [f'v_wrong := v_b[{UH + P50S - 1}];'])
trap('umunze1_damped_p50_h6_bopd', 'the step after', [f'v_wrong := v_b[{UH + P50S + 1}];'])
w(f"  v_b := pg_temp.d5_boot({U1}, 'damped', v_p[1], v_p[2], v_p[3], {UH}, {USIM}, {USEED + 1}, true);")
trap('umunze1_damped_p90_h12_bopd', 'the next seed', [f'v_wrong := v_b[{UH}];'])
trap('umunze1_damped_p10_h12_bopd', 'the next seed', [f'v_wrong := v_b[{3 * UH}];'])
trap('umunze1_damped_p50_h6_bopd', 'the next seed', [f'v_wrong := v_b[{UH + P50S}];'])
w(f"  v_ar := pg_temp.d5_arps({U1}, 'Auto-Select');")
trap('umunze1_arps_di_per_month', 'Di quoted per year', ['v_wrong := 12 * v_ar[2];'])
trap('umunze1_arps_di_per_month', 'Di quoted per day', ['v_wrong := v_ar[2] / 30.4375;'])
trap('umunze1_arps_di_per_month', 'the exponential forced', [f"v_wrong := (pg_temp.d5_arps({U1}, 'Exponential'))[2];"])
trap('umunze1_arps_di_per_month', 'the harmonic forced', [f"v_wrong := (pg_temp.d5_arps({U1}, 'Harmonic'))[2];"])
w('  v_cm := array[]::double precision[];')
for mt in METHODS:
    w(f"  v_cm := v_cm || (pg_temp.d5_bt({U2}, '{mt}', {UFO}, {UHZ}, {UST}, true, 1, 'Auto-Select'))[3];")
w('  v_rk := array(select v from unnest(v_cm) v order by v);')
trap('umunze2_compare_arps_mase', 'the best MASE quoted', ['v_wrong := v_rk[1];'])
trap('umunze2_compare_arps_mase', 'the arps MAE quoted', [f"v_wrong := (pg_temp.d5_bt({U2}, 'arps', {UFO}, {UHZ}, {UST}, true, 1, 'Auto-Select'))[2];"])
trap('umunze2_compare_arps_mase', 'an exponential baseline', [f"v_wrong := (pg_temp.d5_bt({U2}, 'arps', {UFO}, {UHZ}, {UST}, true, 1, 'Exponential'))[3];"])
trap('umunze2_compare_best_mase', 'the arps MASE quoted', ['v_wrong := v_cm[4];'])
trap('umunze2_compare_best_mase', 'the second ranked', ['v_wrong := v_rk[2];'])
trap('umunze2_compare_best_mase', 'the last ranked', ['v_wrong := v_rk[4];'])
w('')

# ------------------------------------------------------------ the flip
w('  -- ------------------------------------------------------------- the flip')
w(f"  update public.academy_apps set status = 'available' where slug = '{S}';")
w(f"  if not exists (select 1 from public.academy_apps where slug = '{S}' and status = 'available') then")
w(f"    raise exception 'D4 go-live refused: {S} did not reach status available';")
w('  end if;')
w("  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')")
w('    into v_available, v_soon from public.academy_apps;')
w(f"  raise notice 'D4 go-live: {S} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',")
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
