#!/usr/bin/env python3
"""B4/B5 ROUND-OFF: the capstone half. Writes the guarded capstone migrations.

  python3 roundoff_capstones.py [--container ro-scratch]

reads the live capstones from a LOCAL scratch replay (main + 20261021a/b +
20261022; never production) and writes

  migrations/20261023b_ro_capstone_<course>.sql   prompt copy only (cementing,
      casingtubing, gaswell advanced): each prompt must hold its current text
      (updated) or its corrected text (left); `fields` must equal the live
      fields exactly (jsonb equality) before and after, so no expected value,
      tolerance or key can move.
  migrations/20261023b_ro_capstone_<course>_dataset.sql   the `dataset`
      column only (wellcontrol beginner shoe depth); prompt and fields asserted
      unchanged.
  migrations/20261023c_ro_fiscal_tolerances.sql   eight fiscal tolerances
      LOOSENED to what the Fiscal Regime Designer prints (toFixed(1)): half a
      unit, 0.05, for a single reading, and 0.1 for a difference of two
      readings. Guarded on the old tolerance and the expected value, exactly as
      20261022_b5_graded_tolerances.sql is.

Every change is listed below with its reason; the text is the source of truth
and the SQL is regenerated from it. Copy rule: no em or en dash, no new
"X, not Y" contrastive.
"""
import argparse, hashlib, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, '..', '..'))

PROMPTS = {
    ('cementing', 'advanced'): {
        'why': ('min_standoff_rigid grades the smallest rigid standoff over the whole string. The engine '
                '(cementing.js standoffProfile) evaluates every 30 m interval: the blade ratio in that '
                'interval\'s bore, less that interval\'s sag. The cased 13-3/8 inch bore is wider, so its ratio '
                'is lower, (0.29 - 0.244475)/(0.315341 - 0.244475) = 0.6424096181525695, and the well is vertical '
                'to 500 m, so no sag is subtracted there. The open hole minimum is 0.6827896512935882 less its '
                'sag = 0.6543142173967237. The prompt said field 5 is "not the blade ratio" and that the sag is '
                'subtracted, which sends a learner to 0.65431 in the open hole, a fail. The engine is physically '
                'right (a rigid blade stands a pipe off less in a bigger hole; a vertical pipe does not sag), so '
                'the copy is corrected and nothing is regraded.'),
        'edits': [
            ('then 3 by bisection, then 5.',
             'then 3 by bisection, then 5, interval by interval.'),
            ('Field 5 is not the blade ratio: the sag is subtracted from it exactly as it is for a bow spring.',
             'Field 5 is the smallest rigid standoff anywhere on the string, cased hole and open hole alike: in '
             'each interval the sag is subtracted from the blade ratio of that interval\'s bore exactly as it is '
             'for a bow spring, and where the well is vertical the sag is zero.'),
        ],
    },
    ('casingtubing', 'advanced'): {
        'why': ('helical_limit_N is 2(2 sqrt2 - 1) sqrt(E I w / r) with w from g = 9.80665. g is stated '
                'nowhere in the course, and 9.81 moves the limit by 45 N against a tolerance of 0.5 N.'),
        'edits': [
            ('rather than the 1150 the lessons used.',
             'rather than the 1150 the lessons used, with g taken as 9.80665 m/s2.'),
        ],
    },
    ('gaswell', 'advanced'): {
        'why': ('The prompt said field 3 is the ONE graded value reachable by hand. Field 6, the liquid a day '
                'of cycling delivers, is too: slug volume from the 2.750 in bore and 165 ft, cycle time from the '
                'five stated cycle figures, 1440 over the cycle, reproduces 18.79621249139511 exactly.'),
        'edits': [
            ('Field 3 is the ONE graded value in this course reachable by hand, and doing it by hand',
             'Field 3 is one of the two graded values in this course reachable by hand, field 6 being the '
             'other, and doing field 3 by hand'),
        ],
    },
}

# dataset copy: the `dataset` column only (the grader and the pages never read it)
DATASETS = {
    ('wellcontrol', 'beginner'): {
        'why': ('The dataset line said the slant well\'s shoe is at 1500 m measured depth. The fixture '
                '(test-data/drilling/goldens/wellcontrol_cases.json, slant shoeMd 1400) and the capstone '
                'lesson (beginner m06 l02) say 1400 m, and every graded value was computed at 1400. The '
                'grader and the course pages never read `dataset`, so no answer or page moves; the record '
                'is corrected so it agrees with the fixture.'),
        'edits': [('its shoe at 1500 m measured depth', 'its shoe at 1400 m measured depth')],
    },
}

# (tier, key, old tol, new tol, why)
FISCAL = [
    ('beginner', 'con_total_government_take_musd', 0.001, 0.05, 'summary govTake.toFixed(1)'),
    ('intermediate', 'psc_npv_musd', 0.001, 0.05, 'summary npv.toFixed(1)'),
    ('advanced', 'cmp_top_npv_musd', 0.001, 0.05, 'summary npv.toFixed(1) on the first row'),
    ('advanced', 'cmp_psc_effective_tax_rate_pct', 0.0001, 0.05, 'summary share of net revenue toFixed(1)'),
    ('advanced', 'cmp_psc_price_sweep_at_60_pct', 0.0001, 0.05, 'price sweep tooltip toFixed(1)'),
    ('advanced', 'cmp_psc_capex_loss_last_tenth_musd', 0.001, 0.1, 'difference of two capex sweep readings, each toFixed(1)'),
    ('advanced', 'cmp_psc_capex_loss_eight_point_musd', 0.001, 0.1, 'swept point minus a direct run, each toFixed(1)'),
    ('advanced', 'cmp_con_price_climb_pct_points', 0.0001, 0.1, 'last minus first price sweep reading, each toFixed(1)'),
]
FISCAL_MIG = '20261023c_ro_fiscal_tolerances.sql'
DASH = re.compile('[–—]')
CONTRAST = re.compile(r',\s*not\b')


def q(s):
    return "'" + s.replace("'", "''") + "'"


def live(container):
    sql = ("select coalesce(json_agg(json_build_object('app', app_slug, 'tier', tier, 'prompt', prompt, 'dataset', dataset, 'fields', fields)), '[]') "
           "from public.academy_capstones where active")
    out = subprocess.run(['docker', 'exec', container, 'psql', '-U', 'postgres', '-tAc', sql],
                         capture_output=True, text=True, check=True).stdout
    return {(c['app'], c['tier']): c for c in json.loads(out)}


def prompt_sql(course, tier, cap, spec):
    old = cap['prompt']
    new = old
    for a, b in spec['edits']:
        if new.count(a) != 1:
            sys.exit(f'REFUSED: {course}/{tier}: edit anchor not found exactly once: {a!r}')
        if DASH.search(b):
            sys.exit(f'REFUSED: {course}/{tier}: em or en dash in {b!r}')
        if CONTRAST.search(b) and not CONTRAST.search(a):
            sys.exit(f'REFUSED: {course}/{tier}: new "X, not Y" contrastive in {b!r}')
        new = new.replace(a, b)
    fields = json.dumps(cap['fields'], ensure_ascii=False)
    tag = f'roundoff capstone {course}/{tier}'
    why = '\n'.join('-- ' + l for l in wrap(spec['why']))
    edits = '\n'.join(f'--   was: {a}\n--   now: {b}' for a, b in spec['edits'])
    return f"""-- ============================================================================
-- B4/B5 ROUND-OFF, CAPSTONE COPY: {course} / {tier} prompt.
--
{why}
--
-- THE EDIT (prompt text only):
{edits}
--
-- WHAT DOES NOT MOVE. `fields` (every key, label, unit, expected value and
-- tolerance), title, dataset, status and the row itself. The guard below
-- requires `fields` to equal its live value exactly, before and after. No
-- stored attempt is re-scored and no answer grades differently.
--
-- GUARDS. The prompt must hold its current text (md5 {hashlib.md5(old.encode()).hexdigest()}, it is
-- updated) or the corrected one (md5 {hashlib.md5(new.encode()).hexdigest()}, left alone). Anything
-- else raises and the transaction rolls back. Generated by
-- docs/graded-field-audit/roundoff_capstones.py from a scratch replay of main
-- plus 20261021a/b and 20261022. Runs after those. SAFE TO RE-RUN.
-- ============================================================================

do $$
declare
  v_n       integer;
  v_state   text;
  v_count   integer;
begin
  select count(*) into v_n from public.academy_capstones where app_slug = {q(course)} and tier = {q(tier)} and active;
  if v_n <> 1 then raise exception '{tag} refused: % active capstone rows, expected 1', v_n; end if;

  select case when md5(prompt) = '{hashlib.md5(old.encode()).hexdigest()}' then 'old'
              when md5(prompt) = '{hashlib.md5(new.encode()).hexdigest()}' then 'new'
              else 'other' end
    into v_state
    from public.academy_capstones where app_slug = {q(course)} and tier = {q(tier)} and active;
  if v_state = 'other' then raise exception '{tag} refused: the prompt matches neither its current nor its corrected form'; end if;
  if (select fields from public.academy_capstones where app_slug = {q(course)} and tier = {q(tier)} and active)
     is distinct from {q(fields)}::jsonb then
    raise exception '{tag} refused: fields differ from the live fields this file was generated against';
  end if;

  if v_state = 'old' then
    update public.academy_capstones
       set prompt = {q(new)}
     where app_slug = {q(course)} and tier = {q(tier)} and active;
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception '{tag} refused: updated % rows', v_count; end if;
  end if;

  if (select md5(prompt) from public.academy_capstones where app_slug = {q(course)} and tier = {q(tier)} and active)
     <> '{hashlib.md5(new.encode()).hexdigest()}' then
    raise exception '{tag} refused: the prompt does not read back as the corrected text';
  end if;
  raise notice '{tag}: % of 1 prompt written', case when v_state = 'old' then 1 else 0 end;
end $$;
"""


def dataset_sql(course, tier, cap, spec):
    old = cap['dataset']
    new = old
    for a, b in spec['edits']:
        if new.count(a) != 1:
            sys.exit(f'REFUSED: {course}/{tier}: dataset anchor not found exactly once: {a!r}')
        new = new.replace(a, b)
    fields = json.dumps(cap['fields'], ensure_ascii=False)
    tag = f'roundoff capstone dataset {course}/{tier}'
    mo, mn = hashlib.md5(old.encode()).hexdigest(), hashlib.md5(new.encode()).hexdigest()
    mp = hashlib.md5(cap['prompt'].encode()).hexdigest()
    why = '\n'.join('-- ' + l for l in wrap(spec['why']))
    edits = '\n'.join(f'--   was: {a}\n--   now: {b}' for a, b in spec['edits'])
    w = f"app_slug = {q(course)} and tier = {q(tier)} and active"
    return f"""-- ============================================================================
-- B4/B5 ROUND-OFF, CAPSTONE DATASET COPY: {course} / {tier}.
--
{why}
--
-- THE EDIT (the `dataset` column only):
{edits}
--
-- WHAT DOES NOT MOVE. `fields` (every key, label, unit, expected value and
-- tolerance) and `prompt`: both must equal their live values exactly, before
-- and after. No stored attempt is re-scored and no answer grades differently.
--
-- GUARDS. `dataset` must hold its current text (md5 {mo}, updated) or the
-- corrected one (md5 {mn}, left alone). Anything else raises and the
-- transaction rolls back. Generated by docs/graded-field-audit/roundoff_capstones.py
-- from a scratch replay of main plus 20261021a/b and 20261022. SAFE TO RE-RUN.
-- ============================================================================

do $$
declare
  v_n       integer;
  v_state   text;
  v_count   integer;
begin
  select count(*) into v_n from public.academy_capstones where {w};
  if v_n <> 1 then raise exception '{tag} refused: % active capstone rows, expected 1', v_n; end if;

  select case when md5(dataset) = '{mo}' then 'old'
              when md5(dataset) = '{mn}' then 'new'
              else 'other' end
    into v_state
    from public.academy_capstones where {w};
  if v_state = 'other' then raise exception '{tag} refused: the dataset matches neither its current nor its corrected form'; end if;
  if (select fields from public.academy_capstones where {w}) is distinct from {q(fields)}::jsonb then
    raise exception '{tag} refused: fields differ from the live fields this file was generated against';
  end if;
  if (select md5(prompt) from public.academy_capstones where {w}) <> '{mp}' then
    raise exception '{tag} refused: the prompt differs from the live prompt this file was generated against';
  end if;

  if v_state = 'old' then
    update public.academy_capstones set dataset = {q(new)} where {w};
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception '{tag} refused: updated % rows', v_count; end if;
  end if;

  if (select md5(dataset) from public.academy_capstones where {w}) <> '{mn}'
     or (select fields from public.academy_capstones where {w}) is distinct from {q(fields)}::jsonb then
    raise exception '{tag} refused: the row does not read back as the corrected dataset with unchanged fields';
  end if;
  raise notice '{tag}: % of 1 dataset written', case when v_state = 'old' then 1 else 0 end;
end $$;
"""


def wrap(text, width=76):
    out, line = [], ''
    for w in text.split():
        if len(line) + len(w) + 1 > width:
            out.append(line); line = w
        else:
            line = (line + ' ' + w).strip()
    if line:
        out.append(line)
    return out


def fiscal_sql(caps):
    rows = []
    for tier, key, old, new, why in FISCAL:
        f = [x for x in caps[('fiscal', tier)]['fields'] if x['key'] == key]
        if len(f) != 1:
            sys.exit(f'REFUSED: fiscal/{tier}.{key} not found exactly once')
        f = f[0]
        if float(f['tol']) not in (old, new):
            sys.exit(f'REFUSED: fiscal/{tier}.{key} carries tol {f["tol"]}, neither {old} nor {new}')
        rows.append((tier, key, old, new, repr(float(f['expected'])), why))
    n = len(rows)
    lines = '\n'.join(f'--   fiscal / {t:<12} / {k:<36} {o:g} -> {nw:g}   ({w})' for t, k, o, nw, _, w in rows)
    vals = ',\n'.join(f"      ('fiscal', {q(t)}, {q(k)}, {o!r}::float8, {nw!r}::float8, {e}::float8)" for t, k, o, nw, e, _ in rows)
    tiers = sorted({t for t, *_ in rows})
    tl = ', '.join(f"('fiscal', {q(t)})" for t in tiers)
    return f"""-- ============================================================================
-- B4/B5 ROUND-OFF: eight fiscal capstone tolerances a correct Designer reading
-- could fail.
--
-- WHY. The fiscal capstones send the learner to the Fiscal Regime Designer
-- (Suite), whose summary table, price sweep and capex sweep print every figure
-- with toFixed(1). These eight fields were graded to 0.001 or 0.0001, so a
-- learner who reads the Designer correctly is marked wrong (B5 finding 2,
-- docs/graded-field-audit/annot/fiscal.json). Each new tolerance is what the
-- Designer's precision admits, the FC6 rule: half a unit of the printed
-- decimal, 0.05, for a single reading; 0.1 for a field that is the difference
-- of two readings, each off by up to 0.05.
--
{lines}
--
-- WHAT DOES NOT MOVE. No `expected`, key, label, unit, field count, prompt or
-- row. Only {n} `tol` numbers, and every one LOOSENS, so no answer that graded
-- correct before can grade wrong now.
--
-- REGRADE IMPACT. academy_capstone_attempts stores each attempt's score and is
-- never re-scored by this file. The file reports (NOTICE) the attempts on the
-- three fiscal tiers; it does not refuse on them, because a loosening cannot
-- take a pass away.
--
-- GUARDS. Each field is addressed by (app_slug, tier, key) and must carry
-- EITHER its published tolerance (updated) OR the new one (left alone), and its
-- published expected value. Anything else raises and the transaction rolls
-- back. Each update touches exactly 1 row and the tier keeps 6 fields.
-- Generated by docs/graded-field-audit/roundoff_capstones.py. SAFE TO RE-RUN.
-- ============================================================================

do $$
declare
  r           record;
  v_state     text;
  v_tol       float8;
  v_expected  float8;
  v_count     integer;
  v_n         integer;
  v_updated   integer := 0;
begin

  for r in
    select app_slug, tier, count(*) as n
      from public.academy_capstone_attempts
     where (app_slug, tier) in ({tl})
     group by 1, 2
  loop
    raise notice 'roundoff fiscal tolerances: % attempt(s) on %/% (scores are stored, not re-scored)', r.n, r.app_slug, r.tier;
  end loop;

  for r in
    select * from (values
{vals}
    ) as t(app_slug, tier, k, old_tol, new_tol, expected)
  loop

    select count(*) into v_n
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) as f
     where c.app_slug = r.app_slug and c.tier = r.tier and c.active
       and f->>'key' = r.k;
    if v_n <> 1 then
      raise exception 'roundoff fiscal tolerances refused: %/% has % field(s) keyed %, expected exactly 1', r.app_slug, r.tier, v_n, r.k;
    end if;

    select (f->>'tol')::float8, (f->>'expected')::float8
      into v_tol, v_expected
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) as f
     where c.app_slug = r.app_slug and c.tier = r.tier and c.active
       and f->>'key' = r.k;

    if v_expected is distinct from r.expected then
      raise exception 'roundoff fiscal tolerances refused: %/%.% expected is %, not the % this file was generated against',
        r.app_slug, r.tier, r.k, v_expected, r.expected;
    end if;

    v_state := case
                 when v_tol = r.old_tol then 'old'
                 when v_tol = r.new_tol then 'new'
                 else 'other' end;
    if v_state = 'other' then
      raise exception 'roundoff fiscal tolerances refused: %/%.% carries tolerance %, neither the published % nor the recut %',
        r.app_slug, r.tier, r.k, v_tol, r.old_tol, r.new_tol;
    end if;

    if v_state = 'old' then
      update public.academy_capstones c
         set fields = (select jsonb_agg(case when e.f->>'key' = r.k
                                             then jsonb_set(e.f, '{{tol}}', to_jsonb(r.new_tol))
                                             else e.f end order by e.n)
                         from jsonb_array_elements(c.fields) with ordinality as e(f, n))
       where c.app_slug = r.app_slug and c.tier = r.tier and c.active;
      get diagnostics v_count = row_count;
      if v_count <> 1 then
        raise exception 'roundoff fiscal tolerances refused: %/%.% updated % rows', r.app_slug, r.tier, r.k, v_count;
      end if;
      v_updated := v_updated + 1;
    end if;

    select (f->>'tol')::float8, (f->>'expected')::float8
      into v_tol, v_expected
      from public.academy_capstones c,
           lateral jsonb_array_elements(c.fields) as f
     where c.app_slug = r.app_slug and c.tier = r.tier and c.active
       and f->>'key' = r.k;
    if v_tol <> r.new_tol or v_expected is distinct from r.expected then
      raise exception 'roundoff fiscal tolerances refused: %/%.% reads back tol % expected %', r.app_slug, r.tier, r.k, v_tol, v_expected;
    end if;
    select jsonb_array_length(fields) into v_n
      from public.academy_capstones where app_slug = r.app_slug and tier = r.tier and active;
    if v_n <> 6 then
      raise exception 'roundoff fiscal tolerances refused: %/% now holds % fields, expected 6', r.app_slug, r.tier, v_n;
    end if;
  end loop;

  raise notice 'roundoff fiscal tolerances: % of {n} field(s) updated, % already applied', v_updated, {n} - v_updated;
end $$;
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--container', default='ro-scratch')
    ap.add_argument('--only', choices=['all', 'datasets'], default='all',
                    help='datasets: write only the dataset files (the others refuse once applied)')
    a = ap.parse_args()
    caps = live(a.container)
    if len(caps) < 100:
        sys.exit(f'REFUSED: the scratch holds {len(caps)} live capstones')
    for (course, tier), spec in DATASETS.items():
        p = os.path.join(REPO, 'migrations', f'20261023b_ro_capstone_{course}_dataset.sql')
        open(p, 'w').write(dataset_sql(course, tier, caps[(course, tier)], spec))
        print('wrote', p)
    if a.only == 'datasets':
        return
    for (course, tier), spec in PROMPTS.items():
        p = os.path.join(REPO, 'migrations', f'20261023b_ro_capstone_{course}.sql')
        open(p, 'w').write(prompt_sql(course, tier, caps[(course, tier)], spec))
        print('wrote', p)
    p = os.path.join(REPO, 'migrations', FISCAL_MIG)
    open(p, 'w').write(fiscal_sql(caps))
    print('wrote', p)


if __name__ == '__main__':
    main()
