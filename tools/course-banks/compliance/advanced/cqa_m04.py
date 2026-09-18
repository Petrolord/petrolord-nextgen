import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Expert m04, Findings and root causes. Digest SECTION 21 (the
# ORASHI findings and actions, canCloseFinding, findingByUrgency,
# isAuditOverdue) and the root cause lists and shared functions of SECTION 1.
# As-of date 2026-10-15. 15 questions.

q(2, "canCloseFinding is asked to close ISF-2026-005, a Minor nonconformity with status Open. Its action ac3 is Corrective and Open. Which requirement refuses it?",
 "The correction: nothing records what was done about the thing that was found.",
 ["The open action: ac3 is still Open against the finding.",
  "The effectiveness check a Minor nonconformity needs before it closes.",
  "The due date, 2026-12-11, which has not yet arrived."],
 "The digest prints the correction refusal for ISF-2026-005: \"Record the correction: what was done about the thing that was found. A corrective action deals with the cause, and this is the other half.\" The correction is the first thing the gate asks for.")

q(0, "A Minor nonconformity has its correction recorded and no actions at all. What does canCloseFinding answer?",
 "ALLOWED, because a Minor nonconformity closes on its correction alone.",
 ["REFUSED until a corrective action is raised against the cause.",
  "REFUSED until its root cause is recorded, as for any nonconformity.",
  "ALLOWED only once an effectiveness check is recorded on the correction."],
 "The digest prints: a Minor nonconformity with its correction and no actions: ALLOWED. isoCompliance.EFFECTIVENESS_REQUIRED_TYPES holds Major nonconformity alone, and the root cause refusal is written for a major nonconformity.")

q(3, "On the Major nonconformity walk, the record holds a correction, a root cause and only a preventive action. Which requirement refuses it?",
 "At least one corrective action, because a corrective action is what deals with the cause.",
 ["An effectiveness check on the preventive action, which has to be verified effective.",
  "A second root cause, written for the preventive action to address on its own.",
  "A due date, which a finding answered by a preventive action alone never carries."],
 "\"A major nonconformity needs at least one corrective action. A correction deals with the instance; a corrective action deals with the cause.\" A preventive action is welcome on a Major finding and does not satisfy the rule.")

q(1, "A Major nonconformity's corrective action is Complete, with no effectiveness check recorded. What does canCloseFinding answer?",
 "REFUSED, because no corrective action has yet been verified effective.",
 ["ALLOWED, since Complete is the last status an action can reach on its own record.",
  "REFUSED, asking for another corrective action to be raised in its place.",
  "ALLOWED, with a watch item on the readiness list until the check is recorded."],
 "\"No corrective action has been verified effective yet. For a major nonconformity the effectiveness check is the point: a completed action is not a working one.\" The request for another action belongs to an action checked and found not to work.")

q(1, "ISF-2026-004 holds ac1, Corrective, In progress, and ac4, Preventive, Complete and unchecked. Which refusal does it meet at 2026-10-15?",
 "The open action refusal, because ac1 is still open against it.",
 ["The root cause refusal, since ac4 was aimed at a cause nobody wrote down.",
  "The unchecked action refusal, since ac4 is Complete with no effectiveness verdict.",
  "The correction refusal, since a preventive action carries no correction."],
 "The digest prints: \"1 action still open against this finding.\" The refusal names the first thing missing on the walk, and ac1 is it.")

q(3, "Suppose ac1 on ISF-2026-004 were completed and never checked. What would the record still lack before the finding could close?",
 "a corrective action verified effective",
 ["a correction for the thing that was found",
  "a preventive action to sit beside ac1",
  "a due date for the finding itself"],
 "ac4 is Preventive with verified effective false, and ac1 would be Complete and unchecked. The finding already has a due date, 2026-09-30, and its refusal today comes after the correction step on the walk.")

q(0, "The register summary prints awaiting an effectiveness check 1. Which action is behind that count?",
 "ac4, Preventive, on ISF-2026-004, Complete with no effectiveness verdict",
 ["ac1, Corrective, on ISF-2026-004, In progress and past its due date",
  "ac2, Corrective, on ISF-2026-001, Complete and verified effective",
  "ac3, Corrective, on ISF-2026-005, Open with no verdict"],
 "The digest names ac4 as the one Complete action with no effectiveness verdict recorded. ac1 and ac3 are still open, and ac2 reads verified effective true.")

q(2, "Which root cause categories appear only in the ISO list?",
 "Measurement or monitoring, and Management system",
 ["Measurement or inspection, and Management system",
  "Measurement or inspection, on its own",
  "Measurement or monitoring, and Supplier or subcontractor"],
 "isoCompliance.ROOT_CAUSE_CATEGORIES holds 10 and qualityAssurance.ROOT_CAUSE_CATEGORIES holds 9. Only in the quality list: Measurement or inspection. Supplier or subcontractor is in both.")

q(2, "A Major nonconformity is raised in the Audit & Findings Manager. Which root cause list is its cause recorded against?",
 "The ISO list of 10, which auditManagement holds as the very same list object.",
 ["The quality list of 9, since the Audit & Findings Manager is a quality app.",
  "A list of its own, kept in step with the ISO list by a copy that is refreshed.",
  "The ISO list less Management system, a category kept for ISO registers."],
 "The digest prints: auditManagement.ROOT_CAUSE_CATEGORIES is the same list object as isoCompliance's: true. One list, so nothing can drift apart. auditManagement.canCloseFinding is the same function as isoCompliance's as well.")

q(0, "isoCompliance.isActionOverdue is the same function as qualityAssurance.isCapaOverdue. What follows?",
 "An action is overdue by one rule, on an NCR or on a finding.",
 ["A finding and an NCR close by one and the same rule.",
  "A CAPA on an NCR is counted in the ORASHI summary's overdue actions.",
  "An action is overdue in the ISO register only once its finding is overdue."],
 "Sharing isActionOverdue means an action's lateness is read the same way in both apps. The function a finding closes by is canCloseFinding, which isoCompliance shares with auditManagement.")

q(3, "The as-of date moves one month later. Which ORASHI findings then print a different age?",
 "ISF-2026-004, ISF-2026-005 and ISF-2026-003, the three that are open",
 ["All five, since the age of every finding runs up to the as-of date it is read at",
  "ISF-2026-001 and ISF-2026-002, the two findings that are closed or voided",
  "ISF-2026-004 alone, as the one finding that reads overdue"],
 "The three open findings were raised 2026-06-12 and read 125 at 2026-10-15; each grows as the as-of date moves. ISF-2026-001 stopped at its closure, 2026-04-21, and ISF-2026-002 at 2026-06-13.")

q(1, "ISF-2026-002, an Observation, was Voided and its age reads 3. Where does that age stop?",
 "At 2026-06-13, the date in its closed column, as a closed finding's would.",
 ["At the as-of date, since voiding a finding does not close it, so it keeps on ageing.",
  "At its due date, which a voided finding keeps on its record.",
  "At the date its audit ended, which the findings table takes over."],
 "ISF-2026-002 was raised 2026-06-10 and its closed column reads 2026-06-13. A voided finding stops ageing at the date it was voided, in the column a closed finding uses. Its due date reads none.")

q(0, "ISF-2026-003 is an open Opportunity for improvement with no due date. What does its overdue flag read?",
 "false, as a finding with no due date cannot fall overdue",
 ["true, since its raised date stands in for the missing due date",
  "true, since every open finding raised 2026-06-12 reads overdue",
  "no value, and the summary counts it among findings overdue"],
 "The raised date stands in for a missing due date only when findingByUrgency sorts. The summary prints findings overdue 1, and that finding is ISF-2026-004, due 2026-09-30.")

q(2, "ISA-2026-001 is Reported with a planned end of 2026-06-12, and ISA-2026-002 is In progress with a planned end of 2026-10-09. Which reads overdue at 2026-10-15?",
 "ISA-2026-002 alone, since an audit is overdue only while undelivered",
 ["Both, since both planned ends are past the as-of date and both audits are open",
  "ISA-2026-001 alone, being the one that is further past its planned end",
  "Neither, since an open audit is never overdue in the ISO module"],
 "isAuditOverdue reads Reported false and In progress true, in both modules. isoCompliance.AUDIT_UNDELIVERED_STATUSES holds Planned, In progress and Fieldwork complete. Both audits read open true.")

q(1, "findingByUrgency places ISF-2026-003, an Opportunity for improvement, before ISF-2026-005, a Minor nonconformity. Why?",
 "Both rank 3, and 003 sorts by its raised date, 2026-06-12, which falls before 005's due date, 2026-12-11.",
 ["The rule ranks an Opportunity for improvement above a Minor nonconformity in its own right.",
  "ISF-2026-005 is still waiting on its correction, and a refused finding drops below the others.",
  "ISF-2026-003 has no due date, and a finding with no due date always sorts ahead of the rest."],
 "Only a Major nonconformity has ranks of its own, 0 and 1. Within a rank the earlier due date comes first, the raised date standing in for a missing one. The same rule puts ISF-2026-001 fourth and ISF-2026-002 fifth at rank 4.")

emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/advanced/cqa_m04.json', expect_n=15)
finish()
