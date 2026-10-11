#!/usr/bin/env python3
"""Generate the QI go-live migration (HELD). Adapted from SC4 marine's.

NOTHING HERE IS RETYPED. The graded values are read out of the CAPSTONE ROWS
THE LADDER ITSELF SEEDED, by key, inside the same transaction, and checked four
ways, none of which restates the generator that wrote them:

1. AGAINST THE ENGINE LEDGER: the values the tier's capstone generator returned
   through the teaching lab and the vendored engines when this file was
   generated (gen_course.py refuses unless fields.json equals that run), to the
   last bit.
2. BY A SECOND ROUTE IN SQL over the case file the learner is handed
   (golive_helpers.sql), each to 1e-9 relative: sixteen of the eighteen
   fields (Associate rock physics and wet trend; every Professional field;
   every Expert field, the two inversions solved exactly by their normal
   equations). The two Associate spectrum fields have no second route (a padded
   FFT); their independent check is the oracle's direct DFT, check 3.
3. BY THE ORACLE: oracle_check.py --json, an independent standard-library
   Python replay, written in by value; each seeded value within its tolerance.
4. BY THE TRAPS: every wrong method discriminate.mjs swept through the engines
   for a field, by value, must miss the seeded value by more than its tolerance.

AND BEFORE ANY OF IT, THE COMPLETENESS BLOCK: the go-live REFUSES, naming the
tier, while any tier lacks its capstone, and refuses while the deep structures
or the 396 questions are short (the Professional and Expert deep seeds are
written once their banks are final). Then the shape, the catalogue row (geoscience,
path_order 80, prerequisite welldata, course_type app) with no other course at
80, the numeric grader simulated on every field, each shipped prompt byte for
byte (md5) with every stated setting named, and a sweep of every number handed
in capstone text against every graded value.

NO BEGIN OR COMMIT: apply_qi.sh wraps the file in one transaction.

Usage: python3 gen_golive.py      writes the go-live to QI_GOLIVE_OUT (default the repo's migrations)
   QI_COURSE_SQL   the course migration this ladder emits (default the repo's)
"""
import hashlib
import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import gen_course as GC  # noqa: E402  (runs the engine and the self checks; writes nothing on import)

W, REPO = GC.W, GC.REPO
NAMES = GC.names
COURSE = os.environ.get('QI_COURSE_SQL', f'{GC.OUTDIR}/{NAMES["course"]}.sql')
OUT = os.environ.get('QI_GOLIVE_OUT', f'{GC.OUTDIR}/{NAMES["go_live"]}.sql')
SLUG, MODULE, PATH_ORDER, PREREQ = GC.SLUG, GC.MODULE, GC.PATH_ORDER, GC.PREREQ
fields = GC.fields
KEYS, TIER_OF = GC.KEYS, GC.TIER_OF
F = {k: v for _t, k, v, _tol in fields}
TOL = {k: tol for _t, k, _v, tol in fields}
ENGINE = {k: r['value'] for k, r in GC.ENGINE.items()}
refused = list(GC.bad)
TAG = 'QI go-live refused'

course_sql = open(COURSE, encoding='utf-8').read() if os.path.exists(COURSE) else None
if course_sql != GC.SQL.get('course'):
    refused.append(f'the course migration at {COURSE} is not the one gen_course.py renders now')
for k in KEYS:
    if TOL[k] < 5e-7:
        refused.append(f'{k} is graded at {TOL[k]}, below the six-decimal floor')


def run(cmd, what):
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=W, env=dict(os.environ, QI_REPO=REPO, TZ='UTC', LC_ALL='C'))
    if r.returncode != 0:
        sys.exit(f'REFUSED: {what} failed (exit {r.returncode}): {(r.stdout + r.stderr).strip()[-400:]}')
    return r.stdout


ORACLE = json.loads(run(['python3', os.path.join(W, 'oracle_check.py'), '--json'], 'oracle_check.py --json'))
WRONG = json.loads(run(['node', os.path.join(W, 'discriminate.mjs'), '--json'], 'discriminate.mjs --json'))
for k in KEYS:
    o = ORACLE.get(k, {}).get('value')
    if o is None or abs(o - F[k]) > TOL[k]:
        refused.append(f'{k}: the oracle gives {o!r}, not within {TOL[k]} of the engine\'s value')
    w_ = WRONG.get(k)
    if w_ is None or w_['truth'] != F[k]:
        refused.append(f'{k}: discriminate.mjs does not compute the engine\'s value')
    elif sum(1 for v in w_['wrong'].values() if v is not None) < 2:
        refused.append(f'{k}: discriminate.mjs aims fewer than two wrong methods at it')


def fl(x):
    return repr(float(x)) + '::double precision'


def lit(s):
    return "'" + s.replace("'", "''") + "'"


def num(x):
    return repr(float(x))


def name(*keys):
    return ' [graded field: ' + ', '.join(f'{TIER_OF[k]}/{k}' for k in keys) + ']'


P = []
w = P.append
COUNT = {'ledger': set(), 'route': set(), 'oracle': set(), 'trap': {}}
V = {k: f'v_g_{k}' for k in KEYS}
CASEVAR = {'beginner': 'v_case_b', 'intermediate': 'v_case_i', 'advanced': 'v_case_a'}

HEADER = f"""-- ============================================================================
-- QI GO-LIVE (HELD): Quantitative Interpretation flips to 'available' in the
-- Geoscience module, at path_order {PATH_ORDER}.
--
-- DEPLOY GATE. Do NOT run this until a NextGen production upload carries the
-- route /dashboard/apps/qi. The 78 lessons, the teaching lab (qiLab.js and its
-- Professional and Expert companions), the four explorer panels and the
-- capstone case files ship in the ZIP and NOT in this database. AN APP COURSE:
-- the Suite app is QI Studio, and the course's own explorer panels carry every
-- practical, so this go-live waits on the NextGen upload only.
--
-- IT ALSO REFUSES WHILE THE LADDER IS SHORT: naming the tier when a capstone is
-- missing, and when the three deep structures or the 396 questions are not all
-- seeded (the Professional and Expert deep seeds are written once their banks
-- are final, and this file is regenerated then).
--
-- EVERY GRADED VALUE IS CHECKED FOUR WAYS, and none restates the generator:
--   1. against the ENGINE LEDGER (the capstone generators' run through the
--      teaching lab and the vendored engines), to the last bit;
--   2. by a SECOND ROUTE IN SQL over the case file the learner is handed, to
--      1e-9 relative, for sixteen fields: Batzle-Wang, Wood, Voigt-Reuss-Hill,
--      Gassmann, least squares, Shuey and the total least squares wet trend;
--      Dix, Walden, NMO stretch, the binned partial stacks, the Shuey
--      regression and the one scale; the low-frequency model, both inversions
--      solved exactly by their normal equations, the Student t porosity bound,
--      the Gaussian facies posterior and the priority-flood closure. The two
--      Associate spectrum fields (a padded FFT) have none and rest on check 3;
--   3. by the ORACLE (oracle_check.py, an independent standard-library Python
--      replay, a direct DFT for the spectra), written in by value, within each
--      field's tolerance;
--   4. by the TRAPS: every wrong method discriminate.mjs swept through the
--      engines, by value, must miss the seeded value by more than its tolerance.
--
-- THE HELPERS are temporary functions (pg_temp), gone when the session ends.
-- NO BEGIN OR COMMIT: apply_qi.sh wraps this file in one transaction.
-- THE GRADER IS NUMERIC: abs(answer - expected) <= tol. The six-decimal answer
-- the prompt asks for must pass, and one unit either side in the sixth decimal
-- must fail at the six-decimal floor. Two Expert fields are graded wider than
-- the floor because their value comes from an iterative solver: the model-based
-- impedance at 1 kg/(m2 s) (under a millionth of the value) and the
-- simultaneous Vp/Vs at 5e-6, the tolerances gradedTolerance.js derives.
-- EVERY REFUSAL THAT READS A GRADED VALUE NAMES IT as tier/key.
-- ============================================================================
"""

HELPERS = open(os.path.join(HERE, 'golive_helpers.sql'), encoding='utf-8').read()

decl = ['do $$', '#variable_conflict use_column', 'declare',
        '  v_structures int; v_questions int; v_capstones int; v_lessons int;',
        '  v_modules int; v_graded int; v_available int; v_soon int; v_n int;',
        '  v_names text; v_prompt text; v_s double precision; v_wrong double precision;']
for k in KEYS:
    decl.append(f'  {V[k]} double precision;')
for t in GC.TIER:
    decl.append(f"  {CASEVAR[t]} jsonb := {lit(json.dumps(GC.CASE[t], ensure_ascii=False, separators=(',', ':')))}::jsonb;")
decl += ['begin', '']
S = SLUG

w('  -- ------------------------------------------------------- 0. completeness')
w("  select string_agg(t, ', ' order by o) into v_names from (values ('beginner', 1), ('intermediate', 2), ('advanced', 3)) x(t, o)")
w(f"   where not exists (select 1 from public.academy_capstones c where c.app_slug = '{S}' and c.tier = x.t);")
w('  if v_names is not null then')
w(f"    raise exception '{TAG}: no capstone for the tier(s) % (a tier''s capstone is written only once the engines behind its fields pass the extraction gate)', v_names;")
w('  end if;')
w(f"  select count(*) into v_structures from public.academy_course_structures where app_slug = '{S}' and active;")
w('  if v_structures <> 3 then')
w(f"    raise exception '{TAG}: {S} has % active deep structures, expected 3', v_structures;")
w('  end if;')
w(f"  select count(*) into v_questions from public.academy_quiz_questions where app_slug = '{S}';")
w('  if v_questions <> 396 then')
w(f"    raise exception '{TAG}: {S} has % quiz questions, expected 396', v_questions;")
w('  end if;')
w(f"  select count(*) into v_capstones from public.academy_capstones where app_slug = '{S}';")
w(f"  select count(*) into v_graded from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}';")
w('  if v_capstones <> 3 or v_graded <> 18 then')
w(f"    raise exception '{TAG}: {S} has % capstones and % graded fields, expected 3 and 18', v_capstones, v_graded;")
w('  end if;')
w('  select count(*) into v_lessons from public.academy_course_structures s,')
w("         lateral jsonb_array_elements(s.structure->'modules') m, lateral jsonb_array_elements_text(m->'lesson_keys') lk")
w(f"   where s.app_slug = '{S}' and s.active;")
w("  select count(*) into v_modules from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m")
w(f"   where s.app_slug = '{S}' and s.active;")
w('  if v_lessons <> 78 or v_modules <> 18 then')
w(f"    raise exception '{TAG}: {S} carries % lesson keys in % modules, expected 78 in 18', v_lessons, v_modules;")
w('  end if;')
w('')
w('  -- ---------------------------------------------------------------- shape')
for cond, msg in ((f"select tier from public.academy_quiz_questions where app_slug = '{S}' group by tier having count(*) <> 132",
                   '% tier(s) do not carry exactly 132 questions'),
                  (f"select tier, module_key from public.academy_quiz_questions where app_slug = '{S}' and scope = 'module' group by tier, module_key having count(*) <> 15",
                   '% module bank(s) do not carry exactly 15 questions'),
                  (f"select tier from public.academy_quiz_questions where app_slug = '{S}' and scope = 'final' group by tier having count(*) <> 42",
                   '% final exam(s) do not carry exactly 42 questions'),
                  (f"select c.tier from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f where c.app_slug = '{S}' group by c.tier having count(*) <> 6",
                   '% tier(s) do not grade exactly six fields')):
    w(f'  select count(*) into v_n from ({cond}) t;')
    w('  if v_n <> 0 then')
    w(f"    raise exception '{TAG}: {msg}', v_n;")
    w('  end if;')
w(f"  select count(*) into v_n from public.academy_quiz_questions where app_slug = '{S}'")
w('     and (jsonb_array_length(options) <> 4 or answer_index < 0 or answer_index > 3);')
w('  if v_n <> 0 then')
w(f"    raise exception '{TAG}: % question(s) do not offer four options with a key inside them', v_n;")
w('  end if;')
w('  select count(*) into v_n from (select distinct qq.tier, qq.module_key from public.academy_quiz_questions qq')
w(f"     where qq.app_slug = '{S}' and qq.scope = 'module' and not exists (")
w("       select 1 from public.academy_course_structures s, lateral jsonb_array_elements(s.structure->'modules') m")
w("        where s.app_slug = qq.app_slug and s.tier = qq.tier and s.active and m->>'key' = qq.module_key)) t;")
w('  if v_n <> 0 then')
w(f"    raise exception '{TAG}: % module bank(s) are keyed to a module the structure does not declare', v_n;")
w('  end if;')
w(f"  if not exists (select 1 from public.academy_apps where slug = '{S}' and module = '{MODULE}' and path_order = {PATH_ORDER}")
w(f"                  and prereq_slug = '{PREREQ}' and course_type = 'app') then")
w(f"    raise exception '{TAG}: the {S} catalogue row is not {MODULE} at path_order {PATH_ORDER} with the prerequisite {PREREQ} and course_type app';")
w('  end if;')
w(f"  if exists (select 1 from public.academy_apps where path_order = {PATH_ORDER} and slug <> '{S}') then")
w(f"    raise exception '{TAG}: another course already holds path_order {PATH_ORDER}';")
w('  end if;')
w(f"  if not exists (select 1 from public.academy_apps where slug = '{PREREQ}') then")
w(f"    raise exception '{TAG}: the prerequisite course {PREREQ} is not in the catalogue';")
w('  end if;')
w('')
w('  -- ------------------------------------------------- the grader is numeric')
TOL_ROWS = ', '.join(f"({lit(TIER_OF[k])}, {lit(k)}, {TOL[k]!r}::numeric)" for k in KEYS)
w("  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names")
w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
w(f"   where c.app_slug = '{S}'")
w("     and (jsonb_typeof(f->'expected') <> 'number' or jsonb_typeof(f->'tol') <> 'number'")
w("          or abs((f->>'expected')::numeric) <= 0.001")
# "Whole" is read with each field's own tolerance when it is below half a unit;
# a field graded at half a unit or more (the model-based impedance, whose
# tolerance is set by the solver's convergence) must instead be large against
# its tolerance, so the grade is still a precision of a millionth or finer.
w("          or ((f->>'tol')::numeric < 0.5 and abs((f->>'expected')::numeric - round((f->>'expected')::numeric)) <= (f->>'tol')::numeric)")
w("          or ((f->>'tol')::numeric >= 0.5 and abs((f->>'expected')::numeric) < 1000000 * (f->>'tol')::numeric)")
w(f"          or (f->>'tol')::numeric is distinct from (select t.tol from (values {TOL_ROWS}) t(tier, k, tol) where t.tier = c.tier and t.k = f->>'key')")
w("          or coalesce(f->>'label', '') = '' or coalesce(f->>'unit', '') = '');")
w('  if v_n <> 0 then')
w(f"    raise exception '{TAG}: % graded field(s) are not a non-zero, non-whole number at the tolerance gradedTolerance.js derives, with a label and a unit: %', v_n, v_names;")
w('  end if;')
w("  select count(*), string_agg(c.tier || '/' || (f->>'key'), ', ') into v_n, v_names")
w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
w(f"   where c.app_slug = '{S}'")
w("     and (abs(round((f->>'expected')::numeric, 6) - (f->>'expected')::numeric) > (f->>'tol')::numeric")
w("          or ((f->>'tol')::numeric = 0.0000005")
w("              and (abs(round((f->>'expected')::numeric, 6) + 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric")
w("                   or abs(round((f->>'expected')::numeric, 6) - 0.000001 - (f->>'expected')::numeric) <= (f->>'tol')::numeric)));")
w('  if v_n <> 0 then')
w(f"    raise exception '{TAG}: % graded field(s) either fail the six-decimal answer or pass one a unit off in the sixth decimal: %', v_n, v_names;")
w('  end if;')
w('')
w('  -- ---------------------------------------- the prompts the learner reads')
STATED = {}
for t, (cert, dataset, title, prompt) in GC.TIER.items():
    STATED[t] = [GC.n(v) + ' ' if False else GC.n(v) for v in GC.stated_numbers(t, GC.CASE[t])] + [GC.CASE_NAME[t], GC.FREE]
    md5 = hashlib.md5(prompt.encode('utf-8')).hexdigest()
    w(f"  select prompt into v_prompt from public.academy_capstones where app_slug = '{S}' and tier = '{t}';")
    w(f"  if v_prompt is null or md5(v_prompt) <> '{md5}' then")
    w(f"    raise exception '{TAG}: the {t} prompt is not the prompt gen_course.py rendered from the case file (md5 %)', md5(v_prompt);")
    w('  end if;')
    w(f"  if not exists (select 1 from public.academy_capstones where app_slug = '{S}' and tier = '{t}'")
    w(f"                    and cert_tier = '{cert}' and dataset = {lit(dataset)} and title = {lit(title)}) then")
    w(f"    raise exception '{TAG}: the {t} capstone does not carry the certificate tier, dataset and title gen_course.py rendered';")
    w('  end if;')
    w("  select count(*), string_agg(l, ' / ') into v_n, v_names")
    w(f"    from unnest(array[{', '.join(lit(s_) for s_ in STATED[t])}]) l where strpos(v_prompt, l) = 0;")
    w('  if v_n <> 0 then')
    w(f"    raise exception '{TAG}: % stated setting(s) or case file(s) are not named in the shipped {t} prompt: %', v_n, v_names;")
    w('  end if;')
w('  -- No number handed in any capstone text may sit within its tolerance of any graded value of any tier.')
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
w(f"    raise exception '{TAG}: % graded value(s) are handed in capstone text: %', v_n, v_names;")
w('  end if;')
w('')
w('  -- ------------------------------------------------------- the graded values')
for k in KEYS:
    w(f"  select (f->>'expected')::double precision into {V[k]}")
    w('    from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f')
    w(f"   where c.app_slug = '{S}' and c.tier = '{TIER_OF[k]}' and f->>'key' = '{k}';")
    w(f'  if {V[k]} is null then')
    w(f"    raise exception '{TAG}: the seeded rows carry no value{name(k)}';")
    w('  end if;')
w('')
w('  -- ------------------------------------------ 1. against the engine ledger')
for k in KEYS:
    COUNT['ledger'].add(k)
    w(f'  if {V[k]} <> {fl(ENGINE[k])} then')
    w(f"    raise exception '{TAG}: the seeded value is %, and the engine returned {num(ENGINE[k])}{name(k)}', {V[k]};")
    w('  end if;')
w('')
w('  -- ----------------------------------------------- 2. the second route in SQL')
SECOND = {
    'quarvin_dix_vint': "pg_temp.qi_prof(v_case_i, 'dix')",
    'quarvin_walden_deg': "pg_temp.qi_prof(v_case_i, 'walden')",
    'quarvin_nmo_stretch': "pg_temp.qi_prof(v_case_i, 'stretch')",
    'quarvin_far_stack_amp': "pg_temp.qi_prof(v_case_i, 'far')",
    'quarvin_shuey_a': "pg_temp.qi_prof(v_case_i, 'shuey_a')",
    'quarvin_one_scale': "pg_temp.qi_prof(v_case_i, 'scale')",
    'delsholm_lfm_lnai_b': "pg_temp.qi_exp(v_case_a, 'lfm')",
    'delsholm_mb_ai': "pg_temp.qi_exp(v_case_a, 'mb')",
    'delsholm_sim_vpvs': "pg_temp.qi_exp(v_case_a, 'sim')",
    'delsholm_phi_q90': "pg_temp.qi_exp(v_case_a, 'phi')",
    'delsholm_p_oil': "pg_temp.qi_exp(v_case_a, 'poil')",
    'delsholm_column_ft': "pg_temp.qi_exp(v_case_a, 'column')",
    'tamberlo_shear_slope': "pg_temp.qi_assoc(v_case_b, 'slope')",
    'tamberlo_ai_brine': "pg_temp.qi_assoc(v_case_b, 'ai')",
    'tamberlo_vpvs_brine': "pg_temp.qi_assoc(v_case_b, 'vpvs')",
    'tamberlo_wet_distance': "pg_temp.qi_assoc(v_case_b, 'distance')",
}
# A field with no second route in SQL, and why; the oracle is its independent check.
NO_ROUTE = {
    'tamberlo_low6_hz': 'a padded FFT; checked by the oracle\'s direct DFT',
    'tamberlo_centroid_hz': 'a padded FFT; checked by the oracle\'s direct DFT',
}
for k in KEYS:
    if k in SECOND:
        COUNT['route'].add(k)
        w(f'  v_s := {SECOND[k]};')
        w(f'  if v_s is null or abs(v_s - {V[k]}) > 1e-9 * abs({V[k]}) then')
        w(f"    raise exception '{TAG}: the second route in SQL gives %, and the seeded value is %{name(k)}', v_s, {V[k]};")
        w('  end if;')
    elif k in NO_ROUTE:
        w(f'  -- {k}: no second route in SQL ({NO_ROUTE[k]})')
    else:
        refused.append(f'{k} has neither a second route in SQL nor a stated reason for none')
w('')
w('  -- ---------------------------------------------------- 3. against the oracle')
for k in KEYS:
    COUNT['oracle'].add(k)
    o = ORACLE[k]
    w(f"  -- {k}: {o['oracle']}")
    w(f'  if abs({V[k]} - {fl(o["value"])}) > {fl(TOL[k])} then')
    w(f"    raise exception '{TAG}: the oracle gives {num(o['value'])}, not within {num(TOL[k])} of the seeded %{name(k)}', {V[k]};")
    w('  end if;')
w('')
w('  -- ------------------------------------------------------------- 4. the traps')
for k in KEYS:
    for why, val in WRONG[k]['wrong'].items():
        if val is None:
            continue
        label = why.replace("'", '')
        COUNT['trap'][k] = COUNT['trap'].get(k, 0) + 1
        w(f'  v_wrong := {fl(val)};')
        w(f'  if abs(v_wrong - {V[k]}) <= {fl(TOL[k])} then')
        w(f"    raise exception '{TAG}: the trap ({label}) reads %, within the tolerance of the seeded %, so the field does not discriminate the trap{name(k)}', v_wrong, {V[k]};")
        w('  end if;')
w('')
w('  -- ------------------------------------------------------------- the flip')
w(f"  update public.academy_apps set status = 'available' where slug = '{S}';")
w(f"  if not exists (select 1 from public.academy_apps where slug = '{S}' and status = 'available') then")
w(f"    raise exception '{TAG}: {S} did not reach status available';")
w('  end if;')
w("  select count(*) filter (where status = 'available'), count(*) filter (where status = 'coming_soon')")
w('    into v_available, v_soon from public.academy_apps;')
w(f"  raise notice 'QI go-live: {S} available, 3 tiers, % lessons, % questions, % capstones, % graded, catalogue % available and % coming_soon',")
w('    v_lessons, v_questions, v_capstones, v_graded, v_available, v_soon;')
w('end $$;')

SQL = HEADER + HELPERS + '\n' + '\n'.join(decl) + '\n' + '\n'.join(P) + '\n'

for k in KEYS:
    for what in ('ledger', 'oracle'):
        if k not in COUNT[what]:
            refused.append(f'{k} has no {what} check')
    if COUNT['trap'].get(k, 0) < 2:
        refused.append(f'{k} has {COUNT["trap"].get(k, 0)} trap(s); two or more are required')
if re.search('[–—]', SQL):
    refused.append('an en or em dash in the go-live')
if re.search(r'(?im)^\s*(begin|commit|rollback)\s*;', SQL):
    refused.append('a transaction line of its own in the go-live; the apply script wraps it')
for ln in SQL.splitlines():
    if 'raise exception' in ln and 'v_g_' in ln and '[graded field:' not in ln:
        refused.append(f'a refusal reads a graded value and names none: {ln.strip()[:120]}')
for b in ('-- ------------------------------------------------------- 0. completeness',
          '-- ------------------------------------------ 1. against the engine ledger',
          '-- ----------------------------------------------- 2. the second route in SQL',
          '-- ---------------------------------------------------- 3. against the oracle',
          '-- ------------------------------------------------------------- 4. the traps'):
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
    print(f"tiers with a capstone {list(GC.TIER)}; ledger {len(COUNT['ledger'])}, second route in SQL {len(COUNT['route'])} "
          f"(none for {sorted(set(KEYS) - COUNT['route'])}), oracle {len(COUNT['oracle'])}, traps {sum(COUNT['trap'].values())} "
          f"over {len(KEYS)} fields; the completeness block refuses while {[t for t in GC.TIERS if t not in GC.TIER]} lack a capstone")
