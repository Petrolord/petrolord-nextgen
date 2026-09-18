import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Professional m03, the nonconformance.
# Draws on m03's five lessons only: digest SECTIONS 13 and 14 (canCloseNcr at
# four severities, the ABAM NCRs and actions, ncrAgeDays, ageBand, ncrAgeing,
# the NCR and action summarise, ncrByUrgency). Read at the as-of date 2026-10-15.

q(3, "A Major NCR with nothing recorded is asked to close. What does canCloseNcr ask for first?",
 "The disposition: what happens to the non-conforming item.",
 ["A root cause, since a major non-conformance needs one before it closes.",
  "At least one corrective action that has been verified effective.",
  "The date the NCR was raised, so that its age can be read."],
 "The first refusal is \"Agree the disposition first: what happens to the non-conforming item.\" It is the first refusal on the Major walk and on the Observation walk, and NCR-2026-027, a Minor NCR, meets it at the as-of date.")

q(1, "A Major NCR has its disposition recorded, Repair, and nothing else. What does canCloseNcr answer?",
 "REFUSED: Record the date the disposition was agreed.",
 ["REFUSED: A major non-conformance needs a root cause before it closes.",
  "ALLOWED, since Repair deals with the item and the cause together.",
  "REFUSED until a corrective action is raised."],
 "A disposition is a decision and carries its date. Only with the disposition and its date on the record does the walk move on to the root cause.")

q(0, "summarise prints concessions 2 for the ABAM NCRs. Which two does it count?",
 "NCR-2026-022, Use as is, and NCR-2026-006, Regrade, both of them Closed.",
 ["NCR-2026-031, Repair, and NCR-2026-019, Return to supplier, both open.",
  "NCR-2026-019, Return to supplier, and NCR-2026-022, Use as is.",
  "NCR-2026-027 and NCR-2026-011, the two with no disposition recorded."],
 "CONCESSION_DISPOSITIONS holds Use as is and Regrade. The count keeps a concession after its NCR closes, since it is the outcome that leaves a known departure from specification in service.")

q(2, "One corrective action is complete and has never been checked. At which severities does canCloseNcr refuse to close over it?",
 "Critical and Major.",
 ["Critical alone.",
  "Critical, Major and Minor.",
  "Every severity, Observation included."],
 "NCR_EFFECTIVENESS_REQUIRED holds Critical and Major. On a Minor NCR the digest prints ALLOWED for one corrective action complete and never checked.")

q(1, "What may a Minor NCR close without, once its disposition and date are recorded?",
 "A root cause and any action at all.",
 ["Its disposition date.",
  "Nothing further; a Minor NCR walks the same steps as a Major one.",
  "A root cause, though it still needs one corrective action raised."],
 "The Minor walk prints ALLOWED for no root cause and no actions, and ALLOWED for one corrective action complete and never checked. The one refusal it meets is an open action.")

q(3, "Which refusal do the Major walk and the Minor walk share?",
 "1 corrective or preventive action still open.",
 ["Record the date the disposition was agreed.",
  "No corrective action has been verified effective yet.",
  "A major non-conformance needs at least one corrective action."],
 "An open action blocks closure at both severities, with the same sentence. It is also the refusal NCR-2026-031 meets at the as-of date, with k2 In progress.")

q(0, "NCR-2026-019 carries k3, which was checked and found ineffective. Why does canCloseNcr allow it at the as-of date?",
 "k4, a second corrective action, is verified effective.",
 ["Its disposition ends the matter.",
  "k3 is Complete, so it counts as working.",
  "At 117 days it is past the check."],
 "The walked refusal for an NCR whose one corrective action was found not to work reads \"Raise another one rather than closing over it.\" NCR-2026-019 has that second action, k4, and it was verified effective.")

q(2, "k2, the preventive action on NCR-2026-031, is marked Complete. Which refusal does NCR-2026-031 meet next?",
 "No corrective action has been verified effective yet.",
 ["1 corrective or preventive action still open.",
  "A corrective action here was checked and found not to have worked.",
  "Record the date the disposition was agreed."],
 "Finishing k2 clears the open action and exposes the next gap: k1 is Complete and reads verified effective false. For a Major NCR the check that it worked is required.")

q(3, "A Major NCR has its preventive action finished and no corrective action. The refusal draws a line between two records. Which?",
 "A disposition deals with the item; a corrective action deals with the cause.",
 ["A preventive action deals with the cause; a corrective action deals with the record.",
  "A correction deals with the site; a disposition deals with the supplier.",
  "A root cause deals with the item; a corrective action deals with the date."],
 "The refusal reads \"A major non-conformance needs at least one corrective action. A disposition deals with the item; a corrective action deals with the cause.\"")

q(0, "To what date does ncrAgeDays measure a Closed NCR?",
 "To its closed date.",
 ["To the as-of date, the same as an open NCR.",
  "To its due date, where one is recorded.",
  "To the date its disposition was agreed."],
 "ncrAgeDays measures to the as-of date while an NCR is open, and to the closed date once it is closed or voided. NCR-2026-022 was raised 2026-07-01 and closed 2026-07-09, and its age reads 8 on any date after that.")

q(1, "An NCR is 90 days old. Which band does ageBand put it in?",
 "61 to 90 days.",
 ["Over 90 days.",
  "31 to 60 days.",
  "null, since the band edges are exclusive."],
 "Each band includes both of its printed ends: 90 days reads 61 to 90 days, and 91 is the first day Over 90 days. Only a negative age, -1, reads null.")

q(2, "The ncrAgeing grid shows a count of 1 in the band 31 to 60 days. Which NCR is it?",
 "NCR-2026-031, at 43 days.",
 ["NCR-2026-006, the Minor NCR at 48 days.",
  "NCR-2026-027, the Minor NCR at 64 days.",
  "NCR-2026-011, the Major NCR voided at 2."],
 "ncrAgeing counts open NCRs only. NCR-2026-006 carries 48 days and the band 31 to 60 days in the age table, and it is Closed, so it is absent from the grid.")

q(0, "summarise prints mean open age 75 days. What is it taken over?",
 "The three open ages, 43, 64 and 117.",
 ["All six ages, the closed and voided ones included.",
  "The two serious NCRs.",
  "The two overdue NCRs."],
 "The digest prints the ages the mean is taken over: 43, 64 and 117, their sum 224 over 3. The closed ages 8, 2 and 48 are not in it.")

q(3, "isCapaOpen reads true for k5, the corrective action on NCR-2026-011. Is k5 in the action summarise's open 2?",
 "No. Its NCR is Voided, and summarise leaves it out.",
 ["Yes. summarise counts every open action.",
  "Yes, and in overdue 1 as well.",
  "No. open 2 counts Preventive actions only."],
 "The open two are k2 and k6, and the overdue one is k2. The digest prints that summarise leaves k5 out of the open and overdue counts because it sits on NCR-2026-011, which is Voided.")

q(1, "The same actions summarised with no NCRs supplied print open 3 and overdue 2. What changed?",
 "k5 is counted, since its Voided parent was not supplied.",
 ["k1 is counted, never having been checked.",
  "k6 turns overdue with no NCR to hold it.",
  "k3 counts as open again."],
 "The digest's line reads \"A child whose parent is not supplied counts.\" Without the NCRs the engine cannot know that k5's parent is Voided, so the counts move from open 2 and overdue 1.")

emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/intermediate/cqi_m03.json', label='cqi_m03', expect_n=15)
finish()
