#!/usr/bin/env python3
"""GATE: no graded capstone value collides with another tier's graded value,
with the value the digest teaches for the same quantity, or with a published
golden case.

Three checks, all printed with what they examined:

  1. CROSS-TIER, by the kit's own collisions.py: no field's tolerance is
     satisfied by a LOWER tier's graded value. Every value here is a whole
     number at a tolerance of 0.5, so this is "no two tiers share a value".
  2. THE SAME QUANTITY IN THE DIGEST. For each graded field the digest prints
     the same quantity on a teaching record (the blank-axis risk's residual,
     the live register's Critical count, the teaching register's expired
     count, and so on). The capstone value must differ from every one of them,
     so a learner who copies the worked teaching answer is marked wrong. The
     teaching values are READ OUT OF digest.txt by the row that prints them,
     never retyped, and a row the gate cannot find is a refusal.
  3. THE GOLDENS. No capstone record with three or more conditions is
     contained in any record the published goldens pass as an argument.

A SMALL INTEGER THAT APPEARS SOMEWHERE ELSE IN THE DIGEST IS NOT A COLLISION.
The grid alone prints every score from 1 to 25, so "the digest never prints 7"
is unsatisfiable for any count or score. What a learner can copy is the answer
to the SAME question on a teaching record, and that is what check 2 tests.

--selftest plants a teaching value into fields.json and proves check 2 fires.
"""
import io, json, os, re, subprocess, sys

WAVE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, '/root/dc-wavekit')
from collisions import check as kit_collisions  # noqa: E402

GOLDENS = '/root/wt-as-riskchange-nextgen/packages/engines/test-data/assurance/goldens'


def cells(digest, row_prefix):
    for line in digest.split('\n'):
        if line.startswith(row_prefix):
            return [c.strip() for c in line.strip().strip('|').split('|')]
    raise SystemExit(f'  GATE REFUSES: no digest row starts with {row_prefix!r}')


def table_col(digest, header_prefix, col):
    lines = digest.split('\n')
    at = next((i for i, l in enumerate(lines) if l.startswith(header_prefix)), None)
    if at is None:
        raise SystemExit(f'  GATE REFUSES: no digest table headed {header_prefix!r}')
    heads = [c.strip() for c in lines[at].strip().strip('|').split('|')]
    k = heads.index(col)
    out = []
    for l in lines[at + 2:]:
        if not l.startswith('|'):
            break
        out.append([c.strip() for c in l.strip().strip('|').split('|')][k])
    return out


def count_row(digest, key):
    return int(cells(digest, f'| {key} |')[1])


def teaching_values(digest):
    band_cols = ['population', '"Critical"', '"High"', '"Medium"', '"Low"', '"None"']
    live_res = cells(digest, '| live risks, residual |')
    live_inh = cells(digest, '| live risks, inherent |')
    ob02 = cells(digest, '| OB-02 | "Open" | 4 | 4 |')
    esanmi = digest.split('# SECTION 12')[1].split('# SECTION 13')[0]
    ikang = digest.split('# SECTION 14')[1].split('# SECTION 15')[0]
    onne = digest.split('# SECTION 17')[1].split('# SECTION 18')[0]
    reuse_hdr = '| lesson | total | applied |'
    m = re.search(r'openComments (\d+), blockingComments (\d+)', ikang)
    blocking_all = re.search(r'The blocking comments are [^:]+: (\d+) in all', ikang)
    days = [int(x) for x in table_col(digest, '| risk | status | next review | days until |', 'days until') if x != 'null']
    days += [int(x) for x in table_col(digest, '| date given | as | parsed | days until |', 'days until') if x != 'null']
    ages = [int(x) for x in table_col(onne, '| lesson | status | event date | age in days |', 'age in days') if x != 'null']
    dues = [x for x in table_col(esanmi, '| change | type | stage |', 'due') if x != 'null']
    dues += table_col(digest, '| implemented on | days since | ratification due |', 'ratification due')
    lasts = [x for x in table_col(digest, reuse_hdr, 'last applied on') if x != 'null']
    ymd = lambda s: int(s.replace('-', ''))  # noqa: E731
    return {
        'igbara_i03_inherent_score': [int(ob02[4])],
        'igbara_i03_residual_score': [int(ob02[8])],
        'igbara_live_residual_critical': [int(live_res[band_cols.index('"Critical"')])],
        'igbara_live_inherent_high': [int(live_inh[band_cols.index('"High"')])],
        'igbara_i06_days_to_review': days,
        'igbara_i12_days_to_review': days,
        'okomu_ok01_ratify_due_yyyymmdd': [ymd(d) for d in dues],
        'okomu_register_expiring_soon': [count_row(esanmi, 'expiringSoon')],
        'okomu_register_expired': [count_row(esanmi, 'expired')],
        'okomu_register_open_actions': [count_row(esanmi, 'openActions')],
        'okomu_register_overdue_actions': [count_row(esanmi, 'overdueActions')],
        'okomu_register_ratification_overdue': [count_row(esanmi, 'ratificationOverdue')],
        'etim_review_blocking': [int(m.group(2)), int(blocking_all.group(1))],
        'etim_review_open_comments': [int(m.group(1))],
        'etim_lesson_applied': [int(x) for x in table_col(digest, reuse_hdr, 'applied')],
        'etim_lesson_last_applied_yyyymmdd': [ymd(d) for d in lasts],
        'etim_lesson_age_days': ages,
        'etim_register_reviews_due_soon': [count_row(onne, 'reviewsDueSoon')],
    }


def golden_records():
    out = []

    def walk(v):
        if isinstance(v, dict):
            if '$date' not in v and '$map' not in v:
                out.append(v)
            for x in v.values():
                walk(x)
        elif isinstance(v, list):
            for x in v:
                walk(x)
    for f in sorted(os.listdir(GOLDENS)):
        for c in json.load(open(os.path.join(GOLDENS, f)))['cases']:
            walk(c.get('args', []))
            walk(c.get('rows', []))
    return out


def cap_records():
    js = ("const M = await import('%s'); const all = [...M.IGBARA_RISKS, ...M.OKOMU_MOCS, M.ETIM_REVIEW, "
          "...M.ETIM_COMMENTS, ...M.ETIM_APPLICATIONS, ...M.ETIM_LESSONS]; console.log(JSON.stringify(all));"
          % os.path.join(WAVE, 'riskchange_fields_capstone.mjs'))
    r = subprocess.run(['node', '--input-type=module', '-e', js], capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit('  GATE REFUSES: could not read the capstone records')
    return json.loads(r.stdout)


SKIP = {'id', 'title', 'moc_number', 'lesson_code', 'review_code', 'review_id', 'lesson_id', 'moc_id'}


def cond(r):
    return {(k, json.dumps(v)) for k, v in r.items() if k not in SKIP and v not in (None, '')}


def run(fields, digest, verbose=True):
    fatal = kit_collisions(fields, verbose=False)
    teach = teaching_values(digest)
    same = []
    for tier, key, value, tol in fields:
        if key not in teach:
            raise SystemExit(f'  GATE REFUSES: {key} has no teaching quantity mapped')
        for t in teach[key]:
            if abs(t - value) <= tol:
                same.append((key, value, t))
    gold = golden_records()
    gold_hits = []
    caps = [r for r in cap_records() if len(cond(r)) >= 3]
    gold_conds = [cond(g) for g in gold]
    for r in caps:
        if any(cond(r) <= g for g in gold_conds):
            gold_hits.append(r['id'])
    if verbose:
        print(f'collision 1, cross-tier (kit collisions.py): {len(fields)} fields, {len(fatal)} fatal')
        for f in fatal:
            print(f'  FATAL {f[0]}:{f[1]} is satisfied by {f[3]}:{f[4]} = {f[5]}')
        n = sum(len(v) for v in teach.values())
        print(f'collision 2, the same quantity in the digest: {n} teaching values read out of digest.txt for 18 fields, {len(same)} equal')
        for key, v, t in same:
            print(f'  SAME {key} = {v} is the digest value for the same quantity on a teaching record')
        print(f'collision 3, the goldens: {len(caps)} capstone records against {len(gold)} golden argument records, {len(gold_hits)} contained')
        for h in gold_hits:
            print(f'  GOLDEN capstone record {h} is contained in a golden case')
    return fatal, same, gold_hits


def main():
    fields = json.load(open(os.path.join(WAVE, 'fields.json')))
    digest = io.open(os.path.join(WAVE, 'digest.txt'), encoding='utf-8').read()
    if len(fields) != 18:
        print('  GATE REFUSES: fields.json does not carry 18 fields')
        return 2
    fatal, same, gold = run(fields, digest)
    return 1 if (fatal or same or gold) else 0


def selftest():
    fields = json.load(open(os.path.join(WAVE, 'fields.json')))
    digest = io.open(os.path.join(WAVE, 'digest.txt'), encoding='utf-8').read()
    teach = teaching_values(digest)
    planted = [list(f) for f in fields]
    for f in planted:
        if f[1] == 'okomu_register_expired':
            f[2] = teach['okomu_register_expired'][0]
    _, same, _ = run(planted, digest, verbose=False)
    assert same, 'a capstone value planted equal to the teaching value was not caught'
    planted2 = [list(f) for f in fields]
    planted2[-1][2] = planted2[0][2]
    fatal, _, _ = run(planted2, digest, verbose=False)
    assert fatal, 'an Expert value planted equal to an Associate value was not caught'
    print('selftest: a planted teaching value and a planted cross-tier value both fire')
    return 0


if __name__ == '__main__':
    sys.exit(selftest() if '--selftest' in sys.argv else main())
