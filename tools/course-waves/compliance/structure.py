# compliance: Compliance, Audit & Quality. Three tiers, six modules each, 26
# lessons a tier. Academy module `assurance`, path_order 60.
#
# THE ONE SENTENCE. Nothing in these five apps is typed as a status: every
# status, count, age and verdict is derived from a dated record read against one
# stated as-of date, and every gate refuses until the evidence, the date and the
# named person it asks for are on the record.
#
# Panel ids: G the register explorer (an obligation register and a document
# library read against an as-of date the learner moves: status, lead time, the
# current period, roll-forward, review state), P the plan explorer (an
# inspection and test plan, its NCRs and a checklist audit: progress counted
# from the points and the answers, the closure gates, NCR ageing), R the
# readiness explorer (an ISO clause register, its audits and findings: coverage
# over the certification cycle, independence, the blocker list).
#
# Titles carry COUNTS only, never a measurement. No em dashes, no en dashes and
# no "X, not Y" contrastive anywhere a learner reads, headings included.
#
# Engines: engines/assurance at petrolord-engines 9d5d3b4 (ASC-0, which
# repaired this wave's five recon findings), vendored sha-identical. This course grades only complianceStatus, documentControl,
# qualityAssurance, auditManagement and isoCompliance (+ calendar).
#
# ---------------------------------------------------------------------------
# SCOPE SEAMS with the sibling assurance course `riskchange` (Risk, Change &
# Learning, path_order 59), which owns riskScoring, managementOfChange,
# peerReview and lessonsLearned:
#  * THIS course owns audit independence (the Audit & Findings Manager's lead
#    auditor against the auditee, ISO 19011 for every examiner), the audit and
#    finding lifecycles, and the root-cause categories.
#  * riskchange owns risk scoring, bands, appetite, and the segregation-of-duties
#    approval rules for MOC and peer review. Document Control's own reviewer rule
#    (the author never reviews a revision) is documentControl code and is taught
#    here in Associate m05, stated as the same owner decision (AS15 D1) without
#    re-teaching the MOC or peer review approval rules.
#  * Nothing here grades riskScoring, managementOfChange, peerReview or
#    lessonsLearned, and nothing here grades NPV, Monte Carlo or a decision tree.
# ---------------------------------------------------------------------------
G = 'compliance-register-explorer'
P = 'compliance-plan-explorer'
R = 'compliance-readiness-explorer'

WORD_BAND = (420, 560)
MIN_WORDS = {12: 420, 13: 470, 14: 510}

TIERS = {
 'beginner': [
  ('m01-what-the-register-derives', 'What the Register Derives', [
    ('l01-five-apps-and-one-date', 'Five apps and one date', 12, []),
    ('l02-a-date-is-a-day', 'A date is a day', 13, [G]),
    ('l03-an-unreadable-date-is-no-date', 'An unreadable date is no date', 13, [G]),
    ('l04-the-as-of-date-is-an-input', 'The as-of date is an input', 12, [G]),
  ]),
  ('m02-an-obligations-status', "An Obligation's Status", [
    ('l01-nine-statuses-worst-first', 'Nine statuses, worst first', 13, [G]),
    ('l02-the-lifecycle-answers-for-itself', 'The lifecycle answers for itself', 12, [G]),
    ('l03-an-expired-permit-outranks-an-overdue-return', 'An expired permit outranks an overdue return', 13, [G]),
    ('l04-the-earlier-of-two-dates', 'The earlier of two dates', 13, [G]),
    ('l05-on-track-and-compliant-are-two-words', 'On track and compliant are two words', 14, [G]),
  ]),
  ('m03-lead-time-and-the-current-period', 'Lead Time and the Current Period', [
    ('l01-the-lead-time-sets-the-warning', 'The lead time sets the warning', 13, [G]),
    ('l02-a-missing-lead-time', 'A missing lead time', 12, [G]),
    ('l03-the-edge-of-the-window', 'The edge of the window', 13, [G]),
    ('l04-the-period-a-filing-belongs-to', 'The period a filing belongs to', 14, [G]),
    ('l05-one-day-before-the-period', 'One day before the period', 13, [G]),
  ]),
  ('m04-rolling-the-schedule-forward', 'Rolling the Schedule Forward', [
    ('l01-from-the-date-that-was-due', 'From the date that was due', 13, [G]),
    ('l02-month-ends-pulled-back', 'Month ends pulled back', 13, [G]),
    ('l03-two-frequencies-with-no-next-date', 'Two frequencies with no next date', 12, [G]),
    ('l04-a-filed-one-off-is-discharged', 'A filed one-off is discharged', 13, [G]),
  ]),
  ('m05-controlled-documents', 'Controlled Documents', [
    ('l01-in-force-and-not-in-force', 'In force and not in force', 13, [G]),
    ('l02-the-review-date-earned-at-issue', 'The review date earned at issue', 14, [G]),
    ('l03-revision-numbers-keep-their-width', 'Revision numbers keep their width', 12, [G]),
    ('l04-the-author-does-not-review', 'The author does not review', 13, [G]),
    ('l05-the-review-queue', 'The review queue', 13, [G]),
  ]),
  ('m06-the-associate-reading', 'The Associate Reading', [
    ('l01-the-ikoro-register-end-to-end', 'The Ikoro register end to end', 14, [G]),
    ('l02-the-ikoro-library-end-to-end', 'The Ikoro library end to end', 14, [G]),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'intermediate': [
  ('m01-the-inspection-and-test-plan', 'The Inspection and Test Plan', [
    ('l01-five-point-types-and-one-that-stops-work', 'Five point types, and one that stops work', 13, [P]),
    ('l02-a-decision-is-a-date-and-a-name', 'A decision is a date and a name', 13, [P]),
    ('l03-a-waiver-carries-its-reason', 'A waiver carries its reason', 12, [P]),
    ('l04-setting-a-hold-point-aside', 'Setting a hold point aside', 14, [P]),
    ('l05-progress-counted-from-the-points', 'Progress counted from the points', 14, [P]),
  ]),
  ('m02-closing-a-plan', 'Closing a Plan', [
    ('l01-a-failed-point-blocks-whatever-its-type', 'A failed point blocks whatever its type', 13, [P]),
    ('l02-hold-points-outstanding', 'Hold points outstanding', 13, [P]),
    ('l03-an-open-ncr-blocks-the-plan', 'An open NCR blocks the plan', 13, [P]),
    ('l04-removing-a-point-and-raising-an-ncr', 'Removing a point, and raising an NCR', 14, [P]),
  ]),
  ('m03-the-nonconformance', 'The Nonconformance', [
    ('l01-the-disposition-comes-first', 'The disposition comes first', 13, [P]),
    ('l02-severity-sets-what-closure-needs', 'Severity sets what closure needs', 14, [P]),
    ('l03-a-completed-action-and-a-working-one', 'A completed action and a working one', 14, [P]),
    ('l04-ageing-and-its-four-bands', 'Ageing and its four bands', 13, [P]),
    ('l05-what-the-dashboard-counts', 'What the dashboard counts', 14, [P]),
  ]),
  ('m04-the-checklist', 'The Checklist', [
    ('l01-not-applicable-needs-a-reason', 'Not applicable needs a reason', 13, [P]),
    ('l02-no-checklist-is-no-percentage', 'No checklist is no percentage', 12, [P]),
    ('l03-a-failed-critical-item-needs-a-finding', 'A failed critical item needs a finding', 14, [P]),
    ('l04-stop-work-records-its-correction', 'Stop work records its correction', 13, [P]),
  ]),
  ('m05-the-audit-and-the-programme', 'The Audit and the Programme', [
    ('l01-six-statuses-and-the-moves-between-them', 'Six statuses and the moves between them', 13, [P]),
    ('l02-what-reporting-an-audit-needs', 'What reporting an audit needs', 14, [P]),
    ('l03-what-closing-an-audit-needs', 'What closing an audit needs', 13, [P]),
    ('l04-the-lead-auditor-and-the-auditee', 'The lead auditor and the auditee', 13, [P]),
    ('l05-a-programme-is-delivered-by-its-reports', 'A programme is delivered by its reports', 14, [P]),
  ]),
  ('m06-the-professional-reading', 'The Professional Reading', [
    ('l01-the-abam-plan-end-to-end', 'The Abam plan end to end', 14, [P]),
    ('l02-the-abam-audit-and-programme-end-to-end', 'The Abam audit and programme end to end', 14, [P]),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'advanced': [
  ('m01-a-claim-is-evidence', 'A Claim Is Evidence', [
    ('l01-applicability-and-its-justification', 'Applicability and its justification', 13, [R]),
    ('l02-evidence-a-date-and-a-name', 'Evidence, a date and a name', 14, [R]),
    ('l03-a-nonconformant-verdict-needs-two-of-the-three', 'A nonconformant verdict needs two of the three', 13, [R]),
    ('l04-reviewing-the-register', 'Reviewing the register', 12, [R]),
  ]),
  ('m02-independence', 'Independence', [
    ('l01-the-lead-auditor-and-the-clauses-in-scope', 'The lead auditor and the clauses in scope', 14, [R]),
    ('l02-every-examiner', 'Every examiner', 13, [R]),
    ('l03-three-independence-rules-in-three-apps', 'Three independence rules in three apps', 13, [R]),
    ('l04-the-external-auditor', 'The external auditor', 12, [R]),
  ]),
  ('m03-coverage-over-the-cycle', 'Coverage Over the Cycle', [
    ('l01-only-internal-audits-count', 'Only internal audits count', 13, [R]),
    ('l02-only-reported-results-count', 'Only reported results count', 14, [R]),
    ('l03-never-examined-and-examined-too-long-ago', 'Never examined, and examined too long ago', 14, [R]),
    ('l04-each-standard-its-own-cycle', 'Each standard its own cycle', 13, [R]),
    ('l05-the-latest-examination-that-counts', 'The latest examination that counts', 13, [R]),
  ]),
  ('m04-findings-and-root-causes', 'Findings and Root Causes', [
    ('l01-the-correction-and-the-corrective-action', 'The correction and the corrective action', 14, [R]),
    ('l02-a-major-nonconformity-needs-its-root-cause', 'A major nonconformity needs its root cause', 13, [R]),
    ('l03-two-root-cause-vocabularies', 'Two root cause vocabularies', 12, [R]),
    ('l04-a-findings-age-stops-at-closure', "A finding's age stops at closure", 13, [R]),
    ('l05-which-finding-comes-first', 'Which finding comes first', 13, [R]),
  ]),
  ('m05-certification-readiness', 'Certification Readiness', [
    ('l01-a-list-of-blockers', 'A list of blockers', 14, [R]),
    ('l02-blocking-serious-and-watch', 'Blocking, serious and watch', 13, [R]),
    ('l03-the-certificate-and-its-window', 'The certificate and its window', 14, [R]),
    ('l04-the-counts-beside-the-list', 'The counts beside the list', 13, [R]),
  ]),
  ('m06-the-expert-reading', 'The Expert Reading', [
    ('l01-the-orashi-register-end-to-end', 'The Orashi register end to end', 14, [R]),
    ('l02-what-is-held-and-what-is-decided', 'What is held and what is decided', 14, [R]),
    ('l03-what-the-oracles-check', 'What the oracles check', 13, []),
    ('l04-where-this-course-hands-over', 'Where this course hands over', 12, []),
  ]),
 ],
}

# Nothing is held: the engine is vendored, the digest is built, and every module
# has its source. The five recon findings were repaired upstream in ASC-0 and
# are taught in Expert m06 l02 as current rules.
HELD = {}

if __name__ == '__main__':
    total = 0
    for tier, mods in TIERS.items():
        n = sum(len(m[2]) for m in mods)
        held = sum(len(m[2]) for m in mods if m[0] in HELD.get(tier, []))
        total += n
        print(f'{tier:<14} {len(mods)} modules  {n} lessons  ({held} held)')
        assert len(mods) == 6, f'{tier} has {len(mods)} modules'
        assert n == 26, f'{tier} has {n} lessons'
    print(f'{"total":<14} {total} lessons, all writable')
    titles = [l[1] for mods in TIERS.values() for m in mods for l in m[2]] \
        + [m[1] for mods in TIERS.values() for m in mods]
    bad = [t for t in titles if '—' in t or '–' in t or ', not ' in t]
    assert not bad, f'owner copy rule broken in: {bad}'
    print('titles: no em dashes, no en dashes, no "X, not Y" contrastives')
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            assert len(set(l[0] for l in lessons)) == len(lessons), mkey
    print('lesson keys unique inside every module')
    mins = {}
    for tier, mods in TIERS.items():
        for mkey, mtitle, lessons in mods:
            for lkey, ltitle, minutes, panels in lessons:
                assert minutes in MIN_WORDS, f'{tier}/{mkey}/{lkey} has no minimum for {minutes} minutes'
                mins.setdefault(MIN_WORDS[minutes], 0)
                mins[MIN_WORDS[minutes]] += 1
    print(f'word band {WORD_BAND[0]} to {WORD_BAND[1]} prose words; per-lesson minimums: '
          + ', '.join(f'{k} words x {v}' for k, v in sorted(mins.items())))
    panelled = [l for mods in TIERS.values() for m in mods for l in m[2] if l[3]]
    print(f'panels: {len(panelled)} of {total} lessons carry one; '
          f'ids {sorted(set(p for l in panelled for p in l[3]))}')
