import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# compliance Expert m02, Independence. Digest SECTION 19 (the lead auditor
# check and canExamineClause), with the auditIndependence and Document Control
# rows the m02 lessons set beside it (SECTIONS 16 and 8) and the coverage row
# of ISA-2026-S01 that l04 reads. As-of date 2026-10-15. 15 questions.

q(3, "A planned internal audit has clauses 8.1, 8.2, 9.1.1 and 9.2 in scope. Proposed as its lead auditor, u-kalu is refused. Which clauses does the refusal name?",
 "8.1 and 8.2, the two clauses u-kalu owns inside this audit's scope",
 ["9.1.1, the clause recorded against u-kalu in this scope",
  "8.1, 8.2 and 9.2, the clauses another auditor must take",
  "none by number, as the refusal cites ISO 19011 alone"],
 "\"The lead auditor owns clauses 8.1, 8.2 in this audit's own scope.\" The refusal ends \"Clauses named: 8.1, 8.2.\" Clause 9.1.1 is u-tari's and 9.2 is u-nneka's.")

q(1, "In the ORASHI register u-nneka owns clauses 4.1, 4.3, 4.4, 9.2 and 10.2. Proposed as lead for the same planned audit, u-nneka is refused naming 9.2 alone. Why only 9.2?",
 "The check reads this audit's own scope, and 9.2 is the only one of the five inside it.",
 ["The check names only the clause whose next review falls soonest.",
  "The others read Conformant with evidence, so none is open to a verdict.",
  "The refusal names one clause per person refused."],
 "The scope holds 8.1, 8.2, 9.1.1 and 9.2. u-nneka's 4.1, 4.3, 4.4 and 10.2 sit outside it, so owning them raises nothing for this audit. The refusal says so in its own words: \"in this audit's own scope\".")

q(0, "Which two ways out does the lead auditor refusal offer the person planning the audit?",
 "Change the scope, or change the auditor.",
 ["Change the clause owner in the register, or name an external auditor.",
  "Have somebody else on the audit record each result the lead owns.",
  "Record a justification for the owned clauses, or exclude them from the standard."],
 "The refusal reads \"so either the scope or the auditor has to change.\" Dropping 8.1 and 8.2 would clear u-kalu, and choosing u-chidi clears the whole audit. The engine names the clauses and leaves the choice to the planner.")

q(2, "u-kalu is on an audit led by u-chidi and moves to record the result for clause 8.1. What does canExamineClause answer?",
 "REFUSED, telling u-kalu that somebody else on the audit has to record this result.",
 ["ALLOWED, because the lead check cleared the audit when u-chidi was named.",
  "REFUSED, offering to change either the scope of the audit or the lead auditor named on it.",
  "ALLOWED, because the check applies to the lead alone."],
 "\"You own clause 8.1. An auditor may not audit their own work (ISO 19011), so somebody else on the audit has to record this result.\" The scope-or-auditor remedy belongs to the lead check. u-chidi recording 8.1 is ALLOWED.")

q(1, "Which owner decision puts the independence check on every examiner, beyond the lead auditor?",
 "AS15 Q5, through canExamineClause",
 ["AS15 Q4, through the coverage count",
  "AS15 D1, through the document review task",
  "AS15 Q6, through the readiness list"],
 "Q5 reads: every examiner is checked for independence, through canExamineClause. Q4 is the coverage rule, D1 keeps an author off their own review, and Q6 sets the certificate's severity.")

q(3, "u-obinna owns clauses 5.2, 7.2 and 7.5.3, and none of the four in the planned audit's scope. What does the digest print for u-obinna as its lead auditor?",
 "No row at all, so no verdict is stated for u-obinna.",
 ["ALLOWED, in the row printed for u-chidi.",
  "REFUSED, naming 7.2 as the clause u-obinna has left unassessed.",
  "REFUSED, because u-obinna owns the unevidenced claim on clause 5.2."],
 "The five printed rows are u-chidi, u-kalu, u-nneka, u-tari and an external lead named in text. A verdict the digest does not print is one this course does not state, however likely it looks from the ownership table.")

q(2, "In the Audit & Findings Manager, auditIndependence refuses u-boma named as both lead auditor and auditee. Which name does that rule check the lead against?",
 "The auditee named on the audit, one person against one person",
 ["The owner of each clause in the audit's scope, one clause at a time",
  "The author of the revision under review, as Document Control does",
  "Each person recording a result, through canExamineClause"],
 "\"The lead auditor is also the auditee for this audit. An auditor may not audit their own area: name somebody else as one or the other.\" The sentence names no clause and no standard. u-kelechi leading with u-boma audited is ALLOWED.")

q(0, "Of the independence refusals printed for the three apps this course teaches, which cite ISO 19011?",
 "The two from the ISO register, for a lead auditor and for an examiner.",
 ["Every one of them, as each concerns who may judge another person's work.",
  "Only the Audit & Findings Manager's, as the audit app.",
  "Only Document Control's, as ISO 19011 governs the review of documents."],
 "Both isoCompliance refusals carry \"An auditor may not audit their own work (ISO 19011)\". auditIndependence says an auditor may not audit their own area and names no standard, and Document Control asks for somebody independent of the draft.")

q(0, "Of the three independence refusals in this course, why can only the ISO lead auditor refusal list more than one item?",
 "A person can own several clauses in one scope, while an auditee and an author are each one name.",
 ["The ISO refusal lists every clause in the scope, whoever owns it, so the planner sees the audit whole.",
  "Only the ISO module records who owns what, so the other two apps have nothing they could list.",
  "The other two refusals are cut short on screen, which shows only the first name refused."],
 "The ISO check reads clause ownership, so u-kalu's refusal names 8.1 and 8.2. The Audit & Findings Manager reads one auditee, and Document Control reads the author of one revision.")

q(3, "An external lead auditor named in text is ALLOWED by the ISO lead auditor check. What does that verdict establish?",
 "That the name owns no clause in this audit's scope, and nothing more.",
 ["That the auditor is independent of every clause in scope, as ISO 19011 requires.",
  "That the audit becomes a certification audit.",
  "That the employer was checked against suppliers."],
 "The check compares names held on the record, and an external name with no account matches none of u-nneka, u-obinna, u-tari or u-kalu. What that auditor's independence rests on in fact stays with whoever appoints them.")

q(1, "An internal audit led by an external auditor named in text is reported. How does it stand for coverage beside ISA-2026-S01, the Closed Surveillance audit?",
 "It counts once reported, being Internal; ISA-2026-S01 does not count whatever its status.",
 ["Neither counts, because each was led by somebody from outside the organization.",
  "Both count, because both have reached a status on the coverage counting list.",
  "It counts only once it is Closed, while ISA-2026-S01 already counts as Closed."],
 "The type of the audit decides coverage. ISA-2026-S01 reads counts towards coverage false, and the clause it examined, 6.1.2, reads never. The employer of the person leading an internal audit does not enter the count.")

q(2, "The lead auditor refusal and the canExamineClause refusal cite ISO 19011 in the same words. Which of these is a difference between the two?",
 "In their first sentence: one names the lead auditor, the other says \"You\".",
 ["In the standard cited, since the examiner refusal cites ISO 14001:2015 in place of ISO 19011.",
  "In the verdict, since the examiner check only warns where the lead auditor check refuses.",
  "In the clauses named, since the examiner refusal lists the whole scope after \"Clauses named:\"."],
 "Both carry \"An auditor may not audit their own work (ISO 19011)\". The lead refusal opens \"The lead auditor owns clauses 8.1, 8.2 in this audit's own scope.\" and the examiner refusal opens \"You own clause 8.1.\" Both are refusals of the request.")

q(1, "Which of the refusals printed for the planned audit carries no \"Clauses named:\" list?",
 "u-kalu's refusal when recording clause 8.1",
 ["u-kalu's refusal as the proposed lead of the planned audit",
  "u-tari's refusal as lead auditor",
  "u-nneka's refusal as lead auditor"],
 "canExamineClause refuses u-kalu on 8.1 with \"You own clause 8.1.\" and lists nothing after. Each lead auditor refusal ends \"Clauses named:\", with 8.1, 8.2 for u-kalu, 9.2 for u-nneka and 9.1.1 for u-tari.")

q(0, "Why is the lead auditor check on its own not enough to keep an owner from examining their own clause?",
 "An independent lead says nothing about the rest of the team, and any of them may record a result.",
 ["The lead check reads only clauses outside the scope, so owners inside it pass unseen.",
  "The lead check runs once the audit is Reported, after the results are already recorded.",
  "The lead check reads the auditee and never reads the owners of the clauses in scope."],
 "With u-chidi leading, the lead check reads ALLOWED, and u-kalu on the team could still record 8.1. canExamineClause closes that gap one result at a time, refusing u-kalu on 8.1 and allowing u-chidi.")

q(2, "Among the candidates for lead of the planned audit who hold an account, which one does the digest allow?",
 "u-chidi, who owns none of the four clauses in scope",
 ["u-tari, whose one clause inside the audit's scope is 9.1.1",
  "u-nneka, whose clause 9.2 is Conformant with evidence",
  "u-kalu, once clauses 8.1 and 8.2 are recorded as Conformant"],
 "u-chidi: ALLOWED. u-tari is refused naming 9.1.1, u-nneka naming 9.2 and u-kalu naming 8.1 and 8.2. A clause's status plays no part in the check; ownership inside the scope is what it reads.")

emit(Q, '/root/wt-as-compliance-nextgen/tools/course-banks/compliance/advanced/cqa_m02.json', expect_n=15)
finish()
