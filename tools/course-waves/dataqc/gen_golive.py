#!/usr/bin/env python3
"""Generate the D1 go-live migration.

NOTHING HERE IS RETYPED. The eighteen graded values are read out of the
CAPSTONE ROWS THE LADDER ITSELF SEEDED, by key, inside the same transaction,
and checked three ways, none of which restates the generator that wrote them:

1. AGAINST THE ENGINE LEDGER. gen_course.py runs `node d1_capstone.mjs --json`
   through the vendored engines/dataai/quality.js when this file is generated,
   and refuses unless fields.json carries exactly what that run returned. The
   go-live compares the seeded rows to THAT RUN'S values, to the last bit, so a
   capstone row an earlier seed left behind (the course migration inserts with
   `on conflict do nothing`) is refused by name, and so is a move of one part in
   1e7.

2. BY A SECOND ROUTE IN SQL over the data the learner is handed in the case
   files. Every graded value is recomputed by Postgres with no engine code: the
   completeness and the coverage by counting and summing steps, the inferred
   step, the quartiles, the medians and the MADs by percentile_cont (which is
   the R7 rule), the z and modified z extremes, the Hampel window, the
   Mahalanobis distance by a two-by-two inverse, the individuals, EWMA, exact
   EWMA and CUSUM recursions step by step, the scorecard by its weighted mean,
   and the Grubbs critical value by bisecting Student's t with the closed-form
   tail for odd degrees of freedom (Abramowitz and Stegun 26.7.3), a road the
   engine does not take (it inverts a continued-fraction incomplete beta). Each
   must agree with the seeded value to 1e-9 relative. The arrays the second
   route reads are rendered from the same engine inputs as the case files.

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

WHAT IT REFUSES TO WRITE: a refusal that reads a graded value and does not name
it; a graded field without a ledger check, a second route and two traps; a
division by a bare integer; an unclosed literal; an em or en dash.

Usage: python3 gen_golive.py
   D1_WAVE, D1_REPO, D1_ENGINES, D1_TOLERANCE as gen_course.py
   D1_COURSE_SQL  the course migration this ladder emits, for the prompt checks
   D1_GOLIVE_OUT  where to write
"""
import hashlib
import os
import re
import sys

W = os.environ.get('D1_WAVE', '/root/dai-wip-dataqc')
REPO = os.environ.get('D1_REPO', '/root/wt-dai-d1-nextgen')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ['D1_WAVE'] = W
import gen_course as GC  # noqa: E402  (runs the engine; writes nothing on import)

DATE = GC.DATE
COURSE = os.environ.get('D1_COURSE_SQL', f'{REPO}/migrations/{DATE}_d1_dataqc_course.sql')
OUT = os.environ.get('D1_GOLIVE_OUT', f'{REPO}/migrations/{DATE}_d1_dataqc_go_live.sql')
SLUG, MODULE, PATH_ORDER = GC.SLUG, GC.MODULE, GC.PATH_ORDER
fields = GC.fields
KEYS, TIER_OF, F, TOL = GC.KEYS, GC.TIER_OF, GC.F, GC.TOL
ENGINE = {k: GC.ENGINE[(TIER_OF[k], k)] for k in KEYS}
OD, IK, AM = GC.OD, GC.IK, GC.AM
refused = list(GC.bad)

course_sql = open(COURSE, encoding='utf-8').read()
if course_sql != GC.SQL:
    refused.append(f'the course migration at {COURSE} is not the one gen_course.py renders now')
TOL6 = 5e-7
for k in KEYS:
    if TOL[k] != TOL6:
        refused.append(f'{k} is graded at {TOL[k]}; every D1 field is graded at the six-decimal floor {TOL6}')


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


V = {k: f'v_g_{k}' for k in KEYS}
lg, pr = OD['log'], OD['production']
DIMS, WTS = AM['scorecard']['dimensions'], AM['scorecard']['weights']
P = []  # the body
w = P.append
COUNT = {'ledger': set(), 'route': set(), 'trap': {}}


def route(key, expr_lines):
    """expr_lines compute v_s; then compare with the seeded value."""
    COUNT['route'].add(key)
    for l in expr_lines:
        w('  ' + l)
    w(f'  if v_s is null or abs(v_s - {V[key]}) > 1e-9 * greatest(1.0, abs({V[key]})) then')
    w(f"    raise exception 'D1 go-live refused: the second route in SQL gives %, and the seeded value is %{name(key)}', v_s, {V[key]};")
    w('  end if;')


def trap(key, label, expr_lines):
    COUNT['trap'][key] = COUNT['trap'].get(key, 0) + 1
    for l in expr_lines:
        w('  ' + l)
    w(f'  if v_wrong is null or abs(v_wrong - {V[key]}) <= {fl(TOL[key])} then')
    w(f"    raise exception 'D1 go-live refused: {label} gives %, within the tolerance of the seeded %, so the field does not discriminate the trap{name(key)}', v_wrong, {V[key]};")
    w('  end if;')


# ------------------------------------------------------------------- header
HEADER = f"""-- ============================================================================
-- D1 GO-LIVE (HELD): Oilfield Data Quality flips to 'available', the FIRST
-- course of the Data & AI module, at path_order {PATH_ORDER}.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/dataqc. The 78 lessons, the teaching lab (dataqcLab.js),
-- its three explorer panels and the eight capstone case files ship in the ZIP
-- and NOT in this database, so a flip before the upload puts a live catalogue
-- tile in front of a route that does not exist. This file is written, dry-run
-- and left unapplied on purpose.
--
-- EVERY GRADED VALUE IS CHECKED THREE WAYS, and none restates the generator:
--
--   1. against the ENGINE LEDGER: the values d1_capstone.mjs returned through
--      the vendored engines/dataai/quality.js when this file was generated, to
--      the last bit, so a capstone row an earlier seed left behind, or a move
--      of one part in 1e7, is refused by name;
--   2. by a SECOND ROUTE IN SQL over the data in the case files: counting,
--      stepping, percentile_cont (the R7 rule), a two-by-two inverse, the chart
--      recursions step by step, and the Grubbs critical value by bisecting
--      Student's t with the closed-form odd-degree tail (A and S 26.7.3), each
--      to 1e-9 relative;
--   3. by the TRAPS the course is built on, each of which must bite on these
--      inputs: the reading a learner who missed the lesson would give is
--      computed and refused if it lands within the field's tolerance.
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

# -------------------------------------------------------------- declarations
decl = ['do $$', 'declare',
        '  v_structures int; v_questions int; v_capstones int; v_lessons int;',
        '  v_modules int; v_graded int; v_available int; v_soon int; v_n int; i int; j int;',
        '  v_names text; v_prompt text; v_s double precision; v_wrong double precision; v_x double precision;',
        '  v_prev double precision; v_last int; v_med double precision; v_mad double precision;',
        '  v_m double precision; v_sd double precision; v_q1 double precision; v_q3 double precision;',
        '  v_lo double precision; v_hi double precision; v_mid double precision; v_t double precision; v_th double precision;',
        '  v_term double precision; v_sum double precision; v_tail double precision; v_q double precision;',
        '  v_ma double precision; v_mb double precision; v_saa double precision; v_sab double precision; v_sbb double precision;',
        '  v_det double precision; v_da double precision; v_db double precision; v_d2 double precision; v_best double precision;',
        '  v_centre double precision; v_mrbar double precision; v_sigma double precision; v_e double precision;',
        '  v_ws double precision; v_nn double precision;']
for k in KEYS:
    decl.append(f'  {V[k]} double precision;')
decl += [f"  v_od_depth double precision[] := {arr(lg['depth'])};",
         f"  v_od_rhob double precision[] := {arr(lg['rhob'])};",
         f"  v_od_nphi double precision[] := {arr(lg['nphi'])};",
         f"  v_od_sc double precision[] := {arr(OD['scada']['minutes'])};",
         f"  v_od_oil double precision[] := {arr(pr['oil'])};",
         f"  v_od_water double precision[] := {arr(pr['water'])};",
         f"  v_od_gross double precision[] := {arr(pr['gross'])};",
         f"  v_od_wc double precision[] := {arr(pr['waterCut'])};",
         f"  v_od_cum double precision[] := {arr(pr['cumOil'])};",
         f"  v_ik_core double precision[] := {arr(IK['core'])};",
         f"  v_ik_rhob double precision[] := {arr(IK['rhob'])};",
         f"  v_ik_a double precision[] := {arr([r[0] for r in IK['cloud']])};",
         f"  v_ik_b double precision[] := {arr([r[1] for r in IK['cloud']])};",
         f"  v_am_p1 double precision[] := {arr(AM['phase1'])};",
         f"  v_am_p2 double precision[] := {arr(AM['phase2'])};",
         f"  v_sc_checked double precision[] := {arr([d['checked'] for d in DIMS])};",
         f"  v_sc_failed double precision[] := {arr([d['failed'] for d in DIMS])};",
         f"  v_sc_w double precision[] := {arr([WTS[d['name']] for d in DIMS])};",
         'begin', '']

# ------------------------------------------------------------------- shape
S = SLUG
w('  -- ---------------------------------------------------------------- shape')
w(f"  select count(*) into v_structures from public.academy_course_structures where app_slug = '{S}' and active;")
w("  if v_structures <> 3 then")
w(f"    raise exception 'D1 go-live refused: {S} has % active deep structures, expected 3', v_structures;")
w('  end if;')
w(f"  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{S}';")
w('  if v_questions <> 396 then')
w(f"    raise exception 'D1 go-live refused: {S} has % quiz questions, expected 396', v_questions;")
w('  end if;')
for cond, msg in ((f"select tier from public.academy_quiz_questions where app_slug = '{S}' group by tier having count(*) <> 132",
                   '% tier(s) do not carry exactly 132 questions'),
                  (f"select tier, module_key from public.academy_quiz_questions where app_slug = '{S}' and scope = 'module' group by tier, module_key having count(*) <> 15",
                   '% module bank(s) do not carry exactly 15 questions'),
                  (f"select tier from public.academy_quiz_questions where app_slug = '{S}' and scope = 'final' group by tier having count(*) <> 42",
                   '% final exam(s) do not carry exactly 42 questions')):
    w(f'  select count(*) into v_n from ({cond}) t;')
    w('  if v_n <> 0 then')
    w(f"    raise exception 'D1 go-live refused: {msg}', v_n;")
    w('  end if;')
w(f"  select count(*) into v_n from public.academy_quiz_questions where app_slug = '{S}'")
w('     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);')
w('  if v_n <> 0 then')
w("    raise exception 'D1 go-live refused: % question(s) do not offer four options with a key inside them', v_n;")
w('  end if;')
w('  select count(*) into v_lessons from public.academy_course_structures s,')
w("         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk")
w(f"   where s.app_slug = '{S}' and s.active;")
w('  if v_lessons <> 78 then')
w(f"    raise exception 'D1 go-live refused: {S} carries % lesson keys, expected 78', v_lessons;")
w('  end if;')
w("  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m")
w(f"   where s.app_slug = '{S}' and s.active;")
w('  if v_modules <> 18 then')
w(f"    raise exception 'D1 go-live refused: {S} carries % modules, expected 18 (six per tier)', v_modules;")
w('  end if;')
w('  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq')
w(f"     where qq.app_slug = '{S}' and qq.scope = 'module' and not exists (")
w("       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m")
w("        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;")
w('  if v_n <> 0 then')
w("    raise exception 'D1 go-live refused: % module bank(s) are keyed to a module the structure does not declare', v_n;")
w('  end if;')
w(f"  select count(*) into v_capstones from public.academy_capstones where app_slug = '{S}';")
w('  if v_capstones <> 3 then')
w(f"    raise exception 'D1 go-live refused: {S} has % capstones, expected 3', v_capstones;")
w('  end if;')
w(f"  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}';")
w('  if v_graded <> 18 then')
w(f"    raise exception 'D1 go-live refused: {S} has % graded capstone fields, expected 18', v_graded;")
w('  end if;')
w(f"  select count(*) into v_n from (select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}' group by c.tier having count(*) <> 6) t;")
w('  if v_n <> 0 then')
w("    raise exception 'D1 go-live refused: % tier(s) do not grade exactly six fields', v_n;")
w('  end if;')
w(f"  if not exists (select 1 from public.academy_apps where slug = '{S}' and module = '{MODULE}' and path_order = {PATH_ORDER} and prereq_slug is null) then")
w(f"    raise exception 'D1 go-live refused: the {S} catalogue row is not {MODULE} at path_order {PATH_ORDER} with no prerequisite';")
w('  end if;')
w(f"  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{S}') then")
w(f"    raise exception 'D1 go-live refused: another course already holds path_order {PATH_ORDER}';")
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
w("    raise exception 'D1 go-live refused: % graded field(s) are not a positive non-whole number at tolerance 0.0000005 with a label and a unit: %', v_n, v_names;")
w('  end if;')
w("  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names")
w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
w(f"   where c.app_slug = '{S}'")
w("     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric")
w("          or abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric")
w("          or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric);")
w('  if v_n <> 0 then')
w("    raise exception 'D1 go-live refused: % graded field(s) either fail the six-decimal answer the prompt asks for or pass one a unit off in the sixth decimal: %', v_n, v_names;")
w('  end if;')
w('')

# ------------------------------------------------------------ the prompts
w('  -- ---------------------------------------- the prompts the learner reads')
STATED = {
    'beginner': [f"coverage of the interval {GC.n(lg['coverageStart'])} to {GC.n(lg['coverageEnd'])} ft", f"maxStep of {GC.n(lg['maxStep'])} ft",
                 'water cut computed from the rates for day 23'] + [f for f, _ in GC.CASES['beginner']],
    'intermediate': [f"half window of {GC.n(IK['halfWindow'])} and nSigma {GC.n(IK['nSigma'])}", f"at alpha {GC.n(IK['alpha'])}",
                     'entry 57 of the density interval'] + [f for f, _ in GC.CASES['intermediate']],
    'advanced': [f"lambda {GC.n(AM['lambda'])} and L {GC.n(AM['L'])}", f"k {GC.n(AM['k'])} and h {GC.n(AM['h'])} in sigma units",
                 'sigma as MRbar / 1.128'] + [f"{d['name']} {d['failed']} failed of {d['checked']} checked" for d in DIMS]
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
    w(f"    raise exception 'D1 go-live refused: the {tier} prompt is not the prompt gen_course.py rendered from the engine inputs (md5 %)', md5(v_prompt);")
    w('  end if;')
    w(f"  if not exists (select 1 from public.academy_capstones where app_slug = '{S}' and tier = '{tier}'")
    w(f"                    and cert_tier = '{cert}' and dataset = {lit(dataset)} and title = {lit(title)}) then")
    w(f"    raise exception 'D1 go-live refused: the {tier} capstone does not carry the certificate tier, dataset and title gen_course.py rendered';")
    w('  end if;')
    w("  select count(*), string_agg(l, ' / ') into v_n, v_names")
    w(f"    from unnest(array[{', '.join(lit(s_) for s_ in STATED[tier])}]) l where strpos(v_prompt, l) = 0;")
    w('  if v_n <> 0 then')
    w(f"    raise exception 'D1 go-live refused: % stated setting(s) or case file(s) are not named in the shipped {tier} prompt: %', v_n, v_names;")
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
w("    raise exception 'D1 go-live refused: % graded value(s) are handed in capstone text: %', v_n, v_names;")
w('  end if;')
w('')

# ---------------------------------------------------- the graded values
w('  -- --------------------------------------- the eighteen graded values')
for k in KEYS:
    w(f"  select (f->>'expected')::double precision into {V[k]}")
    w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
    w(f"   where c.app_slug = '{S}' and c.tier = '{TIER_OF[k]}' and f->>'key' = '{k}';")
    w(f'  if {V[k]} is null then')
    w(f"    raise exception 'D1 go-live refused: the seeded rows carry no value{name(k)}';")
    w('  end if;')
w('')

# ------------------------------------------------------ 1. the ledger
w('  -- ------------------------------------------ 1. against the engine ledger')
for k in KEYS:
    COUNT['ledger'].add(k)
    w(f'  if {V[k]} <> {fl(ENGINE[k])} then')
    w(f"    raise exception 'D1 go-live refused: the seeded value is %, and the engine returned {fl(ENGINE[k])}{name(k)}', {V[k]};")
    w('  end if;')
w('')

# ------------------------------------------------- 2. the second route
w('  -- ----------------------------------------------- 2. the second route in SQL')
CS, CE, MS = fl(lg['coverageStart']), fl(lg['coverageEnd']), fl(lg['maxStep'])
route('odudu_rhob_completeness', [
    "v_s := (select count(x)::double precision / count(*)::double precision from unnest(v_od_rhob) x);"])
route('odudu_nphi_coverage', [
    'v_x := 0.0; v_prev := null;',
    'for i in 1 .. array_length(v_od_depth, 1) loop',
    '  if v_od_nphi[i] is not null then',
    f'    if v_prev is not null and v_od_depth[i] - v_prev <= {MS} then',
    f'      v_x := v_x + greatest(0.0, least(v_od_depth[i], {CE}) - greatest(v_prev, {CS}));',
    '    end if;',
    '    v_prev := v_od_depth[i];',
    '  end if;',
    'end loop;',
    f'v_s := v_x / ({CE} - {CS});'])
route('odudu_scada_expected_step_min', [
    'select percentile_cont(0.5) within group (order by d) into v_s',
    '  from (select v_od_sc[g + 1] - v_od_sc[g] as d from generate_series(1, array_length(v_od_sc, 1) - 1) g) t where d > 0.0;'])
route('odudu_water_cut_day23', ['v_s := v_od_water[23] / (v_od_oil[23] + v_od_water[23]);'])
route('odudu_cumulative_drop_bbl', [
    'v_s := null; v_last := null; v_n := null;',
    'for i in 1 .. array_length(v_od_cum, 1) loop',
    '  if v_od_cum[i] is not null then',
    '    if v_last is not null and v_s is null and v_od_cum[v_last] - v_od_cum[i] > 0.0 then',
    '      v_s := v_od_cum[v_last] - v_od_cum[i]; v_n := i;',
    '    end if;',
    '    v_last := i;',
    '  end if;',
    'end loop;',
    'if v_n is distinct from 39 then',
    f"  raise exception 'D1 go-live refused: the second route finds the first fall of the cumulative on day %, and the capstone grades day 39{name('odudu_cumulative_drop_bbl')}', v_n;",
    'end if;'])
route('odudu_phase_sum_allowed_day44_bbl_d', [
    'v_s := null; v_n := null;',
    'for i in 1 .. array_length(v_od_gross, 1) loop',
    '  if v_s is null and v_od_gross[i] is not null and v_od_oil[i] is not null and v_od_water[i] is not null',
    '     and abs(v_od_oil[i] + v_od_water[i] - v_od_gross[i]) > 0.005 * abs(v_od_gross[i]) then',
    '    v_s := 0.005 * abs(v_od_gross[i]); v_n := i;',
    '  end if;',
    'end loop;',
    'if v_n is distinct from 44 then',
    f"  raise exception 'D1 go-live refused: the second route finds the phase-sum flag on day %, and the capstone grades day 44{name('odudu_phase_sum_allowed_day44_bbl_d')}', v_n;",
    'end if;'])
route('ikoro_core_max_abs_z', [
    'select avg(x), stddev_samp(x) into v_m, v_sd from unnest(v_ik_core) x;',
    'v_s := (select max(abs((x - v_m) / v_sd)) from unnest(v_ik_core) x);'])
route('ikoro_core_max_abs_modified_z', [
    'select percentile_cont(0.5) within group (order by x) into v_med from unnest(v_ik_core) x;',
    'select percentile_cont(0.5) within group (order by abs(x - v_med)) into v_mad from unnest(v_ik_core) x;',
    'v_s := (select max(0.6745 * abs(x - v_med) / v_mad) from unnest(v_ik_core) x);'])
route('ikoro_rhob_upper_fence_g_cm3', [
    'select percentile_cont(0.25) within group (order by x), percentile_cont(0.75) within group (order by x)',
    '  into v_q1, v_q3 from unnest(v_ik_rhob) x where x is not null;',
    'v_s := v_q3 + 1.5 * (v_q3 - v_q1);'])
HW, NS = IK['halfWindow'], IK['nSigma']
route('ikoro_rhob_hampel_threshold_entry57_g_cm3', [
    '-- entry 57 counted from 0 is array element 58; its window is 58 +/- the half window, present samples only',
    f'select percentile_cont(0.5) within group (order by v_ik_rhob[g]) into v_med from generate_series(58 - {HW}, 58 + {HW}) g where v_ik_rhob[g] is not null;',
    f'select percentile_cont(0.5) within group (order by abs(v_ik_rhob[g] - v_med)) into v_mad from generate_series(58 - {HW}, 58 + {HW}) g where v_ik_rhob[g] is not null;',
    f'v_s := {fl(NS)} * 1.4826 * v_mad;'])


def grubbs_bisect(q_expr, target):
    """Bisect Student's t on df = n - 2 for the upper tail probability q_expr,
    with the closed-form tail for odd df (A and S 26.7.3), then the critical G."""
    n_ = len(IK['core'])
    df = n_ - 2
    if df % 2 != 1:
        refused.append(f'the Grubbs second route needs odd degrees of freedom, and n - 2 is {df}')
    return [
        f'v_q := {q_expr};',
        'v_lo := 0.0; v_hi := 100.0;',
        'for j in 1 .. 200 loop',
        '  v_mid := 0.5 * (v_lo + v_hi);',
        f'  v_th := atan(v_mid / sqrt({fl(df)}));',
        '  v_term := cos(v_th); v_sum := cos(v_th);',
        f'  for i in 1 .. {(df - 3) // 2} loop',
        '    v_term := v_term * cos(v_th) * cos(v_th) * (2.0 * i) / (2.0 * i + 1.0);',
        '    v_sum := v_sum + v_term;',
        '  end loop;',
        '  v_tail := (1.0 - (2.0 / pi()) * (v_th + sin(v_th) * v_sum)) / 2.0;',
        '  if v_tail > v_q then v_lo := v_mid; else v_hi := v_mid; end if;',
        'end loop;',
        'v_t := 0.5 * (v_lo + v_hi);',
        f'{target} := ({fl(n_ - 1)} / sqrt({fl(n_)})) * sqrt(v_t * v_t / ({fl(df)} + v_t * v_t));']


route('ikoro_core_grubbs_critical', grubbs_bisect(f"{fl(IK['alpha'])} / (2.0 * {fl(len(IK['core']))})", 'v_s'))
route('ikoro_max_mahalanobis_d2', [
    'select avg(a), avg(b) into v_ma, v_mb from unnest(v_ik_a, v_ik_b) as t(a, b);',
    'select sum((a - v_ma) * (a - v_ma)) / (count(*)::double precision - 1.0),',
    '       sum((a - v_ma) * (b - v_mb)) / (count(*)::double precision - 1.0),',
    '       sum((b - v_mb) * (b - v_mb)) / (count(*)::double precision - 1.0)',
    '  into v_saa, v_sab, v_sbb from unnest(v_ik_a, v_ik_b) as t(a, b);',
    'v_det := v_saa * v_sbb - v_sab * v_sab;',
    'v_s := (select max(((a - v_ma) * (a - v_ma) * v_sbb - 2.0 * (a - v_ma) * (b - v_mb) * v_sab + (b - v_mb) * (b - v_mb) * v_saa) / v_det)',
    '          from unnest(v_ik_a, v_ik_b) as t(a, b));'])
# phase one, shared by the Expert routes
w('  v_centre := (select avg(x) from unnest(v_am_p1) x);')
w('  v_mrbar := (select avg(abs(v_am_p1[g] - v_am_p1[g - 1])) from generate_series(2, array_length(v_am_p1, 1)) g);')
w('  v_sigma := v_mrbar / 1.128;')
route('amasiri_phase1_individuals_ucl_psig', ['v_s := v_centre + 3.0 * v_sigma;'])
route('amasiri_phase1_mr_ucl_psig', ['v_s := 3.267 * v_mrbar;'])
LAM, LL, KK, HH = fl(AM['lambda']), fl(AM['L']), fl(AM['k']), fl(AM['h'])
route('amasiri_ewma_day14_psig', [
    'v_e := v_centre;',
    'for i in 1 .. 14 loop',
    f'  v_e := {LAM} * v_am_p2[i] + (1.0 - {LAM}) * v_e;',
    'end loop;',
    'v_s := v_e;'])
route('amasiri_ewma_exact_ucl_day2_psig', [
    f'v_s := v_centre + {LL} * v_sigma * (sqrt({LAM} / (2.0 - {LAM})) * sqrt(1.0 - (1.0 - {LAM}) ^ (2.0 * 2.0)));'])
route('amasiri_cusum_upper_day18_psi', [
    'v_hi := 0.0;',
    'for i in 1 .. 18 loop',
    f'  v_hi := greatest(0.0, v_hi + v_am_p2[i] - v_centre - {KK} * v_sigma);',
    'end loop;',
    'v_s := v_hi;'])
route('amasiri_scorecard_total', [
    'v_ws := (select sum(x) from unnest(v_sc_w) x);',
    'v_s := (select sum((w_ / v_ws) * (1.0 - f / c)) from unnest(v_sc_w, v_sc_failed, v_sc_checked) as t(w_, f, c));'])
w('')

# ---------------------------------------------------------- 3. the traps
w('  -- ------------------------------------------------------------ 3. the traps')
trap('odudu_rhob_completeness', 'the sentinel counted as missing', [
    'v_wrong := (select count(*) filter (where x is not null and x <> -999.25)::double precision / count(*)::double precision from unnest(v_od_rhob) x);'])
trap('odudu_rhob_completeness', 'the missing fraction quoted', [
    'v_wrong := (select count(*) filter (where x is null)::double precision / count(*)::double precision from unnest(v_od_rhob) x);'])
trap('odudu_nphi_coverage', 'a maxStep of one foot', [
    'v_x := 0.0; v_prev := null;',
    'for i in 1 .. array_length(v_od_depth, 1) loop',
    '  if v_od_nphi[i] is not null then',
    '    if v_prev is not null and v_od_depth[i] - v_prev <= 1.0 then',
    f'      v_x := v_x + greatest(0.0, least(v_od_depth[i], {CE}) - greatest(v_prev, {CS}));',
    '    end if;',
    '    v_prev := v_od_depth[i];',
    '  end if;',
    'end loop;',
    f'v_wrong := v_x / ({CE} - {CS});'])
trap('odudu_nphi_coverage', 'the fraction of samples present', [
    f'v_wrong := (select count(v_od_nphi[g])::double precision / count(*)::double precision from generate_series(1, array_length(v_od_depth, 1)) g where v_od_depth[g] >= {CS} and v_od_depth[g] <= {CE});'])
trap('odudu_scada_expected_step_min', 'the mean of every step', [
    'v_wrong := (select avg(v_od_sc[g + 1] - v_od_sc[g]) from generate_series(1, array_length(v_od_sc, 1) - 1) g);'])
trap('odudu_scada_expected_step_min', 'the span over the entries', [
    'v_wrong := (v_od_sc[array_length(v_od_sc, 1)] - v_od_sc[1]) / (array_length(v_od_sc, 1)::double precision - 1.0);'])
trap('odudu_water_cut_day23', 'the reported value quoted', ['v_wrong := v_od_wc[23];'])
trap('odudu_water_cut_day23', 'water over oil', ['v_wrong := v_od_water[23] / v_od_oil[23];'])
trap('odudu_water_cut_day23', 'the oil cut', ['v_wrong := v_od_oil[23] / (v_od_oil[23] + v_od_water[23]);'])
trap('odudu_cumulative_drop_bbl', 'a drop measured against day 36', ['v_wrong := v_od_cum[36] - v_od_cum[39];'])
trap('odudu_cumulative_drop_bbl', 'the drop as a percent of day 37', ['v_wrong := 100.0 * (v_od_cum[37] - v_od_cum[39]) / v_od_cum[37];'])
trap('odudu_phase_sum_allowed_day44_bbl_d', 'the tolerance taken on the sum of the parts', ['v_wrong := 0.005 * (v_od_oil[44] + v_od_water[44]);'])
trap('odudu_phase_sum_allowed_day44_bbl_d', 'the tolerance taken on the oil', ['v_wrong := 0.005 * v_od_oil[44];'])
trap('ikoro_core_max_abs_z', 'the population standard deviation', [
    'select avg(x), stddev_pop(x) into v_m, v_sd from unnest(v_ik_core) x;',
    'v_wrong := (select max(abs((x - v_m) / v_sd)) from unnest(v_ik_core) x);'])
trap('ikoro_core_max_abs_z', 'the ceiling quoted', [
    f"v_wrong := ({fl(len(IK['core']) - 1)}) / sqrt({fl(len(IK['core']))});"])
trap('ikoro_core_max_abs_modified_z', 'the reciprocal of 1.4826', [
    'select percentile_cont(0.5) within group (order by x) into v_med from unnest(v_ik_core) x;',
    'select percentile_cont(0.5) within group (order by abs(x - v_med)) into v_mad from unnest(v_ik_core) x;',
    'v_wrong := (select max((abs(x - v_med) / 1.4826) / v_mad) from unnest(v_ik_core) x);'])
trap('ikoro_core_max_abs_modified_z', 'the mean in place of the median', [
    'v_wrong := (select max(0.6745 * abs(x - (select avg(y) from unnest(v_ik_core) y)) / v_mad) from unnest(v_ik_core) x);'])
trap('ikoro_rhob_upper_fence_g_cm3', 'the outer fence, k of 3', [
    'select percentile_cont(0.25) within group (order by x), percentile_cont(0.75) within group (order by x)',
    '  into v_q1, v_q3 from unnest(v_ik_rhob) x where x is not null;',
    'v_wrong := v_q3 + 3.0 * (v_q3 - v_q1);'])
trap('ikoro_rhob_upper_fence_g_cm3', 'the fence built from the median', [
    'v_wrong := (select percentile_cont(0.5) within group (order by x) from unnest(v_ik_rhob) x where x is not null) + 1.5 * (v_q3 - v_q1);'])
trap('ikoro_rhob_hampel_threshold_entry57_g_cm3', 'a window one sample wider', [
    f'select percentile_cont(0.5) within group (order by v_ik_rhob[g]) into v_med from generate_series(58 - {HW + 1}, 58 + {HW + 1}) g where v_ik_rhob[g] is not null;',
    f'select percentile_cont(0.5) within group (order by abs(v_ik_rhob[g] - v_med)) into v_mad from generate_series(58 - {HW + 1}, 58 + {HW + 1}) g where v_ik_rhob[g] is not null;',
    f'v_wrong := {fl(NS)} * 1.4826 * v_mad;'])
trap('ikoro_rhob_hampel_threshold_entry57_g_cm3', 'no 1.4826 scale on the MAD', [
    f'select percentile_cont(0.5) within group (order by v_ik_rhob[g]) into v_med from generate_series(58 - {HW}, 58 + {HW}) g where v_ik_rhob[g] is not null;',
    f'select percentile_cont(0.5) within group (order by abs(v_ik_rhob[g] - v_med)) into v_mad from generate_series(58 - {HW}, 58 + {HW}) g where v_ik_rhob[g] is not null;',
    f'v_wrong := {fl(NS)} * v_mad;'])
trap('ikoro_rhob_hampel_threshold_entry57_g_cm3', 'two sigma', ['v_wrong := 2.0 * 1.4826 * v_mad;'])
trap('ikoro_core_grubbs_critical', 'the ceiling quoted', [
    f"v_wrong := ({fl(len(IK['core']) - 1)}) / sqrt({fl(len(IK['core']))});"])
trap('ikoro_core_grubbs_critical', 'the one-sided critical value at alpha over N',
     grubbs_bisect(f"{fl(IK['alpha'])} / {fl(len(IK['core']))}", 'v_wrong'))
trap('ikoro_max_mahalanobis_d2', 'the distance not squared', [f"v_wrong := sqrt({V['ikoro_max_mahalanobis_d2']});"])
trap('ikoro_max_mahalanobis_d2', 'the population covariance', [
    f"v_wrong := {V['ikoro_max_mahalanobis_d2']} * ({fl(len(IK['cloud']) - 1)} / {fl(len(IK['cloud']))});"])
trap('amasiri_phase1_individuals_ucl_psig', 'the sample standard deviation for sigma', [
    'v_wrong := v_centre + 3.0 * (select stddev_samp(x) from unnest(v_am_p1) x);'])
trap('amasiri_phase1_individuals_ucl_psig', 'two-sigma limits', ['v_wrong := v_centre + 2.0 * v_sigma;'])
trap('amasiri_phase1_mr_ucl_psig', 'D4 taken as 3', ['v_wrong := 3.0 * v_mrbar;'])
trap('amasiri_phase1_mr_ucl_psig', 'D4 times sigma', ['v_wrong := 3.267 * v_sigma;'])
trap('amasiri_ewma_day14_psig', 'the EWMA started at the first value', [
    'v_e := v_am_p2[1];',
    'for i in 1 .. 14 loop',
    f'  v_e := {LAM} * v_am_p2[i] + (1.0 - {LAM}) * v_e;',
    'end loop;',
    'v_wrong := v_e;'])
trap('amasiri_ewma_day14_psig', 'the target taken from phase two', [
    'v_e := (select avg(x) from unnest(v_am_p2) x);',
    'for i in 1 .. 14 loop',
    f'  v_e := {LAM} * v_am_p2[i] + (1.0 - {LAM}) * v_e;',
    'end loop;',
    'v_wrong := v_e;'])
trap('amasiri_ewma_exact_ucl_day2_psig', 'the asymptotic limit', [
    f'v_wrong := v_centre + {LL} * v_sigma * sqrt({LAM} / (2.0 - {LAM}));'])
trap('amasiri_ewma_exact_ucl_day2_psig', 'the exact limit of day 1', [
    f'v_wrong := v_centre + {LL} * v_sigma * (sqrt({LAM} / (2.0 - {LAM})) * sqrt(1.0 - (1.0 - {LAM}) ^ 2.0));'])
trap('amasiri_cusum_upper_day18_psi', 'the CUSUM without its floor at zero', [
    'v_hi := 0.0;',
    'for i in 1 .. 18 loop',
    f'  v_hi := v_hi + v_am_p2[i] - v_centre - {KK} * v_sigma;',
    'end loop;',
    'v_wrong := v_hi;'])
trap('amasiri_cusum_upper_day18_psi', 'the plain cumulative sum', [
    'v_wrong := (select sum(v_am_p2[g] - v_centre) from generate_series(1, 18) g);'])
trap('amasiri_scorecard_total', 'equal weights', [
    'v_wrong := (select avg(1.0 - f / c) from unnest(v_sc_failed, v_sc_checked) as t(f, c));'])
trap('amasiri_scorecard_total', 'the failures pooled across dimensions', [
    'v_wrong := 1.0 - (select sum(x) from unnest(v_sc_failed) x) / (select sum(x) from unnest(v_sc_checked) x);'])
w('')

# ------------------------------------------------------------ the flip
w('  -- ------------------------------------------------------------- the flip')
w(f"  update public.academy_apps set status = 'available' where slug = '{S}';")
w(f"  if not exists (select 1 from public.academy_apps where slug = '{S}' and status = 'available') then")
w(f"    raise exception 'D1 go-live refused: {S} did not reach status available';")
w('  end if;')
w("  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')")
w('    into v_available, v_soon from public.academy_apps;')
w(f"  raise notice 'D1 go-live: {S} available | 3 tiers | % lessons | % questions | % capstones | % graded | catalogue % available / % coming_soon',")
w('    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;')
w('end $$;')

SQL = HEADER + '\n' + '\n'.join(decl) + '\n' + '\n'.join(P) + '\n'

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
