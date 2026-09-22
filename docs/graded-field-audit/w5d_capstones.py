#!/usr/bin/env python3
"""B5 FOLLOW-ON, WAVE 5, BUILDER D (section 3 pick B, strip). Writes the guarded
capstone migrations that take the W1 open-book label (D4 C) off a tier once its
answers are no longer printed before the learner works.

  python3 w5d_capstones.py [--container w5d-scratch] [--course welldesign] [--check]

Reads the live capstones from a LOCAL scratch replay in the production state of
2026-09-22 (mirror + B4 + B5 + round-off + W1; never production) and writes

  migrations/20261028d_w5_<course>.sql
      For each tier in STRIP: the brief loses its W1 open-book first sentence,
      and becomes exactly the text it had before W1. Pick B keeps every key,
      expected value and tolerance, so `fields` must equal its live value
      before and after, and there is no attempts guard (no answer can grade
      differently). What made the tier clean ships in the NextGen zip: the
      lesson note removed, the lessons and panels stripped, each course's
      capstoneLeak.test.jsx proving it.

Every row is content-addressed: its prompt must hold the W1-labelled md5 and its
fields the exact jsonb (it is rewritten), or the unlabelled md5 with the same
fields (left alone); anything else raises and the file's transaction rolls
back. Every file first checks that W1 is applied (the SENTINEL below), because a
tier that W1 never labelled already reads as unlabelled. Copy rule: no em or en
dash, no new "X, not Y" contrastive. `--check` regenerates in memory and fails
if a committed migration differs.
"""
import argparse, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import w1_capstones as w1  # noqa: E402  (dumps, q, md5, live, wrap, check_copy, the W1 label text)

MIG = w1.MIG
TIERS = ('beginner', 'intermediate', 'advanced')

# Section 3 pick B tiers this builder strips, by course, with what made each
# clean (it goes into the file header). A tier is listed only once its lessons,
# page and panels print none of its graded answers (capstoneLeak.test.jsx).
STRIP = {
    'welldesign': {
        'beginner': 'the survey listing opened on the feet golden well (TVD and vertical section graded); it now '
                    'opens on the 131-station teaching well',
        'advanced': 'the clearance ladder opened on offset 10 (its minimum separation factor graded) and the page '
                    'intro printed that factor to three decimals; the ladder now opens on offset 05 and the intro '
                    'prints two decimals',
    },
}

# W1 must be applied: the gasprocessing beginner re-key (tegReboilerMMBtuHr) is
# W1's, and no later wave touches that tier.
SENTINEL = """
  -- W1 (20261024*) must be applied: before it, an unlabelled brief is not evidence of anything
  if not exists (select 1 from public.academy_capstones c, lateral jsonb_array_elements(c.fields) f
                  where c.app_slug = 'gasprocessing' and c.tier = 'beginner' and c.active
                    and f->>'key' = 'tegReboilerMMBtuHr') then
    raise exception '{tag} refused: W1 (20261024*) is not applied on this database; apply it first (/root/w1-apply/apply.sh apply --prod)';
  end if;"""


# The pre-W1 briefs (the B5 baseline dump): a stripped brief must equal its own.
BASELINE = {(c['app'], c['tier']): c['prompt'] for c in json.load(open(os.path.join(HERE, 'caps.json')))}


def label_of(course, tier):
    """The exact W1 label (first sentence plus its B ending) on a pick-B tier."""
    if (course, tier) not in w1.PICK_B:
        sys.exit(f'REFUSED: {course}/{tier} is not a section 3 pick B tier')
    return w1.LABEL_SOME + w1.END_B


def plan(caps, course):
    rows = []
    for tier in sorted(STRIP[course], key=TIERS.index):
        cap = caps.get((course, tier))
        if cap is None:
            sys.exit(f'REFUSED: {course}/{tier} has no live capstone on the scratch')
        lab = label_of(course, tier) + ' '
        old = cap['prompt']
        if not old.startswith(lab):
            sys.exit(f'REFUSED: {course}/{tier} brief does not open with its W1 label (is W1 applied on the scratch?)')
        new = old[len(lab):]
        if 'Open book' in new:
            sys.exit(f'REFUSED: {course}/{tier}: a second open-book sentence remains')
        base = BASELINE.get((course, tier))
        if base != new:
            sys.exit(f'REFUSED: {course}/{tier}: the stripped brief is not the pre-W1 brief of caps.json')
        w1.check_copy(f'{course}/{tier} prompt', old, new)
        rows.append({'tier': tier, 'old': old, 'new': new, 'fields': w1.dumps(cap['fields']), 'why': STRIP[course][tier]})
    return rows


def file_sql(course, rows):
    tag = f'w5d {course}'
    n = len(rows)
    lines = []
    for r in rows:
        lines.append(f"-- {r['tier']}:")
        lines.append(w1.wrap(r['why'], lead='--   '))
    header = f"""-- ============================================================================
-- B5 FOLLOW-ON W5 (section 3 pick B, strip): {course}. The W1 open-book label
-- comes off the brief of each tier below.
--
-- WHY. W1 (D4 C) labelled these briefs open book because a lesson, a panel's
-- opening view or the page printed some graded answers. Those prints are gone
-- (NextGen zip; src/components/course/panels/{course}/capstoneLeak.test.jsx
-- proves each tier prints none and runs a negative control), so the label is
-- no longer true.
--
{chr(10).join(lines)}
--
-- WHAT MOVES. The brief's first sentence (the label). The brief becomes exactly
-- its text before W1.
--
-- WHAT DOES NOT MOVE. `fields` (every key, label, unit, expected and
-- tolerance), title, dataset, status and the row. The guard requires `fields`
-- to equal its live value exactly, before and after, so no answer grades
-- differently and there is no attempts guard (pick B keeps the keys).
--
-- GUARDS. Each brief must hold its W1-labelled text (md5, rewritten) or its
-- unlabelled text (left alone), with the fields this file was generated
-- against. Anything else raises and the file rolls back. The file refuses
-- unless W1 is applied. Generated by docs/graded-field-audit/w5d_capstones.py.
-- SAFE TO RE-RUN.
--
-- AFTER THIS FILE, 20261024b_w1_openbook_{course}.sql reads these tiers as its
-- "published" form again and would put the label back: it is SUPERSEDED and
-- must not be re-applied (/root/w5d-apply/apply.sh reports it so).
-- ============================================================================
"""
    decl = ['  v_n        integer;', '  v_count    integer;', '  v_written  integer := 0;']
    decl += [f'  v_s{i}       text;' for i in range(n)]
    body = [SENTINEL.format(tag=tag)]
    for i, r in enumerate(rows):
        w = f"app_slug = {w1.q(course)} and tier = {w1.q(r['tier'])} and active"
        body.append(f"""
  -- {course} / {r['tier']}
  select count(*) into v_n from public.academy_capstones where {w};
  if v_n <> 1 then raise exception '{tag} refused: {course}/{r['tier']} has % active capstone rows, expected 1', v_n; end if;
  select case when md5(prompt) = '{w1.md5(r['old'])}' and fields = {w1.q(r['fields'])}::jsonb then 'old'
              when md5(prompt) = '{w1.md5(r['new'])}' and fields = {w1.q(r['fields'])}::jsonb then 'new'
              else 'other' end
    into v_s{i} from public.academy_capstones where {w};
  if v_s{i} = 'other' then
    raise exception '{tag} refused: {course}/{r['tier']} matches neither its W1-labelled form (prompt md5 {w1.md5(r['old'])}) nor its stripped form (prompt md5 {w1.md5(r['new'])}), with the fields this file was generated against';
  end if;""")
    body.append('\n  -- nothing to write: every row is already stripped')
    body.append('  if ' + ' and '.join(f"v_s{i} = 'new'" for i in range(n)) + ' then')
    body.append(f"    raise notice '{tag}: 0 of {n} row(s) written, all already applied';")
    body.append('    return;')
    body.append('  end if;')
    for i, r in enumerate(rows):
        w = f"app_slug = {w1.q(course)} and tier = {w1.q(r['tier'])} and active"
        body.append(f"""
  if v_s{i} = 'old' then
    update public.academy_capstones
       set prompt = {w1.q(r['new'])}
     where {w} and md5(prompt) = '{w1.md5(r['old'])}';
    get diagnostics v_count = row_count;
    if v_count <> 1 then raise exception '{tag} refused: {course}/{r['tier']} updated % rows', v_count; end if;
    v_written := v_written + 1;
  end if;
  if (select (md5(prompt) = '{w1.md5(r['new'])}' and fields = {w1.q(r['fields'])}::jsonb) from public.academy_capstones where {w}) is not true then
    raise exception '{tag} refused: {course}/{r['tier']} does not read back as its stripped form';
  end if;""")
    body.append(f"\n  raise notice '{tag}: % of {n} row(s) written, % already applied', v_written, {n} - v_written;")
    return header + '\ndo $$\ndeclare\n' + '\n'.join(decl) + '\nbegin' + '\n'.join(body) + '\nend $$;\n'


def build(caps, courses):
    return {f'20261028d_w5_{c}.sql': file_sql(c, plan(caps, c)) for c in courses}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--container', default='w5d-scratch')
    ap.add_argument('--course', action='append', help='only this course (repeatable); default every course in STRIP')
    ap.add_argument('--check', action='store_true', help='fail if a committed migration differs from a regeneration')
    a = ap.parse_args()
    courses = a.course or sorted(STRIP)
    unknown = [c for c in courses if c not in STRIP]
    if unknown:
        sys.exit(f'REFUSED: not in STRIP: {unknown}')
    caps = w1.live(a.container)
    if len(caps) < 100:
        sys.exit(f'REFUSED: the scratch holds {len(caps)} live capstones')
    out = build(caps, courses)
    bad = 0
    for name, sql in sorted(out.items()):
        p = os.path.join(MIG, name)
        if a.check:
            if not os.path.exists(p) or open(p).read() != sql:
                print('DIFFERS', name)
                bad += 1
            else:
                print('same', name)
        else:
            open(p, 'w').write(sql)
            print('wrote', name)
    print(f'{len(out)} file(s); {sum(len(STRIP[c]) for c in courses)} tier(s) stripped')
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
