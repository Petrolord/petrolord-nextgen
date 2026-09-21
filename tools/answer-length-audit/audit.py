#!/usr/bin/env python3
"""Answer-length audit over the SERVED question rows (B4, 2026-09-21).

A four-option question gives its correct option a LENGTH RANK: 0 if it is the
longest option, 3 if it is the shortest. If one rank carries most of a bank's
answers, a candidate who never reads the questions can pass by always picking
that rank. The wave kit's gate (/root/dc-wavekit/bankkit.py) requires every
rank to hold between RANK_ANY_FLOOR and RANK_ANY_CAP of a bank's answers; this
tool applies the same rule to what production actually serves, bank by bank.

A BANK is (app_slug, tier, scope, module_key): the pool one quiz or one final
exam is drawn from (academy_serve_quiz samples it at random and serves the
options in stored order).

Two numbers per bank:
  kit rank   sorted(range(4), key=-len) with a STABLE sort, exactly as
             bankkit.py computes it, so ties break by option order. This is
             the number the gate judges.
  read-nothing score
             the best a candidate can do by always choosing ONE length rank,
             tie-aware: when the correct option ties with others at that rank
             the candidate is credited 1/(tie size). This is the exposure.

REFUSES (exit 2) on an empty sweep: a gate that reports success on zero input
is worse than no gate. `--selftest` runs the negative controls.

Input: a JSON array of rows {app_slug, tier, scope, module_key, ord, options,
answer_index}, from --json FILE or --container NAME (a local scratch postgres
replaying main; never production).
"""
import argparse, csv, json, subprocess, sys
from collections import defaultdict

RANK_ANY_CAP = 0.40
RANK_ANY_FLOOR = 0.12

SQL = ("select coalesce(json_agg(json_build_object('app_slug',app_slug,'tier',tier,"
       "'scope',scope,'module_key',module_key,'ord',ord,'options',options,"
       "'answer_index',answer_index) order by app_slug,tier,scope,module_key,ord),'[]') "
       "from academy_quiz_questions where active")


def kit_rank(opts, a):
    return sorted(range(len(opts)), key=lambda j: -len(opts[j])).index(a)


def tie_credit(opts, a):
    """Per rank k: the chance a 'pick the k-th longest' candidate is right."""
    L = [len(o) for o in opts]
    distinct = sorted(set(L), reverse=True)
    credit = [0.0] * 4
    # the candidate picks the option at rank k, breaking ties at random
    order = sorted(range(4), key=lambda j: -L[j])
    for k in range(4):
        lk = L[order[k]]
        tied = [j for j in range(4) if L[j] == lk]
        if a in tied:
            credit[k] = 1.0 / len(tied)
    return credit


def audit(rows):
    banks = defaultdict(list)
    for r in rows:
        banks[(r['app_slug'], r['tier'], r['scope'], r['module_key'] or '')].append(r)
    out = []
    for key in sorted(banks):
        qs = banks[key]
        n = len(qs)
        counts = [0, 0, 0, 0]
        credit = [0.0] * 4
        ties = 0
        bad_shape = 0
        for q in qs:
            opts, a = q['options'], q['answer_index']
            if len(opts) != 4 or not (0 <= a < 4):
                bad_shape += 1
                continue
            counts[kit_rank(opts, a)] += 1
            c = tie_credit(opts, a)
            credit = [x + y for x, y in zip(credit, c)]
            if len({len(o) for o in opts}) < 4:
                ties += 1
        shares = [c / n for c in counts]
        fails = [f'rank{k} {s:.2f}>{RANK_ANY_CAP}' for k, s in enumerate(shares) if s > RANK_ANY_CAP]
        fails += [f'rank{k} {s:.2f}<{RANK_ANY_FLOOR}' for k, s in enumerate(shares) if s < RANK_ANY_FLOOR]
        if bad_shape:
            fails.append(f'{bad_shape} not four options')
        out.append({
            'app_slug': key[0], 'tier': key[1], 'scope': key[2], 'module_key': key[3],
            'n': n, 'r0': counts[0], 'r1': counts[1], 'r2': counts[2], 'r3': counts[3],
            'top_share': round(max(shares), 4),
            'read_nothing': round(max(credit) / n, 4),
            'best_rank': max(range(4), key=lambda k: credit[k]),
            'ties': ties, 'pass': not fails, 'fails': '; '.join(fails),
        })
    return out


def load(args):
    if args.json:
        return json.load(open(args.json))
    res = subprocess.run(['docker', 'exec', args.container, 'psql', '-U', 'postgres', '-tAc', SQL],
                         capture_output=True, text=True, check=True)
    return json.loads(res.stdout)


def selftest():
    ok = True
    def check(name, cond):
        nonlocal ok
        print(('  ok    ' if cond else '  FAIL  ') + name)
        ok &= bool(cond)
    def q(opts, a, mk='m01'):
        return {'app_slug': 't', 'tier': 'beginner', 'scope': 'module', 'module_key': mk,
                'ord': 0, 'options': opts, 'answer_index': a}
    even = [q(['aaaa', 'bbb', 'cc', 'd'], k % 4) for k in range(8)]
    check('an even bank passes', audit(even)[0]['pass'])
    check('an even bank reads near chance', audit(even)[0]['read_nothing'] == 0.25)
    skewed = [q(['aaaa', 'bbb', 'cc', 'd'], 1) for _ in range(8)]
    r = audit(skewed)[0]
    check('a one-rank bank fails', not r['pass'])
    check('a one-rank bank reads 100 pct', r['read_nothing'] == 1.0)
    planted = even[:6] + [q(['aaaa', 'bbb', 'cc', 'd'], 1) for _ in range(4)]
    check('a bank at rank share 0.50 fails the cap', not audit(planted)[0]['pass'])
    tied = [q(['aa', 'bb', 'cc', 'dd'], 0) for _ in range(4)]
    check('a four-way tie credits a quarter', audit(tied)[0]['read_nothing'] == 0.25)
    check('a four-way tie is counted', audit(tied)[0]['ties'] == 4)
    three = [q(['aaa', 'bb', 'c'], 0)]
    check('a three-option question is flagged', 'not four options' in audit(three)[0]['fails'])
    check('an empty sweep yields no banks (main refuses it)', audit([]) == [])
    return ok


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--json'); ap.add_argument('--container')
    ap.add_argument('--csv'); ap.add_argument('--selftest', action='store_true')
    ap.add_argument('--min-rows', type=int, default=1000,
                    help='refuse a sweep smaller than this (the estate is ~25k rows)')
    args = ap.parse_args()
    if args.selftest:
        sys.exit(0 if selftest() else 1)
    if not (args.json or args.container):
        ap.error('--json or --container')
    rows = load(args)
    if len(rows) < args.min_rows:
        print(f'REFUSED: swept {len(rows)} rows, below the floor of {args.min_rows}. '
              'An empty or partial sweep is not a pass.')
        sys.exit(2)
    res = audit(rows)
    if args.csv:
        with open(args.csv, 'w', newline='') as f:
            w = csv.DictWriter(f, fieldnames=list(res[0].keys()))
            w.writeheader(); w.writerows(res)
    failing = [r for r in res if not r['pass']]
    print(f'rows {len(rows)}  banks {len(res)}  failing {len(failing)}  '
          f'courses {len({r["app_slug"] for r in res})}  '
          f'courses with a failing bank {len({r["app_slug"] for r in failing})}')
    sys.exit(1 if failing else 0)


if __name__ == '__main__':
    main()
