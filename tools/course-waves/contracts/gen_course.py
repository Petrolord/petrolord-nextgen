#!/usr/bin/env python3
"""THE SC5 COURSE GENERATOR: the catalogue row of the first practice course.

A practice course has NO CAPSTONE (lead decision 2): its certificates are
issued from the tier final exams by academy_claim_practice_certificate, so
this generator writes no academy_capstones row and refuses if one is asked
for. What it writes, at the ship phase, is the course migration
migrations/20261116_sc5_contracts_course.sql: the academy_apps row with
course_type 'practice' and the two dates the platform migration requires,
read from wave.json, and an assert block that refuses when the row is not a
practice row with those dates or when any capstone row exists for it.

At the FOUNDATION it runs its self checks and writes nothing:
  * wave.json is a practice wave with a review date after its check date;
  * the platform migration (course_type, review_date, sources_checked_on and
    the claim function) is committed in the repository;
  * path_order 79 is taken by no other academy_apps insert in migrations/,
    and no migration inserts 'contracts' yet;
  * the title carries no dash and no contrastive.

    python3 gen_course.py            self checks only
    python3 gen_course.py --sql      self checks, then print the course migration
    python3 gen_course.py --write    ship phase only (SC5_STAGE=final): write it
                                     (to SC5_COURSE_OUT when set, as gen_seeds.sh does)
"""
import os
import re
import sys
import packlib as K

W = K.WAVE
MIG = os.path.join(K.REPO, 'migrations', f"{W['migration_prefix']}course.sql")
PLATFORM = os.path.join(K.REPO, W['platform_migration'])


def refused(msg):
    print(f'  gen_course REFUSES: {msg}')
    return True


def checks():
    bad = False
    if W.get('course_type') != 'practice' or W.get('kit') != 'practice':
        bad |= refused('wave.json is not a practice wave')
    if not (W['review_date'] > W['sources_checked_on']):
        bad |= refused('the review date is not after the date the sources were checked')
    if not os.path.exists(PLATFORM):
        bad |= refused(f'the platform migration {W["platform_migration"]} is not in the repository')
    else:
        p = open(PLATFORM, encoding='utf-8').read()
        for need in ('add column if not exists course_type', 'add column if not exists review_date',
                     'add column if not exists sources_checked_on', 'function public.academy_claim_practice_certificate'):
            if need not in p:
                bad |= refused(f'the platform migration does not carry "{need}"')
    used, contracts = [], []
    ins = re.compile(r'insert into public\.academy_apps\s*\(([^)]*)\)\s*values([\s\S]*?);', re.I)
    for f in sorted(os.listdir(os.path.join(K.REPO, 'migrations'))):
        if not f.endswith('.sql') or f == os.path.basename(MIG):
            continue
        sql = open(os.path.join(K.REPO, 'migrations', f), encoding='utf-8').read()
        for m in ins.finditer(sql):
            cols = [c.strip() for c in m.group(1).split(',')]
            if 'path_order' not in cols:
                continue
            k = cols.index('path_order')
            for row in re.findall(r"\(([^()]*(?:\([^()]*\)[^()]*)*)\)", m.group(2)):
                vals = [v.strip() for v in re.split(r",(?=(?:[^']*'[^']*')*[^']*$)", row)]
                if len(vals) == len(cols):
                    if vals[k] == str(W['path_order']):
                        used.append((f, vals[0]))
                    if vals[0].strip("'") == W['slug']:
                        contracts.append(f)
    if used:
        bad |= refused(f"path_order {W['path_order']} is already taken: {used}")
    if contracts:
        bad |= refused(f"'{W['slug']}' is already inserted by {contracts}")
    if re.search('[–—]', W['title']) or re.search(K.S.CONTRASTIVE, W['title'], re.I):
        bad |= refused('the title breaks the copy rule')
    print(f"  wave: {W['slug']} '{W['title']}', {W['module']}, path_order {W['path_order']}, {W['course_type']} course; "
          f"sources checked {W['sources_checked_on']}, review due {W['review_date']}")
    print(f'  path_order {W["path_order"]} free: {not used}; slug not yet inserted: {not contracts}; platform migration present: {os.path.exists(PLATFORM)}')
    print('  capstones: none (a practice course certifies from its tier final exams)')
    return not bad


def sql():
    t = W['title'].replace("'", "''")
    return f"""-- ============================================================================
-- SC5: {W['title']} joins the catalogue, the FIFTH course of the Supply Chain
-- & Logistics module and the academy's FIRST PRACTICE COURSE: no engine, no
-- calculator panel and no numeric capstone. It teaches from a dated, cited
-- source pack (tools/course-waves/contracts/PACK.md and SOURCES.md), its banks
-- are scenario questions audited against that pack, and each tier's
-- certificate is issued from its final exam (the Expert exam is the written
-- case bank) by academy_claim_practice_certificate.
--
-- Catalogue row (module '{W['module']}'; path_order {W['path_order']}; prereq_slug NULL;
-- course_type 'practice'; sources checked {W['sources_checked_on']}; review due
-- {W['review_date']}), generated by tools/course-waves/contracts/gen_course.py from
-- wave.json. NO academy_capstones row, by design. REQUIRES the platform
-- migration {os.path.basename(W['platform_migration'])} first. Deep seeds are three
-- separate migrations; the go-live is a fifth and is HELD until a NextGen
-- production upload carries the route /dashboard/apps/{W['slug']}.
-- No transaction lines of its own. Idempotent.
-- ============================================================================

insert into public.academy_apps
    (slug, name, module, path_order, status, prereq_slug, course_type, review_date, sources_checked_on)
values ('{W['slug']}', '{t}', '{W['module']}', {W['path_order']}, 'coming_soon', null,
        'practice', date '{W['review_date']}', date '{W['sources_checked_on']}')
on conflict (slug) do nothing;

do $$
begin
  if not exists (select 1 from public.academy_apps
                  where slug = '{W['slug']}' and course_type = 'practice'
                    and review_date = date '{W['review_date']}'
                    and sources_checked_on = date '{W['sources_checked_on']}') then
    raise exception '{W['slug']}: the catalogue row is not the practice row this migration writes';
  end if;
  if exists (select 1 from public.academy_capstones where app_slug = '{W['slug']}') then
    raise exception '{W['slug']}: a practice course carries no capstone row';
  end if;
end $$;
"""


def main():
    ok = checks()
    if not ok:
        return 1
    if '--sql' in sys.argv:
        print(sql())
    if '--write' in sys.argv:
        if K.STAGE != 'final':
            print('  gen_course REFUSES: --write is the ship phase (SC5_STAGE=final), and this is the foundation')
            return 1
        out = os.environ.get('SC5_COURSE_OUT', MIG)
        open(out, 'w', encoding='utf-8').write(sql())
        print(f'  wrote {out}')
    print('  gen_course: self checks passed')
    return 0


sys.exit(main())
