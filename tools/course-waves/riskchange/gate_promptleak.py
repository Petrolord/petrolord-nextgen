#!/usr/bin/env python3
"""GATE: a capstone prompt may not hand a learner a graded answer.

A prompt is the one text a learner reads WHILE being graded. This wave's
prompts are PROSE plus TABLES of records (PROMPTS and PROMPT_TABLES in
riskchange_fields_capstone.mjs). Three checks:

  1. PROSE. No number in any prompt's prose may equal ANY tier's graded value
     within its tolerance. The one date a prompt must state, the as-of date,
     is allowed by name and only in its YYYY-MM-DD form.
  2. COLUMNS. Every table a prompt carries lists only INPUT columns, from an
     allow-list, and every record in it carries no other key. An output column
     (a score, a band, an appetite, a ratification due date, a blocking flag, a
     count) would be an answer printed beside its question.
  3. DATES. No graded date appears anywhere in any prompt or any of its tables,
     in either spelling.

It prints what it swept and REFUSES on an empty sweep. --selftest plants a
graded value in a prompt, an output column in a table and a graded date in a
record, and proves all three fire.
"""
import json, os, re, subprocess, sys

WAVE = os.path.dirname(os.path.abspath(__file__))
OUTPUT_KEYS = {'inherentScore', 'residualScore', 'rating', 'appetite_status', 'inherentBand', 'residualBand',
               'score', 'band', 'dueDate', 'state', 'blocking', 'applied', 'lastAppliedOn', 'reviewsDueSoon',
               'expiryState', 'overdue', 'age'}


def load():
    js = ("const M = await import('%s'); const t = {}; for (const [tier, tabs] of Object.entries(M.PROMPT_TABLES)) "
          "{ t[tier] = tabs.map(([name, cols]) => [name, cols, [].concat(M[name])]); } "
          "console.log(JSON.stringify({ prompts: M.PROMPTS, tables: t, asOf: M.AS_OF_ISO }));"
          % os.path.join(WAVE, 'riskchange_fields_capstone.mjs'))
    r = subprocess.run(['node', '--input-type=module', '-e', js], capture_output=True, text=True)
    if r.returncode != 0:
        raise SystemExit('  GATE REFUSES: could not read the prompts: ' + r.stderr[-300:])
    return json.loads(r.stdout)


NUM = re.compile(r'(?<![\w.])-?\d+(?:\.\d+)?(?![\w])')
RECORD_ID = re.compile(r'\b[A-Z]{2}-[A-Z]?\d+\b')

# A SELECTION FIELD is graded by WHICH of the dates in the records is the
# answer, so its value is one of the record dates by construction. It is
# declared here with the one column it may appear in, and it may appear
# nowhere else (not in prose, not in another column, not in another table).
SELECTION = {
    'etim_lesson_last_applied_yyyymmdd': ('ETIM_APPLICATIONS', 'applied_on',
        'the answer is which applied_on date is the latest one that applied something; '
        'discriminate.mjs grades the rejected, the adopted-only and the earliest readings wrong'),
}


def check(data, fields):
    fails, ex = [], {'prompts': 0, 'words': 0, 'numbers': 0, 'tables': 0, 'records': 0, 'dates': 0}
    graded = [(t, k, v, tol) for t, k, v, tol in fields]
    dates = []
    allowed_at = {}
    for t, k, v, tol in graded:
        if k.endswith('_yyyymmdd'):
            s = str(v)
            forms = [s, f'{s[:4]}-{s[4:6]}-{s[6:]}']
            dates += forms
            if k in SELECTION:
                for f in forms:
                    allowed_at[f] = SELECTION[k][:2]
    for tier, prompt in data['prompts'].items():
        ex['prompts'] += 1
        prose = RECORD_ID.sub(' ', prompt.replace(data['asOf'], ' '))
        ex['words'] += len(prose.split())
        for m in NUM.finditer(prose):
            ex['numbers'] += 1
            x = float(m.group())
            for t, k, v, tol in graded:
                if abs(x - v) <= tol:
                    fails.append(f'{tier} prompt prose states {m.group()}, which is graded {t}:{k} = {v}')
        for d in dates:
            ex['dates'] += 1
            if d in prompt:
                fails.append(f'{tier} prompt states the graded date {d}')
        for name, cols, recs in data['tables'].get(tier, []):
            ex['tables'] += 1
            bad_cols = [c for c in cols if c in OUTPUT_KEYS]
            if bad_cols:
                fails.append(f'{tier} table {name} lists output column(s) {bad_cols}')
            for r in recs:
                ex['records'] += 1
                extra = [k for k in r if k not in cols]
                if extra:
                    fails.append(f'{tier} table {name} record {r.get("id")} carries key(s) outside its columns: {extra}')
                for col, val in r.items():
                    for d in dates:
                        if d in json.dumps(val) and allowed_at.get(d) != (name, col):
                            fails.append(f'{tier} table {name} record {r.get("id")} carries the graded date {d} in {col}')
    return fails, ex


def main():
    fields = json.load(open(os.path.join(WAVE, 'fields.json')))
    data = load()
    fails, ex = check(data, fields)
    print(f'promptleak: {ex["prompts"]} prompts, {ex["words"]} prose words, {ex["numbers"]} prose numbers after record ids and the as-of date, {ex["tables"]} tables, '
          f'{ex["records"]} records, {ex["dates"]} graded-date spellings checked')
    # A prompt whose prose states no number at all is the best case, so the
    # prose count may be zero; the prompts, tables and records may not.
    if min(ex['prompts'], ex['words'], ex['tables'], ex['records']) == 0:
        print('  GATE REFUSES: an empty sweep is not a pass')
        return 2
    for f in fails:
        print('  LEAK', f)
    print(f'  {len(fails)} leak(s)')
    return 1 if fails else 0


def selftest():
    fields = json.load(open(os.path.join(WAVE, 'fields.json')))
    data = load()
    data['prompts']['beginner'] += ' The answer is 33.'
    data['tables']['intermediate'][0][1].append('dueDate')
    data['tables']['advanced'][2][2][1]['review_due'] = '2026-08-19'
    fails, _ = check(data, fields)
    assert any('prose states 33' in f for f in fails), 'a planted graded value in prose was not caught'
    assert any('output column' in f for f in fails), 'a planted output column was not caught'
    assert any('graded date' in f and 'record' in f for f in fails), 'a planted graded date in a record was not caught'
    print('selftest: a planted prose value, an output column and a graded date in a record all fire')
    return 0


if __name__ == '__main__':
    sys.exit(selftest() if '--selftest' in sys.argv else main())
