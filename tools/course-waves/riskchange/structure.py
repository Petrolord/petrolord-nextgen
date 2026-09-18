# riskchange, Risk, Change & Learning. Three tiers, six modules each, 26 lessons a tier.
#
# Panel ids, three explorer panels over ONE teaching lab
# (src/components/course/panels/riskchange/riskchangeLab.js, to be built):
#   R the risk explorer: the five by five grid with its bands, the residual
#     falling back one axis at a time, appetite against a target, and a
#     register counted by band over a population the reader chooses.
#   C the change explorer: the stage machine, approval levels with who may sign,
#     the two gates, and a timeline that moves an expiry and an emergency
#     implementation date across the as-of date.
#   V the review and lesson explorer: a comment log whose dispositions the
#     reader moves and watches the closure verdict follow, and a lesson whose
#     applications the reader adds and watches the reuse record and the
#     embedding verdict follow.
#
# Titles carry COUNTS only, never a measurement, and no title carries a number
# a lesson would have to defend (a lead in days is a measurement).
#
# FRAMED HISTORY IS CURRICULUM. Expert m05 l03 is titled so the frame is in the
# heading. Its source is digest SECTION 20, the one section whose subject is
# what these engines were repaired for and which says so in its title and its
# first line. No em dashes and no "X, not Y" contrastive anywhere a learner
# reads, headings included.
#
# Engines: engines/assurance/{riskScoring,managementOfChange,peerReview,
# lessonsLearned,calendar}.js, vendored sha-identical with engines 6b00f43.
#
# ---------------------------------------------------------------------------
# SCOPE SEAMS with the sibling course compliance (Compliance, Audit & Quality,
# path_order 60), which is built at the same time from the same vendored family:
#  * AUDIT INDEPENDENCE, THE AUDIT AND FINDING LIFECYCLES AND ROOT-CAUSE
#    CATEGORIES are OWNED by compliance. Expert m06 l01 names an audit finding
#    as the SOURCE of a lesson and stops there; nothing from auditManagement or
#    isoCompliance is graded or computed here.
#  * RISK SCORING, BANDS, APPETITE and the SEGREGATION-OF-DUTIES rules on
#    change approvals are OWNED here. Peer review carries no independence rule
#    in any layer (RECON.md RC-4), so Expert m02 l04 teaches that absence as a
#    stated limit.
#  * Nothing here is an NPV, a Monte Carlo or a decision tree; those are owned
#    by the economics courses.
# ---------------------------------------------------------------------------
R = 'rc-risk-explorer'
C = 'rc-change-explorer'
V = 'rc-review-explorer'

# The lesson length band, and the per-lesson MINIMUM keyed by est_minutes, as FC6.
WORD_BAND = (420, 560)
MIN_WORDS = {12: 420, 13: 470, 14: 510}

TIERS = {
 'beginner': [
  ('m01-what-these-engines-decide', 'What These Engines Decide', [
    ('l01-four-registers-and-a-rule-for-each', 'Four registers and a rule for each', 12, []),
    ('l02-one-as-of-date-for-every-status', 'One as-of date for every status', 13, [R]),
    ('l03-every-verdict-answers-the-same-way', 'Every verdict answers the same way', 12, [R]),
    ('l04-what-the-engines-leave-to-people', 'What the engines leave to people', 12, []),
  ]),
  ('m02-the-matrix-and-its-bands', 'The Matrix and Its Bands', [
    ('l01-five-levels-on-two-axes', 'Five levels on two axes', 12, [R]),
    ('l02-twenty-five-cells-and-one-product', 'Twenty-five cells and one product', 13, [R]),
    ('l03-four-bands-and-their-lower-edges', 'Four bands and their lower edges', 13, [R]),
    ('l04-scores-the-grid-cannot-hold', 'Scores the grid cannot hold', 13, [R]),
    ('l05-values-off-the-scale', 'Values off the scale', 13, [R]),
  ]),
  ('m03-residual-and-appetite', 'Residual and Appetite', [
    ('l01-inherent-and-residual', 'Inherent and residual', 12, [R]),
    ('l02-falling-back-one-axis-at-a-time', 'Falling back one axis at a time', 14, [R]),
    ('l03-a-blank-and-an-off-scale-level', 'A blank and an off-scale level', 13, [R]),
    ('l04-a-target-and-three-answers', 'A target and three answers', 13, [R]),
    ('l05-when-there-is-no-answer', 'When there is no answer', 12, [R]),
  ]),
  ('m04-the-calendar-date', 'The Calendar Date', [
    ('l01-whole-days-between-two-dates', 'Whole days between two dates', 13, [R]),
    ('l02-due-today-is-not-overdue', 'Due today is not overdue', 12, [R]),
    ('l03-a-date-that-does-not-exist', 'A date that does not exist', 12, [R]),
    ('l04-one-as-of-date-in-every-time-zone', 'One as-of date in every time zone', 13, [R]),
  ]),
  ('m05-the-register-as-a-whole', 'The Register as a Whole', [
    ('l01-live-and-not-live', 'Live and not live', 12, [R]),
    ('l02-one-row-derived-once', 'One row derived once', 13, [R]),
    ('l03-counting-by-band', 'Counting by band', 13, [R]),
    ('l04-four-populations-of-one-register', 'Four populations of one register', 14, [R]),
    ('l05-what-each-heatmap-plots', 'What each heatmap plots', 12, [R]),
  ]),
  ('m06-the-associate-reading', 'The Associate Reading', [
    ('l01-the-obodo-register-end-to-end', 'The OBODO register end to end', 14, [R]),
    ('l02-the-capstone-worked', 'The capstone worked', 14, [R]),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'intermediate': [
  ('m01-a-change-and-its-stages', 'A Change and Its Stages', [
    ('l01-eight-stages-in-order', 'Eight stages in order', 12, [C]),
    ('l02-legal-moves-and-final-stages', 'Legal moves and final stages', 13, [C]),
    ('l03-a-refusal-that-names-the-way-forward', 'A refusal that names the way forward', 13, [C]),
    ('l04-active-in-effect-and-terminal', 'Active, in effect and terminal', 13, [C]),
  ]),
  ('m02-approval-levels', 'Approval Levels', [
    ('l01-levels-come-from-the-rows', 'Levels come from the rows', 12, [C]),
    ('l02-one-signature-a-level', 'One signature a level', 13, [C]),
    ('l03-a-rejection-stops-the-gate', 'A rejection stops the gate', 13, [C]),
    ('l04-no-rows-means-nothing-to-approve', 'No rows means nothing to approve', 12, [C]),
  ]),
  ('m03-segregation-of-duties', 'Segregation of Duties', [
    ('l01-the-originator-never-approves', 'The originator never approves', 13, [C]),
    ('l02-only-the-assignee-decides', 'Only the assignee decides', 13, [C]),
    ('l03-a-decision-is-made-once', 'A decision is made once', 12, [C]),
    ('l04-covering-an-absence', 'Covering an absence', 12, [C]),
  ]),
  ('m04-actions-and-the-two-gates', 'Actions and the Two Gates', [
    ('l01-three-kinds-of-action', 'Three kinds of action', 12, [C]),
    ('l02-the-gate-into-implementation', 'The gate into implementation', 14, [C]),
    ('l03-the-gate-into-closed', 'The gate into closed', 13, [C]),
    ('l04-a-date-to-come-back-out', 'A date to come back out', 13, [C]),
    ('l05-actions-on-a-finished-change', 'Actions on a finished change', 13, [C]),
  ]),
  ('m05-temporary-and-emergency-change', 'Temporary and Emergency Change', [
    ('l01-only-a-change-in-effect-can-expire', 'Only a change in effect can expire', 13, [C]),
    ('l02-six-expiry-states', 'Six expiry states', 13, [C]),
    ('l03-the-lead-before-an-expiry', 'The lead before an expiry', 13, [C]),
    ('l04-an-emergency-change-on-one-signature', 'An emergency change on one signature', 14, [C]),
    ('l05-the-ratification-window', 'The ratification window', 14, [C]),
    ('l06-a-window-that-cannot-be-shown-open', 'A window that cannot be shown open', 13, [C]),
  ]),
  ('m06-the-professional-reading', 'The Professional Reading', [
    ('l01-the-esanmi-register-end-to-end', 'The ESANMI register end to end', 14, [C]),
    ('l02-the-capstone-worked', 'The capstone worked', 14, [C]),
    ('l03-what-the-next-tier-changes', 'What the next tier changes', 12, []),
  ]),
 ],
 'advanced': [
  ('m01-the-comment-loop', 'The Comment Loop', [
    ('l01-six-dispositions', 'Six dispositions', 12, [V]),
    ('l02-who-moves-a-comment', 'Who moves a comment', 13, [V]),
    ('l03-nothing-to-verify-without-a-response', 'Nothing to verify without a response', 12, [V]),
    ('l04-refusals-a-user-can-act-on', 'Refusals a user can act on', 13, [V]),
    ('l05-two-final-dispositions', 'Two final dispositions', 12, [V]),
  ]),
  ('m02-closing-a-review', 'Closing a Review', [
    ('l01-two-severities-that-block', 'Two severities that block', 13, [V]),
    ('l02-a-review-that-cannot-close', 'A review that cannot close', 14, [V]),
    ('l03-overdue-reviews-and-live-stages', 'Overdue reviews and live stages', 13, [V]),
    ('l04-what-the-review-engine-does-not-check', 'What the review engine does not check', 13, [V]),
  ]),
  ('m03-a-lesson-and-its-validation', 'A Lesson and Its Validation', [
    ('l01-three-parts-of-a-lesson', 'Three parts of a lesson', 12, [V]),
    ('l02-the-author-may-not-validate', 'The author may not validate', 13, [V]),
    ('l03-a-typed-name-and-the-actor', 'A typed name and the actor', 13, [V]),
    ('l04-validated-before-published', 'Validated before published', 12, [V]),
  ]),
  ('m04-proof-of-use', 'Proof of Use', [
    ('l01-an-application-and-its-outcome', 'An application and its outcome', 13, [V]),
    ('l02-the-reuse-record-counts', 'The reuse record counts', 14, [V]),
    ('l03-embedded-is-earned', 'Embedded is earned', 13, [V]),
    ('l04-archive-and-supersede-need-reasons', 'Archive and supersede need reasons', 12, [V]),
    ('l05-what-an-application-must-carry', 'What an application must carry', 13, [V]),
  ]),
  ('m05-what-the-engines-do-not-know', 'What the Engines Do Not Know', [
    ('l01-review-due-soon-and-overdue', 'Review due soon and overdue', 13, [V]),
    ('l02-the-onne-register-summarised', 'The ONNE register summarised', 14, [V]),
    ('l03-what-these-engines-were-repaired-for', 'What these engines were repaired for', 13, []),
    ('l04-held-items-and-owner-decisions', 'Held items and owner decisions', 14, []),
    ('l05-two-oracles-one-answer', 'Two oracles, one answer', 13, []),
  ]),
  ('m06-the-expert-reading', 'The Expert Reading', [
    ('l01-a-lesson-into-a-risk-and-a-change', 'A lesson into a risk and a change', 14, [V]),
    ('l02-the-capstone-worked', 'The capstone worked', 14, [V]),
    ('l03-where-these-engines-hand-over', 'Where these engines hand over', 12, []),
  ]),
 ],
}

# Nothing is held at the lesson level. Held ENGINE items (RECON.md RC-1 to
# RC-4) are taught as stated limits in the lessons that own their sections and
# are graded nowhere; no whole lesson waits on a repair.
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
        for m in mods:
            for l in m[2]:
                assert l[2] in MIN_WORDS, f'{l[0]} est_minutes {l[2]}'
                assert not any(ch.isdigit() for ch in l[1]), f'a title carries a figure: {l[1]}'
                assert '—' not in l[1] and '–' not in l[1], f'dash in {l[1]}'
    print(f'{"total":<14} {total} lessons, all writable')
    keys = [(t, m[0], l[0]) for t, mods in TIERS.items() for m in mods for l in m[2]]
    assert len(keys) == len(set(keys)), 'duplicate lesson key'
    print('lesson keys unique within their module; no title carries a figure or a dash')
