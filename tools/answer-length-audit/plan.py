#!/usr/bin/env python3
"""Minimal-move answer-length plan per bank (B4).

For each failing bank, choose target rank counts inside the band
[ceil(FLOOR*n), floor(CAP*n)] that move the FEWEST questions, then assign
questions to ranks at the least distractor-edit cost. Edits are always to
DISTRACTORS, and lengthening is preferred three to one over shortening
(plan_ranks.py's rule): a distractor is lengthened by naming the mechanism it
wrongly invokes, shortened only by cutting a hedge.

To put the correct option at rank r, exactly r distractors must be strictly
longer than it and 3-r strictly shorter (no ties with the correct option, so
the kit's stable sort cannot place it by option order).

Input: the served-row JSON (see audit.py). Output: a JSON plan
[{bank, ord, current, target, edits:[{option, now_len, need, direction}]}].
"""
import json, math, sys
from collections import defaultdict

CAP, FLOOR = 0.40, 0.12
SHORTEN_PENALTY = 3
MARGIN = 6   # characters of clearance so a later typo fix cannot flip a rank


def kit_rank(opts, a):
    return sorted(range(4), key=lambda j: -len(opts[j])).index(a)


def edits_for(opts, a, r):
    """Edits that put the correct option at rank r, lengthen-first."""
    La = len(opts[a])
    ds = sorted((len(opts[j]), j) for j in range(4) if j != a)   # short -> long
    out, cost = [], 0
    for k, (dl, j) in enumerate(ds):
        longer = k >= 3 - r
        if longer and dl <= La:
            need = La + MARGIN
            out.append({'option': j, 'now_len': dl, 'need_len_at_least': need, 'direction': 'lengthen'})
            cost += need - dl
        elif not longer and dl >= La:
            need = La - MARGIN
            out.append({'option': j, 'now_len': dl, 'need_len_at_most': need, 'direction': 'shorten'})
            cost += (dl - need) * SHORTEN_PENALTY
    return out, cost


def plan_bank(qs):
    n = len(qs)
    lo, hi = math.ceil(FLOOR * n), math.floor(CAP * n)
    cur = [0] * 4
    for q in qs:
        cur[kit_rank(q['options'], q['answer_index'])] += 1
    if all(lo <= c <= hi for c in cur):
        return None
    # target counts: clip into the band, then rebalance with the fewest moves
    tgt = [min(max(c, lo), hi) for c in cur]
    # Raising short ranks to the floor can overfill; take the surplus from the
    # ranks furthest above their current count first (those are the moves that
    # cost least to undo), never below the floor.
    while sum(tgt) > n:
        k = max((k for k in range(4) if tgt[k] > lo), key=lambda k: (tgt[k] - cur[k], tgt[k]))
        tgt[k] -= 1
    # Clipping full ranks to the cap can underfill. Give each spare slot to the
    # rank whose NEXT incoming question is cheapest to move there, so the
    # remainder lands where lengthening alone reaches it (for a bank whose
    # answers sit second-shortest, that is the shortest rank: lengthen the one
    # shorter distractor) rather than being spread evenly into ranks that can
    # only be reached by shortening.
    movecost = {k: sorted(edits_for(q['options'], q['answer_index'], k)[1]
                          for q in qs if kit_rank(q['options'], q['answer_index']) != k)
                for k in range(4)}
    while sum(tgt) < n:
        def next_cost(k):
            extra = tgt[k] - min(tgt[k], cur[k])      # incoming already planned
            return movecost[k][extra] if tgt[k] >= cur[k] and extra < len(movecost[k]) else 0
        k = min((k for k in range(4) if tgt[k] < hi), key=next_cost)
        tgt[k] += 1
    # assign: keep questions where they are while their rank has room, then
    # move the cheapest ones into the ranks that are short
    cand = []
    for i, q in enumerate(qs):
        r0 = kit_rank(q['options'], q['answer_index'])
        for r in range(4):
            e, c = edits_for(q['options'], q['answer_index'], r) if r != r0 else ([], 0)
            cand.append((c, r != r0, r, i, e))
    cand.sort(key=lambda x: (x[1], x[0]))
    counts, assigned = [0] * 4, {}
    for c, moved, r, i, e in cand:
        if i in assigned or counts[r] >= tgt[r]:
            continue
        assigned[i] = (r, e, c)
        counts[r] += 1
    rows = []
    for i, q in enumerate(qs):
        r, e, c = assigned[i]
        r0 = kit_rank(q['options'], q['answer_index'])
        if r != r0:
            rows.append({'ord': q['ord'], 'current': r0, 'target': r, 'cost': c, 'edits': e})
    return {'n': n, 'current': cur, 'target': tgt, 'moves': rows}


def main():
    rows = json.load(open(sys.argv[1]))
    only = set(sys.argv[2].split(',')) if len(sys.argv) > 2 else None
    banks = defaultdict(list)
    for r in rows:
        if only and r['app_slug'] not in only:
            continue
        banks[(r['app_slug'], r['tier'], r['scope'], r['module_key'] or '')].append(r)
    out = []
    for k in sorted(banks):
        p = plan_bank(sorted(banks[k], key=lambda q: q['ord']))
        if p:
            out.append({'bank': list(k), **p})
    json.dump(out, sys.stdout, indent=1)


if __name__ == '__main__':
    main()
