#!/usr/bin/env python3
"""THE ORACLE BRIDGE: every engine answer this wave prints or grades, replayed
through the independent Python oracle for its module.

The engines repository ships one stdlib oracle per assurance module, written
from the rules as the modules and the Suite STATUS document state them rather
than from the JavaScript, and its goldens are the oracle's answers on the
oracle author's own records. A golden therefore checks the engine on somebody
else's cases. This bridge checks it on THIS course's cases: riskchange_dump.mjs
and riskchange_capstone.mjs write every engine call they make (module, export,
arguments, answer) to a ledger, and this script calls the matching oracle
function on the same arguments and compares.

WHAT IS COMPARED. The whole answer, key for key, with the three prose keys
(reason, text, message) removed from objects, because an oracle is not asked
to reproduce sentences, exactly as the golden runner does. A bare string answer
(explainRefusal) IS compared verbatim, because the oracle reproduces those.

IT REFUSES rather than passing if the ledger is empty, if any call has no
oracle mapping (an unmapped call would be an answer nobody checked), or if any
answer disagrees. It prints how many calls it replayed per module.

Usage: oracle_bridge.py [ledger.json ...] [--selftest]
"""
import json, math, os, sys

ORACLES = os.environ.get('RC_ORACLES',
    '/root/wt-as-riskchange-nextgen/packages/engines/tools/validation/assurance')
sys.path.insert(0, ORACLES)
import oracle_calendar as oc      # noqa: E402
import oracle_risk as orisk       # noqa: E402
import oracle_moc as omoc         # noqa: E402
import oracle_peer_review as opr  # noqa: E402
import oracle_lessons as oll      # noqa: E402

PROSE = {'reason', 'text', 'message'}
WAVE = os.path.dirname(os.path.abspath(__file__))


def dec(v):
    """Ledger JSON -> the plain values every oracle reads (dates as strings)."""
    if isinstance(v, list):
        return [dec(x) for x in v]
    if isinstance(v, dict):
        if '$date' in v:
            return v['$date']
        if '$undefined' in v:
            return None
        if '$map' in v:
            return {dec(k): dec(x) for k, x in v['$map']}
        if '$num' in v:
            return float(v['$num'])
        return {k: dec(x) for k, x in v.items()}
    return v


def strip(v):
    if isinstance(v, list):
        return [strip(x) for x in v]
    if isinstance(v, dict):
        if '$date' in v:
            return v['$date']
        return {k: strip(x) for k, x in v.items() if k not in PROSE}
    return v


def same(a, b):
    if isinstance(a, bool) or isinstance(b, bool):
        return a is b if isinstance(a, bool) and isinstance(b, bool) else False
    if isinstance(a, (int, float)) and isinstance(b, (int, float)):
        return a == b or (math.isnan(a) and math.isnan(b))
    if isinstance(a, dict) and isinstance(b, dict):
        return a.keys() == b.keys() and all(same(a[k], b[k]) for k in a)
    if isinstance(a, list) and isinstance(b, list):
        return len(a) == len(b) and all(same(x, y) for x, y in zip(a, b))
    return a == b


def opt(args, i, default=None):
    return args[i] if len(args) > i and args[i] is not None else default


MAP = {
    ('calendar', 'daysUntil'): lambda a: oc.days_until(a[0], a[1]),
    ('calendar', 'toDateOnlyString'): lambda a: oc.ymd_string(a[0]),
    ('riskScoring', 'calculateRiskScore'): lambda a: orisk.score(a[0], a[1]),
    ('riskScoring', 'getRiskBand'): lambda a: orisk.band(a[0]),
    ('riskScoring', 'calculateResidualScore'): lambda a: orisk.residual(a[0]),
    ('riskScoring', 'getAppetiteStatus'): lambda a: orisk.appetite(a[0]),
    ('riskScoring', 'isReviewOverdue'): lambda a: orisk.overdue(a[0], a[1]),
    ('riskScoring', 'deriveRiskFields'): lambda a: orisk.derive(a[0]),
    ('riskScoring', 'countByBand'): lambda a: orisk.count_by_band(a[0], bool(opt(a, 1, {}).get('residual'))),
    ('managementOfChange', 'nextStages'): lambda a: omoc.o_next_stages(a[0]),
    ('managementOfChange', 'canAdvance'): lambda a: omoc.o_can_advance(a[0], a[1], opt(a, 2, {})),
    ('managementOfChange', 'approvalState'): lambda a: omoc.o_approval_state(a[0]),
    ('managementOfChange', 'canAssignApprover'): lambda a: omoc.o_can_assign_approver(a[0], a[1]),
    ('managementOfChange', 'canDecideApproval'): lambda a: omoc.o_can_decide_approval(a[0], a[1], a[2]),
    ('managementOfChange', 'expiryState'): lambda a: omoc.o_expiry_state(a[0], a[1]),
    ('managementOfChange', 'isExpired'): lambda a: omoc.o_is_expired(a[0], a[1]),
    ('managementOfChange', 'isOverdue'): lambda a: omoc.o_is_overdue(a[0], a[1]),
    ('managementOfChange', 'ratificationState'): lambda a: omoc.o_ratification(a[0], a[1], a[2]),
    ('managementOfChange', 'summarise'): lambda a: omoc.o_summarise(a[0], opt(a, 1, {}), a[2]),
    ('managementOfChange', 'daysUntil'): lambda a: omoc.days_until(a[0], a[1]),
    ('peerReview', 'nextStatuses'): lambda a: list(opr.DISPOSITION.get(a[0], [])),
    ('peerReview', 'explainRefusal'): lambda a: opr.refusal(a[0], a[1]),
    ('peerReview', 'canTransition'): lambda a: opr.can(a[0], a[1]),
    ('peerReview', 'isResolved'): lambda a: opr.resolved(a[0]),
    ('peerReview', 'isBlocking'): lambda a: opr.blocking(a[0]),
    ('peerReview', 'canClose'): lambda a: opr.can_close(a[0]),
    ('peerReview', 'isOverdue'): lambda a: opr.overdue(a[0], a[1]),
    ('peerReview', 'summarise'): lambda a: opr.summarise(a[0], a[1], a[2]),
    ('peerReview', 'canAssignPeerReviewer'): lambda a: opr.can_assign_peer_reviewer(a[0], a[1]),
    ('peerReview', 'canActOnComment'): lambda a: opr.can_act_on_comment(a[0], a[1], a[2], opt(a, 3)),
    ('lessonsLearned', 'hasSubstance'): lambda a: oll.o_has_substance(a[0]),
    ('lessonsLearned', 'missingSubstance'): lambda a: oll.o_missing(a[0]),
    ('lessonsLearned', 'isAccepted'): lambda a: oll.o_is_accepted(a[0]),
    ('lessonsLearned', 'isVisible'): lambda a: oll.o_is_visible(a[0]),
    ('lessonsLearned', 'isLive'): lambda a: oll.o_is_live(a[0]),
    ('lessonsLearned', 'canValidate'): lambda a: oll.o_can_validate(a[0], opt(a, 1), opt(a, 2, {})),
    ('lessonsLearned', 'canAdvanceLesson'): lambda a: oll.o_can_advance(a[0], a[1], opt(a, 2, {})),
    ('lessonsLearned', 'reuseRecord'): lambda a: oll.o_reuse(a[0]),
    ('lessonsLearned', 'nextLessonStatuses'): lambda a: oll.o_next(a[0]),
    ('lessonsLearned', 'canRecordApplication'): lambda a: oll.o_can_record(a[0]),
    ('lessonsLearned', 'isReviewOverdue'): lambda a: oll.o_review_overdue(a[0], a[1]),
    ('lessonsLearned', 'isReviewDueSoon'): lambda a: oll.o_review_soon(a[0], a[1]),
    ('lessonsLearned', 'lessonAgeDays'): lambda a: oll.o_age(a[0], a[1]),
    ('lessonsLearned', 'isUnapplied'): lambda a: oll.o_unapplied(a[0], opt(a, 1, [])),
    ('lessonsLearned', 'summarise'): lambda a: oll.o_summarise(a[0], a[1]),
    ('lessonsLearned', 'daysUntil'): lambda a: oll.days_until(a[0], a[1]),
}

SORTS = {
    ('managementOfChange', 'byUrgency'): lambda rows, f: omoc.urgency_order(rows, f[0]),
    ('peerReview', 'byUrgency'): lambda rows, f: opr.urgency_order(rows, f[0]),
    ('peerReview', 'bySeverityThenAge'): lambda rows, f: opr.severity_order(rows),
    ('lessonsLearned', 'lessonByAttention'): lambda rows, f: oll.attention_order(rows, f[0], f[1]),
}


CONSTS = {
    ('riskScoring', 'RISK_BANDS'): lambda v: [(b['band'], b['min']) for b in v] == orisk.BANDS,
    ('riskScoring', 'SCALE_MIN'): lambda v: orisk.level(v) == v and orisk.level(v - 1) is None,
    ('riskScoring', 'SCALE_MAX'): lambda v: orisk.level(v) == v and orisk.level(v + 1) is None,
    ('managementOfChange', 'EXPIRY_LEAD_DAYS'): lambda v: v == omoc.LEAD,
    ('managementOfChange', 'EMERGENCY_RATIFY_DAYS'): lambda v: v == omoc.RATIFY_DAYS,
    ('managementOfChange', 'STAGE_TRANSITIONS'): lambda v: v == omoc.EDGES,
    ('managementOfChange', 'ACTIVE_STAGES'): lambda v: v == omoc.ACTIVE,
    ('managementOfChange', 'IN_EFFECT_STAGES'): lambda v: v == omoc.IN_EFFECT,
    ('peerReview', 'COMMENT_TRANSITIONS'): lambda v: v == opr.DISPOSITION,
    ('peerReview', 'RESOLVED_STATUSES'): lambda v: v == opr.RESOLVED,
    ('peerReview', 'BLOCKING_SEVERITIES'): lambda v: v == opr.BLOCKING,
    ('peerReview', 'ACTIVE_STAGES'): lambda v: v == opr.ACTIVE,
    ('peerReview', 'REVIEWER_ROLES'): lambda v: v == opr.REVIEWER_ROLES,
    ('lessonsLearned', 'REVIEW_LEAD_DAYS'): lambda v: v == oll.REVIEW_LEAD,
    ('lessonsLearned', 'LESSON_TRANSITIONS'): lambda v: v == oll.EDGES,
    ('lessonsLearned', 'LESSON_VISIBLE_STATUSES'): lambda v: v == oll.VISIBLE,
    ('lessonsLearned', 'LESSON_LIVE_STATUSES'): lambda v: v == oll.LIVE,
    ('lessonsLearned', 'EMBEDDING_OUTCOMES'): lambda v: v == oll.CHANGED,
}


def replay(calls):
    per, bad, unmapped = {}, [], []
    for i, c in enumerate(calls):
        m = c['m']
        if 'constant' in c:
            key = (m, c['constant'])
            if key not in CONSTS:
                unmapped.append(f'{m}.{c["constant"]} (constant)')
                continue
            per[m] = per.get(m, 0) + 1
            if not CONSTS[key](dec(c['value'])):
                bad.append((i, key, c['value'], 'the oracle states this rule differently'))
            continue
        if 'sort' in c:
            key = (m, c['sort'])
            if key not in SORTS:
                unmapped.append(f'{m}.{c["sort"]} (sort)')
                continue
            got = SORTS[key](dec(c['rows']), dec(c.get('factoryArgs', [])))
            want = c['order']
        else:
            key = (m, c['fn'])
            if key not in MAP:
                unmapped.append(f'{m}.{c["fn"]}')
                continue
            got = strip(MAP[key](dec(c['args'])))
            want = strip(c['result'])
        per[m] = per.get(m, 0) + 1
        if not same(want, got):
            bad.append((i, key, want, got))
    return per, bad, unmapped


def run(paths):
    total_calls = 0
    failed = False
    for p in paths:
        led = json.load(open(p))
        calls = led['calls']
        total_calls += len(calls)
        if not calls:
            print(f'  BRIDGE REFUSES: {p} holds no calls. A replay of nothing checks nothing.')
            return 2
        per, bad, unmapped = replay(calls)
        print(f'{os.path.basename(p)}: {len(calls)} engine call(s), as of {led.get("asOf")}')
        for m in sorted(per):
            print(f'   {m:<20} {per[m]:>5} replayed through the oracle')
        if unmapped:
            failed = True
            print(f'  UNMAPPED ({len(set(unmapped))} export(s)), an answer no oracle checked: {sorted(set(unmapped))}')
        for i, key, want, got in bad[:20]:
            failed = True
            print(f'  DISAGREE call {i} {key[0]}.{key[1]}\n     engine {json.dumps(want)[:300]}\n     oracle {json.dumps(got)[:300]}')
        if bad:
            failed = True
            print(f'  {len(bad)} disagreement(s)')
        else:
            print(f'  {sum(per.values())} of {len(calls)} agree')
    return 1 if failed else 0


def selftest():
    """Negative controls: a planted wrong answer and an unmapped export must both fail."""
    calls = [{'m': 'riskScoring', 'fn': 'calculateRiskScore', 'args': [4, 5], 'result': 20},
             {'m': 'managementOfChange', 'fn': 'summarise',
              'args': [[{'id': 'a', 'stage': 'Closed'}], {'actions': [{'moc_id': 'a', 'status': 'Open'}]}, {'$date': '2026-10-01'}],
              'result': None}]
    calls[1]['result'] = strip(omoc.o_summarise(dec(calls[1]['args'][0]), dec(calls[1]['args'][1]), '2026-10-01'))
    per, bad, un = replay(calls)
    assert not bad and not un, 'the positive control failed'
    calls[0]['result'] = 21
    per, bad, un = replay(calls)
    assert len(bad) == 1, 'a planted wrong score was not caught'
    calls[1]['result']['openActions'] = 1
    per, bad, un = replay(calls)
    assert len(bad) == 2, 'an action on a closed change counted as open was not caught'
    per, bad, un = replay([{'m': 'riskScoring', 'fn': 'notAnExport', 'args': [], 'result': 0}])
    assert un, 'an unmapped export was not reported'
    print('selftest: the positive control agrees, a planted wrong score, a planted AS14 miscount and an unmapped export all fire')
    return 0


if __name__ == '__main__':
    if '--selftest' in sys.argv:
        sys.exit(selftest())
    paths = [a for a in sys.argv[1:] if not a.startswith('--')] or [os.path.join(WAVE, 'calls.json')]
    sys.exit(run(paths))
