import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Professional m05, the audit and the programme.
# Draws on m05's five lessons only: digest SECTION 16 (nextAuditStatuses,
# canReportAudit, canCloseAudit, canCancelAudit, auditIndependence,
# isAuditOverdue) and SECTION 17 (the programme table, programmeProgress,
# canCompleteProgramme, the programme workflow and approval, the one rule for
# outstanding). Read at the as-of date 2026-10-15.

q(1, "Once an audit is Reported, which move does nextAuditStatuses allow it?",
 "Closed, and no other.",
 ["Closed or Cancelled.",
  "Closed, or back to In progress for more fieldwork.",
  "Closed, Cancelled or Fieldwork complete."],
 "Reported: Closed. Cancelled is reachable from Planned, In progress and Fieldwork complete, and once an audit is reported its only move is to Closed.")

q(3, "Which backward move does nextAuditStatuses allow?",
 "Fieldwork complete to In progress.",
 ["Reported to Fieldwork complete.",
  "In progress to Planned.",
  "Closed to Reported."],
 "Fieldwork complete may move to Reported, In progress or Cancelled, so an auditor who finds a gap while writing up can return to the field. Closed and Cancelled are final.")

q(0, "A cancellation is asked for with a reason made of spaces. What does canCancelAudit answer?",
 "REFUSED, with the same sentence as no reason at all.",
 ["ALLOWED, since the reason field is not empty.",
  "ALLOWED, though the audit stays outstanding.",
  "REFUSED, with a sentence about blank text."],
 "Both rows read \"Say why this audit is not being done. An audit that quietly disappears from the programme is the reason a programme cannot be trusted.\" A reason of spaces counts as no reason.")

q(2, "AUD-2026-007 reads Fieldwork complete, planned end 2026-10-09, overdue true at the as-of date. Why is it still overdue with its fieldwork done?",
 "Its planned end has passed and it has not been Reported.",
 ["Its checklist still has 4 items with no answer yet.",
  "Its stop-work finding, AF-2026-018, is still open.",
  "The programme it belongs to has not been marked Complete."],
 "isAuditOverdue reads true for Planned, In progress and Fieldwork complete once the planned end has passed, and false for Reported, Closed and Cancelled. The report is the deliverable.")

q(0, "In what order does canReportAudit refuse AUD-2026-007 on its walk from the record as it stands?",
 "Unanswered items, then critical item 6 with no finding, then the conclusion.",
 ["Critical item 6 with no finding, then unanswered items, then the conclusion.",
  "The conclusion, then unanswered items, then critical item 6 with no finding.",
  "Unanswered items, then the conclusion, then critical item 6 with no finding."],
 "As recorded the refusal names the 4 unanswered items. With every item answered and the two blank Not applicable answers given reasons, it names critical item 6. With a finding raised from item 6 as well, it asks for the conclusion, and with the conclusion written the walk reads ALLOWED.")

q(1, "Every item on AUD-2026-007 is answered and a finding is raised from item 6. What does canReportAudit still ask for?",
 "The audit conclusion, which it calls the deliverable.",
 ["A finding raised from item 4, the Observation answer.",
  "The closure of AF-2026-018 before the report.",
  "A second auditor's review of the whole checklist."],
 "The refusal reads \"Write the audit conclusion. It is the deliverable.\" With the conclusion written, the answer is ALLOWED.")

q(3, "Under canCloseAudit, which open findings hold a reported audit open?",
 "Major nonconformities, and any finding that stopped work.",
 ["Every open finding, observations included.",
  "Major nonconformities alone, whatever else stopped work.",
  "Any finding whose correction is not recorded."],
 "Reported with both major findings open is refused, and so is reported with a stop-work minor finding open. A minor nonconformity or an observation open with no stop-work is ALLOWED.")

q(2, "canCloseAudit is asked to close an audit that has not been reported. What does it answer?",
 "REFUSED: Report the audit before closing it.",
 ["ALLOWED, provided no major finding is open.",
  "ALLOWED, provided the fieldwork is complete.",
  "REFUSED, until every finding it raised is closed."],
 "The refusal reads \"Report the audit before closing it: the report is the deliverable, and closure is the statement that everything it raised has been dealt with.\" The workflow allows Closed only from Reported.")

q(1, "What does auditIndependence compare?",
 "The lead auditor against the auditee.",
 ["The lead auditor against the author of the checklist.",
  "The auditee against the person who approved the programme.",
  "Every auditor on the team against every other one."],
 "u-kelechi leading with u-boma audited is ALLOWED; u-boma named as both is refused: \"The lead auditor is also the auditee for this audit.\"")

q(0, "An external lead auditor is named in text, with no account. What does auditIndependence answer?",
 "ALLOWED for the external lead.",
 ["REFUSED, since there is no account to test.",
  "REFUSED: Name the lead auditor.",
  "ALLOWED only once an account is made for them."],
 "The digest prints ALLOWED for an external lead auditor named in text with no account. \"Name the lead auditor.\" is the reporting refusal for an audit with no lead auditor named at all.")

q(3, "u-boma is named as both lead auditor and auditee, and auditIndependence refuses. What does the refusal leave to the person fixing it?",
 "Which of the two roles gets somebody else.",
 ["Nothing; it names the replacement lead auditor.",
  "Whether to cancel the audit or report it as it is.",
  "Whether an external auditor must be used."],
 "The refusal ends \"name somebody else as one or the other.\" The audit can keep its lead auditor and name a different auditee, or keep its auditee and name a different lead.")

q(2, "Which audits make up programmeProgress's reported 3?",
 "AUD-2026-001, AUD-2026-002 and AUD-2026-003.",
 ["AUD-2026-002, AUD-2026-005 and AUD-2026-007.",
  "AUD-2026-001, AUD-2026-003 and AUD-2026-004.",
  "AUD-2026-002, AUD-2026-004 and AUD-2026-007."],
 "AUD-2026-001 and AUD-2026-003 are Closed and AUD-2026-002 is Reported. A closed audit was reported on its way to closure, and it counts.")

q(3, "AUD-2026-004 is Cancelled. Where does programmeProgress count it?",
 "In cancelled 1 alone.",
 ["In reported 3, since a cancelled audit has been dealt with.",
  "In outstanding 4, since it was never delivered.",
  "In overdue 3, since its planned end of 2026-06-19 has passed."],
 "programmeProgress prints total 8, reported 3, cancelled 1, outstanding 4, overdue 3, percent 38. The outstanding four are AUD-2026-005 to AUD-2026-008 and the overdue three are AUD-2026-005, AUD-2026-006 and AUD-2026-007.")

q(0, "The outstanding audits are reported except the last, AUD-2026-008, which is cancelled with no reason written. What does canCompleteProgramme answer?",
 "REFUSED, naming AUD-2026-008 as not reported or cancelled.",
 ["ALLOWED, since every audit now reads Reported, Closed or Cancelled.",
  "REFUSED, naming AUD-2026-004 as the audit with no reason.",
  "ALLOWED, with percent 38 left as it was."],
 "The refusal reads \"1 audit in this programme has not been reported or cancelled (AUD-2026-008).\" A cancellation with no written reason leaves the audit outstanding, whatever its status reads.")

q(1, "What does approving an audit programme need on the record?",
 "The date it was approved and who approved it.",
 ["A lead auditor named for every audit in it.",
  "A written reason, the same as a cancellation.",
  "The date alone; the approver is taken from the author."],
 "Approving with no date is refused with \"Record the date the programme was approved.\" and with a date and no approver with \"Name who approved it.\" With both, the answer is ALLOWED.")

emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/intermediate/cqi_m05.json', label='cqi_m05', expect_n=15)
finish()
