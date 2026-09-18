#!/usr/bin/env python3
"""GATE: nothing the capstone grades, and no record it is set on, reaches the
digest or the digest generator.

Two directions, both checked, both printed with how much they examined:

  1. CONDITIONS. Every capstone record id, title and person id must be absent
     from digest.txt, riskchange_dump.mjs and riskchange_fields.mjs. And every
     capstone record's CONDITION SET (its input fields other than id, title and
     people) must not be contained in any teaching record, so a teaching row
     can never be a capstone row under another name.
  2. GRADED VALUES. Each graded date must be absent from the digest and the
     dump in both spellings (YYYYMMDD and YYYY-MM-DD). Each DISTINCTIVE graded
     integer (negative, or 25 and above, which no score on the grid can be) must
     be absent from the digest as a standalone figure. A small positive integer
     is a count or a score every register prints somewhere, and is checked in
     gate_collision.py against the digest's value for the same quantity.

It REFUSES rather than passing if it examined nothing, and --selftest plants a
capstone title and a graded date in a copy of the digest and proves both fire.
"""
import io, json, os, re, subprocess, sys

WAVE = os.path.dirname(os.path.abspath(__file__))
PEOPLE = re.compile(r"^u-[a-z]+$")
ID_KEYS = {'id', 'title', 'moc_number', 'lesson_code', 'review_code', 'review_id', 'lesson_id', 'moc_id',
           'target_risk_id', 'target_moc_id', 'reference', 'notes', 'response_text', 'description',
           'root_cause', 'recommendation'}


def load(module, names):
    js = ("const M = await import('%s'); console.log(JSON.stringify(Object.fromEntries(%s.map((n) => [n, M[n]]))));"
          % (module, json.dumps(names)))
    r = subprocess.run(['node', '--input-type=module', '-e', js], capture_output=True, text=True)
    if r.returncode != 0:
        print('  GATE REFUSES: could not read', module, r.stderr[-400:])
        sys.exit(2)
    return json.loads(r.stdout)


CAP = load(os.path.join(WAVE, 'riskchange_fields_capstone.mjs'),
           ['IGBARA_RISKS', 'OKOMU_MOCS', 'OKOMU_APPROVALS', 'OKOMU_ACTIONS', 'ETIM_REVIEW', 'ETIM_COMMENTS',
            'ETIM_LESSON', 'ETIM_APPLICATIONS', 'ETIM_LESSONS'])
TEACH = load(os.path.join(WAVE, 'riskchange_fields.mjs'),
             ['OBODO_RISKS', 'ESANMI_MOCS', 'ESANMI_APPROVALS', 'ESANMI_ACTIONS', 'IKANG_REVIEWS',
              'IKANG_COMMENTS', 'ONNE_LESSONS', 'ONNE_APPLICATIONS'])


def rows(bundle):
    out = []
    for v in bundle.values():
        out.extend(v if isinstance(v, list) else [v])
    return out


def condition_set(r):
    return {(k, json.dumps(v)) for k, v in r.items()
            if k not in ID_KEYS and not (isinstance(v, str) and PEOPLE.match(v)) and v not in (None, '')}


def check(digest, sources):
    fails, examined = [], {'tokens': 0, 'condition_sets': 0, 'teaching_rows': 0, 'dates': 0, 'integers': 0}
    cap_rows, teach_rows = rows(CAP), rows(TEACH)
    tokens = set()
    for r in cap_rows:
        for k in ('id', 'title', 'moc_number', 'lesson_code', 'review_code'):
            if isinstance(r.get(k), str):
                tokens.add(r[k])
        for v in r.values():
            if isinstance(v, str) and PEOPLE.match(v):
                tokens.add(v)
    teach_people = {v for r in teach_rows for v in r.values() if isinstance(v, str) and PEOPLE.match(v)}
    for t in sorted(tokens):
        examined['tokens'] += 1
        if t in teach_people:
            fails.append(f'capstone person {t} is also a teaching person')
        for name, text in [('digest.txt', digest)] + sources:
            if re.search(r'(?<![\w-])' + re.escape(t) + r'(?![\w-])', text):
                fails.append(f'capstone token "{t}" appears in {name}')
    for r in cap_rows:
        cs = condition_set(r)
        # A child row (an approval, an action) carries two or three conditions
        # that every register shares (a level and a status); it is identified
        # by its parent, whose own condition set is checked. Three or more
        # conditions make a record.
        if len(cs) < 3:
            continue
        examined['condition_sets'] += 1
        for tr in teach_rows:
            examined['teaching_rows'] += 1
            if cs <= condition_set(tr):
                fails.append(f'capstone record {r.get("id")} has the same conditions as teaching record {tr.get("id")}')
    fields = json.load(open(os.path.join(WAVE, 'fields.json')))
    for tier, key, value, tol in fields:
        if key.endswith('_yyyymmdd'):
            s = str(value)
            for form in (s, f'{s[:4]}-{s[4:6]}-{s[6:]}'):
                examined['dates'] += 1
                for name, text in [('digest.txt', digest)] + sources:
                    if form in text:
                        fails.append(f'graded date {key} appears as "{form}" in {name}')
        elif value < 0 or value >= 25:
            examined['integers'] += 1
            if re.search(r'(?<![\w.-])' + re.escape(str(value)) + r'(?![\w.])', digest):
                fails.append(f'distinctive graded integer {key} = {value} is printed in digest.txt')
    return fails, examined


def main(digest_path):
    digest = io.open(digest_path, encoding='utf-8').read()
    sources = [(n, io.open(os.path.join(WAVE, n), encoding='utf-8').read())
               for n in ('riskchange_dump.mjs', 'riskchange_fields.mjs')]
    fails, ex = check(digest, sources)
    print(f'capstone leak: {ex["tokens"]} capstone ids, titles and people; {ex["condition_sets"]} condition sets '
          f'against {ex["teaching_rows"] // max(ex["condition_sets"], 1)} teaching rows each; {ex["dates"]} graded date '
          f'spellings; {ex["integers"]} distinctive graded integers')
    if min(ex['tokens'], ex['condition_sets'], ex['dates'], ex['integers']) == 0:
        print('  GATE REFUSES: one direction examined nothing')
        return 2
    for f in fails:
        print('  LEAK', f)
    print(f'  {len(fails)} leak(s)')
    return 1 if fails else 0


def selftest():
    digest = io.open(os.path.join(WAVE, 'digest.txt'), encoding='utf-8').read()
    planted = digest + '\n- ' + CAP['OKOMU_MOCS'][0]['title'] + ' 2026-08-19\n'
    fails, _ = check(planted, [])
    assert any('appears in digest.txt' in f and 'anti-surge' in f for f in fails), 'a planted capstone title was not caught'
    assert any('graded date' in f for f in fails), 'a planted graded date was not caught'
    print('selftest: a planted capstone title and a planted graded date both fire')
    return 0


if __name__ == '__main__':
    if '--selftest' in sys.argv:
        sys.exit(selftest())
    sys.exit(main(os.path.join(WAVE, 'digest.txt')))
